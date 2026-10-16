import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { mediaService } from '../modules/media/media.service.js';
import { categoryService } from '../modules/category/category.service.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Target test titles specifically highlighted by the user
export const TARGET_TEST_TITLES = [
  'Harry Potter World',
  'Marvel Universe',
  'Naruto Universe',
  'One Piece Adventures',
  'Solar System',
];

interface MigrateOptions {
  dryRun?: boolean;
  targetTitlesOnly?: boolean;
}

function extractPublicId(cloudinaryUrl?: string): string | null {
  if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) return null;
  try {
    const uploadIdx = cloudinaryUrl.indexOf('/upload/');
    if (uploadIdx === -1) return null;
    let pathPart = cloudinaryUrl.slice(uploadIdx + 8);
    // Strip version prefix if present e.g. v1792168008/
    pathPart = pathPart.replace(/^v\d+\//, '');
    // Strip transformation parameters e.g. f_auto,q_auto/
    pathPart = pathPart.replace(/^(?:[a-z]_[a-z0-9_-]+,?)+\//i, '');
    // Strip file extension
    const dotIdx = pathPart.lastIndexOf('.');
    if (dotIdx !== -1) {
      pathPart = pathPart.slice(0, dotIdx);
    }
    return pathPart;
  } catch {
    return null;
  }
}

export async function runThumbnailMigration(options: MigrateOptions = {}) {
  const { dryRun = false, targetTitlesOnly = false } = options;

  console.log('================================================================');
  console.log(`THUMBNAIL REGENERATION & MIGRATION ${dryRun ? '(DRY RUN)' : '(LIVE EXECUTION)'}`);
  console.log('================================================================');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  await mongoose.connect(uri);

  const query: any = { isActive: true };
  if (targetTitlesOnly) {
    query.name = { $in: TARGET_TEST_TITLES };
  }

  const subjects = await SubjectModel.find(query).sort({ name: 1 });
  const categories = await CategoryModel.find({ isActive: true });
  const catMap = new Map(categories.map((c) => [c._id.toString(), c]));

  console.log(`Found ${subjects.length} eligible subject records.\n`);

  const results: Array<{
    name: string;
    oldUrl: string;
    newUrl?: string;
    status: 'migrated' | 'skipped' | 'failed' | 'dry-run';
    error?: string;
  }> = [];

  for (let i = 0; i < subjects.length; i++) {
    const subj = subjects[i];
    const cat = catMap.get(subj.categoryId.toString());
    const catName = cat?.name || 'General';
    const catSlug = cat?.slug || 'general';
    const oldUrl = subj.thumbnailUrl || '';
    const oldPublicId = extractPublicId(oldUrl);

    console.log(`[${i + 1}/${subjects.length}] ${subj.name} (${catName})`);
    console.log(`   Old Asset: ${oldUrl ? oldUrl.slice(0, 70) + '...' : '(none)'}`);

    if (dryRun) {
      console.log(`   [DRY RUN] Would regenerate with title-first prompt and replace old asset: ${oldPublicId || 'none'}\n`);
      results.push({ name: subj.name, oldUrl, status: 'dry-run' });
      continue;
    }

    try {
      console.log(`   🎨 Generating new title-specific thumbnail...`);
      const newUrl = await mediaService.generateAndUploadSubjectThumbnail(
        subj.name,
        catName,
        {
          categorySlug: catSlug,
          description: subj.description,
        }
      );

      console.log(`   ☁️ Uploaded new asset to Cloudinary: ${newUrl}`);

      // Update MongoDB record
      subj.thumbnailUrl = newUrl;
      await subj.save();
      console.log(`   💾 Updated MongoDB record successfully.`);

      // Safely cleanup old Cloudinary asset ONLY if it was an old AI-generated quizzy thumbnail
      if (oldPublicId && oldPublicId.startsWith('quizzy/thumbnails/') && oldPublicId !== extractPublicId(newUrl)) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
          console.log(`   🗑️ Cleaned up old replaced Cloudinary asset: ${oldPublicId}`);
        } catch (cleanupErr: any) {
          console.warn(`   ⚠️ Non-blocking: Could not delete old asset ${oldPublicId}:`, cleanupErr?.message);
        }
      }

      results.push({ name: subj.name, oldUrl, newUrl, status: 'migrated' });
      console.log(`   ✅ Successfully updated "${subj.name}"\n`);
    } catch (err: any) {
      console.error(`   ❌ Failed for "${subj.name}":`, err?.message || err, '\n');
      results.push({ name: subj.name, oldUrl, status: 'failed', error: err?.message || String(err) });
    }

    // Rate-limit pause
    await new Promise((res) => setTimeout(res, 800));
  }

  console.log('================================================================');
  console.log('MIGRATION SUMMARY:');
  console.log(`Total Processed: ${results.length}`);
  console.log(`Migrated: ${results.filter((r) => r.status === 'migrated').length}`);
  console.log(`Failed: ${results.filter((r) => r.status === 'failed').length}`);
  console.log('================================================================\n');

  if (!dryRun) {
    console.log('🧹 Evicting taxonomy cache in Redis...');
    await categoryService.clearCache();
  }

  await mongoose.disconnect();
  return results;
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('regenerate-target-thumbnails.ts')) {
  const isDryRun = process.argv.includes('--dry-run');
  const targetOnly = process.argv.includes('--target-only');

  runThumbnailMigration({ dryRun: isDryRun, targetTitlesOnly: targetOnly })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

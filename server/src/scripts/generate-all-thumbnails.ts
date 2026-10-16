import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { mediaService } from '../modules/media/media.service.js';
import { categoryService } from '../modules/category/category.service.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB.');

  const subjects = await SubjectModel.find({ isActive: true }).sort({ name: 1 });
  const categories = await CategoryModel.find({ isActive: true });
  const catMap = new Map(categories.map((c) => [c._id.toString(), c]));

  console.log(`\n📸 Starting AI Thumbnail Generation for ${subjects.length} subjects...`);
  console.log(`Cloudflare Model: ${process.env.CLOUDFLARE_AI_MODEL || '@cf/black-forest-labs/flux-1-schnell'}`);
  console.log(`Cloudinary Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < subjects.length; i++) {
    const subj = subjects[i];
    const cat = catMap.get(subj.categoryId.toString());
    const catName = cat?.name || 'General';
    const catSlug = cat?.slug || 'general';

    console.log(`[${i + 1}/${subjects.length}] Processing "${subj.name}" (${catName})...`);

    // If it already has a valid Cloudinary thumbnail, we can skip or regenerate
    if (subj.thumbnailUrl && subj.thumbnailUrl.includes('cloudinary.com') && !process.env.FORCE_REGENERATE) {
      console.log(`   ⏭️ Already has thumbnail: ${subj.thumbnailUrl.slice(0, 50)}...`);
      successCount++;
      continue;
    }

    try {
      const url = await mediaService.generateAndUploadSubjectThumbnail(
        subj.name,
        catName,
        {
          categorySlug: catSlug,
          description: subj.description,
        }
      );

      subj.thumbnailUrl = url;
      await subj.save();
      successCount++;
      console.log(`   ✅ Generated & Uploaded: ${url}`);
    } catch (err: any) {
      failCount++;
      console.error(`   ❌ Failed for "${subj.name}":`, err?.message || err);
    }

    // Brief pause between requests to respect rate limits
    await new Promise((res) => setTimeout(res, 800));
  }

  console.log(`\n✨ Finished Thumbnail Generation!`);
  console.log(`   - Successfully updated: ${successCount}`);
  console.log(`   - Failed: ${failCount}`);

  console.log('🧹 Evicting taxonomy cache...');
  await categoryService.clearCache();

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

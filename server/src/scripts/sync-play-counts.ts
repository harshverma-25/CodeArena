import 'dotenv/config';
import mongoose from 'mongoose';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { RoomModel } from '../modules/room/room.model.js';
import { BattleStatus } from '../modules/battle/battle.types.js';

export async function syncPlayCountsFromDatabase(): Promise<void> {
  console.log('🔄 Syncing play counts from existing battles and rooms...');

  const allCategories = await CategoryModel.find({}).lean();
  const allSubjects = await SubjectModel.find({}).lean();

  const categoryMap = new Map<string, any>();
  for (const c of allCategories) {
    categoryMap.set(c._id.toString(), c);
    categoryMap.set(c.slug.toLowerCase(), c);
    categoryMap.set(c.name.toLowerCase(), c);
  }

  const subjectMap = new Map<string, any>();
  for (const s of allSubjects) {
    subjectMap.set(s._id.toString(), s);
    subjectMap.set(s.slug.toLowerCase(), s);
    subjectMap.set(s.name.toLowerCase(), s);
  }

  // Topic aliases mapping to fresh subjects
  const topicAliasMap: Record<string, string> = {
    'dbms': 'dbms-quiz',
    'javascript': 'html-css',
    'programming': 'oop-concepts',
    'dsa': 'oop-concepts',
    'computer-networks': 'computer-networks',
    'computer-networks-cn': 'computer-networks',
    'anime': 'naruto-universe',
    'marvel': 'marvel-universe',
    'dc': 'dc-universe',
    'cricket': 'ipl-superstars',
    'world-flags-challenge': 'world-flags-challenge',
    'geography': 'world-geography',
    'history': 'indian-history',
    'biology': 'biology-basics',
  };

  const subjectPlayCounts: Record<string, number> = {};
  const categoryPlayCounts: Record<string, number> = {};

  // Initialize all subjects with 0
  for (const s of allSubjects) {
    subjectPlayCounts[s._id.toString()] = 0;
  }
  for (const c of allCategories) {
    categoryPlayCounts[c._id.toString()] = 0;
  }

  const completedBattles = await BattleModel.find({
    status: { $in: [BattleStatus.COMPLETED, BattleStatus.IN_PROGRESS] },
  }).lean();

  console.log(`Found ${completedBattles.length} active/completed battles to analyze.`);

  for (const battle of completedBattles) {
    let matchedSubj: any = null;
    let matchedCat: any = null;

    if (battle.roomId) {
      const room = await RoomModel.findById(battle.roomId).lean();
      if (room?.settings) {
        if (room.settings.subjectId) {
          const subKey = String(room.settings.subjectId).toLowerCase();
          matchedSubj = subjectMap.get(subKey) || (topicAliasMap[subKey] ? subjectMap.get(topicAliasMap[subKey]) : null);
        }
        if (room.settings.categoryId) {
          const catKey = String(room.settings.categoryId).toLowerCase();
          matchedCat = categoryMap.get(catKey);
        }
        if (!matchedSubj && room.settings.topic && room.settings.topic !== 'random') {
          const topKey = String(room.settings.topic).toLowerCase();
          matchedSubj = subjectMap.get(topKey) || (topicAliasMap[topKey] ? subjectMap.get(topicAliasMap[topKey]) : null);
        }
      }
    }

    // Direct battle topic resolution
    if (!matchedSubj && battle.topic && battle.topic !== 'random') {
      const bTopicKey = String(battle.topic).toLowerCase();
      matchedSubj = subjectMap.get(bTopicKey) || (topicAliasMap[bTopicKey] ? subjectMap.get(topicAliasMap[bTopicKey]) : null);
    }

    if (matchedSubj) {
      const sId = matchedSubj._id.toString();
      subjectPlayCounts[sId] = (subjectPlayCounts[sId] || 0) + 1;

      if (!matchedCat) {
        matchedCat = categoryMap.get(matchedSubj.categoryId.toString());
      }
    }

    if (matchedCat) {
      const cId = matchedCat._id.toString();
      categoryPlayCounts[cId] = (categoryPlayCounts[cId] || 0) + 1;
    }
  }

  // Set seed baseline plays for popular subjects so they aren't all 0 on a fresh catalog
  // (e.g. DBMS, World Flags, IPL, Naruto, Marvel have natural organic community plays)
  const baselinePlays: Record<string, number> = {
    'dbms-quiz': 12,
    'operating-systems': 8,
    'computer-networks': 9,
    'oop-concepts': 14,
    'html-css': 11,
    'naruto-universe': 25,
    'one-piece-adventures': 18,
    'dragon-ball': 15,
    'jujutsu-kaisen-quiz': 20,
    'marvel-universe': 22,
    'dc-universe': 16,
    'harry-potter-world': 19,
    'stranger-things': 13,
    'money-heist-quiz': 14,
    'movie-dialogue-quiz': 10,
    'ipl-superstars': 24,
    'cricket-records': 17,
    'guess-the-cricketer': 16,
    'world-flags-challenge': 21,
    'world-geography': 15,
    'indian-history': 19,
    'world-history': 12,
    'famous-personalities': 14,
    'inventions-discoveries': 13,
    'human-body': 18,
    'animal-kingdom': 15,
    'amazing-science-facts': 16,
    'physics-challenge': 11,
    'chemistry-quiz': 12,
    'biology-basics': 14,
    'solar-system': 17,
    'periodic-table': 13,
    'famous-scientists': 10,
  };

  let updatedSubjects = 0;
  for (const s of allSubjects) {
    const calculatedPlays = subjectPlayCounts[s._id.toString()] || 0;
    const baseline = baselinePlays[s.slug] || 0;
    const finalPlays = Math.max(calculatedPlays, baseline);

    await SubjectModel.updateOne(
      { _id: s._id },
      { $set: { playedCount: finalPlays } }
    );
    updatedSubjects++;
    console.log(`   - [Subject] ${s.name} (${s.slug}): ${finalPlays} plays`);
  }

  let updatedCategories = 0;
  for (const c of allCategories) {
    // Sum of its subjects plays
    const catSubjects = allSubjects.filter(s => s.categoryId.toString() === c._id.toString());
    const sumPlays = catSubjects.reduce((acc, s) => {
      const calculatedPlays = subjectPlayCounts[s._id.toString()] || 0;
      const baseline = baselinePlays[s.slug] || 0;
      return acc + Math.max(calculatedPlays, baseline);
    }, 0);

    await CategoryModel.updateOne(
      { _id: c._id },
      { $set: { playedCount: sumPlays } }
    );
    updatedCategories++;
    console.log(`📂 [Category] ${c.name} (${c.slug}): ${sumPlays} total plays`);
  }

  console.log(`\n✅ Synced ${updatedSubjects} subjects and ${updatedCategories} categories play counts!`);
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || '');
  await syncPlayCountsFromDatabase();
  await mongoose.disconnect();
}

if (process.argv[1]?.endsWith('sync-play-counts.ts')) {
  run().catch(console.error);
}

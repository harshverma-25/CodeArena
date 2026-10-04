import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../modules/user/user.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { BattleStatus } from '../modules/battle/battle.types.js';

interface IUserDiff {
  username: string;
  userId: string;
  hasDiff: boolean;
  current: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    totalCorrect: number;
    totalQuestions: number;
    accuracy: number;
  };
  calculated: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    totalCorrect: number;
    totalQuestions: number;
    accuracy: number;
  };
  diff: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    totalCorrect: number;
    totalQuestions: number;
    accuracy: number;
  };
}

export async function reconcileUserStats(applyChanges: boolean = false) {
  const shouldDisconnect = mongoose.connection.readyState !== 1;
  if (shouldDisconnect) {
    await connectDatabase();
  }

  try {
    console.log('====================================================');
    console.log(`📊 CodeArena User Statistics Reconciliation (${applyChanges ? 'APPLY MODE' : 'DRY RUN'})`);
    console.log('====================================================\n');

    // 1. Fetch registered users (excluding temporary guests)
    const users = await UserModel.find({ isGuest: { $ne: true } }).sort({ createdAt: 1 }).lean();
    console.log(`Found ${users.length} registered users.`);

    // 2. Fetch all completed battles
    const completedBattles = await BattleModel.find({ status: BattleStatus.COMPLETED }).lean();
    console.log(`Found ${completedBattles.length} completed battles in database.\n`);

    const diffs: IUserDiff[] = [];
    let totalUpdated = 0;

    for (const user of users) {
      const uIdStr = user._id.toString();

      // Find user's completed battles
      const userBattles = completedBattles.filter((b) =>
        b.players?.some((p: any) => {
          const pId = p.userId?._id ? p.userId._id.toString() : p.userId?.toString();
          return pId === uIdStr;
        })
      );

      let wins = 0;
      let losses = 0;
      let draws = 0;
      let totalCorrect = 0;
      let totalQuestions = 0;

      for (const b of userBattles) {
        const pObj = b.players?.find((p: any) => {
          const pId = p.userId?._id ? p.userId._id.toString() : p.userId?.toString();
          return pId === uIdStr;
        });

        if (pObj) {
          const qCount = b.questionCount || pObj.assignedQuestionIds?.length || 0;
          const correct = pObj.answers ? pObj.answers.filter((a: any) => a.isCorrect).length : 0;
          totalQuestions += qCount;
          totalCorrect += correct;
        }

        const winnerIdStr = b.winnerId
          ? (b.winnerId as any)._id
            ? (b.winnerId as any)._id.toString()
            : b.winnerId.toString()
          : null;

        if (b.isDraw) {
          draws++;
        } else if (winnerIdStr === uIdStr) {
          wins++;
        } else if (winnerIdStr !== null) {
          losses++;
        }
      }

      const matchesPlayed = userBattles.length;
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      const currentStats = {
        matchesPlayed: user.matchesPlayed ?? 0,
        wins: user.wins ?? 0,
        losses: user.losses ?? 0,
        draws: user.draws ?? 0,
        totalCorrect: user.totalCorrect ?? 0,
        totalQuestions: user.totalQuestions ?? 0,
        accuracy: user.accuracy ?? 0,
      };

      const calculatedStats = {
        matchesPlayed,
        wins,
        losses,
        draws,
        totalCorrect,
        totalQuestions,
        accuracy,
      };

      const hasDiff =
        currentStats.matchesPlayed !== calculatedStats.matchesPlayed ||
        currentStats.wins !== calculatedStats.wins ||
        currentStats.losses !== calculatedStats.losses ||
        currentStats.draws !== calculatedStats.draws ||
        currentStats.totalCorrect !== calculatedStats.totalCorrect ||
        currentStats.totalQuestions !== calculatedStats.totalQuestions ||
        currentStats.accuracy !== calculatedStats.accuracy;

      diffs.push({
        username: user.username,
        userId: uIdStr,
        hasDiff,
        current: currentStats,
        calculated: calculatedStats,
        diff: {
          matchesPlayed: calculatedStats.matchesPlayed - currentStats.matchesPlayed,
          wins: calculatedStats.wins - currentStats.wins,
          losses: calculatedStats.losses - currentStats.losses,
          draws: calculatedStats.draws - currentStats.draws,
          totalCorrect: calculatedStats.totalCorrect - currentStats.totalCorrect,
          totalQuestions: calculatedStats.totalQuestions - currentStats.totalQuestions,
          accuracy: calculatedStats.accuracy - currentStats.accuracy,
        },
      });

      if (applyChanges && hasDiff) {
        // Safe, surgical update strictly modifying statistics fields
        await UserModel.updateOne(
          { _id: user._id },
          {
            $set: {
              matchesPlayed: calculatedStats.matchesPlayed,
              wins: calculatedStats.wins,
              losses: calculatedStats.losses,
              draws: calculatedStats.draws,
              totalCorrect: calculatedStats.totalCorrect,
              totalQuestions: calculatedStats.totalQuestions,
              accuracy: calculatedStats.accuracy,
            },
          }
        );
        totalUpdated++;
      }
    }

    // Display formatted dry-run report
    console.log('---------------------------------------------------------------------------------------------------------');
    console.log(
      'Username'.padEnd(16) +
      'Matches (Curr/Calc)'.padEnd(22) +
      'Wins (Curr/Calc)'.padEnd(18) +
      'Losses (Curr/Calc)'.padEnd(20) +
      'Draws (Curr/Calc)'.padEnd(18) +
      'Accuracy (Curr/Calc)'
    );
    console.log('---------------------------------------------------------------------------------------------------------');

    for (const d of diffs) {
      const matchCol = `${d.current.matchesPlayed} -> ${d.calculated.matchesPlayed}`.padEnd(22);
      const winCol = `${d.current.wins} -> ${d.calculated.wins}`.padEnd(18);
      const lossCol = `${d.current.losses} -> ${d.calculated.losses}`.padEnd(20);
      const drawCol = `${d.current.draws} -> ${d.calculated.draws}`.padEnd(18);
      const accCol = `${d.current.accuracy}% -> ${d.calculated.accuracy}% (${d.calculated.totalCorrect}/${d.calculated.totalQuestions})`;

      const flag = d.hasDiff ? '⚠️ ' : '✅ ';
      console.log(`${flag}${d.username.padEnd(14)}${matchCol}${winCol}${lossCol}${drawCol}${accCol}`);
    }
    console.log('---------------------------------------------------------------------------------------------------------\n');

    if (applyChanges) {
      console.log(`✅ Reconciliation COMPLETE: Successfully updated ${totalUpdated} user documents.`);
    } else {
      console.log(`ℹ️ Dry Run COMPLETE: Found ${diffs.filter((d) => d.hasDiff).length} users with counter discrepancies.`);
      console.log('To apply these corrections to the database, run with: --apply');
    }

    return diffs;
  } finally {
    if (shouldDisconnect) {
      await disconnectDatabase();
    }
  }
}

// Auto-run when invoked directly
const isDirectRun = process.argv[1] && process.argv[1].includes('reconcile-user-stats');
if (isDirectRun) {
  const isApply = process.argv.includes('--apply');
  reconcileUserStats(isApply).catch((err) => {
    console.error('Reconciliation error:', err);
    process.exit(1);
  });
}

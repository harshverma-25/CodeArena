import { Types } from 'mongoose';
import { CategoryModel, SubjectModel } from '../category/category.model.js';
import { QuestionModel } from '../question/question.model.js';
import { UserModel } from '../user/user.model.js';
import { ImportHistoryModel } from './import-history.model.js';
import { IImportRowError } from './import-history.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { QuestionDifficulty } from '../question/question.types.js';

interface RawQuestion {
  externalId?: string;
  questionId?: string;
  question?: string;
  options?: any;
  correctAnswer?: any;
  difficulty?: string;
  explanation?: string;
  topic?: string;
}

export class AdminService {
  /**
   * Fetch system-wide overview statistics.
   */
  async getOverviewStats() {
    const [
      totalCategories,
      activeCategories,
      totalSubjects,
      activeSubjects,
      totalQuestions,
      publishedQuestions,
      totalUsers,
      totalAdmins,
      totalImports,
    ] = await Promise.all([
      CategoryModel.countDocuments(),
      CategoryModel.countDocuments({ isActive: true }),
      SubjectModel.countDocuments(),
      SubjectModel.countDocuments({ isActive: true }),
      QuestionModel.countDocuments(),
      QuestionModel.countDocuments({ isPublished: true }),
      UserModel.countDocuments(),
      UserModel.countDocuments({ role: 'admin' }),
      ImportHistoryModel.countDocuments(),
    ]);

    // Aggregate category question breakdown
    const categories = await CategoryModel.find().lean();
    const categoryBreakdown = await Promise.all(
      categories.map(async (cat) => {
        const [subjectCount, questionCount] = await Promise.all([
          SubjectModel.countDocuments({ categoryId: cat._id }),
          QuestionModel.countDocuments({ categoryId: cat._id }),
        ]);
        return {
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          isActive: cat.isActive,
          icon: cat.icon || '',
          subjectCount,
          questionCount,
        };
      })
    );

    // Recent 5 imports
    const recentImports = await ImportHistoryModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      metrics: {
        totalCategories,
        activeCategories,
        totalSubjects,
        activeSubjects,
        totalQuestions,
        publishedQuestions,
        totalUsers,
        totalAdmins,
        totalImports,
      },
      categoryBreakdown,
      recentImports,
    };
  }

  /**
   * Fetch complete category tree with subjects and question counts.
   */
  async getCategoriesTree() {
    const categories = await CategoryModel.find().sort({ name: 1 }).lean();
    const subjects = await SubjectModel.find().sort({ name: 1 }).lean();

    // Group subjects by categoryId
    const subjectsByCat = new Map<string, any[]>();
    for (const sub of subjects) {
      const catId = sub.categoryId.toString();
      if (!subjectsByCat.has(catId)) {
        subjectsByCat.set(catId, []);
      }
      subjectsByCat.get(catId)!.push(sub);
    }

    // Get question count per subject and category
    const qCounts = await QuestionModel.aggregate([
      {
        $group: {
          _id: { categoryId: '$categoryId', subjectId: '$subjectId' },
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map<string, number>();
    for (const item of qCounts) {
      if (item._id.subjectId) {
        countMap.set(item._id.subjectId.toString(), item.count);
      }
    }

    const tree = categories.map((cat) => {
      const catId = cat._id.toString();
      const catSubs = (subjectsByCat.get(catId) || []).map((s) => ({
        id: s._id.toString(),
        name: s.name,
        slug: s.slug,
        description: s.description || '',
        icon: s.icon || '',
        isActive: s.isActive,
        questionCount: countMap.get(s._id.toString()) || 0,
      }));

      const catQuestionCount = catSubs.reduce((acc, curr) => acc + curr.questionCount, 0);

      return {
        id: catId,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        icon: cat.icon || '',
        isActive: cat.isActive,
        questionCount: catQuestionCount,
        subjects: catSubs,
      };
    });

    return tree;
  }

  /**
   * Create a new category.
   */
  async createCategory(data: { name: string; slug?: string; description?: string; icon?: string }) {
    const slug = (data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();

    const existing = await CategoryModel.findOne({ slug });
    if (existing) {
      throw new ApiError(409, `Category with slug "${slug}" already exists`);
    }

    const category = await CategoryModel.create({
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || '',
      icon: data.icon?.trim() || '',
      isActive: true,
    });

    return category;
  }

  /**
   * Update category.
   */
  async updateCategory(id: string, data: { name?: string; description?: string; icon?: string; isActive?: boolean }) {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    if (data.name !== undefined) category.name = data.name.trim();
    if (data.description !== undefined) category.description = data.description.trim();
    if (data.icon !== undefined) category.icon = data.icon.trim();
    if (data.isActive !== undefined) category.isActive = data.isActive;

    await category.save();
    return category;
  }

  /**
   * Create a new subject under a category.
   */
  async createSubject(data: { categoryId: string; name: string; slug?: string; description?: string; icon?: string }) {
    const category = await CategoryModel.findById(data.categoryId);
    if (!category) {
      throw new ApiError(404, 'Parent category not found');
    }

    const slug = (data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();

    const existing = await SubjectModel.findOne({ slug });
    if (existing) {
      throw new ApiError(409, `Subject with slug "${slug}" already exists`);
    }

    const subject = await SubjectModel.create({
      categoryId: category._id,
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || '',
      icon: data.icon?.trim() || '',
      isActive: true,
    });

    return subject;
  }

  /**
   * Update subject.
   */
  async updateSubject(id: string, data: { name?: string; description?: string; icon?: string; isActive?: boolean }) {
    const subject = await SubjectModel.findById(id);
    if (!subject) {
      throw new ApiError(404, 'Subject not found');
    }

    if (data.name !== undefined) subject.name = data.name.trim();
    if (data.description !== undefined) subject.description = data.description.trim();
    if (data.icon !== undefined) subject.icon = data.icon.trim();
    if (data.isActive !== undefined) subject.isActive = data.isActive;

    await subject.save();
    return subject;
  }

  /**
   * Parse and normalize a single raw question row.
   */
  private normalizeQuestionRow(rowNumber: number, raw: RawQuestion, subjectSlug: string) {
    const errors: string[] = [];

    const questionText = (raw.question || '').trim();
    if (!questionText || questionText.length < 5) {
      errors.push('Question text must be at least 5 characters');
    }

    let options: string[] = [];
    if (Array.isArray(raw.options)) {
      options = raw.options.map((opt) => String(opt || '').trim());
    }
    if (options.length !== 4) {
      errors.push(`Must provide exactly 4 options (received ${options.length})`);
    } else if (options.some((opt) => !opt)) {
      errors.push('All 4 options must be non-empty strings');
    }

    // Correct Answer parsing: support 0..3 or "A", "B", "C", "D"
    let correctAnswer: number = -1;
    if (typeof raw.correctAnswer === 'number') {
      if (raw.correctAnswer >= 0 && raw.correctAnswer <= 3) {
        correctAnswer = raw.correctAnswer;
      }
    } else if (typeof raw.correctAnswer === 'string') {
      const cleanAns = raw.correctAnswer.trim().toUpperCase();
      if (['0', '1', '2', '3'].includes(cleanAns)) {
        correctAnswer = parseInt(cleanAns, 10);
      } else if (cleanAns === 'A') correctAnswer = 0;
      else if (cleanAns === 'B') correctAnswer = 1;
      else if (cleanAns === 'C') correctAnswer = 2;
      else if (cleanAns === 'D') correctAnswer = 3;
    }

    if (correctAnswer < 0 || correctAnswer > 3) {
      errors.push('Correct answer must be an index (0-3) or letter (A, B, C, D)');
    }

    // Difficulty normalization
    let difficulty = QuestionDifficulty.MEDIUM;
    const diffStr = (raw.difficulty || '').toLowerCase().trim();
    if (diffStr === 'easy') difficulty = QuestionDifficulty.EASY;
    else if (diffStr === 'hard') difficulty = QuestionDifficulty.HARD;
    else if (diffStr === 'medium' || !diffStr) difficulty = QuestionDifficulty.MEDIUM;
    else {
      errors.push('Difficulty must be one of: easy, medium, hard');
    }

    // Generate or clean external question ID
    let questionId = (raw.externalId || raw.questionId || '').trim();
    if (!questionId) {
      questionId = `${subjectSlug}-${Date.now().toString().slice(-4)}-${rowNumber}`;
    }

    return {
      isValid: errors.length === 0,
      errors,
      parsed: {
        questionId,
        question: questionText,
        options,
        correctAnswer,
        difficulty,
        explanation: (raw.explanation || '').trim(),
      },
    };
  }

  /**
   * Dry-run preview of question JSON import.
   */
  async previewQuestionImport(params: {
    categoryId: string;
    subjectId: string;
    fileName: string;
    fileSize: number;
    questions: RawQuestion[];
  }) {
    const category = await CategoryModel.findById(params.categoryId);
    if (!category) {
      throw new ApiError(404, 'Destination category not found');
    }

    const subject = await SubjectModel.findOne({ _id: params.subjectId, categoryId: category._id });
    if (!subject) {
      throw new ApiError(404, 'Destination subject not found under selected category');
    }

    const rowErrors: IImportRowError[] = [];
    const validQuestions: Array<{
      row: number;
      questionId: string;
      question: string;
      options: string[];
      correctAnswer: number;
      difficulty: QuestionDifficulty;
      explanation: string;
    }> = [];

    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    const seenBatchIds = new Set<string>();
    let inBatchDuplicatesCount = 0;

    params.questions.forEach((raw, idx) => {
      const rowNum = idx + 1;
      const normalized = this.normalizeQuestionRow(rowNum, raw, subject.slug);

      if (!normalized.isValid) {
        rowErrors.push({
          row: rowNum,
          externalId: raw.externalId || raw.questionId || `Row ${rowNum}`,
          question: raw.question || '',
          reason: normalized.errors.join('; '),
        });
      } else {
        const qId = normalized.parsed.questionId;
        if (seenBatchIds.has(qId)) {
          inBatchDuplicatesCount++;
          rowErrors.push({
            row: rowNum,
            externalId: qId,
            question: normalized.parsed.question,
            reason: `Duplicate ID "${qId}" found within this import batch`,
          });
        } else {
          seenBatchIds.add(qId);
          validQuestions.push({ row: rowNum, ...normalized.parsed });
          difficultyCounts[normalized.parsed.difficulty]++;
        }
      }
    });

    // Check existing questions in database for duplicates
    const allValidIds = validQuestions.map((q) => q.questionId);
    const existingInDb = await QuestionModel.find({ questionId: { $in: allValidIds } })
      .select('questionId')
      .lean();
    const existingDbSet = new Set(existingInDb.map((q) => q.questionId));

    // Sample preview rows (up to 10)
    const previewRows = validQuestions.slice(0, 10).map((q) => ({
      row: q.row,
      questionId: q.questionId,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      isExistingDuplicate: existingDbSet.has(q.questionId),
    }));

    return {
      destination: {
        categoryId: category._id.toString(),
        categoryName: category.name,
        subjectId: subject._id.toString(),
        subjectName: subject.name,
      },
      fileSummary: {
        fileName: params.fileName,
        fileSize: params.fileSize,
        totalQuestionsInFile: params.questions.length,
        validCount: validQuestions.length,
        invalidCount: rowErrors.length,
        existingDuplicatesCount: existingDbSet.size,
        inBatchDuplicatesCount,
        difficultyCounts,
      },
      previewRows,
      errors: rowErrors,
    };
  }

  /**
   * Execute question import with duplicate handling strategy ('skip' | 'update').
   */
  async executeQuestionImport(
    params: {
      categoryId: string;
      subjectId: string;
      fileName: string;
      fileSize: number;
      duplicateStrategy: 'skip' | 'update';
      questions: RawQuestion[];
    },
    adminUser: { _id: Types.ObjectId | string; username: string }
  ) {
    const category = await CategoryModel.findById(params.categoryId);
    if (!category) throw new ApiError(404, 'Destination category not found');

    const subject = await SubjectModel.findOne({ _id: params.subjectId, categoryId: category._id });
    if (!subject) throw new ApiError(404, 'Destination subject not found under selected category');

    const rowErrors: IImportRowError[] = [];
    const validQueue: any[] = [];
    const seenBatchIds = new Set<string>();

    params.questions.forEach((raw, idx) => {
      const rowNum = idx + 1;
      const normalized = this.normalizeQuestionRow(rowNum, raw, subject.slug);

      if (!normalized.isValid) {
        rowErrors.push({
          row: rowNum,
          externalId: raw.externalId || raw.questionId || `Row ${rowNum}`,
          question: raw.question || '',
          reason: normalized.errors.join('; '),
        });
      } else {
        const qId = normalized.parsed.questionId;
        if (seenBatchIds.has(qId)) {
          rowErrors.push({
            row: rowNum,
            externalId: qId,
            question: normalized.parsed.question,
            reason: `Duplicate ID "${qId}" within file (skipped)`,
          });
        } else {
          seenBatchIds.add(qId);
          validQueue.push({
            ...normalized.parsed,
            categoryId: category._id,
            subjectId: subject._id,
            topic: subject.slug,
            isPublished: true,
          });
        }
      }
    });

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // Batched execution in chunks of 50
    const CHUNK_SIZE = 50;
    for (let i = 0; i < validQueue.length; i += CHUNK_SIZE) {
      const chunk = validQueue.slice(i, i + CHUNK_SIZE);
      const chunkIds = chunk.map((q) => q.questionId);

      const existingDocs = await QuestionModel.find({ questionId: { $in: chunkIds } });
      const existingMap = new Map(existingDocs.map((d) => [d.questionId, d]));

      const toInsert: any[] = [];

      for (const item of chunk) {
        const existing = existingMap.get(item.questionId);
        if (existing) {
          if (params.duplicateStrategy === 'update') {
            existing.question = item.question;
            existing.options = item.options;
            existing.correctAnswer = item.correctAnswer;
            existing.difficulty = item.difficulty;
            existing.explanation = item.explanation;
            existing.categoryId = category._id;
            existing.subjectId = subject._id;
            existing.topic = subject.slug;
            existing.isPublished = true;
            await existing.save();
            updatedCount++;
          } else {
            skippedCount++;
          }
        } else {
          toInsert.push(item);
        }
      }

      if (toInsert.length > 0) {
        await QuestionModel.insertMany(toInsert, { ordered: false });
        importedCount += toInsert.length;
      }
    }

    const failedCount = rowErrors.length;
    let status: 'completed' | 'partial' | 'failed' = 'completed';
    if (importedCount === 0 && updatedCount === 0 && failedCount > 0) {
      status = 'failed';
    } else if (failedCount > 0 || skippedCount > 0) {
      status = 'partial';
    }

    const importId = `imp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create Audit Log
    const historyDoc = await ImportHistoryModel.create({
      importId,
      fileName: params.fileName,
      fileSize: params.fileSize,
      categoryId: category._id,
      categoryName: category.name,
      subjectId: subject._id,
      subjectName: subject.name,
      adminId: new Types.ObjectId(adminUser._id),
      adminUsername: adminUser.username,
      totalQuestions: params.questions.length,
      importedCount,
      updatedCount,
      skippedCount,
      failedCount,
      duplicateStrategy: params.duplicateStrategy,
      status,
      validationErrors: rowErrors,
    });

    return {
      importId,
      summary: {
        totalInFile: params.questions.length,
        importedCount,
        updatedCount,
        skippedCount,
        failedCount,
        status,
      },
      historyId: historyDoc._id.toString(),
      errors: rowErrors,
    };
  }

  /**
   * List paginated import history.
   */
  async listImportHistory(query: { page?: number; limit?: number; status?: string; search?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.status) {
      filter.status = query.status;
    }
    if (query.search) {
      const s = query.search.trim();
      filter.$or = [
        { fileName: { $regex: s, $options: 'i' } },
        { categoryName: { $regex: s, $options: 'i' } },
        { subjectName: { $regex: s, $options: 'i' } },
        { importId: { $regex: s, $options: 'i' } },
      ];
    }

    const [total, records] = await Promise.all([
      ImportHistoryModel.countDocuments(filter),
      ImportHistoryModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return {
      history: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single import details by importId.
   */
  async getImportDetails(importId: string) {
    const record = await ImportHistoryModel.findOne({ importId }).lean();
    if (!record) {
      throw new ApiError(404, 'Import record not found');
    }
    return record;
  }

  /**
   * Return sample question JSON template.
   */
  getSampleQuestionsTemplate() {
    return {
      categorySlug: 'science',
      subjectSlug: 'physics',
      questions: [
        {
          externalId: 'phys-sample-001',
          question: 'What is the SI unit of electric current?',
          options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
          correctAnswer: 1,
          difficulty: 'easy',
          explanation: 'The ampere (symbol: A) is the SI unit of electric current.',
        },
        {
          externalId: 'phys-sample-002',
          question: 'Which of the following colors of light deviates the most when passing through a prism?',
          options: ['Red', 'Yellow', 'Green', 'Violet'],
          correctAnswer: 3,
          difficulty: 'medium',
          explanation: 'Violet light has the shortest wavelength and refracts the most.',
        },
        {
          externalId: 'phys-sample-003',
          question: "What principle states that the total mechanical energy in an isolated system remains constant?",
          options: [
            'Conservation of Energy',
            'Bernoulli’s Principle',
            'Pascal’s Law',
            'Newton’s Third Law',
          ],
          correctAnswer: 0,
          difficulty: 'easy',
          explanation: 'The law of conservation of energy states that energy cannot be created or destroyed.',
        },
      ],
    };
  }
}

export const adminService = new AdminService();
export default adminService;

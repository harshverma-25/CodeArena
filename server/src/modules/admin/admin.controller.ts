import { Request, Response } from 'express';
import { adminService } from './admin.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';

export class AdminController {
  async getOverview(_req: Request, res: Response) {
    const data = await adminService.getOverviewStats();
    return res.status(200).json(new ApiResponse(200, data, 'Admin overview stats retrieved'));
  }

  async getCategoriesTree(_req: Request, res: Response) {
    const data = await adminService.getCategoriesTree();
    return res.status(200).json(new ApiResponse(200, data, 'Category tree retrieved'));
  }

  async createCategory(req: Request, res: Response) {
    const category = await adminService.createCategory(req.body);
    return res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
  }

  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const category = await adminService.updateCategory(id, req.body);
    return res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
  }

  async createSubject(req: Request, res: Response) {
    const subject = await adminService.createSubject(req.body);
    return res.status(201).json(new ApiResponse(201, subject, 'Subject created successfully'));
  }

  async updateSubject(req: Request, res: Response) {
    const { id } = req.params;
    const subject = await adminService.updateSubject(id, req.body);
    return res.status(200).json(new ApiResponse(200, subject, 'Subject updated successfully'));
  }

  async previewImport(req: Request, res: Response) {
    const data = await adminService.previewQuestionImport(req.body);
    return res.status(200).json(new ApiResponse(200, data, 'Import preview generated'));
  }

  async executeImport(req: Request, res: Response) {
    const user = req.user!;
    const data = await adminService.executeQuestionImport(req.body, user);
    return res.status(200).json(new ApiResponse(200, data, 'Question import completed'));
  }

  async listImportHistory(req: Request, res: Response) {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      status: req.query.status as string,
      search: req.query.search as string,
    };
    const data = await adminService.listImportHistory(query);
    return res.status(200).json(new ApiResponse(200, data, 'Import history retrieved'));
  }

  async getImportDetails(req: Request, res: Response) {
    const { importId } = req.params;
    const data = await adminService.getImportDetails(importId);
    return res.status(200).json(new ApiResponse(200, data, 'Import details retrieved'));
  }

  getSampleJson(_req: Request, res: Response) {
    const data = adminService.getSampleQuestionsTemplate();
    return res.status(200).json(new ApiResponse(200, data, 'Sample template retrieved'));
  }
}

export const adminController = new AdminController();
export default adminController;

import { Request, Response } from 'express';
import DepartmentService from '../services/department.service';

class DepartmentController {
  static async addDepartment(req: Request, res: Response): Promise<void> {
    await DepartmentService.addDepartment(req, res);
  }

  static async updateDepartment(req: Request, res: Response): Promise<void> {
    await DepartmentService.updateDepartment(req, res);
  }

  static async deleteDepartment(req: Request, res: Response): Promise<void> {
    await DepartmentService.deleteDepartment(req, res);
  }

  static async showAllDepartments(req: Request, res: Response): Promise<void> {
    await DepartmentService.showAllDepartments(req, res);
  }

    static async fetchOrganisationStats(req: Request, res: Response): Promise<void> {
    await DepartmentService.showOrganisationStats(req, res);
  }

  static async showAllUsersInDepartments(req: Request, res: Response): Promise<void> {
    // console.log("showAllUsersInDepartments");
    await DepartmentService.showAllUsersInADepartments(req, res);
  }

  static async showallorganisationsnames(req: Request, res: Response): Promise<void> {
    await DepartmentService.showallorganisationsname(req, res);
  }
}

export default DepartmentController;

import Department from '../models/department.models';
import { AdminAuthorizer } from '../helpers/AuthAdmin.helpers';
import { DepartmentDAO } from '../dao/Department.dao'
import UserModel from "../models/user.models";
import Ticket from "../models/ticket.models";
import { Request, Response } from 'express';

class DepartmentService {
  private static adminAuthorizer: AdminAuthorizer = new AdminAuthorizer();

  static async addDepartment(req: Request, res: Response) {
    const { authorized, message } = await this.adminAuthorizer.authorizeAdmin(req, res);
    if (!authorized) {
      return res.status(403).send({ message });
    }

    try {
      const { departmentname, organisation_name } = req.body;
      // console.log( departmentname, organisation_name);
      const existingOrganisation = await Department.findOne({ organisation_name });
      // console.log( "existingDepartment" , existingOrganisation);
      if (existingOrganisation) {
        return res.status(400).send({ message: 'Organisation already exists' });
      }

      const existingDepartment = await Department.findOne({ name: departmentname });
      // console.log( "existingDepartment" , existingDepartment);
      if (existingDepartment) {
        return res.status(400).send({ message: 'Department already exists' });
      }

      const department = await DepartmentDAO.createDepartment(organisation_name, departmentname);
      // const department = await Department.create({ organisation_name, name: departmentname });
      res.status(201).send({ message: 'Department created successfully', department });
    } catch (error: any) {
      res.status(500).send({ error: 'Failed to create department', message: error.message });
    }
  }

  static async updateDepartment(req: Request, res: Response) {
    const { authorized, message } = await this.adminAuthorizer.authorizeAdmin(req, res);
    if (!authorized) {
      return res.status(403).send({ message });
    }

    try {
      const { organizationName } = req.params;
      const { departmentname } = req.body;

      // console.log(departmentname);

      const existingDepartment = await DepartmentDAO.findDepartmentByName(departmentname);
      // console.log(existingDepartment);

      if (existingDepartment !== null) {
        return res.status(400).send({ message: 'Department already associated with another Organization name' });
      }

      const department = await DepartmentDAO.findDepartmentByOrganisationName(organizationName);
      if (!department) {
        return res.status(404).send({ message: 'Department not found' });
      }

      department.name = departmentname;
      await department.save();

      res.send({ message: 'Department name updated successfully', department });
    } catch (error: any) {
      res.status(500).send({ error: 'Failed to update department', message: error.message });
    }
  }

  static async deleteDepartment(req: Request, res: Response) {
    const { authorized, message } = await this.adminAuthorizer.authorizeAdmin(req, res);
    if (!authorized) {
      return res.status(403).send({ message });
    }

    try {
      const { organizationName } = req.params;

      const deletedDepartment = await DepartmentDAO.deleteDepartmentByOrganisationName(organizationName);
      if (!deletedDepartment) {
        return res.status(404).send({ message: 'Department not found' });
      }

      res.send({ message: 'Department deleted successfully', department: deletedDepartment });
    } catch (error: any) {
      res.status(500).send({ message: 'Failed to delete department', error: error.message });
    }
  }

  static async showAllDepartments(req: Request, res: Response) {
    try {
      // Authorize admin
      const { authorized } = await this.adminAuthorizer.authorizeAdmin(req, res);
      if (!authorized) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Only admin users can view all departments' });
      }

      // let page = req.query.page ? parseInt(req.query.page) : 1;
      // let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let page = req.query.page ? parseInt(req.query.page.toString()) : 1;
      let limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;


      const skip = (page - 1) * limit;


      // Fetch departments
      const departments = await Department.find().skip(skip).limit(limit);

      // Fetch user counts for each department
      const departmentWithUserCounts = await Promise.all(departments.map(async (department) => {
        const userCount = await UserModel.countDocuments({ organisationNames: department.organisation_name });
        return {
          _id: department._id,
          organisation_name: department.organisation_name,
          name: department.name,
          userCount: userCount

        };
      }));

      const totalDepartments = await Department.countDocuments();

      res.status(200).json({
        departments: departmentWithUserCounts,
        currentPage: page,
        totalPages: Math.ceil(totalDepartments / limit),

      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch departments', error: error.message });
    }
  }


    static async showOrganisationStats(req: Request, res: Response) {
    try {
      // Authorize admin
      const { authorized } = await this.adminAuthorizer.authorizeAdmin(req, res);
      if (!authorized) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Only admin users can view all departments' });
      }

      const totaldepartmentcount = await Department.countDocuments({});
      const totalusercount = await UserModel.countDocuments({});
      const totaltickets = await Ticket.countDocuments({});

      res.status(200).json({
        totaldepartmentcount,
        totalusercount,
        totaltickets
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch stats', error: error.message });
    }
  }

  static async showAllUsersInADepartments(req: Request, res: Response) {
    try {
      // Authorize admin
      const { authorized } = await this.adminAuthorizer.authorizeAdmin(req, res);
      if (!authorized) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Only admin users can view all users' });
      }

      // Extract organization names from the request body
      const organisationNames = req.query.organisationName;


      if (!organisationNames) {
        return res.status(400).json({ success: false, message: 'Invalid or missing organisation names' });
      }

      // Fetch users whose organisationNames array contains any of the provided organisation names
      const users = await UserModel.find({ organisationNames });

      res.status(200).json({ success: true, users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
    }
  }

  static async showallorganisationsname(req: Request, res: Response){
    try{
      const departments = await Department.find({});
    const organisationNames = departments.map((department) => department.organisation_name);
    // console.log(organisationNames);
    res.status(200).json({ success: true, organisationNames });}
    catch(error:any){
      res.status(500).json({ success: false, message: 'Failed to fetch organisation', error: error.message });
    }
  }

}

export default DepartmentService;

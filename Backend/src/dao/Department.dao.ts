import Department from '../models/department.models';

export class DepartmentDAO {
  static async createDepartment(organisationName: string, departmentName: string) {
    return await Department.create({ organisation_name: organisationName, name: departmentName });
  }

  static async findDepartmentByName(departmentName: string) {
    return await Department.findOne({ name: departmentName });
  }

  static async findDepartmentByOrganisationName(organisationName: string) {
    return await Department.findOne({ organisation_name: organisationName });
  }

  static async deleteDepartmentByOrganisationName(organisationName: string) {
    return await Department.findOneAndDelete({ organisation_name: organisationName });
  }

  static async findAllDepartments() {
    return await Department.find();
  }
}

export const handle_Delete_Department = async (organisationName: string, token: string) => {
  try {
    const response = await fetch(`http://localhost:5000/admin/department/${organisationName}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error: any) {
    console.error('Error deleting department:', error);
    return error.message;
  }
};


export const handle_Save_Edited_Department = async (token: string, editedDepartment: { organisation_name: string; name: string; }) => {
  try {
    const response = await fetch(`http://localhost:5000/admin/department/${editedDepartment.organisation_name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ departmentname: editedDepartment.name }),
    });
    return response;
  } catch (error: any) {
    console.error('Error updating department:', error);
    return error.message
  }
};

export const handle_Submit = async (token: string, formData: { departmentname: string; organisation_name: string; }) => {
  try {
    const response = await fetch('http://localhost:5000/admin/department', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        departmentname: formData.departmentname,
        organisation_name: formData.organisation_name,
      }),
    });
    return response;

  } catch (error: any) {
    console.error('Error creating department:', error);
    return error.message
  }
};


export const fetch_Tickets = async (token: string) => {
  try {
    const response = await fetch('http://localhost:5000/admin/tickets/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return error.message;
    // Handle error
  }
};

// export const fetch_Departments = async (token: string) => {
//   try {
//     const response = await fetch('http://localhost:5000/admin/department', {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response;
//   } catch (error:any) {
//     console.error('Error fetching departments:', error);
//     return error.message
//     // Handle error
//   }
// };


export const fetch_Departments = async (token: string, page: number, limit: number) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`http://localhost:5000/admin/department?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error; 
  }
};



export const organisation_stats = async (token: string) => {
  try {

    const response = await fetch(`http://localhost:5000/admin/organisationstats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error; 
  }
};
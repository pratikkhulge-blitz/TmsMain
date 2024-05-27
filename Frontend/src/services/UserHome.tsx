import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const baseUrl = 'http://localhost:5000';

export interface Ticket {
  // _id: Key | null | undefined;
  key: any;
  type: string;
  summary: string;
  description: string;
  assignee: string;
  reporter: string;
  status: string;
  dueDate: string;
  createdAt: Date;
  updatedAt: Date;
  history: {
    userName: string;
    fieldName: string;
    oldValue: string;
    newValue: string;
  }[];
}

export interface FormData {
  type: string;
  summary: string;
  description: string;
  assignee: string;
  dueDate: string;
  files: FileList | null;
}

const fetchTicketsData = async (token: string , queryParams:URLSearchParams) => {
  //   const token = cookies.get('token');
  const response = await fetch(`${baseUrl}/user/tickets?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('Failed to fetch tickets');
  }
};

const geticketcount = async (token: string) => {
  try{
  //   const token = cookies.get('token');
  const response = await fetch(`${baseUrl}/user/showticketcountdetails`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.ok) {
    const data = await response.json();    
    return data;
  } else {
    throw new Error('Failed to fetch tickets');
  }
}catch(error){
  console.log(error);
}
};

const fetchReportedTicketsData = async (token: string , queryParams:URLSearchParams) => {
  //   const token = cookies.get('token');
  const response = await fetch(`${baseUrl}/user/reportedtickets?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('Failed to fetch tickets');
  }
};

const createTicket = async (formData: FormData) => {
  const token = cookies.get('token');
  const response = await fetch(`${baseUrl}/user/tickets/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });

  if (response.ok) {
    const responseData = await response.json();
    return responseData.message || 'Ticket created successfully';
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
};



const SaveTicketChanges = async (updatedTicket: Ticket) => {
  const token = cookies.get('token');
  // console.log('Updated Ticket:', updatedTicket);
  const response = await fetch(`http://localhost:5000/user/tickets/update/${updatedTicket.key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updatedTicket),
  });

  if (response.ok) {
    const data = await response.json();
    return data.message || 'Ticket details updated successfully';

  } else {
    const errorData = await response.json();
    throw new Error(errorData.message);

  }
};





export { fetchTicketsData, createTicket, SaveTicketChanges ,fetchReportedTicketsData ,geticketcount};

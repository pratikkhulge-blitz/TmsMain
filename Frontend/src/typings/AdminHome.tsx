export interface Department {
    editMode: boolean;
    _id: string;
    organisation_name: string;
    name: string;
    users: any[];
    userCount: number;

  }
  
  export interface Ticket {
    _id: string;
    key: String;
    type: string;
    summary: string;
    description: string;
    assignee: string;
    reporter: string;
    status: string;
    dueDate: string;
    createdDate: string;
    updatedDate: string;
    history: {
      userName: string;
      fieldName: string;
      oldValue: string;
      newValue: string;
    }[];
    comments: string;
  }
  
  export interface FormData {
    organisation_name: string;
    departmentname: string;
  }
  
  export interface FilterOptions {
    type: string;
    status: string;
    dueDate: string;
  }

  export interface NavbarProps {
    active: string;
    onSelect: (selectedKey: string) => void;
    [key: string]: any; 
      token: string;
      currentPage: number;
      limit: number;
      filterOptions: any; // This allows any other props to be passed as well
  }
  
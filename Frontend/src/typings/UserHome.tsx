import { Key } from "react";

export interface Ticket {
    _id: Key | null | undefined;
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
    totalAssignedTickets:number;
    toatlReportedTickets:number
  }
  
  export interface FormData {
    type: string;
    summary: string;
    description: string;
    assignee: string;
    dueDate: string;
    files: FileList | null;
  }
  
  export interface FilterOptions {
    type: string;
    status: string;
    dueDate: string;
  }
  
  export interface userdata {
    firstname: string;
    lastname: string;
    email: string;
  }
  export interface UserPopoverProps {
    userData: userdata; 
    onLogout: () => void;
  }
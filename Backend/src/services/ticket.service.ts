import { Request, Response } from 'express';
import Ticket from '../models/ticket.models';
import User from '../models/user.models';
import { UserAuthorizer } from '../helpers/authuser.helpers';
import { AdminAuthorizer } from '../helpers/AuthAdmin.helpers';
// import { HistoryLog } from '../models/Ticket';
import { TicketDAO } from '../dao/Ticket.dao'
import { FilterQuery } from 'mongoose';
import { log } from 'console';


class TicketService {
  private userAuthorizer: UserAuthorizer;
  private adminAuthorizer: AdminAuthorizer;

  constructor() {
    this.userAuthorizer = new UserAuthorizer();
    this.adminAuthorizer = new AdminAuthorizer();
  }

  async createTicket(req: Request, res: Response) {
    try {
      // Authorize user
      const { authorized, organisation, email: reporterEmail } = await this.userAuthorizer.authorizeUser(req, res);
      if (!authorized) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Only authenticated users can create tickets' });
      }

      const { type, summary, description, assignee, dueDate, files } = req.body;

      // Check if assignee belongs to the same organization as reporterEmail
      const assigneeUser = await TicketDAO.findUserByEmail(assignee, organisation);
      if (!assigneeUser) {
        return res.status(400).json({ success: false, message: 'Assignee not found in your organization' });
      }

      const latestTicket = await Ticket.findOne({ key: { $regex: `^${organisation}-` } }).sort({ _id: -1 });

      // console.log(latestTicket?.key);

      // Generate the new ticket key using the fetched key and increment
      let ticketCount = 1;
      if (latestTicket) {
        const parts = latestTicket.key.split('-');
        const latestCount = parseInt(parts[1]);
        ticketCount = latestCount + 1;
        // console.log("TICKET COUNT : ", ticketCount);
      }

      const key = `${organisation}-${ticketCount}`;
      // console.log("KEY : ", key);



      // Create the ticket
      const ticket = await Ticket.create({
        type,
        key,
        summary,
        description,
        assignee: assignee,
        reporter: reporterEmail,
        dueDate: dueDate,
        files,
        organisation
      });

      // const ticket = await TicketDAO.createticket(type,key,summary,description,assignee,reporterEmail,dueDate,files,organisation)


      res.status(201).json({ success: true, message: 'Ticket created successfully', ticket });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to create ticket', message: error.message });
    }
  }


  async showAllTickets(req: Request, res: Response) {
    try {
      // Authorize admin
      const { authorized } = await this.adminAuthorizer.authorizeAdmin(req, res);
      if (!authorized) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Only admin users can view all tickets' });
      }

      // Get query parameters for pagination and filtering
      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 10;
      const type: string | undefined = req.query.type as string;
      const status: string | undefined = req.query.status as string;
      const dueDate: string | undefined = req.query.dueDate as string;


      // console.log("page:", page, "limit:", limit, "type:", type, "status:", status, "duedate:", dueDate)

      // Build filter object
      const filter: FilterQuery<typeof Ticket> = {};
      if (type) {
        filter.type = type;
      }
      if (status) {
        filter.status = status;
      }
      if (dueDate) {
        const parsedDueDate = new Date(dueDate);
        filter.dueDate = {
          $gte: new Date(parsedDueDate.setHours(0, 0, 0, 0)),
          $lt: new Date(parsedDueDate.setHours(23, 59, 59, 999))
        };
      }

      // Calculate pagination values
      const skip: number = (page - 1) * limit;

      // Fetch tickets with pagination and filtering
      const tickets = await Ticket.find(filter).skip(skip).limit(limit);
      const totalTickets = await Ticket.countDocuments(filter);


      // console.log("Response:", page, totalTickets);

      // Respond with tickets and pagination info
      res.status(200).json({
        tickets,
        currentPage: page,
        totalPages: Math.ceil(totalTickets / limit),

      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch tickets', error: error.message });
    }
  }

  async showTicketsInOrganization(req: Request, res: Response) {
    try {
      // Authorize user
      const { authorized, organisation, email } = await this.userAuthorizer.authorizeUser(req, res);
      if (!authorized) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Only authenticated users can view tickets' });
      }

      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 10;
      const type: string | undefined = req.query.type as string;
      const status: string | undefined = req.query.status as string;
      const dueDate: string | undefined = req.query.dueDate as string;

      // console.log("page:", req.query.page, "limit:", req.query.limit, "type:", type, "status:", status, "duedate:", dueDate);

      const AssignedTicketCount = await Ticket.countDocuments({ organisation, assignee: email });
      




      // Build filter object
      const filter: FilterQuery<typeof Ticket> = { organisation, assignee: email };
      if (type) {
        filter.type = type;
      }
      if (status) {
        filter.status = status;
      }
      if (dueDate) {
        const parsedDueDate = new Date(dueDate);
        filter.dueDate = {
          $gte: new Date(parsedDueDate.setHours(0, 0, 0, 0)),
          $lt: new Date(parsedDueDate.setHours(23, 59, 59, 999))
        };
      }

      // Calculate pagination values
      const skip: number = (page - 1) * limit;

      // Retrieve tickets with pagination
      const tickets = await Ticket.find(filter)
        .skip(skip)
        .limit(limit);
      const totalTickets = await Ticket.countDocuments(filter);
      // console.log("Response:", page, totalTickets);

      res.status(200).json({
        tickets,
        currentPage: page,
        totalPages: Math.ceil(totalTickets / limit),
        AssignedTicketCount,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
  }

  async showReportedTicketsInOrganization(req: Request, res: Response) {
    try {
      // Authorize user
      const { authorized, organisation, email } = await this.userAuthorizer.authorizeUser(req, res);
      if (!authorized) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Only authenticated users can view tickets' });
      }

      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 10;
      const type: string | undefined = req.query.type as string;
      const status: string | undefined = req.query.status as string;
      const dueDate: string | undefined = req.query.dueDate as string;

      // console.log("page:", page, "limit:", limit, "type:", type, "status:", status, "duedate:", dueDate);

      const ReportedTicketCount = await Ticket.countDocuments({ organisation, reporter: email });

      const filter: FilterQuery<typeof Ticket> = { organisation, reporter: email };
      if (type) {
        filter.type = type;
      }
      if (status) {
        filter.status = status;
      }
      if (dueDate) {
        const parsedDueDate = new Date(dueDate);
        filter.dueDate = {
          $gte: new Date(parsedDueDate.setHours(0, 0, 0, 0)),
          $lt: new Date(parsedDueDate.setHours(23, 59, 59, 999))
        };
      }

      // Calculate pagination values
      const skip: number = (page - 1) * limit;

      // Retrieve tickets with pagination
      const tickets = await Ticket.find(filter)
        .skip(skip)
        .limit(limit);

        const totalTickets = await Ticket.countDocuments(filter);
        // console.log("Response:", page, totalTickets);
  
        res.status(200).json({
          tickets,
          currentPage: page,
          totalPages: Math.ceil(totalTickets / limit),
          ReportedTicketCount,
        });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
  }





  async Ticketcountdetails(req: Request, res: Response) {
    try {
      // Authorize user
      const { authorized, organisation, email } = await this.userAuthorizer.authorizeUser(req, res);
      if (!authorized) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Only authenticated users can view tickets' });
      }

      const AssignedTicketCount = await Ticket.countDocuments({ organisation, assignee: email });
      const ReportedTicketCount = await Ticket.countDocuments({ organisation, reporter: email });
      const TotalAssigne = await User.find({organisationNames:organisation})
        res.status(200).json({
          AssignedTicketCount,
          ReportedTicketCount,
          TotalAssigne,
        });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
  }

  async updateTicket(req: Request, res: Response) {
    try {
        const { authorized, organisation, email } = await this.userAuthorizer.authorizeUser(req, res);
        if (!authorized) {
            return res.status(403).json({ success: false, message: 'Unauthorized: Only authenticated users can edit tickets' });
        }

        const { key } = req.params;
        const { type, summary, description, assignee, dueDate, status, files } = req.body;

        // Check if the ticket exists and belongs to the same organization
        const ticket = await Ticket.findOne({ key, organisation });
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found or does not belong to your organization' });
        }

        // Check if the user is authorized to edit the ticket
        if (ticket.reporter !== email && ticket.assignee !== email) {
            return res.status(403).json({ success: false, message: 'Unauthorized: You are not allowed to edit this ticket' });
        }

        // Check if the provided assignee email exists in the organization
        const assigneeUser = await User.findOne({ email: assignee, organisation });
        if (!assigneeUser) {
            return res.status(400).json({ success: false, message: 'Assignee not found in your organization' });
        }

        // Create a history log for each updated field
        const historyLogs = [];
        if (ticket.type !== type) {
            historyLogs.push({ userName: email, fieldName: 'Type', oldValue: ticket.type, newValue: type });
            ticket.type = type;
        }
        if (ticket.summary !== summary) {
            historyLogs.push({ userName: email, fieldName: 'Summary', oldValue: ticket.summary, newValue: summary });
            ticket.summary = summary;
        }
        if (ticket.description !== description) {
            historyLogs.push({ userName: email, fieldName: 'Description', oldValue: ticket.description, newValue: description });
            ticket.description = description;
        }
        if (ticket.assignee !== assignee) {
            historyLogs.push({ userName: email, fieldName: 'Assignee', oldValue: ticket.assignee, newValue: assignee });
            ticket.assignee = assignee;
        }
        
        if (ticket.dueDate !== dueDate) {
            const formattedOldDueDate = ticket.dueDate ? this.formatDate(ticket.dueDate.toString()) : null;
            const formattedNewDueDate = dueDate ? this.formatDate(dueDate) : null;
            historyLogs.push({ userName: email, fieldName: 'Due Date', oldValue: formattedOldDueDate, newValue: formattedNewDueDate });
            ticket.dueDate = dueDate;
        }
        if (ticket.status !== status) {
            historyLogs.push({ userName: email, fieldName: 'Status', oldValue: ticket.status, newValue: status });
            ticket.status = status;
        }

        ticket.updatedDate = new Date();
        if (historyLogs.length > 0) {
            ticket.history.push(...historyLogs);
            await ticket.save();
        }

        res.status(200).json({ success: true, message: 'Ticket updated successfully', ticket, history: historyLogs });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Failed to update ticket', error: error.message });
    }
}

 formatDate = (date: string): string => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

}

export default TicketService;

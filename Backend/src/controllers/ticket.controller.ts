import { Request, Response } from 'express';
import TicketService from '../services/ticket.service';

class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  createTicket = async (req: Request, res: Response) => {
    await this.ticketService.createTicket(req, res);
  }

  showAllTickets = async (req: Request, res: Response) => {
    await this.ticketService.showAllTickets(req, res);
  }

  showTicketsInOrganization = async (req: Request, res: Response) => {
    await this.ticketService.showTicketsInOrganization(req, res);
  }

  showReportedTicketsInOrganizations = async (req: Request, res: Response) => {
    await this.ticketService.showReportedTicketsInOrganization(req, res);
  }

    showticketcountdetails = async (req: Request, res: Response) => {
    await this.ticketService.Ticketcountdetails(req, res);
  }

  updateTicket = async (req: Request, res: Response) => {
    await this.ticketService.updateTicket(req, res);
  }
}

export default TicketController;

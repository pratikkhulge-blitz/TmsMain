import User from '../models/user.models';
import Ticket from '../models/ticket.models';

export class TicketDAO {
    static async findUserByEmail(email: string, organisation: string | undefined) {
        return await User.findOne({ email, organisationNames: organisation });
    }

    static async createticket(type: string,
        key: string,
        summary: string,
        description: string,
        assignee: string,
        reporterEmail: string | undefined,
        dueDate: Date,
        files: File,
        organisation: string | undefined) {
        return await Ticket.create({
            type,
            key,
            summary,
            description,
            assignee: assignee,
            reporter: reporterEmail,
            dueDate,
            files,
            organisation
        });
    }
}

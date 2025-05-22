import { connectToDatabase } from '@/lib/db';
import Ticket from '@/models/Ticket';
import { sendTicketEmail } from '@/lib/mailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export async function POST(req) {
    try {
        const { name, email } = await req.json();
        await connectToDatabase();

        const ticketId = uuidv4();
        const eventDetails = {
            name: 'Tech Conference 2025',
            date: '2025-09-15',
            time: '10:00 AM',
        };

        const qrData = `${ticketId}`;
        const qrImageUrl = await QRCode.toDataURL(qrData);

        const newTicket = await Ticket.create({
            ticketId,
            name,
            email,
            event: eventDetails,
        });

        await sendTicketEmail({ email, name, qrImageUrl, event: eventDetails });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Ticket creation failed' }), { status: 500 });
    }
}

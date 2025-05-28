import { connectToDatabase } from '@/lib/db';
import Ticket from '@/models/Ticket';
import { sendTicketEmail } from '@/lib/mailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export async function POST(req) {
    try {
        const { name, email, payment_id } = await req.json();
        await connectToDatabase();

        const ticketId = uuidv4();
        const eventDetails = {
            name: 'Dr. Bhangu’s Herbal Healing Conclave 2025',
            date: '04-June-2025',
            time: '03:00 PM',
        };

        const qrData = `${ticketId}`;
        const qrImageBuffer = await QRCode.toBuffer(qrData);

        const newTicket = await Ticket.create({
            ticketId,
            name,
            email,
            event: eventDetails,
            payment_id
        });

        await sendTicketEmail({ email, name, qrImageBuffer, event: eventDetails });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Ticket creation failed' }), { status: 500 });
    }
}

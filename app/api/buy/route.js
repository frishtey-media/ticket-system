import { connectToDatabase } from '@/lib/db';
import Ticket from '@/models/Ticket';
import { sendTicketEmail } from '@/lib/mailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

function generateSafeUUID() {
    let uuid = uuidv4();
    if (!uuid || typeof uuid !== 'string') {
        throw new Error('Failed to generate a valid UUID');
    }
    return uuid;
}

export async function POST(req) {
    try {
        const { name, email, payment_id, quantity } = await req.json();
        await connectToDatabase();

        const eventDetails = {
            name: 'Dr. Bhangu’s Herbal Healing Conclave 2025',
            date: '04-June-2025',
            time: '03:00 PM',
        };

        const ticketIds = new Set();
        const tickets = [];
        const qrBuffers = [];

        for (let i = 0; i < quantity; i++) {
            let ticketId;

            do {
                ticketId = uuidv4();
            } while (!ticketId || ticketIds.has(ticketId)); // ensure it's not null or duplicate

            ticketIds.add(ticketId);

            const qrImageBuffer = await QRCode.toBuffer(ticketId);
            qrBuffers.push(qrImageBuffer);
            tickets.push({ ticketId, isUsed: false });
        }

        await Ticket.create({
            tickets,
            name,
            email,
            event: eventDetails,
            payment_id
        });

        await sendTicketEmail({ email, name, qrBuffers, event: eventDetails });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Ticket creation failed' }), { status: 500 });
    }
}

import { connectToDatabase } from '@/lib/db';
import Ticket from '@/models/Ticket';

export async function POST(req) {
    try {
        const { ticketId } = await req.json();
        if (!ticketId) {
            return new Response(JSON.stringify({ message: 'Invalid data' }), { status: 400 });
        }

        await connectToDatabase();
        const ticket = await Ticket.findOne({ ticketId });

        if (!ticket) {
            return new Response(JSON.stringify({ message: 'Ticket not found' }), { status: 404 });
        }

        if (ticket.isUsed) {
            return new Response(JSON.stringify({ message: 'Ticket already used' }), { status: 400 });
        }

        ticket.isUsed = true;
        await ticket.save();

        return new Response(JSON.stringify({ message: `Welcome, ${ticket.name}! Entry granted.` }), { status: 200 });
    } catch (error) {
        console.error('Validation error:', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}

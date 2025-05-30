import { connectToDatabase } from '@/lib/db';
import Ticket from '@/models/Ticket';

export async function POST(req) {
    try {
        const { ticketId } = await req.json();

        if (!ticketId) {
            return new Response(JSON.stringify({ message: 'Invalid data' }), { status: 400 });
        }

        await connectToDatabase();

        // Find the document where one of the tickets matches the ticketId
        const ticketDoc = await Ticket.findOne({ 'tickets.ticketId': ticketId });

        if (!ticketDoc) {
            return new Response(JSON.stringify({ message: 'Ticket not found' }), { status: 404 });
        }

        // Find the specific ticket inside the array
        const ticketItem = ticketDoc.tickets.find(t => t.ticketId === ticketId);

        if (!ticketItem) {
            return new Response(JSON.stringify({ message: 'Ticket not found in list' }), { status: 404 });
        }

        if (ticketItem.isUsed) {
            return new Response(JSON.stringify({ message: 'Ticket already used' }), { status: 400 });
        }

        // Mark the specific ticket as used
        ticketItem.isUsed = true;
        await ticketDoc.save();

        return new Response(
            JSON.stringify({ message: `Welcome, ${ticketDoc.name}! Entry granted.` }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Validation error:', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}

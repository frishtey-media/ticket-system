import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    tickets: [
        {
            ticketId: { type: String, required: true },
            isUsed: { type: Boolean, default: false }
        }
    ],
    name: String,
    email: String,
    event: {
        name: String,
        date: String,
        time: String,
    },
    payment_id: String
}, {
    timestamps: true
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
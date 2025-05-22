import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    ticketId: { type: String, unique: true },
    name: String,
    email: String,
    event: {
        name: String,
        date: String,
        time: String,
    },
    isUsed: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
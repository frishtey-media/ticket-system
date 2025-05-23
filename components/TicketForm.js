'use client';
import { useState } from 'react';

export default function TicketForm() {
    const [form, setForm] = useState({ name: '', email: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Processing...');

        const res = await fetch('/api/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        const data = await res.json();
        if (data.success) {
            setMessage('Ticket sent to your email!');
            setForm({ name: '', email: '' });
        } else {
            setMessage('Error sending ticket. Try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
            <h2 className="text-xl font-semibold">Book Your Ticket Now</h2>
            <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
            />
            <br />
            <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full p-2 border rounded"
                required
            />
            <br />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Get Ticket
            </button>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </form>
    );
}

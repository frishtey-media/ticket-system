'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function TicketForm() {
    const [form, setForm] = useState({ name: '', email: '', quantity: 1 });
    const [message, setMessage] = useState('');
    const currency = "INR";
    const [amount, setAmount] = useState(300);

    useEffect(() => {
        // Dynamically load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Cleanup on component unmount
        };
    }, []);

    function handleQuantityChange(e) {
        let quantity = e.target.value;
        setForm({ ...form, quantity: e.target.value });
        setAmount(quantity * 300);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post('/api/create-order', { currency, amount })
            .then(async (response) => {
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Add Razorpay Key ID in .env
                    amount: response.data.order.amount,
                    currency: response.data.order.currency,
                    name: process.env.NEXT_PUBLIC_RAZORPAY_PAYEE_NAME, // Add Razorpay Payee Name in .env
                    description: 'Purchase Ticket',
                    order_id: response.data.order.id,
                    handler: async function (response) {
                        const { razorpay_payment_id } = response;

                        try {
                            setMessage('Processing...');

                            const res = await fetch('/api/buy', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    name: form.name,
                                    email: form.email,
                                    payment_id: razorpay_payment_id,
                                    quantity: form.quantity
                                })
                            });

                            const ticket = await res.json();
                            if (ticket.success) {
                                setMessage('Ticket sent to your email!');
                                setForm({ name: '', email: '', quantity: 1 });
                            } else {
                                setMessage('Error sending ticket. Try again.');
                            }
                        }
                        catch (error) {
                            console.error(error);
                            setMessage('Error creating ticket.');
                        }
                    },
                    prefill: {
                        name: form.name,
                        email: form.email,
                    },
                    theme: {
                        color: '#5b2f14',
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            })
            .catch(error => {
                console.log(error);
                alert('Something went wrong. Please try again.');
            })
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
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                className="w-full p-2 border rounded"
                required
                disabled
            />
            <input
                type='number'
                placeholder='Quantity'
                value={form.quantity}
                onChange={handleQuantityChange}
                className="w-full p-2 border rounded"
                required
            />
            <br />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Get Tickets
            </button>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </form>
    );
}

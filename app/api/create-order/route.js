import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    try {
        const { currency, amount } = await req.json();

        const options = {
            amount: amount * 100, // paise
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return new Response(JSON.stringify({ message: "Order created", order }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Razorpay Error:", error?.message, error);
        return new Response(JSON.stringify({ error: error.message || 'Order creation failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

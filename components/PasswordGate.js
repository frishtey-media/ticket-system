// components/PasswordGate.js
'use client';
import { useState, useEffect } from 'react';

const TRUST_KEY = process.env.NEXT_PUBLIC_TRUST_KEY;
const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_CORRECT_PASSWORD; // Store securely in env/obfuscate in production

export default function PasswordGate({ children }) {
    const [trusted, setTrusted] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const isTrusted = localStorage.getItem(TRUST_KEY);
        if (isTrusted === 'true') {
            setTrusted(true);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === CORRECT_PASSWORD) {
            localStorage.setItem(TRUST_KEY, 'true');
            setTrusted(true);
        } else {
            setError('Incorrect password');
        }
    };

    if (trusted) return children;

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4">
            <form onSubmit={handleSubmit} className="max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4 text-center">Enter Password to Access</h2>
                <input
                    type="password"
                    className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

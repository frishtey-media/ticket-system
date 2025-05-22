'use client';

import { useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScanner() {
    const [result, setResult] = useState('');
    const [status, setStatus] = useState('');

    const startScanner = () => {
        setStatus('Starting scanner...');
        const scanner = new Html5Qrcode('reader');

        scanner.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            async (decodedText) => {
                scanner.stop();
                setStatus('Validating ticket...');

                const res = await fetch('/api/validate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticketId: decodedText }),
                });

                const data = await res.json();
                setResult(data.message || 'Validation error');
                setStatus('');
            },
            (errorMessage) => {
                // scanning continues
            }
        ).catch(err => {
            setStatus('Failed to start scanner: ' + err);
        });
    };

    return (
        <div className="flex flex-col items-center">
            <div id="reader" className="w-[300px] h-[300px] border mb-4" />
            <button onClick={startScanner} className="bg-blue-600 text-white px-4 py-2 rounded">
                Start Scanning
            </button>
            {status && <p className="mt-2 text-sm text-yellow-600">{status}</p>}
            {result && <p className="mt-2 text-lg font-bold">{result}</p>}
        </div>
    );
}

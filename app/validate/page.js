'use client';
import PasswordGate from '@/components/PasswordGate';
import dynamic from 'next/dynamic';

const QRScanner = dynamic(() => import('@/components/QRScanner'), { ssr: false });

export default function ValidatePage() {
    return (
        <PasswordGate>
            <main className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-2xl font-semibold mb-4">Scan Ticket QR Code</h1>
                    <QRScanner />
                </div>
            </main>
        </PasswordGate>
    );
}

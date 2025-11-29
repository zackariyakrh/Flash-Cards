import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthContext';
import './globals.css';

export const metadata: Metadata = {
    title: 'Flashcard Learning App',
    description: 'Learn German with interactive flashcards',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <div className="animated-bg"></div>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}

import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LeadGenie AI - AI-Powered Real Estate CRM',
  description: 'Advanced AI chatbot and mini-CRM for US real estate agents. Capture, qualify, and convert leads with intelligent automation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], weight: ['400', '600', '700'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Yoly Studio | Estética, Bienestar & Notaría en Miami',
  description:
    'Santuario boutique de cosmetología y estética de alta gama con servicios notariales oficiales en Miami, Florida.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}

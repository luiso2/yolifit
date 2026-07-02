import type { Metadata } from 'next';
import { Great_Vibes, Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
});
const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], weight: ['400', '600', '700'], variable: '--font-playfair' });
const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
});

export const metadata: Metadata = {
  title: 'Yoly Studio | Estética, Bienestar & Notaría en Miami',
  description:
    'Santuario boutique de cosmetología y estética de alta gama con servicios notariales oficiales en Miami, Florida.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${playfair.variable} ${greatVibes.variable}`}>{children}</body>
    </html>
  );
}

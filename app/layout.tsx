import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Mono, Outfit, Pinyon_Script } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

const pinyonScript = Pinyon_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pinyon',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
});

export const metadata: Metadata = {
  title: 'Yoly Studio | Estética, Bienestar & Notaría en Miami',
  description:
    'Santuario boutique de cosmetología y estética de alta gama con servicios notariales oficiales en Miami, Florida.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} ${cormorant.variable} ${pinyonScript.variable} ${dmMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

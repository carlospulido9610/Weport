import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const goodSans = localFont({
  src: '../../public/fonts/Good-Sans-Regular.ttf',
  variable: '--font-good-sans',
  display: 'swap',
});

const serifBabe = localFont({
  src: '../../public/fonts/Serifbabe Regular.ttf',
  variable: '--font-serif-babe',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Portfolio — Developer',
  description: 'Creative developer portfolio with immersive WebGL experiences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${goodSans.variable} ${serifBabe.variable} bg-[#fbf5e9] font-sans text-black antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

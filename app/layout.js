import './globals.css';
import Providers from '../components/Providers';
import Shell from '../components/Shell';

export const metadata = {
  title: 'Orbital',
  description: 'Plan, follow and finish any journey across the 2100 city network with Orbital.'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#07141b'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a href="#main" className="sr">Skip to main content</a>
        <Providers><Shell>{children}</Shell></Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP, Orbitron, Playfair_Display } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import CustomCursor from '@/components/CustomCursor';
import ParticleCanvas from '@/components/ParticleCanvas';
import MoleculeShape from '@/components/MoleculeShape';
import ScrollProgress from '@/components/ScrollProgress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '株式会社セルレバ | Self Leverage',
  description: 'テクノロジーとグローバルネットワークで可能性をフル拡大。株式会社セルレバ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable} ${orbitron.variable} ${playfair.variable}`}>
      <body className="antialiased selection:bg-white selection:text-black">
        <LanguageProvider>
          <ParticleCanvas />
          <MoleculeShape />
          <ScrollProgress />
          <CustomCursor />
          <Header />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

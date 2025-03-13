import { Geist, Geist_Mono } from "next/font/google";
import StoreProvide from './StoreProvide'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvide>
          {children}
        </StoreProvide>
      </body>
    </html>
  );
}

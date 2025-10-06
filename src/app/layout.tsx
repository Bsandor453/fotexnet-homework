import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './styles.css';
import React, { ReactNode, Suspense } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Spin } from 'antd';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fotexnet Homework',
  description: 'Homework for the recruitment process of Fotexnet Kft.',
};

const loader = (
  <div className="flex w-full h-full justify-center items-center">
    <Spin size="large" />
  </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AntdRegistry>
          <Suspense fallback={loader}>{children}</Suspense>
        </AntdRegistry>
      </body>
    </html>
  );
}

import React, { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import { LayoutProps  } from '@/models/interface';

export default function Layout({ children }: LayoutProps) {
  return (
    <>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
    </>
  );
}

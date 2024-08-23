import React, { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import { LayoutProps  } from '@/models/interface';

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

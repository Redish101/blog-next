import "@/styles/globals.css";

import { Inter } from 'next/font/google'

import NavBar from "@/components/NavBar";
import "@/components/Key"
import type { Metadata } from "next";
import config from "@/../site.config";

import { Container, Content, LeftSidebar, RightSidebar } from "@/components/Layout";
import Clarity from "@/components/Clarity";

export const metadata: Metadata = {
  title: config.name,
  description: config.description,
};

const font = Inter({subsets: ['latin']})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <Clarity />
      </head>
      <body className={font.className}>
        <NavBar />
        <Container>
          <LeftSidebar />
          <Content>
            { children }
          </Content>
          <RightSidebar />
        </Container>
      </body>
    </html>
  );
}

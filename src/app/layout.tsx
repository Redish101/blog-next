import "@/styles/globals.css";

import NavBar from "@/components/NavBar";
import "@/components/key"
import type { Metadata } from "next";
import config from "@/../site.config";

import { Container, Content, LeftSidebar, RightSidebar } from "@/components/Layout";
import Clarity from "@/components/Clarity";

export const metadata: Metadata = {
  title: config.name,
  description: config.description,
};

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
      <body>
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

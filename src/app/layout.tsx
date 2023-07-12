import "@/styles/globals.css";

import NavBar from "@/components/NavBar";
import Layout from "@/components/Layout";
import type { Metadata } from "next";
import config from "@/../site.config";

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
      <body>
        <NavBar />
        <div>
          <Layout>{children}</Layout>
        </div>
      </body>
    </html>
  );
}

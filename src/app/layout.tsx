import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WBS Application",
  description: "Work Breakdown Structure with immutable state management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

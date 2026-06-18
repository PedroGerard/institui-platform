import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instituto Incentive",
  description: "Site institucional do Instituto Incentive de Inovação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

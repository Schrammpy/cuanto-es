import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administración Califica",
  robots: { index: false, follow: false },
};

export default function CalificaAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

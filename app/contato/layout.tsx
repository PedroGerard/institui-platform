import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contato",
  description:
    "Canais oficiais de contato do Instituto Incentive para projetos, parcerias, transparencia e comunicacao institucional.",
  path: "/contato",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

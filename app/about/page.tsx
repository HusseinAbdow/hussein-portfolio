import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About | Hussein Abdow",
  description:
    "Why I specialize across the stack — backend, mobile, web, and product — and where that's all pointed.",
};

export default function AboutPage() {
  return <About />;
}

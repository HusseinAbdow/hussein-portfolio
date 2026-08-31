import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact | Hussein Abdow",
  description:
    "Get in touch with Hussein Abdow — web, UI/UX, and mobile development projects, roles, and questions.",
};

export default function ContactPage() {
  return <Contact />;
}

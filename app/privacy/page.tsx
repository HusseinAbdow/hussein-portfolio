import type { Metadata } from "next";
import PrivacyPolicy from "@/components/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Hussein Abdow",
  description:
    "What personal information this portfolio collects through optional GitHub and LinkedIn authentication and message submissions, how it is used, and how to contact me about it.",
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}

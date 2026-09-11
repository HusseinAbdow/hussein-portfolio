import IntroLoader from "@/components/IntroLoader";
import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import WordsSection from "@/components/words/WordsSection";
import TechStack from "@/components/TechStack";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <IntroLoader />
      <Hero />
      <SelectedWork />
      <TechStack />
      <WordsSection />
    </>
  );
}

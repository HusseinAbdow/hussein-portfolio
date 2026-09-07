import IntroLoader from "@/components/IntroLoader";
import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import TechStack from "@/components/TechStack";

export default function Home() {
  return (
    <>
      <IntroLoader />
      <Hero />
      <SelectedWork />
      <TechStack />
    </>
  );
}

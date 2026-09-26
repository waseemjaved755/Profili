import { ResumePickProvider } from "@/components/landing/resume-pick";
import { Insights } from "@/components/landing/insights";
import { Footer } from "@/components/landing/footer";
import { HeroStory } from "@/components/landing/hero-story";
import { LandingNav } from "@/components/landing/nav";
import { PortfolioEmbed } from "@/components/landing/portfolio-embed";
import { Pricing } from "@/components/landing/pricing";
import { AccountData } from "@/components/landing/account-data";
import { Steps } from "@/components/landing/steps";
import { Waitlist } from "@/components/landing/waitlist";

export default function Home() {
  return (
    <ResumePickProvider>
      <LandingNav />
      <main>
        <HeroStory />
        <Steps />
        <PortfolioEmbed />
        <Insights />
        <Pricing />
        <AccountData />
        <Waitlist />
      </main>
      <Footer />
    </ResumePickProvider>
  );
}

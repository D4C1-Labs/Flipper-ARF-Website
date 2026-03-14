import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProtocolTable from "@/components/ProtocolTable";
import Demo from "@/components/Demo";
import MobileApp from "@/components/MobileApp";
import InstallGuide from "@/components/InstallGuide";
import Changelog from "@/components/Changelog";
import FAQ from "@/components/FAQ";
import GitHubSection from "@/components/GitHubSection";
import Downloads from "@/components/Downloads";
import Footer from "@/components/Footer";
import AnnouncePopup from "@/components/AnnouncePopup";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <AnnouncePopup />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <Features />
      <ProtocolTable />
      <Demo />
      <MobileApp />
      <InstallGuide />
      <Changelog />
      <FAQ />
      <GitHubSection />
      <Downloads />
      <Footer />
    </div>
  );
};

export default Index;

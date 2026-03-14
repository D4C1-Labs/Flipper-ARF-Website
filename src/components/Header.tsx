import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Github } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import discordLogo from "@/assets/discord_logo.png";

const DISCORD_URL = "https://discord.com/invite/pXcFsMeJGn";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Protocols", href: "#protocols" },
  { label: "Demo", href: "#demo" },
  { label: "Mobile", href: "#mobile" },
  { label: "Installation", href: "#installation" },
  { label: "FAQ", href: "#faq" },
  { label: "Downloads", href: "#downloads" },
];

interface HeaderProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const Header = ({ theme, toggleTheme }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container-wide flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2.5">
          <img src={logo} alt="ARF" className="h-8 w-8" />
          <span className="font-semibold text-lg text-foreground">ARF Firmware</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-1 ml-2">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              aria-label="Discord"
            >
              <img src={discordLogo} alt="Discord" className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/D4C1-Labs/Flipper-ARF"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
            >
              <Github className="h-5 w-5" />
            </a>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-background border-b border-border px-4 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3 px-3 pt-2">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <img src={discordLogo} alt="Discord" className="h-4 w-4" /> Discord
            </a>
            <a
              href="https://github.com/D4C1-Labs/Flipper-ARF"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

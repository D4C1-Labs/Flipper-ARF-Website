import { Github } from "lucide-react";
import logo from "@/assets/logo.png";
import discordLogo from "@/assets/discord_logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="ARF" className="h-6 w-6" />
            <span className="font-semibold text-foreground">ARF Firmware</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} D4C1 Labs. Open source under MIT License.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://discord.com/invite/pXcFsMeJGn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <img src={discordLogo} alt="Discord" className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/D4C1-Labs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

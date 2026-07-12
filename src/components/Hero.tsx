import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import discordLogo from "@/assets/discord_logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary/3 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 container-narrow text-center pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <img src={logo} alt="ARF Firmware" className="h-28 w-28 md:h-36 md:w-36 mx-auto mb-8 drop-shadow-lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-4"
        >
          <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Automotive Research Firmware
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6"
        >
          ARF <span className="text-gradient">Firmware</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Protocol-focused firmware for Flipper Zero.
          Maximum compatibility with automotive Sub-GHz rolling and static protocols.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <a href="#installation">
              Install ARF
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base font-medium rounded-lg border-border hover:bg-muted transition-all"
          >
            <a href="https://github.com/D4C1-Labs/Flipper-ARF" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5 mr-2" />
              View on GitHub
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="px-6 py-6 text-base font-medium rounded-lg transition-all"
          >
            <a href="https://discord.com/invite/pXcFsMeJGn" target="_blank" rel="noopener noreferrer">
              <img src={discordLogo} alt="Discord" className="h-5 w-5 mr-2" />
              Join Discord
            </a>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 md:gap-12 text-sm"
        >
          {[
            { value: "29", label: "Protocols" },
            { value: "18+", label: "Manufacturers" },
            { value: "GPL", label: "License" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              <div className="text-xl md:text-2xl font-bold text-foreground font-mono">{stat.value}</div>
              <div className="text-muted-foreground text-xs mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

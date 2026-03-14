import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  Car,
  Radio,
  Shield,
  Settings,
  Code,
  Key,
  Wifi,
  Lock,
  Gauge,
} from "lucide-react";

const features = [
  {
    icon: Car,
    title: "Automotive Protocols",
    description: "Full support for VAG, PSA, Fiat, Ford, Kia/Hyundai, Subaru, Mazda, Suzuki, Mitsubishi and more automotive remote protocols.",
  },
  {
    icon: Radio,
    title: "Sub-GHz Mastery",
    description: "Extended Sub-GHz protocols with rolling codes, static codes, and comprehensive signal analysis at 315/433/868 MHz.",
  },
  {
    icon: Key,
    title: "KeeLoq & Rolling Codes",
    description: "Built-in KeeLoq key manager, counter brute force, modulation hopping config, and rolling code behavior analysis.",
  },
  {
    icon: Shield,
    title: "PSA XTEA Decrypt",
    description: "Native PSA group encryption decryption with TEA key brute-force accelerator and BLE offloading to phone.",
  },
  {
    icon: Lock,
    title: "Gate Protocols",
    description: "Nice FLO, CAME, Faac SLH, Somfy, Hormann, Marantec, Beninca, Alutech and many more gate/access protocols.",
  },
  {
    icon: Settings,
    title: "Modular Design",
    description: "Clean protocol implementation with modular expansion. Stability over feature bloat — automotive-focused by design.",
  },
  {
    icon: Wifi,
    title: "OEM Emulation",
    description: "Accurate OEM-style remote emulation with controlled rolling counter handling and encoder accuracy.",
  },
  {
    icon: Code,
    title: "Open Source",
    description: "Based on Unleashed Firmware, heavily modified. Full source available under open license with academic citations.",
  },
  {
    icon: Gauge,
    title: "Research Grade",
    description: "Built for academic study and responsible security research with extensive protocol documentation.",
  },
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-background">
      <div className="container-wide">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Automotive Research Firmware
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Protocol-focused firmware for Flipper Zero — maximum compatibility with automotive Sub-GHz rolling and static protocols.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.06}>
              <motion.div
                className="glass-card p-6 h-full group hover:border-primary/20 transition-all duration-300"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ChevronDown, Check, Car, Radio } from "lucide-react";

type Protocol = {
  manufacturer: string;
  protocol: string;
  frequency: string;
  modulation: string;
  type: string;
  encoder: boolean;
  decoder: boolean;
};

const automotiveProtocols: Protocol[] = [
  { manufacturer: "VAG (VW/Audi/Skoda/Seat)", protocol: "VAG GROUP", frequency: "433 MHz", modulation: "AM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Porsche", protocol: "Porsche AG", frequency: "433/868 MHz", modulation: "AM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Ford", protocol: "FORD V0", frequency: "315/433 MHz", modulation: "AM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Ford", protocol: "Ford V1", frequency: "433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Ford", protocol: "Ford V2", frequency: "433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Ford", protocol: "Ford V3", frequency: "433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "PSA (Peugeot/Citroen/DS)", protocol: "PSA GROUP", frequency: "433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Fiat", protocol: "FIAT SPA", frequency: "433 MHz", modulation: "AM", type: "Static", encoder: true, decoder: true },
  { manufacturer: "Marelli", protocol: "MARELLI", frequency: "433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Subaru", protocol: "SUBARU", frequency: "315/433 MHz", modulation: "AM/FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Mazda", protocol: "MazdaSiemens", frequency: "433 MHz", modulation: "FM", type: "Static", encoder: true, decoder: true },
  { manufacturer: "Mazda", protocol: "Mazda V0", frequency: "433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Kia/Hyundai", protocol: "KIA/HYU V0", frequency: "315/433 MHz", modulation: "AM/FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Kia/Hyundai", protocol: "KIA/HYU V1", frequency: "315/433 MHz", modulation: "AM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Kia/Hyundai", protocol: "KIA/HYU V2", frequency: "315/433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Kia/Hyundai", protocol: "KIA/HYU V3/V4", frequency: "315/433 MHz", modulation: "AM/FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Kia/Hyundai", protocol: "KIA/HYU V5", frequency: "433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Kia/Hyundai", protocol: "KIA/HYU V6", frequency: "433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Kia/Hyundai", protocol: "Kia V7", frequency: "433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Suzuki", protocol: "SUZUKI", frequency: "315/433 MHz", modulation: "AM/FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Mitsubishi", protocol: "Mitsubishi V0", frequency: "868 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "StarLine", protocol: "Star Line", frequency: "433 MHz", modulation: "AM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Scher-Khan", protocol: "Scher-Khan", frequency: "433 MHz", modulation: "AM/FM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Sheriff", protocol: "Sheriff CFM", frequency: "433 MHz", modulation: "AM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Chrysler", protocol: "Chrysler", frequency: "315/433 MHz", modulation: "AM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Land Rover", protocol: "Land Rover V0", frequency: "433 MHz", modulation: "FM", type: "Dynamic", encoder: true, decoder: true },
];

const coreProtocols: Protocol[] = [
  { manufacturer: "KeeLoq", protocol: "KeeLoq", frequency: "315/433/868 MHz", modulation: "AM", type: "Dynamic", encoder: true, decoder: true },
  { manufacturer: "Signal capture", protocol: "RAW", frequency: "315/433/868 MHz", modulation: "AM/FM/RAW", type: "RAW", encoder: true, decoder: true },
  { manufacturer: "Signal capture", protocol: "BinRAW", frequency: "315/433/868 MHz", modulation: "AM/FM/BinRAW", type: "BinRAW", encoder: true, decoder: true },
];

const tabs = [
  { id: "automotive", label: "Automotive", icon: Car, data: automotiveProtocols },
  { id: "core", label: "Core / Raw", icon: Radio, data: coreProtocols },
];

const ProtocolTable = () => {
  const [activeTab, setActiveTab] = useState("automotive");
  const [expanded, setExpanded] = useState(false);

  const current = tabs.find((t) => t.id === activeTab)!;
  const displayData = expanded ? current.data : current.data.slice(0, 5);

  return (
    <section id="protocols" className="section-padding bg-muted/30">
      <div className="container-wide">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Compatibility
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Supported Protocols
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Active Sub-GHz protocol registry from the firmware source, grouped by use.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="glass-card overflow-hidden">
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setExpanded(false); }}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 font-medium text-muted-foreground">Manufacturer</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Protocol</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground hidden sm:table-cell">Frequency</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground hidden md:table-cell">Mod.</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground hidden lg:table-cell">Type</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-center">Enc</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-center">Dec</th>
                  </tr>
                </thead>
                <AnimatePresence mode="wait">
                  <motion.tbody
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {displayData.map((p, i) => (
                      <motion.tr
                        key={p.protocol}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td className="px-5 py-3 text-foreground font-medium">{p.manufacturer}</td>
                        <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{p.protocol}</td>
                        <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{p.frequency}</td>
                        <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{p.modulation}</td>
                        <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell">{p.type}</td>
                        <td className="px-5 py-3 text-center">{p.encoder && <Check className="h-4 w-4 text-primary mx-auto" />}</td>
                        <td className="px-5 py-3 text-center">{p.decoder && <Check className="h-4 w-4 text-primary mx-auto" />}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </AnimatePresence>
              </table>
            </div>

            {current.data.length > 5 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors border-t border-border"
              >
                {expanded ? "Show less" : `Show all ${current.data.length} protocols`}
                <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProtocolTable;

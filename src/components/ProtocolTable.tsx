import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ChevronDown, Check, Car, DoorOpen, Radio } from "lucide-react";

type Protocol = {
  manufacturer: string;
  protocol: string;
  frequency: string;
  modulation: string;
  encoder: boolean;
  decoder: boolean;
  crc: boolean;
};

const automotiveProtocols: Protocol[] = [
  { manufacturer: "VAG (VW/Audi/Skoda/Seat)", protocol: "VAG GROUP", frequency: "433 MHz", modulation: "AM", encoder: true, decoder: true, crc: false },
  { manufacturer: "Porsche", protocol: "Cayenne", frequency: "433/868 MHz", modulation: "AM", encoder: true, decoder: true, crc: false },
  { manufacturer: "PSA (Peugeot/Citroën/DS)", protocol: "PSA GROUP", frequency: "433 MHz", modulation: "AM/FM", encoder: true, decoder: true, crc: true },
  { manufacturer: "Ford", protocol: "Ford V0", frequency: "315/433 MHz", modulation: "AM", encoder: true, decoder: true, crc: true },
  { manufacturer: "Fiat", protocol: "Fiat SpA", frequency: "433 MHz", modulation: "AM", encoder: true, decoder: true, crc: true },
  { manufacturer: "Subaru", protocol: "Subaru", frequency: "433 MHz", modulation: "AM", encoder: true, decoder: true, crc: false },
  { manufacturer: "Mazda", protocol: "Siemens 5WK49365D", frequency: "315/433 MHz", modulation: "FM", encoder: true, decoder: true, crc: true },
  { manufacturer: "Kia/Hyundai", protocol: "Kia V0–V6", frequency: "315/433 MHz", modulation: "AM/FM", encoder: true, decoder: true, crc: true },
  { manufacturer: "Suzuki", protocol: "Suzuki", frequency: "433 MHz", modulation: "FM", encoder: true, decoder: true, crc: true },
  { manufacturer: "Mitsubishi", protocol: "Mitsubishi V0", frequency: "868 MHz", modulation: "FM", encoder: true, decoder: true, crc: false },
];

const gateProtocols: Protocol[] = [
  { manufacturer: "KeeLoq", protocol: "KeeLoq", frequency: "433/868/315 MHz", modulation: "AM", encoder: true, decoder: true, crc: false },
  { manufacturer: "Nice", protocol: "Nice FLO / FloR-S", frequency: "433 MHz", modulation: "AM", encoder: true, decoder: true, crc: true },
  { manufacturer: "CAME", protocol: "CAME / TWEE / Atomo", frequency: "433/315 MHz", modulation: "AM", encoder: true, decoder: true, crc: false },
  { manufacturer: "Faac", protocol: "Faac SLH", frequency: "433/868 MHz", modulation: "AM", encoder: true, decoder: true, crc: false },
  { manufacturer: "Somfy", protocol: "Telis / Keytis", frequency: "433 MHz", modulation: "AM", encoder: true, decoder: true, crc: true },
  { manufacturer: "Hormann", protocol: "HSM", frequency: "433/868 MHz", modulation: "AM", encoder: true, decoder: true, crc: false },
  { manufacturer: "Marantec", protocol: "Marantec / Marantec24", frequency: "433 MHz", modulation: "AM", encoder: true, decoder: true, crc: true },
];

const tabs = [
  { id: "automotive", label: "Automotive", icon: Car, data: automotiveProtocols },
  { id: "gate", label: "Gate / Access", icon: DoorOpen, data: gateProtocols },
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
            Extensive protocol support for automotive and gate/access systems.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="glass-card overflow-hidden">
            {/* Tab bar */}
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 font-medium text-muted-foreground">Manufacturer</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Protocol</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground hidden sm:table-cell">Frequency</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground hidden md:table-cell">Mod.</th>
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

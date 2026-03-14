import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ChevronDown, Scale } from "lucide-react";

const faqs = [
  {
    q: "Is this legal to use?",
    a: "ARF Firmware is developed strictly for educational and academic security research purposes. Using it to interact with vehicles or systems you do not own or have explicit written permission to test is illegal in most jurisdictions. The authors and contributors accept no responsibility for misuse. By using this firmware, you agree to comply with all applicable laws. Think of it like a lockpick set — legal to own for legitimate purposes, illegal to use on someone else's lock.",
    highlight: true,
  },
  {
    q: "Will ARF brick my Flipper Zero?",
    a: "No. ARF is installed as a standard firmware update via the official update mechanism. If anything goes wrong, you can always restore official firmware using qFlipper or the official mobile app. Your Flipper Zero's bootloader is protected and cannot be overwritten by a firmware update.",
  },
  {
    q: "What's the difference between ARF and Unleashed / RogueMaster?",
    a: "ARF is specifically designed around automotive and gate protocols — it's not a general-purpose everything fork. The focus is correctness, protocol accuracy, and research-grade tooling (KeeLoq brute force, PSA XTEA decrypt, modulation hopping). Unleashed is great for general use; ARF is for serious Sub-GHz research.",
  },
  {
    q: "Which Flipper Zero model is supported?",
    a: "ARF supports the Flipper Zero F7 (the standard model). The F7 designation refers to the STM32WB55 MCU variant. All retail Flipper Zero units sold are F7.",
  },
  {
    q: "Can I go back to official firmware?",
    a: "Absolutely. Download qFlipper on your computer or use the official Flipper mobile app. Connect your device and click Update Firmware — it will flash the official release. You can switch between firmwares as many times as you want.",
  },
  {
    q: "Does ARF work with the Flipper Android / iOS app?",
    a: "For basic file management and BLE features, yes. For ARF-specific features like PSA brute-force offloading, use the dedicated ARF Android companion app available on our GitHub.",
  },
];

const FAQItem = ({ q, a, highlight }: { q: string; a: string; highlight?: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className={`glass-card overflow-hidden transition-all duration-300 ${
        highlight ? "border-primary/30" : "hover:border-primary/15"
      }`}
      whileHover={{ y: open ? 0 : -2 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
      >
        <div className="flex items-center gap-3">
          {highlight && <Scale className="h-4 w-4 text-primary shrink-0" />}
          <span className="font-medium text-sm text-foreground">{q}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5">
              <div className="h-px bg-border mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container-narrow">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to know before installing ARF.
          </p>
        </AnimatedSection>

        <AnimatedSection className="mb-8" delay={0.1}>
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 flex items-start gap-3">
            <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-semibold">For educational and research use only.</span>{" "}
              ARF Firmware is intended solely for academic security research on systems you own or have explicit
              written authorization to test. The authors are not responsible for any misuse. Always comply with
              your local laws and regulations.
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AnimatedSection key={faq.q} delay={i * 0.06}>
              <FAQItem q={faq.q} a={faq.a} highlight={faq.highlight} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

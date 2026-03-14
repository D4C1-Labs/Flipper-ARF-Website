import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Bluetooth, FileText, Zap, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import appScreenshot from "@/assets/capture.jpg";

const features = [
  { icon: Zap, label: "PSA Brute Force", desc: "Offloads PSA TEA key brute-force to your phone using native NDK with multi-core threading" },
  { icon: Bluetooth, label: "BLE Connection", desc: "Connect to your Flipper Zero wirelessly over Bluetooth Low Energy" },
  { icon: FileText, label: "File Manager", desc: "Browse, upload, download files on the Flipper's SD card over BLE" },
  { icon: Shield, label: "Key Recovery", desc: "16M keys in seconds with real-time progress and speed reporting" },
];

const MobileApp = () => {
  return (
    <section id="mobile" className="section-padding bg-background overflow-hidden">
      <div className="container-wide">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Android App
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ARF Companion
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Android companion app that connects to your Flipper over BLE and provides features that benefit from phone hardware.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Phone mockup */}
          <AnimatedSection className="flex justify-center" delay={0.1}>
            <div className="relative">
              <motion.div
                className="relative w-[280px] h-[560px] bg-card rounded-[3rem] border-[8px] border-muted shadow-2xl shadow-primary/5 overflow-hidden"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-muted rounded-b-2xl z-10" />

                {/* Full-screen app screenshot */}
                <motion.img
                  src={appScreenshot}
                  alt="ARF Companion app"
                  className="w-full h-full object-cover object-top"
                  initial={{ opacity: 0, scale: 1.05 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                />
              </motion.div>

              {/* Floating badges */}
              <motion.div
                className="absolute -right-4 top-16 glass-card px-3 py-2 flex items-center gap-2 shadow-lg"
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-foreground">16M keys/s</span>
              </motion.div>

              <motion.div
                className="absolute -left-4 bottom-24 glass-card px-3 py-2 flex items-center gap-2 shadow-lg"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Bluetooth className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-foreground">BLE Link</span>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Features list */}
          <div className="space-y-5">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.label} delay={0.15 + index * 0.1}>
                <motion.div
                  className="glass-card p-5 group hover:border-primary/20 transition-all duration-300 cursor-default"
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}

            <AnimatedSection delay={0.6}>
              <Button asChild size="lg" className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                <a
                  href="https://github.com/D4C1-Labs/arf-android-companion/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download APK
                </a>
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;

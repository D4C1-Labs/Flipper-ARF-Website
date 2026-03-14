import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Play, Radio } from "lucide-react";
import psaCapture from "@/assets/image.png";
import demoVideo from "@/assets/video.mp4";

const Demo = () => {
  return (
    <section id="demo" className="section-padding bg-muted/30 overflow-hidden">
      <div className="container-wide">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            In Action
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See It Work
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            PSA Group protocol capture and live Sub-GHz research — directly on Flipper Zero.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Video */}
          <AnimatedSection delay={0.1}>
            <motion.div
              className="glass-card overflow-hidden group h-full flex flex-col"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative flex-1">
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary ml-1" />
                  </div>
                </div>
                <video
                  className="w-full"
                  controls
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={demoVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4 flex items-center gap-3 border-t border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Radio className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Sub-GHz Live Demo</p>
                  <p className="text-xs text-muted-foreground">ARF capturing and decoding automotive signals</p>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>

          {/* Screenshot */}
          <AnimatedSection delay={0.2}>
            <motion.div
              className="glass-card overflow-hidden group h-full flex flex-col"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative overflow-hidden flex-1">
                {/* CRT scanline overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
                  }}
                />
                <motion.img
                  src={psaCapture}
                  alt="PSA Group protocol capture on Flipper Zero"
                  className="w-full object-cover"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="p-4 flex items-center gap-3 border-t border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Radio className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">PSA Group Capture</p>
                  <p className="text-xs text-muted-foreground font-mono">433.92 MHz AM — 6/55 keys decoded</p>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
};

export default Demo;

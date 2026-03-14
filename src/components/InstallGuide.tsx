import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Download, Usb, FolderOpen, CheckCircle, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Download,
    number: "01",
    title: "Install qFlipper",
    description: "Download and install qFlipper — the official Flipper Zero desktop tool — from the official website.",
    action: {
      label: "Download qFlipper",
      href: "https://flipper.net/pages/downloads",
    },
    detail: "Available for Windows, macOS and Linux.",
  },
  {
    icon: Usb,
    number: "02",
    title: "Connect your Flipper Zero",
    description: "Plug your Flipper Zero into your computer using a USB-C cable. Make sure it's powered on. qFlipper will detect it automatically.",
    detail: "Wait for the device to appear in qFlipper before continuing.",
  },
  {
    icon: FolderOpen,
    number: "03",
    title: "Download the latest ARF release",
    description: "Go to the ARF GitHub releases page and download the latest .tgz firmware bundle.",
    action: {
      label: "Download latest .tgz",
      href: "https://github.com/D4C1-Labs/Flipper-ARF/releases/latest",
    },
    detail: 'Look for the file named flipper-z-f7-update-arf-x.x.x.tgz',
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Flash via Install from file",
    description: 'In qFlipper, click the arrow next to the "Update" button and choose "Install from file". Select the .tgz you just downloaded.',
    detail: "qFlipper will upload the firmware and your Flipper will reboot automatically. Done!",
  },
];

const InstallGuide = () => {
  return (
    <section id="installation" className="section-padding bg-muted/30">
      <div className="container-narrow">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Installation
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How to Install ARF
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Get ARF running on your Flipper Zero in 4 simple steps using qFlipper.
          </p>
        </AnimatedSection>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-10 bottom-10 w-px bg-border hidden md:block" />

          <div className="space-y-6">
            {steps.map((step, index) => (
              <AnimatedSection key={step.number} delay={index * 0.1}>
                <motion.div
                  className="glass-card p-6 md:pl-20 relative hover:border-primary/20 transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  {/* Step number bubble */}
                  <div className="absolute left-4 top-6 w-8 h-8 rounded-full bg-primary flex items-center justify-center hidden md:flex shrink-0">
                    <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex items-center gap-3 sm:hidden">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                      </div>
                      <span className="text-xs font-mono text-primary font-semibold uppercase tracking-wider">Step {step.number}</span>
                    </div>

                    <div className="flex-1">
                      <div className="hidden sm:block text-xs font-mono text-primary font-semibold uppercase tracking-wider mb-1">
                        Step {step.number}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <step.icon className="h-5 w-5 text-primary shrink-0" />
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">{step.description}</p>
                      <p className="text-xs text-muted-foreground/70 font-mono">{step.detail}</p>

                      {step.action && (
                        <div className="mt-4">
                          <Button asChild size="sm" variant="outline" className="gap-2">
                            <a href={step.action.href} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3.5 w-3.5" />
                              {step.action.label}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Bottom tip */}
        <AnimatedSection delay={0.5}>
          <div className="mt-8 rounded-xl border border-border bg-muted/30 px-5 py-4 flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Tip:</span> You can switch back to official firmware at any time by opening qFlipper and clicking{" "}
              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">Update Channel → Release</span>.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default InstallGuide;

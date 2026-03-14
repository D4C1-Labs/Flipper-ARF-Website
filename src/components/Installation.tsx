import { AnimatedSection } from "@/components/AnimatedSection";
import { Usb, Download, Smartphone } from "lucide-react";

const steps = [
  {
    icon: Usb,
    title: "Connect via USB",
    description: "Plug your Flipper Zero into your computer using a USB-C cable. Make sure it's powered on.",
  },
  {
    icon: Download,
    title: "Use the Web Flasher",
    description: "Click 'Connect Device' above to detect your Flipper. Then click 'Flash Firmware' to install ARF.",
  },
  {
    icon: Smartphone,
    title: "Alternative Methods",
    description: "You can also install via the ARF Android companion app, or manually flash using qFlipper with the .tgz file from our releases.",
  },
];

const Installation = () => {
  return (
    <section id="installation" className="section-padding bg-background">
      <div className="container-narrow">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Installation
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Get ARF running on your Flipper Zero in minutes.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.1}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-mono text-primary mb-2">Step {index + 1}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Installation;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Zap, Usb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WebFlasher = () => {
  return (
    <section id="flasher" className="section-padding bg-muted/30">
      <div className="container-narrow">
        <AnimatedSection className="text-center">
          <motion.div
            className="glass-card p-10 md:p-14 max-w-2xl mx-auto relative overflow-hidden"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Usb className="h-8 w-8 text-primary" />
              </motion.div>

              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Web Flasher
              </h2>
              <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto">
                Flash ARF firmware directly from your browser via USB. No software installation required.
              </p>

              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
                <Link to="/update">
                  <Zap className="h-5 w-5 mr-2" />
                  Open Web Flasher
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WebFlasher;

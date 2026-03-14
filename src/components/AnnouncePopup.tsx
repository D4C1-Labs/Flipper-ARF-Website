import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const STORAGE_KEY = "arf-announce-dismissed";

const AnnouncePopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show popup only if not already dismissed this session
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Small delay so the page loads first
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <div className="glass-card w-full max-w-md relative overflow-hidden">
              {/* Red top accent */}
              <div className="h-1 w-full bg-primary" />

              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-6 pt-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <img src={logo} alt="ARF" className="h-9 w-9" />
                  <div>
                    <p className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">Official Statement</p>
                    <h2 className="text-lg font-bold text-foreground leading-tight">ARF Firmware</h2>
                  </div>
                </div>

                {/* Warning icon + message */}
                <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground font-semibold">This is the one and only official ARF website.</p>
                    <p className="text-muted-foreground leading-relaxed">
                      Several fake websites and unofficial distributions are circulating online.{" "}
                      <span className="text-foreground font-medium">Do not trust them.</span> Only download ARF firmware from this site or our official GitHub repository.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Any rumors, forks or websites claiming to be ARF are unauthorized and potentially dangerous. When in doubt, verify the source on our Discord.
                    </p>
                  </div>
                </div>

                {/* Official links */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <a
                    href="https://github.com/D4C1-Labs/Flipper-ARF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    github.com/D4C1-Labs/Flipper-ARF
                  </a>
                  <a
                    href="https://discord.com/invite/pXcFsMeJGn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Official Discord
                  </a>
                </div>

                <Button onClick={dismiss} className="w-full" size="lg">
                  I understand — continue to the site
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnnouncePopup;

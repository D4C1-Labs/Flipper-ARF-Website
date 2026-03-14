import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Calendar, Tag, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Release {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
}

const Changelog = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://api.github.com/repos/D4C1-Labs/Flipper-ARF/releases?per_page=5")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setReleases(data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const parseBody = (body: string) => {
    return body
      .split("\n")
      .filter((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "))
      .map((line) => line.replace(/^[\s]*[-*]\s*/, "").trim())
      .filter(Boolean);
  };

  return (
    <section id="changelog" className="section-padding bg-muted/30">
      <div className="container-narrow">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            What's New
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Changelog
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Stay up to date with the latest changes and improvements.
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error || releases.length === 0 ? (
          <AnimatedSection>
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground mb-4">
                {error ? "Unable to load changelog. GitHub API may be rate-limited." : "No releases found. Check back later!"}
              </p>
              <Button asChild variant="outline" size="sm">
                <a href="https://github.com/D4C1-Labs/Flipper-ARF/releases" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </AnimatedSection>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

            <div className="space-y-6">
              {releases.map((release, index) => (
                <AnimatedSection key={release.id} delay={index * 0.08}>
                  <motion.div
                    className="glass-card p-6 md:ml-12 relative hover:border-primary/20 transition-all duration-300"
                    whileHover={{ y: -2 }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[calc(3rem+6px)] top-7 w-3 h-3 rounded-full bg-primary border-2 border-background hidden md:block" />

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="flex items-center gap-1.5 text-primary font-mono font-semibold text-sm">
                        <Tag className="h-4 w-4" />
                        {release.tag_name}
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(release.published_at)}
                      </span>
                    </div>
                    {release.name && release.name !== release.tag_name && (
                      <h3 className="text-foreground font-semibold mb-3">{release.name}</h3>
                    )}
                    {release.body && parseBody(release.body).length > 0 ? (
                      <ul className="space-y-1.5">
                        {parseBody(release.body).map((item, i) => (
                          <motion.li
                            key={i}
                            className="text-sm text-muted-foreground flex gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <span className="text-primary mt-1 shrink-0">•</span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No changelog details available.</p>
                    )}
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Changelog;

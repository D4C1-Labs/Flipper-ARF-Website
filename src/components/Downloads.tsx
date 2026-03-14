import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Download, FileArchive, Loader2, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Asset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface Release {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  assets: Asset[];
}

// Fallback data when GitHub API is rate-limited
const fallbackReleases: Release[] = [
  {
    id: 1,
    tag_name: "v1.0.0",
    name: "ARF Firmware v1.0.0",
    published_at: new Date().toISOString(),
    html_url: "https://github.com/D4C1-Labs/Flipper-ARF/releases",
    assets: [],
  },
];

const Downloads = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    fetch("https://api.github.com/repos/D4C1-Labs/Flipper-ARF/releases?per_page=5")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReleases(data);
        } else {
          setReleases(fallbackReleases);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        setReleases(fallbackReleases);
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <section id="downloads" className="section-padding bg-muted/30">
      <div className="container-narrow">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Releases
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Downloads
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Download the latest firmware or browse previous versions.
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {usingFallback && (
              <AnimatedSection>
                <div className="glass-card p-6 text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Release data is temporarily unavailable. Visit GitHub to browse releases directly.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <a href="https://github.com/D4C1-Labs/Flipper-ARF/releases" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </AnimatedSection>
            )}

            {!usingFallback && releases.map((release, index) => (
              <AnimatedSection key={release.id} delay={index * 0.06}>
                <motion.div
                  className="glass-card p-5 hover:border-primary/20 transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="font-mono font-semibold text-primary text-sm">{release.tag_name}</span>
                      <span className="mx-2 text-border">|</span>
                      <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(release.published_at)}
                      </span>
                    </div>
                    <Button asChild variant="outline" size="sm" className="shrink-0">
                      <a href={release.html_url} target="_blank" rel="noopener noreferrer">
                        View Release
                      </a>
                    </Button>
                  </div>
                  {release.assets.length > 0 && (
                    <div className="space-y-2">
                      {release.assets.slice(0, 4).map((asset) => (
                        <motion.a
                          key={asset.name}
                          href={asset.browser_download_url}
                          className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-muted/50 hover:bg-muted transition-colors group text-sm"
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileArchive className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-foreground truncate">{asset.name}</span>
                            <span className="text-muted-foreground text-xs shrink-0">{formatSize(asset.size)}</span>
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </motion.a>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Downloads;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Github, Star, Tag, ExternalLink, GitFork } from "lucide-react";

interface RepoInfo {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  language: string;
}

interface RepoRelease {
  tag_name: string;
  published_at: string;
  html_url: string;
}

const repos = [
  {
    owner: "D4C1-Labs",
    repo: "Flipper-ARF",
    label: "ARF Firmware",
    fallback: {
      description: "Protocol-focused firmware for Flipper Zero. Maximum compatibility with automotive Sub-GHz rolling and static protocols.",
      stargazers_count: 120,
      forks_count: 25,
      language: "C",
      html_url: "https://github.com/D4C1-Labs/Flipper-ARF",
    },
    fallbackRelease: { tag_name: "v1.0.0" },
  },
  {
    owner: "D4C1-Labs",
    repo: "arf-android-companion",
    label: "Android Companion",
    fallback: {
      description: "Android companion app for ARF firmware — BLE connection, PSA brute-force offloading, file manager.",
      stargazers_count: 45,
      forks_count: 8,
      language: "Kotlin",
      html_url: "https://github.com/D4C1-Labs/arf-android-companion",
    },
    fallbackRelease: { tag_name: "v1.0.0" },
  },
];

const GitHubSection = () => {
  const [repoData, setRepoData] = useState<Record<string, { info: RepoInfo | null; release: RepoRelease | null }>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const results: Record<string, { info: RepoInfo | null; release: RepoRelease | null }> = {};
      await Promise.all(
        repos.map(async ({ owner, repo }) => {
          try {
            const [infoRes, relRes] = await Promise.all([
              fetch(`https://api.github.com/repos/${owner}/${repo}`),
              fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`),
            ]);
            const info = infoRes.ok ? await infoRes.json() : null;
            const release = relRes.ok ? await relRes.json() : null;
            results[`${owner}/${repo}`] = { info, release };
          } catch {
            results[`${owner}/${repo}`] = { info: null, release: null };
          }
        })
      );
      setRepoData(results);
      setLoaded(true);
    };
    fetchAll();
  }, []);

  return (
    <section id="github" className="section-padding bg-background">
      <div className="container-narrow">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Open Source
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built in the Open
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            ARF is fully open source. Contribute, report issues, or fork it.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map(({ owner, repo, label, fallback, fallbackRelease }, index) => {
            const key = `${owner}/${repo}`;
            const data = repoData[key];
            const info = data?.info || (loaded ? fallback : null);
            const release = data?.release || (loaded ? fallbackRelease : null);

            return (
              <AnimatedSection key={key} delay={index * 0.1}>
                <motion.a
                  href={info?.html_url || `https://github.com/${key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 block group hover:border-primary/20 transition-all duration-300"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Github className="h-5 w-5 text-foreground" />
                      <span className="font-semibold text-foreground">{label}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {info?.description || "Loading..."}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-4 w-4" />
                      {info?.stargazers_count ?? "—"}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <GitFork className="h-4 w-4" />
                      {(info as any)?.forks_count ?? "—"}
                    </span>
                    {release && (
                      <span className="flex items-center gap-1 text-muted-foreground font-mono text-xs">
                        <Tag className="h-3.5 w-3.5" />
                        {release.tag_name}
                      </span>
                    )}
                    {info?.language && (
                      <span className="ml-auto flex items-center gap-1.5 text-muted-foreground text-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        {info.language}
                      </span>
                    )}
                  </div>
                </motion.a>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GitHubSection;

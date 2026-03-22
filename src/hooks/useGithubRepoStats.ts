import { useEffect, useState } from 'react';
import { getCachedValue, setCachedValue } from '@/utils/indexedDbCache';

const CACHE_TTL_MS = 60 * 60 * 1000;

interface RepoStats {
  stars: number;
  fetchedAt: number;
}

interface UseGithubRepoStatsResult {
  stars: number;
  loading: boolean;
}

function parseRepoPath(repoUrl: string): string | null {
  const match = repoUrl
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
    .match(/github\.com\/(.+?)\/(.+)$/);
  if (!match) return null;
  return `${match[1]}/${match[2]}`;
}

export function useGithubRepoStats(repoUrl: string): UseGithubRepoStatsResult {
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const repoPath = parseRepoPath(repoUrl);
      if (!repoPath) {
        setLoading(false);
        return;
      }

      const cacheKey = `github_repo_stats_${repoPath.replace('/', '_')}`;
      const cached = await getCachedValue<RepoStats>(cacheKey);
      const now = Date.now();

      if (cached?.value?.stars !== undefined) {
        setStars(cached.value.stars);
      }

      if (cached && now - cached.updatedAt < CACHE_TTL_MS) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
          headers: { Accept: 'application/vnd.github+json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch repo stats');
        }

        const payload = (await response.json()) as { stargazers_count?: number };
        const nextStars = payload.stargazers_count ?? cached?.value?.stars ?? 0;

        if (!cancelled) {
          setStars(nextStars);
        }

        await setCachedValue<RepoStats>(cacheKey, {
          stars: nextStars,
          fetchedAt: now,
        });
      } catch {
        if (!cancelled) {
          setStars(cached?.value?.stars ?? 0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [repoUrl]);

  return { stars, loading };
}

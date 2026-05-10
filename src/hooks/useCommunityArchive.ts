import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearCommunityContributions,
  createCommunityContribution,
  readCommunityContributions,
  readLocalVoteIds,
  sortCommunityContributions,
  subscribeCommunityArchive,
  toggleFeaturedContribution,
  upvoteContribution,
  type ContributionDraft,
} from '../services/communityArchive';

export function useCommunityArchive(mugId?: string) {
  const [allContributions, setAllContributions] = useState(readCommunityContributions);
  const [localVoteIds, setLocalVoteIds] = useState(readLocalVoteIds);

  const refresh = useCallback(() => {
    setAllContributions(readCommunityContributions());
    setLocalVoteIds(readLocalVoteIds());
  }, []);

  useEffect(() => subscribeCommunityArchive(refresh), [refresh]);

  const contributions = useMemo(() => {
    const scoped = mugId
      ? allContributions.filter((contribution) => contribution.mugId === mugId)
      : allContributions;

    return sortCommunityContributions(scoped);
  }, [allContributions, mugId]);

  const addContribution = useCallback((draft: ContributionDraft) => {
    const contribution = createCommunityContribution(draft);
    refresh();
    return contribution;
  }, [refresh]);

  const upvote = useCallback((contributionId: string) => {
    upvoteContribution(contributionId);
    refresh();
  }, [refresh]);

  const toggleFeatured = useCallback((contributionId: string) => {
    toggleFeaturedContribution(contributionId);
    refresh();
  }, [refresh]);

  const clearContributions = useCallback((targetMugId?: string) => {
    clearCommunityContributions(targetMugId);
    refresh();
  }, [refresh]);

  return {
    contributions,
    allContributions: sortCommunityContributions(allContributions),
    localVoteIds,
    addContribution,
    upvote,
    toggleFeatured,
    clearContributions,
  };
}

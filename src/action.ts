import { context, getOctokit } from '@actions/github';
import { getInput, warning } from '@actions/core';

export const needBlockPullRequest = (allowedBranch: string) =>
  (originBranchName: string): boolean =>
    allowedBranch.toLowerCase() !== originBranchName.toLowerCase();

async function blockPullRequest(pullRequestProperties) {
  const octokit = getOctokit(getInput('github-token'));

  console.log(123, pullRequestProperties.head.repo);
  console.log(1234, pullRequestProperties.head.repo.owner);
  console.log(12345, pullRequestProperties.repository);

  octokit.pulls.update({
    owner: pullRequestProperties.head.repo.owner.id,
    repo: pullRequestProperties.repository.id,
    pull_number: pullRequestProperties.number,
    state: 'closed'
  } as any);

  console.log('Closed!!');
}

export const isAProtectedBranch = (protectedBranchParameter: string) =>
  (baseBranchName: string) =>
    protectedBranchParameter.toLowerCase() === baseBranchName.toLowerCase();

export const start = async () => {
  const pullRequestProperties = context.payload.pull_request;
  if (!pullRequestProperties) {
    warning('This action only works in a pull_request event');
    return;
  }

  const baseBranchName = pullRequestProperties.base.ref;
  if (!isAProtectedBranch(getInput('protected-branch'))(baseBranchName)) {
    return;
  }

  const originBranchName = pullRequestProperties.head.ref;
  if (needBlockPullRequest(getInput('allowed-branch'))(originBranchName)) {
    await blockPullRequest(pullRequestProperties);
  }

  console.log(2, originBranchName);
};

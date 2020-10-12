import { context, getOctokit } from '@actions/github';
import { getInput, warning } from '@actions/core';

export const needBlockPullRequest = (allowedBranch: string) =>
  (originBranchName: string): boolean =>
    allowedBranch.toLowerCase() !== originBranchName.toLowerCase();

const blockPullRequest = async pullRequestProperties => {
  const octokit = getOctokit(getInput('github-token'));

  await octokit.issues.createComment({
    repo: context.repo.repo,
    owner: context.repo.owner,
    body: getInput('close-message') || '⛔ Invalid branch',
    issue_number: pullRequestProperties.number
  } as any);

  const requestOptions = {
    repo: context.repo.repo,
    owner: context.repo.owner,
    pull_number: pullRequestProperties.number,
    state: 'closed'
  };

  console.log('Before:', requestOptions);

  return await octokit.pulls.update({
    repo: context.repo.repo,
    owner: context.repo.owner,
    pull_number: pullRequestProperties.number,
    state: 'closed'
  } as any);
};

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

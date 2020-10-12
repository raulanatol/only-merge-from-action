import { context, getOctokit } from '@actions/github';
import { getInput } from '@actions/core';

export const needBlockPullRequest = (allowedBranch: string) =>
  (originBranchName: string): boolean =>
    allowedBranch.toLowerCase() === originBranchName.toLowerCase();

async function blockPullRequest(pullRequestProperties) {
  const octokit = getOctokit(getInput('github-token'));

  octokit.pulls.update({
    owner: pullRequestProperties.head.owner.id,
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
  console.log('A------->', context);
  console.log('B------->', context.payload);
  const pullRequestProperties = context.payload.pull_requests;
  // FIXME
  // if (!pullRequestProperties) {
  //   warning('This action only works in a pull_request event');
  //   return;
  // }

  console.log('HERE', pullRequestProperties);

  const baseBranchName = pullRequestProperties.base.ref;
  if (!isAProtectedBranch(getInput('protected-branch'))(baseBranchName)) {
    return;
  }

  const originBranchName = pullRequestProperties.head.ref;
  if (needBlockPullRequest(getInput('allowed-branch'))(originBranchName)) {
    await blockPullRequest(pullRequestProperties);
  }
};

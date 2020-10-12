import { context } from '@actions/github';

export const start = async () => {
  console.log('CONTEXT', context);
};

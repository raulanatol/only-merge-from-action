import { context } from '@actions/github';


export const start = async () => {
  console.log('CONTEXT', context);


  console.log('REF', context.ref); // 'refs/heads/main'
  // console.log('BASE_REF', context.base_ref);
  // console.log('HEAD_REF', context.head_ref);
};

import { context } from '@actions/github';


export const start = async () => {
  console.log('CONTEXT', context);

  console.log('REF', context.ref); // 'refs/heads/main'  in PR refs/pull/1/merge
  // console.log('BASE_REF', context.base_ref);
  // console.log('HEAD_REF', context.head_ref);


  console.log(1, context.payload?.pull_request?.base);
  console.log(2, context.payload?.pull_request?.head);
  console.log(3, context.payload?.pull_request?.number);
};

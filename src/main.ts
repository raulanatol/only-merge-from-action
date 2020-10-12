import { start } from './action';
import { info, setFailed } from '@actions/core';

start()
  .then(() => info('Finished!'))
  .catch(error => setFailed(error.message));

import { start } from './action';
import { info, setFailed } from '@actions/core';

start()
  .then(() => info('Finished!'))
  .catch(error => {
    console.log('EEE', error);
    setFailed(error.message);
  });

import { isAProtectedBranch, needBlockPullRequest } from '../action';

describe('action', () => {
  describe('isAProtectedBranch', () => {
    test('should return true if the branch name is equal that the protected branch - main', () => {
      expect(isAProtectedBranch('main')('main')).toBeTruthy();
    });

    test('should return true if the branch name is equal that the protected branch - master', () => {
      expect(isAProtectedBranch('master')('master')).toBeTruthy();
    });

    test('should return true if the branch name is equal that the protected branch - custom', () => {
      expect(isAProtectedBranch('protected')('protected')).toBeTruthy();
    });

    test('should return false if the branch name is not equal that the protected branch', () => {
      expect(isAProtectedBranch('master')('develop')).toBeFalsy();
      expect(isAProtectedBranch('main')('develop')).toBeFalsy();
      expect(isAProtectedBranch('protected')('develop')).toBeFalsy();
    });
  });

  describe('needBlockPullRequest', () => {
    test('should return false if the branch name is equal that the allowed branch - develop', () => {
      expect(needBlockPullRequest('develop')('develop')).toBeFalsy();
    });

    test('should return true if the branch name is not equal that the allowed branch', () => {
      expect(needBlockPullRequest('develop')('main')).toBeTruthy();
      expect(needBlockPullRequest('main')('develop')).toBeTruthy();
      expect(needBlockPullRequest('protected')('develop')).toBeTruthy();
    });
  });
});

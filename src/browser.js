/*
 *
 * This is used to build the bundle with browserify.
 *
 * The bundle is used by people who doesn't use browserify.
 * Those who use browserify will install with npm and require the module,
 * the package.json file points to index.js.
 */

import AuthokLock from './index';
import AuthokLockPasswordless from './passwordless';

if (typeof window !== 'undefined') {
  if (typeof window.define == 'function' && window.define.amd) {
    window.define('authokLock', function () {
      return AuthokLock;
    });
    window.define('authokLockPasswordless', function () {
      return AuthokLockPasswordless;
    });
  } else if (window.window) {
    window.AuthokLock = AuthokLock;
    window.AuthokLockPasswordless = AuthokLockPasswordless;
  }
}

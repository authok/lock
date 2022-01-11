import Core, { injectStyles, setWindowHeightStyle } from './core';
import passwordless from './engine/passwordless';

export default class AuthokLockPasswordless extends Core {
  constructor(clientID, domain, options) {
    super(clientID, domain, options, passwordless);
    injectStyles();
    setWindowHeightStyle();

    window.addEventListener('resize', () => {
      setWindowHeightStyle();
    });
  }
}

AuthokLockPasswordless.version = __VERSION__;

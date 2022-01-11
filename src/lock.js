import Core, { injectStyles, setWindowHeightStyle } from './core';
import classic from './engine/classic';

export default class AuthokLock extends Core {
  constructor(clientID, domain, options) {
    super(clientID, domain, options, classic);
    injectStyles();
    setWindowHeightStyle();

    window.addEventListener('resize', () => {
      setWindowHeightStyle();
    });
  }
}

// telemetry
AuthokLock.version = __VERSION__;

// TODO: should we have different telemetry for classic/passwordless?
// TODO: should we set telemetry info before each request?
// TODO: should we inject styles here?

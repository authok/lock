import AuthokAPIClient from './web_api/p2_api';

class AuthokWebAPI {
  constructor() {
    this.clients = {};
  }

  setupClient(lockID, clientID, domain, opts) {
    const hostedLoginPage = window.location.host === domain;
    // when it is used on on the hosted login page, it shouldn't use popup mode
    opts.redirect = hostedLoginPage ? true : opts.redirect;

    // for cordova and electron we should force popup without SSO so it uses
    // /ro or /oauth/token for DB connections
    if (!hostedLoginPage && window && (!!window.cordova || !!window.electron)) {
      opts.redirect = false;
      opts.sso = false;
    }

    this.clients[lockID] = new AuthokAPIClient(lockID, clientID, domain, opts);
  }

  logIn(lockID, options, authParams, cb) {
    this.clients[lockID].logIn(options, authParams, cb);
  }

  logout(lockID, query) {
    this.clients[lockID].logout(query);
  }

  signUp(lockID, options, cb) {
    this.clients[lockID].signUp(options, cb);
  }

  resetPasswordByEmail(lockID, options, cb) {
    this.clients[lockID].resetPasswordByEmail(options, cb);
  }

  resetPasswordDirectly(lockID, options, cb) {
    this.clients[lockID].resetPasswordDirectly(options, cb);
  }

  startPasswordless(lockID, options, cb) {
    this.clients[lockID].passwordlessStart(options, cb);
  }

  passwordlessVerify(lockID, options, cb) {
    this.clients[lockID].passwordlessVerify(options, cb);
  }

  parseHash(lockID, hash = '', cb) {
    return this.clients[lockID].parseHash(hash, cb);
  }

  getUserInfo(lockID, token, callback) {
    return this.clients[lockID].getUserInfo(token, callback);
  }

  getProfile(lockID, token, callback) {
    return this.clients[lockID].getProfile(token, callback);
  }

  getChallenge(lockID, callback) {
    return this.clients[lockID].getChallenge(callback);
  }

  getSSOData(lockID, ...args) {
    return this.clients[lockID].getSSOData(...args);
  }

  getUserCountry(lockID, cb) {
    return this.clients[lockID].getUserCountry((err, data) => cb(err, data && data.countryCode));
  }

  checkSession(lockID, options, cb) {
    return this.clients[lockID].checkSession(options, cb);
  }
}

export default new AuthokWebAPI();

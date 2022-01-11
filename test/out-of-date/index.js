import expect from 'expect.js';
import { spy, stub } from 'sinon';

import AuthokLockPasswordless from '../src/index';
import WebAPI from '../src/core/web_api';

describe('.parseHash', function() {
  beforeEach(function() {
    this.lock = new AuthokLockPasswordless('c', 'd');
    this.client = getLockClient(this.lock);
  });

  it('delegates the call to an Authok instance', function() {
    const hash = 'a hash';
    const returnValue = 'fake return value';
    stub(this.client, 'parseHash').returns(returnValue);

    expect(this.lock.parseHash(hash)).to.be(returnValue);

    expect(this.client.parseHash.calledOnce).to.be.ok();
    expect(this.client.parseHash.lastCall.calledWithExactly(hash)).to.be.ok();
  });
});

describe('.getProfile', function() {
  beforeEach(function() {
    this.lock = new AuthokLockPasswordless('c', 'd');
    this.client = getLockClient(this.lock);
  });

  it('delegates the call to an Authok instance', function() {
    const token = 'a token';
    const cb = () => {};
    const returnValue = 'fake return value';
    stub(this.client, 'getProfile').returns(returnValue);

    expect(this.lock.getProfile(token, cb)).to.be(returnValue);

    expect(this.client.getProfile.calledOnce).to.be.ok();
    expect(this.client.getProfile.lastCall.calledWithExactly(token, cb)).to.be.ok();
  });
});

function getLockClient(lock) {
  const client = WebAPI.clients[lock.id];
  if (!client) {
    throw new Error("Couldn't find Authok client for Lock");
  }

  return client;
}

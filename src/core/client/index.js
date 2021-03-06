import Immutable, { List, Map } from 'immutable';
import passwordPolicies from '@authok/authok-password-policies';

import { dataFns } from '../../utils/data_utils';
// TODO: this module should depend from social stuff
import { STRATEGIES as SOCIAL_STRATEGIES } from '../../connection/social/index';
import { STRATEGIES as ENTERPRISE_STRATEGIES } from '../../connection/enterprise';

const { initNS, get } = dataFns(['client']);

const DEFAULT_CONNECTION_VALIDATION = { username: { min: 1, max: 15 } };

export function hasFreeSubscription(m) {
  return ['free', 'dev'].indexOf(get(m, ['tenant', 'subscription'])) > -1;
}

export function connection(m, strategyName, name) {
  // TODO: this function should take a client, not a map with a client
  // key.
  const connections = strategy(m, strategyName).get('connections', List());
  return connections.find(withName(name)) || Map();
}

function strategy(m, name) {
  // TODO: this function should take a client, not a map with a client
  // key.
  return m.getIn(['client', 'strategies'], List()).find(withName(name)) || Map();
}

function withName(name) {
  return x => x.get('name') === name;
}

function strategyNameToConnectionType(str) {
  if (str === 'authok') {
    return 'database';
  } else if (str === 'email' || str === 'sms') {
    return 'passwordless';
  } else if (SOCIAL_STRATEGIES[str]) {
    return 'social';
  } else if (ENTERPRISE_STRATEGIES[str]) {
    return 'enterprise';
  } else if (['oauth1', 'oauth2'].indexOf(str) !== -1) {
    return 'social';
  } else {
    return 'unknown';
  }
}

function formatConnectionValidation(connectionValidation = {}) {
  if (connectionValidation.username == null) {
    return null;
  }

  const validation = { ...DEFAULT_CONNECTION_VALIDATION, ...connectionValidation };
  const defaultMin = DEFAULT_CONNECTION_VALIDATION.username.min;
  const defaultMax = DEFAULT_CONNECTION_VALIDATION.username.max;

  validation.username.min = parseInt(validation.username.min, 10) || defaultMin;
  validation.username.max = parseInt(validation.username.max, 10) || defaultMax;

  if (validation.username.min > validation.username.max) {
    validation.username.min = defaultMin;
    validation.username.max = defaultMax;
  }

  return validation;
}

const emptyConnections = Immutable.fromJS({
  database: [],
  enterprise: [],
  passwordless: [],
  social: [],
  unknown: [] // TODO: should be oauth2
});

export function initClient(m, client) {
  return initNS(m, formatClient(client));
}

function formatClient(o) {
  return new Immutable.fromJS({
    id: o.id,
    tenant: {
      name: o.tenant,
      subscription: o.subscription
    },
    connections: formatClientConnections(o)
  });
}

function formatClientConnections(o) {
  const result = emptyConnections.toJS();

  for (var i = 0; i < (o.strategies || []).length; i++) {
    const strategy = o.strategies[i];
    const connectionType = strategyNameToConnectionType(strategy.name);

    const connections = strategy.connections.map(connection => {
      return formatClientConnection(connectionType, strategy.name, connection);
    });
    result[connectionType].push(...connections);
  }

  return result;
}

function formatClientConnection(connectionType, strategyName, connection) {
  const result = {
    name: connection.name,
    strategy: strategyName,
    type: connectionType,
    displayName: connection.display_name
  };

  if (connectionType === 'database') {
    result.passwordPolicy = passwordPolicies[connection.passwordPolicy || 'none'];
    if (
      connection.password_complexity_options &&
      connection.password_complexity_options.min_length
    ) {
      result.passwordPolicy.length.minLength = connection.password_complexity_options.min_length;
    }
    result.allowSignUpWithEmail = typeof connection.showSignupWithEmail === 'boolean' ? connection.showSignupWithEmail : true;
    result.allowSignUpWithSms = typeof connection.showSignupWithSms === 'boolean' ? connection.showSignupWithSms : true;

    result.allowForgot = typeof connection.showForgot === 'boolean' ? connection.showForgot : true;
    result.usernameStyle = connection.usernameStyle || 'any'

    result.validation = formatConnectionValidation(connection.validation);
  }

  if (connectionType === 'enterprise') {
    const domains = connection.domain_aliases || [];
    if (connection.domain) {
      domains.unshift(connection.domain);
    }
    result.domains = domains;
  }

  // edison add it
  if (connectionType === 'social') {
    result.scope = connection.scope;
  }

  return result;
}

export function clientConnections(m) {
  return get(m, 'connections', emptyConnections);
}

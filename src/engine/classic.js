import Base from '../index';
import LoginWithUsername from './classic/login_with_username';
import SignUpEmail from './classic/sign_up_with_email_screen';
import MFALoginScreen from './classic/mfa_login_screen';
import ResetPassword from '../connection/database/reset_password';
import { renderSSOScreens } from '../core/sso/index';
import {
  additionalSignUpFields,
  authWithUsername,
  databaseUsernameValue,
  defaultDatabaseConnection,
  defaultDatabaseConnectionName,
  getScreen,
  hasInitialScreen,
  hasScreen,
  initDatabase,
  overrideDatabaseOptions,
  resolveAdditionalSignUpFields
} from '../connection/database/index';
import {
  isADEnabled,
  defaultEnterpriseConnection,
  defaultEnterpriseConnectionName,
  initEnterprise,
  isEnterpriseDomain,
  isHRDActive,
  isInCorpNetwork,
  quickAuthConnection
} from '../connection/enterprise';
import { defaultDirectory, defaultDirectoryName } from '../core/tenant';
import { setEmail } from '../field/email';
import { setUsername } from '../field/username';
import { setPhoneNumber } from '../field/phone_number';
import * as l from '../core/index';
import KerberosScreen from '../connection/enterprise/kerberos_screen';
import HRDScreen from '../connection/enterprise/hrd_screen';
import EnterpriseQuickAuthScreen from '../connection/enterprise/quick_auth_screen';
import { hasSkippedQuickAuth } from '../quick_auth';
import * as sso from '../core/sso/index';
import LoadingScreen from '../core/loading_screen';
import ErrorScreen from '../core/error_screen';
import LastLoginScreen from '../core/sso/last_login_screen';
import { hasError, isDone, isSuccess } from '../sync';
import { getFieldValue } from '../field/index';
import { swap, updateEntity } from '../store/index';
import { showLoginWithSmsActivity } from '../connection/database/actions';
import LoginWithSms from './classic/login_with_sms';
import {
  initPasswordless,
} from '../connection/passwordless/index';
import SignUpWithSms from './classic/sign_up_with_sms_screen';
import ResetPasswordBySms from '../connection/database/reset_password_by_sms';


export function isSSOEnabled(m, options) {
  return matchesEnterpriseConnection(m, databaseUsernameValue(m, options));
}

export function matchesEnterpriseConnection(m, usernameValue) {
  return isEnterpriseDomain(m, usernameValue);
}

export function usernameStyle(m) {
  return authWithUsername(m) && !isADEnabled(m) ? 'username' : 'email';
}

export function hasOnlyClassicConnections(m, type = undefined, ...strategies) {
  return l.hasOnlyConnections(m, type, ...strategies) && !l.hasSomeConnections(m, 'passwordless');
}

function validateAllowedConnections(m) {
  const anyDBConnection = l.hasSomeConnections(m, 'database');
  const anySocialConnection = l.hasSomeConnections(m, 'social');
  const anyEnterpriseConnection = l.hasSomeConnections(m, 'enterprise');

  if (!anyDBConnection && !anySocialConnection && !anyEnterpriseConnection) {
    const error = new Error(
      'At least one database, enterprise or social connection needs to be available.'
    );
    error.code = 'no_connection';
    m = l.stop(m, error);
  } else if (!anyDBConnection && hasInitialScreen(m, 'forgotPassword')) {
    const error = new Error(
      'The `initialScreen` option was set to "forgotPassword" but no database connection is available.'
    );
    error.code = 'unavailable_initial_screen';
    m = l.stop(m, error);
  } else if (!anyDBConnection && !anySocialConnection && hasInitialScreen(m, 'signUpWithEmail')) {
    const error = new Error(
      'The `initialScreen` option was set to "signUp" but no database or social connection is available.'
    );
    error.code = 'unavailable_initial_screen';
    m = l.stop(m, error);
  }

  if (defaultDirectoryName(m) && !defaultDirectory(m)) {
    l.error(m, `The account's default directory "${defaultDirectoryName(m)}" is not enabled.`);
  }

  if (defaultDatabaseConnectionName(m) && !defaultDatabaseConnection(m)) {
    l.warn(
      m,
      `The provided default database connection "${defaultDatabaseConnectionName(
        m
      )}" is not enabled.`
    );
  }

  if (defaultEnterpriseConnectionName(m) && !defaultEnterpriseConnection(m)) {
    l.warn(
      m,
      `The provided default enterprise connection "${defaultEnterpriseConnectionName(
        m
      )}" is not enabled or does not allow email/password authentication.`
    );
  }

  return m;
}

const setPrefill = m => {
  const { email, username } = l.prefill(m).toJS();
  if (typeof email === 'string') m = setEmail(m, email);
  if (typeof username === 'string') m = setUsername(m, username, 'username', false);
  if (typeof phoneNumber === 'string') m = setPhoneNumber(m, phoneNumber);
  return m;
};

const setPrefillPasswordless = m => {
  const { email, phoneNumber } = l.prefill(m).toJS();
  if (typeof email === 'string') {
    m = setEmail(m, email);
  }
  if (typeof phoneNumber === 'string') {
    m = setPhoneNumber(m, phoneNumber);
  }
  return m;
};

function createErrorScreen(m, stopError) {
  setTimeout(() => {
    swap(updateEntity, 'lock', l.id(m), l.stop, stopError);
  }, 0);

  return new ErrorScreen();
}

class Classic {
  static SCREENS = {
    loginWithUsername: LoginWithUsername,
    loginWithSms: LoginWithSms,
    forgotPassword: ResetPasswordBySms,
    signUpWithEmail: SignUpEmail,
    signUpWithSms: SignUpWithSms,
    mfaLogin: MFALoginScreen
  };

  didInitialize(model, options) {
    model = initDatabase(model, options);
    model = initEnterprise(model, options);
    model = initPasswordless(model, options);

    return model;
  }

  didReceiveClientSettings(m) {
    m = validateAllowedConnections(m);
    m = setPrefill(m);

    const anySocialConnection = l.hasSomeConnections(m, 'social');
    const anyPasswordlessConnection = l.hasSomeConnections(m, 'passwordless');

    if (!anySocialConnection && !anyPasswordlessConnection) {
      const error = new Error(
        'At least one email, sms or social connection needs to be available.'
      );
      error.code = 'no_connection';
      m = l.stop(m, error);
    }
    m = setPrefillPasswordless(m);

    return m;
  }

  willShow(m, opts) {
    m = overrideDatabaseOptions(m, opts);
    m = resolveAdditionalSignUpFields(m);
    if (isSuccess(m, 'client')) {
      m = validateAllowedConnections(m);
    }
    return m;
  }

  render(m) {
    //if there's an error, we should show the error screen no matter what.
    if (l.hasStopped(m)) {
      return new ErrorScreen();
    }

    // TODO: remove the detail about the loading pane being pinned,
    // sticky screens should be handled at the box module.
    if (!isDone(m) || m.get('isLoadingPanePinned')) {
      return new LoadingScreen();
    }

    if (hasScreen(m, 'loginWithUsername')) {
      if (!hasSkippedQuickAuth(m) && hasInitialScreen(m, 'loginWithUsername')) {
        if (isInCorpNetwork(m)) {
          return new KerberosScreen();
        }

        if (l.ui.rememberLastLogin(m)) {
          const lastUsedConnection = sso.lastUsedConnection(m);
          const lastUsedUsername = sso.lastUsedUsername(m);
          if (
            lastUsedConnection &&
            isSuccess(m, 'sso') &&
            l.hasConnection(m, lastUsedConnection.get('name')) &&
            l.findConnection(m, lastUsedConnection.get('name')).get('type') !== 'passwordless'
          ) {
            return new LastLoginScreen();
          }
        }
      }

      if (quickAuthConnection(m)) {
        return new EnterpriseQuickAuthScreen();
      }

      if (isHRDActive(m)) {
        return new HRDScreen();
      }
    }

    // 免密登录模式
    if (hasScreen(m, 'loginWithSms') || hasScreen(m, 'loginWithEmail')) {
      if (!hasSkippedQuickAuth(m)) {
        if (l.ui.rememberLastLogin(m)) {
          const lastUsedConnection = sso.lastUsedConnection(m);
          if (
            lastUsedConnection &&
            isSuccess(m, 'sso') &&
            l.hasConnection(m, lastUsedConnection.get('name')) &&
            ['passwordless', 'social'].indexOf(
              l.findConnection(m, lastUsedConnection.get('name')).get('type')
            ) >= 0 //if connection.type is either passwordless or social
          ) {
            const conn = l.findConnection(m, lastUsedConnection.get('name'));
            const connectionType = conn.get('type');
            if (connectionType === 'passwordless' || connectionType === 'social') {
              return new LastLoginScreen();
            }
          }
        }
      }
    }

    if (!hasScreen(m, 'loginWithUsername') 
      && !hasScreen(m, 'loginWithSms')
      && !hasScreen(m, 'signUpWithEmail') 
      && !hasScreen(m, 'signUpWithSms')
      && !hasScreen(m, 'forgotPassword')) {
      const errorMessage =
        'No available Screen. You have to allow at least one of those screens: `login`, `signUp`or `forgotPassword`.';
      const noAvailableScreenError = new Error(errorMessage);
      noAvailableScreenError.code = 'internal_error';
      noAvailableScreenError.description = errorMessage;
      return createErrorScreen(m, noAvailableScreenError);
    }

    const Screen = Classic.SCREENS[getScreen(m)];
    if (Screen) {
      return new Screen();
    }
    const noScreenError = new Error('Internal error');
    noScreenError.code = 'internal_error';
    noScreenError.description = `Couldn't find a screen "${getScreen(m)}"`;
    return createErrorScreen(m, noScreenError);
  }
}

export default new Classic();

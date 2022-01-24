import React from 'react';
import Screen from '../../core/screen';
import LoginPane from '../../connection/database/login_pane';
import {
  databaseConnection,
  databaseUsernameStyle,
  databaseUsernameValue,
  defaultDatabaseConnection,
  hasInitialScreen,
  hasScreen,
  signUpLink
} from '../../connection/database/index';
import { logIn as databaseLogIn } from '../../connection/database/actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import LoginTabs from '../../connection/database/login_tabs';
import * as l from '../../core/index';
import { logIn as enterpriseLogIn, startHRD } from '../../connection/enterprise/actions';
import {
  defaultEnterpriseConnection,
  findADConnectionWithoutDomain,
  isHRDDomain
} from '../../connection/enterprise';
import SingleSignOnNotice from '../../connection/enterprise/single_sign_on_notice';
import { hasOnlyClassicConnections, isSSOEnabled } from '../classic';
import * as i18n from '../../i18n';
import SocialLogin from './social_login';

function shouldRenderTabs(m) {
  if (isSSOEnabled(m)) return false;
  if (l.hasSomeConnections(m, 'database')) return hasScreen(m, 'signUpWithEmail') || hasScreen(m, 'signUpWithSms');
  if (l.hasSomeConnections(m, 'social') && hasInitialScreen(m, 'signUpWithEmail'))
    return hasScreen(m, 'signUpWithEmail') || hasScreen(m, 'signUpWithSms');
}

const LoginComponent = ({ i18n, model }) => {
  const sso = isSSOEnabled(model);

  const tabs = shouldRenderTabs(model) && (
    <LoginTabs
      key="login"
      lock={model}
      loginLabel={i18n.str('loginLabel')}
      loginWithSmsLabel={i18n.str('loginWithLabel', i18n.str('phoneNumber'))}
      signUpLink={signUpLink(model)}
      signUpLabel={i18n.str('signUpLabel')}
    />
  );

  const showPassword =
    !sso && (l.hasSomeConnections(model, 'database') || !!findADConnectionWithoutDomain(model));

  const showForgotPasswordLink = showPassword && l.hasSomeConnections(model, 'database');

  const usernameInputPlaceholderKey =
    databaseUsernameStyle(model) === 'any' || l.countConnections(model, 'enterprise') > 1
      ? 'usernameOrEmailOrPhoneNumberInputPlaceholder'
      : 'usernameInputPlaceholder';

  const usernameStyle = databaseUsernameStyle(model);

  const login = (sso ||
    l.hasSomeConnections(model, 'database') ||
    l.hasSomeConnections(model, 'enterprise')) && (
    <LoginPane
      emailInputPlaceholder={i18n.str('emailInputPlaceholder')}
      usernameInputPlaceholder={i18n.str(usernameInputPlaceholderKey)}
      passwordInputPlaceholder={i18n.str('passwordInputPlaceholder')}
      forgotPasswordAction={i18n.str('forgotPasswordAction')}
      signupAction={i18n.str('signupAction')}
      i18n={i18n}
      lock={model}
      showForgotPasswordLink={showForgotPasswordLink}
      showPassword={showPassword}
      usernameStyle={usernameStyle}
    />
  );

  const ssoNotice = sso && <SingleSignOnNotice>{i18n.str('ssoEnabled')}</SingleSignOnNotice>;

  return (
    <div>
      {ssoNotice}
      {tabs}
      <div>
        {login}
      </div>
    </div>
  );
};

export default class LoginWithUsername extends Screen {
  constructor() {
    super('main.loginWithUsername');
  }

  renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  }

  renderTabs(model) {
    return shouldRenderTabs(model);
  }

  submitButtonLabel(m) {
    return i18n.str(m, ['loginSubmitLabel']);
  }

  isSubmitDisabled(m) {
    // it should disable the submit button if there is any connection that
    // requires username/password and there is no enterprise with domain
    // that matches with the email domain entered for HRD
    return (
      !l.hasSomeConnections(m, 'database') && // no database connection
      !findADConnectionWithoutDomain(m) && // no enterprise without domain
      !isSSOEnabled(m)
    ); // no matching domain
  }

  submitHandler(model) {
    if (hasOnlyClassicConnections(model, 'social')) {
      return null;
    }

    if (isHRDDomain(model, databaseUsernameValue(model))) {
      return id => startHRD(id, databaseUsernameValue(model));
    }

    const useDatabaseConnection =
      !isSSOEnabled(model) &&
      databaseConnection(model) &&
      (defaultDatabaseConnection(model) || !defaultEnterpriseConnection(model));

    return useDatabaseConnection ? databaseLogIn : enterpriseLogIn;
  }

  renderExtra() {
    return SocialLogin;
  }

  render() {
    return LoginComponent;
  }
}

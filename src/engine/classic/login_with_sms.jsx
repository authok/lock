import React from 'react';
import Screen from '../../core/screen';
import SmsLoginPane from '../../connection/passwordless/sms/sms_login_pane';
import {
  hasInitialScreen,
  signUpLink
} from '../../connection/database/index';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import LoginTabs from '../../connection/database/login_tabs';
import * as l from '../../core/index';
import SingleSignOnNotice from '../../connection/enterprise/single_sign_on_notice';
import { isSSOEnabled } from '../classic';
import * as i18n from '../../i18n';
import SocialLogin from './social_login';
import { logIn } from '../../connection/passwordless/actions';
import { setPasswordlessStrategy } from '../../connection/passwordless/actions';

function shouldRenderTabs(m) {
  if (isSSOEnabled(m)) return false;
  if (l.hasSomeConnections(m, 'database')) return true;
  if (l.hasSomeConnections(m, 'social') && hasInitialScreen(m, 'signUpWithEmail'))
    return true;
}

const LoginWithSmsComponent = ({ i18n, model }) => {
  const sso = isSSOEnabled(model);

  const tabs = shouldRenderTabs(model) && (
    <LoginTabs
      key="loginsignup"
      lock={model}
      loginLabel={i18n.str('loginLabel')}
      loginWithSmsLabel={i18n.str('loginWithLabel', i18n.str('phoneNumber'))}
      signUpLink={signUpLink(model)}
      signUpLabel={i18n.str('signUpLabel')}
    />
  );

  

  const showForgotPasswordLink = l.hasSomeConnections(model, 'database');

  const loginInstructionsKey = 'databaseEnterpriseLoginInstructions';

  const login = (sso ||
    l.hasSomeConnections(model, 'database') ||
    l.hasSomeConnections(model, 'enterprise')) && (
    <SmsLoginPane
      i18n={i18n}
      instructions={i18n.html(loginInstructionsKey)}
      lock={model}
      showForgotPasswordLink={showForgotPasswordLink}
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

export default class LoginWithSms extends Screen {
  constructor() {
    super('main.loginWithSms');
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

  submitHandler(m) {
    setPasswordlessStrategy(l.id(m), 'sms');

    return logIn;
  }

  render() {
    return LoginWithSmsComponent;
  }

  renderExtra() {
    return SocialLogin;
  }
}

import PropTypes from 'prop-types';
import React from 'react';
import EmailPane from '../../field/email/email_pane';
import UsernamePane from '../../field/username/username_pane';
import PasswordPane from '../../field/password/password_pane';
import { showResetPasswordActivity, showSignUpWithSmsActivity } from './actions';
import { swapCaptcha } from '../captcha';
import { hasScreen, forgotPasswordLink, signUpLink } from './index';
import * as l from '../../core/index';
import CaptchaPane from '../../field/captcha/captcha_pane';
import { isSSOEnabled } from '../../engine/classic';
import { isHRDDomain } from '../enterprise';
import { databaseUsernameValue } from '../database';

export default class LoginPane extends React.Component {
  handleDontRememberPasswordClick = e => {
    e.preventDefault();
    showResetPasswordActivity(l.id(this.props.lock));
  };

  handleSignupClick = e => {
    e.preventDefault();
    showSignUpWithSmsActivity(l.id(this.props.lock));
  };

  render() {
    const {
      emailInputPlaceholder,
      forgotPasswordAction,
      signupAction,
      i18n,
      instructions,
      lock,
      passwordInputPlaceholder,
      showForgotPasswordLink,
      showPassword,
      usernameInputPlaceholder,
      usernameStyle
    } = this.props;

    const headerText = instructions || null;
    const header = headerText && <p>{headerText}</p>;
    const resolver = l.connectionResolver(lock);
    const sso = isSSOEnabled(lock);

    // Should never validate format on login because of custom db connection and import mode.
    // If a custom resolver is in use, always use UsernamePane without validating format,
    // as the target connection (and this validation rules) could change by time the user hits 'submit'.
    let fieldPane;

    if (usernameStyle === 'email' && resolver === undefined) {
      fieldPane = (
        <EmailPane
          i18n={i18n}
          lock={lock}
          forceInvalidVisibility={!showPassword}
          placeholder={emailInputPlaceholder}
          strictValidation={false}
        />
      );
    } else /* if (usernameStyle === 'username')*/ {
      fieldPane = (
        <UsernamePane
          i18n={i18n}
          lock={lock}
          placeholder={usernameInputPlaceholder}
          usernameStyle={usernameStyle}
          validateFormat={false}
          strictValidation={false}
        />
      );
    }

    const captchaPane =
      l.captcha(lock) &&
      l.captcha(lock).get('required') &&
      (isHRDDomain(lock, databaseUsernameValue(lock)) || !sso) ? (
        <CaptchaPane i18n={i18n} lock={lock} onReload={() => swapCaptcha(l.id(lock), false)} />
      ) : null;

    const dontRememberPassword =
        <p className="authok-lock-alternative">
          {
            showForgotPasswordLink && hasScreen(lock, 'forgotPassword') ? (
              <a
              className="authok-lock-alternative-link"
              href={forgotPasswordLink(lock, '#')}
              onClick={forgotPasswordLink(lock) ? undefined : this.handleDontRememberPasswordClick}
            >
              {forgotPasswordAction}
            </a>) : null
          }
          <a
            className="authok-lock-alternative-link"
            style={{ marginLeft: 'auto' }}
            href={signUpLink(lock, '#')}
            onClick={signUpLink(lock) ? undefined : this.handleSignupClick}
          >
            {signupAction}
          </a>
        </p>;

    return (
      <div>
        {header}
        {fieldPane}
        <PasswordPane
          i18n={i18n}
          lock={lock}
          placeholder={passwordInputPlaceholder}
          hidden={!showPassword}
        />
        {captchaPane}
        {dontRememberPassword}
      </div>
    );
  }
}

LoginPane.propTypes = {
  signupAction: PropTypes.string,
  emailInputPlaceholder: PropTypes.string.isRequired,
  forgotPasswordAction: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired,
  instructions: PropTypes.any,
  lock: PropTypes.object.isRequired,
  passwordInputPlaceholder: PropTypes.string.isRequired,
  showForgotPasswordLink: PropTypes.bool.isRequired,
  showPassword: PropTypes.bool.isRequired,
  usernameInputPlaceholder: PropTypes.string.isRequired,
  usernameStyle: PropTypes.oneOf(['any', 'email', 'username'])
};

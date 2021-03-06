import PropTypes from 'prop-types';
import React from 'react';
import { showResetPasswordActivity, showSignUpWithSmsActivity } from '../../database/actions';
import { hasScreen, forgotPasswordLink, signUpLink } from '../../database/index';
import * as l from '../../../core/index';
import PhoneNumberPane from '../../../field/phone-number/phone_number_pane';
import VcodePane from '../../../field/vcode/vcode_pane';

export default class SmsLoginPane extends React.Component {
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
      i18n,
      lock,
      showForgotPasswordLink,
    } = this.props;

    const phoneNumber = l.hasSomeConnections(lock, 'passwordless', 'sms') ? (
      <PhoneNumberPane
        lock={lock}
        placeholder={i18n.str('phoneNumberInputPlaceholder')}
        invalidHint={i18n.str('phoneNumberInputInvalidHint')}
      />
    ) : null;

    const dontRememberPassword =
      showForgotPasswordLink && hasScreen(lock, 'forgotPassword') ? (
        <p className="authok-lock-alternative">
          <a
            className="authok-lock-alternative-link"
            href={forgotPasswordLink(lock, '#')}
            onClick={forgotPasswordLink(lock) ? undefined : this.handleDontRememberPasswordClick}
          >
            {i18n.str('forgotPasswordAction')}
          </a>

          <a
            className="authok-lock-alternative-link"
            style={{ marginLeft: 'auto' }}
            href={signUpLink(lock, '#')}
            onClick={signUpLink(lock) ? undefined : this.handleSignupClick}
          >
            {i18n.str('signupAction')}
          </a>
        </p>
      ) : null;

    const vcode = <VcodePane
      lock={lock}
      scene="login"
      placeholder={i18n.str('codeInputPlaceholder')}
      resendLabel={i18n.str('sendVcode')}
    />

    return (
      <div>
        {phoneNumber}
        {vcode}
        {dontRememberPassword}
      </div>
    );
  }
}

SmsLoginPane.propTypes = {
  i18n: PropTypes.object.isRequired,
  lock: PropTypes.object.isRequired,
  showForgotPasswordLink: PropTypes.bool.isRequired,
};

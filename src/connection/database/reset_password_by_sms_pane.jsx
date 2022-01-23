import PropTypes from 'prop-types';
import React from 'react';
import * as l from '../../core/index';
import PhoneNumberPane from '../../field/phone-number/phone_number_pane';
import VcodePane from '../../field/vcode/vcode_pane';
import PasswordPane from '../../field/password/password_pane';
import { passwordStrengthPolicy } from './index';

export default class ResetPasswordBySmsPane extends React.Component {
  static propTypes = {
    lock: PropTypes.object.isRequired
  };

  render() {
    const { header, i18n, lock } = this.props;


    const phoneNumber = (<PhoneNumberPane
        lock={lock}
        placeholder={i18n.str('phoneNumberInputPlaceholder')}
        invalidHint={i18n.str('phoneNumberInputInvalidHint')}
      />);

    const vcode = <VcodePane
      lock={lock}
      scene="reset_pwd"
      placeholder={i18n.str('codeInputPlaceholder')}
      resendLabel={i18n.str('sendVcode')}
    />
    const password = <PasswordPane
      i18n={i18n}
      lock={lock}
      policy={passwordStrengthPolicy(lock)}
      strengthMessages={i18n.group('passwordStrength')}
      placeholder={i18n.str('passwordInputPlaceholder')} />;

    return (
      <div>
        {header}
        {phoneNumber}
        {vcode}
        {password}
      </div>
    );
  }
}

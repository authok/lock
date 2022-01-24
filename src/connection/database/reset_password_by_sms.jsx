import React from 'react';
import Screen from '../../core/screen';
import ResetPasswordBySmsPane from './reset_password_by_sms_pane';
import { hasScreen } from './index';
import { cancelResetPassword, resetPasswordBySms } from './actions';
import { renderPasswordResetConfirmation } from './password_reset_confirmation';
import { databaseUsernameValue } from './index';
import { isEnterpriseDomain } from '../enterprise';
import * as i18n from '../../i18n';
import * as l from '../../core/index';
import { swap, updateEntity } from '../../store/index';
import { renderOptionSelection } from '../../field';

const Component = ({ i18n, model }) => {
  return (
    <ResetPasswordBySmsPane
      i18n={i18n}
      lock={model}
    />
  );
};

export default class ResetPasswordBySms extends Screen {
  constructor() {
    super('resetPasswordBySms');
  }

  backHandler(m) {
    return hasScreen(m, 'loginWithUsername') ? cancelResetPassword : undefined;
  }

  submitButtonLabel(m) {
    return i18n.str(m, ['resetPasswordBySmsSubmitLabel']);
  }

  getScreenTitle(m) {
    return i18n.str(m, 'forgotPasswordTitle');
  }
  isSubmitDisabled(m) {
    const tryingToResetPasswordWithEnterpriseEmail = isEnterpriseDomain(
      m,
      databaseUsernameValue(m, { emailFirst: true })
    );
    if (tryingToResetPasswordWithEnterpriseEmail) {
      setTimeout(() => {
        swap(
          updateEntity,
          'lock',
          l.id(m),
          l.setGlobalError,
          i18n.str(m, ['error', 'forgotPassword', 'enterprise_email'])
        );
      }, 50);
    } else {
      swap(updateEntity, 'lock', l.id(m), l.clearGlobalError);
    }
    return tryingToResetPasswordWithEnterpriseEmail;
  }

  submitHandler() {
    return resetPasswordBySms;
  }

  renderAuxiliaryPane(m) {
    return renderPasswordResetConfirmation(m) || renderOptionSelection(m);  
  }

  render() {
    return Component;
  }
}

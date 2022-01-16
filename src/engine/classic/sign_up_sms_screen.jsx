import React, { useState } from 'react';
import Screen from '../../core/screen';

import {
  hasScreen,
  showTerms,
  mustAcceptTerms,
  termsAccepted
} from '../../connection/database/index';
import { toggleTermsAcceptance, cancelSignUp, signUpWithSms } from '../../connection/database/actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import { renderSignedUpConfirmation } from '../../connection/database/signed_up_confirmation';
import { renderOptionSelection } from '../../field/index';
import * as l from '../../core/index';
import * as i18n from '../../i18n';

import SignUpTerms from '../../connection/database/sign_up_terms';
import SignUpWithSmsPane from './sign_up_sms_pane';
import SignUpTabs from '../../connection/database/signup_tabs';
import { isSSOEnabled } from '../classic';

function shouldRenderTabs(m) {
  if (isSSOEnabled(m)) return false;
  if (l.hasSomeConnections(m, 'database')) return hasScreen(m, 'signUpWithEmail') || hasScreen(m, 'signUpWithSms');
  if (l.hasSomeConnections(m, 'social') && hasInitialScreen(m, 'signUpWithEmail'))
    return hasScreen(m, 'signUpWithEmail') || hasScreen(m, 'signUpWithSms');
}

const SignUpWithSmsComponent = ({ i18n, model}) => {
  const tabs = shouldRenderTabs(model) && (
    <SignUpTabs
      key="signup"
      lock={model}
      signUpWithSmsLabel={i18n.str('signUpWithSms')}
      signUpWithEmailLabel={i18n.str('signUpWithEmail')}
    />
  );
  
  const signUp = (
    <SignUpWithSmsPane 
      phoneInputPlaceholder={i18n.str('phoneInputPlaceholder')}
      i18n={i18n}
      model={model} />);

  return (
    <div>
      {tabs}
      <div>
        {signUp}
      </div>
    </div>
  );
}

export default class SignUpSms extends Screen {
  constructor() {
    super('main.signUpSms');
  }

  submitButtonLabel(m) {
    return i18n.str(m, ['signUpSubmitLabel']);
  }

  backHandler(m) {
    return hasScreen(m, 'login') ? cancelSignUp : undefined;
  }

  submitHandler(m) {
    return signUpWithSms;
  }

  isSubmitDisabled(m) {
    return !termsAccepted(m);
  }

  renderAuxiliaryPane(lock) {
    return (
      renderSignedInConfirmation(lock) ||
      renderSignedUpConfirmation(lock) ||
      renderOptionSelection(lock)
    );
  }

  renderTabs() {
    return true;
  }

  getScreenTitle(m) {
    // signupTitle is inconsistent with the rest of the codebase
    // but, since changing this would be a breaking change, we'll
    // still support it until the next major version
    return i18n.str(m, 'signUpTitle') || i18n.str(m, 'signupTitle');
  }

  renderTerms(m, terms) {
    const checkHandler = mustAcceptTerms(m) ? () => toggleTermsAcceptance(l.id(m)) : undefined;
    return terms && showTerms(m) ? (
      <SignUpTerms
        showCheckbox={mustAcceptTerms(m)}
        checkHandler={checkHandler}
        checked={termsAccepted(m)}
      >
        {terms}
      </SignUpTerms>
    ) : null;
  }

  render() {
    return SignUpWithSmsComponent;
  }
}

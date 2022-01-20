import React, { useState } from 'react';
import Screen from '../../core/screen';

import {
  hasScreen,
  showTerms,
  mustAcceptTerms,
  termsAccepted
} from '../../connection/database/index';
import { signUp, toggleTermsAcceptance, cancelSignUp } from '../../connection/database/actions';
import { hasOnlyClassicConnections, isSSOEnabled } from '../classic';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import { renderSignedUpConfirmation } from '../../connection/database/signed_up_confirmation';
import { renderOptionSelection } from '../../field/index';
import { logIn as enterpriseLogIn, startHRD } from '../../connection/enterprise/actions';
import { databaseUsernameValue } from '../../connection/database/index';
import { isHRDDomain } from '../../connection/enterprise';
import * as l from '../../core/index';
import * as i18n from '../../i18n';

import SignUpWithEmailPane from './sign_up_email_pane';
import PaneSeparator from '../../core/pane_separator';
import SignUpTerms from '../../connection/database/sign_up_terms';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import SingleSignOnNotice from '../../connection/enterprise/single_sign_on_notice';
import SignUpTabs from '../../connection/database/signup_tabs';

function shouldRenderTabs(m) {
  if (isSSOEnabled(m)) return false;
  if (l.hasSomeConnections(m, 'database')) return hasScreen(m, 'signUpWithEmail') || hasScreen(m, 'signUpWithSms');
  if (l.hasSomeConnections(m, 'social') && hasInitialScreen(m, 'signUpWithEmail'))
    return hasScreen(m, 'signUpWithEmail') || hasScreen(m, 'signUpWithSms');
}

const SignUpWithEmailComponent = ({ i18n, model }) => {
  const sso = isSSOEnabled(model, { emailFirst: true }) && (hasScreen(model, 'loginWithUsername') || hasScreen(model, 'loginWithSms'));
  const ssoNotice = sso && <SingleSignOnNotice>{i18n.str('ssoEnabled')}</SingleSignOnNotice>;

  const tabs = shouldRenderTabs(model) && (
    <SignUpTabs
      key="signup"
      lock={model}
      signUpWithSmsLabel={i18n.str('signUpWithSms')}
      signUpWithEmailLabel={i18n.str('signUpWithEmail')}
    />
  );

  const social = l.hasSomeConnections(model, 'social') && (
    <SocialButtonsPane
      instructions={i18n.html('socialSignUpInstructions')}
      labelFn={i18n.str}
      lock={model}
      signUp={true}
    />
  );

  const signUpInstructionsKey = social
    ? 'databaseAlternativeSignUpInstructions'
    : 'databaseSignUpInstructions';

  const db = (l.hasSomeConnections(model, 'database') ||
    l.hasSomeConnections(model, 'enterprise')) && (
    <SignUpWithEmailPane
      emailInputPlaceholder={i18n.str('emailInputPlaceholder')}
      i18n={i18n}
      instructions={i18n.html(signUpInstructionsKey)}
      model={model}
      onlyEmail={sso}
      passwordInputPlaceholder={i18n.str('passwordInputPlaceholder')}
      passwordStrengthMessages={i18n.group('passwordStrength')}
      usernameInputPlaceholder={i18n.str('usernameInputPlaceholder')}
    />
  );

  const separator = social && db && <PaneSeparator />;

  return (
    <div>
      {ssoNotice}
      {tabs}
      <div>
        {separator}
        {db}
        {social}
      </div>
    </div>
  );
};

export default class SignUpEmail extends Screen {
  constructor() {
    super('main.signUpWithEmail');
  }

  submitButtonLabel(m) {
    return i18n.str(m, ['signUpSubmitLabel']);
  }

  backHandler(m) {
    return (hasScreen(m, 'loginWithUsername') || hasScreen(m, 'loginWithSms')) ? cancelSignUp : undefined;
  }

  submitHandler(m) {
    if (hasOnlyClassicConnections(m, 'social')) return null;
    const username = databaseUsernameValue(m, { emailFirst: true });
    if (isHRDDomain(m, username)) {
      return id => startHRD(id, username);
    }
    if (isSSOEnabled(m, { emailFirst: true })) return enterpriseLogIn;
    return signUp;
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
    return SignUpWithEmailComponent;
  }
}

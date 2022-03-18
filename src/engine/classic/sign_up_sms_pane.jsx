import React from 'react';
import CustomInput from '../../field/custom_input';
import {
  additionalSignUpFields,
} from '../../connection/database/index';
import CaptchaPane from '../../field/captcha/captcha_pane';
import * as l from '../../core/index';
import { swapCaptcha } from '../../connection/captcha';
import { isHRDDomain } from '../../connection/enterprise';
import { databaseUsernameValue } from '../../connection/database/index';
import { isSSOEnabled } from '../classic';
import PhoneNumberPane from '../../field/phone-number/phone_number_pane';
import VcodePane from '../../field/vcode/vcode_pane';

const SignUpWithSmsPane = (props) => {
  const { i18n, model } = props;

  const sso = isSSOEnabled(model);
    
  const phonePane = l.hasSomeConnections(model, 'passwordless', 'sms') ? (
    <PhoneNumberPane
      lock={model}
      placeholder={i18n.str('phoneNumberInputPlaceholder')}
      invalidHint={i18n.str('phoneNumberInputInvalidHint')}
    />
  ) : null;

  const fields = additionalSignUpFields(model).map(x => (
      <CustomInput
        iconUrl={x.get('icon')}
        key={x.get('name')}
        model={model}
        name={x.get('name')}
        ariaLabel={x.get('ariaLabel')}
        options={x.get('options')}
        placeholder={x.get('placeholder')}
        placeholderHTML={x.get('placeholderHTML')}
        type={x.get('type')}
        validator={x.get('validator')}
        value={x.get('value')}
      />
    ));

  const vcode = <VcodePane
    lock={model}
    scene="login"
    placeholder={i18n.str('codeInputPlaceholder')}
    resendLabel={i18n.str('sendVcode')}
  />

  const captchaPane =
    l.captcha(model) &&
    l.captcha(model).get('required') &&
    (isHRDDomain(model, databaseUsernameValue(model)) || !sso) ? (
      <CaptchaPane i18n={i18n} lock={model} onReload={() => swapCaptcha(l.id(model), false)} />
    ) : null;

  return (
    <div>
      {phonePane}
      {vcode}
      {captchaPane}
      {fields}
    </div>
  );
}

export default SignUpWithSmsPane;

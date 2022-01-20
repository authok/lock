import React from 'react';
import SocialButtonsPane from '../../field/social/social_buttons_pane';

export default function SocialLogin({ i18n, model }) {
  return <SocialButtonsPane
    className="authok-lock-social-login"  
    instructions={i18n.html('socialLoginInstructions')}
    labelFn={i18n.str}
    lock={model}
    signUp={false}
  />;  
}
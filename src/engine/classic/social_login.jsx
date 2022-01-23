import React from 'react';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import { hasOnlyClassicConnections } from '../classic';
import * as l from '../../core/index';

export default function SocialLogin({ i18n, model }) {
  const onlySocial = hasOnlyClassicConnections(model, 'social');
  const social = l.hasSomeConnections(model, 'social') && (
    <SocialButtonsPane
      instructions={i18n.html('socialLoginInstructions')}
      labelFn={i18n.str}
      lock={model}
      showLoading={onlySocial}
      signUp={false}
    />
  );

  return social;
}
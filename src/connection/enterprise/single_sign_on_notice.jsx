import React from 'react';
import { IconSvg } from '../../ui/input/password_input';

export default ({ children }) => (
  <div className="authok-sso-notice-container">
    <span>{IconSvg}</span> <span className="authok-sso-notice">{children}</span>
  </div>
);

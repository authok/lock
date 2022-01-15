import PropTypes from 'prop-types';
import React from 'react';
import { showLoginActivity, showSignUpActivity, showLoginWithSmsActivity } from './actions';
import * as l from '../../core/index';
import { getScreen } from './index';
import { closeLock } from '../../core/actions';

export default class LoginSignUpTabs extends React.Component {
  render() {
    const { lock, loginLabel, loginWithSmsLabel, signUpLink, signUpLabel } = this.props;
    const screen = getScreen(lock);
    console.log('screen: ', screen);

    return (
      <div role="navigation" className="authok-lock-tabs-container">
        <ul className="authok-lock-tabs">
          <LoginSignUpTab
            label={loginLabel}
            current={screen === 'login'}
            clickHandler={::this.handleLoginClick}
          />
          <LoginSignUpTab
            label={loginWithSmsLabel}
            current={screen === 'loginWithSms'}
            clickHandler={::this.handleLoginWithSmsClick}
          />
        </ul>
      </div>
    );
  }

  handleLoginClick() {
    showLoginActivity(l.id(this.props.lock));
  }

  handleLoginWithSmsClick() {
    if (this.props.signUpLink) {
      closeLock(l.id(this.props.lock), true);
    }
    showLoginWithSmsActivity(l.id(this.props.lock));
  }
}

LoginSignUpTabs.propTypes = {
  lock: PropTypes.object.isRequired,
  loginLabel: PropTypes.string.isRequired,
  loginWithSmsLabel: PropTypes.string.isRequired,
  signUpLabel: PropTypes.string.isRequired,
  signUpLink: PropTypes.string
};

class LoginSignUpTab extends React.Component {
  handleClick = e => {
    if (this.props.href) {
      this.props.clickWithHrefHandler();
    } else {
      e.preventDefault();
      this.props.clickHandler();
    }
  };

  render() {
    const { current, href, label } = this.props;
    const className = current ? 'authok-lock-tabs-current' : '';

    return (
      <li className={className}>
        {current ? (
          <span>{label}</span>
        ) : (
          <a href={href || '#'} onClick={this.handleClick}>
            {label}
          </a>
        )}
      </li>
    );
  }
}

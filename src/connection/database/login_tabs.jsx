import PropTypes from 'prop-types';
import React from 'react';
import { showLoginActivity, showLoginWithSmsActivity } from './actions';
import * as l from '../../core/index';
import { getScreen } from './index';

export default class LoginTabs extends React.Component {
  render() {
    const { lock, loginLabel, loginWithSmsLabel } = this.props;
    const screen = getScreen(lock);

    return (
      <div role="navigation" className="authok-lock-tabs-container">
        <ul className="authok-lock-tabs">
          <LoginTab
            label={loginLabel}
            current={screen === 'login'}
            clickHandler={::this.handleLoginClick}
          />
          <LoginTab
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
    showLoginWithSmsActivity(l.id(this.props.lock));
  }
}

LoginTabs.propTypes = {
  lock: PropTypes.object.isRequired,
  loginLabel: PropTypes.string.isRequired,
  loginWithSmsLabel: PropTypes.string.isRequired,
  signUpLabel: PropTypes.string.isRequired,
  signUpLink: PropTypes.string
};

class LoginTab extends React.Component {
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

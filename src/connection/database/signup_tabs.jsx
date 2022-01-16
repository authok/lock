import PropTypes from 'prop-types';
import React from 'react';
import { showSignUpWithEmailActivity, showSignUpWithSmsActivity } from './actions';
import * as l from '../../core/index';
import { getScreen } from './index';

const SignUpTabs = (props) => {
  const { signUpWithSmsLabel, signUpWithEmailLabel, lock } = props;
  const screen = getScreen(lock);

  console.log('screen: ', screen);

  return (
    <div role="navigation" className="authok-lock-tabs-container">
    <ul className="authok-lock-tabs">
      <SignUpTab
        label={signUpWithSmsLabel}
        current={screen === 'signUpWithSms'}
        clickHandler={() => showSignUpWithSmsActivity(l.id(lock))}
      />
      <SignUpTab
        label={signUpWithEmailLabel}
        current={screen === 'signUpWithEmail'}
        clickHandler={() => showSignUpWithEmailActivity(l.id(lock))}
      />
    </ul>
  </div>);
}

export default SignUpTabs;

class SignUpTab extends React.Component {
  handleClick = e => {
    e.preventDefault();
    this.props.clickHandler();    
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
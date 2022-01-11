import PropTypes from 'prop-types';
import React from 'react';

export default class InputWrap extends React.Component {
  render() {
    const { after, focused, invalidHint, isValid, name, icon } = this.props;
    let blockClassName = `authok-lock-input-block authok-lock-input-${name}`;
    if (!isValid) {
      blockClassName += ' authok-lock-error';
    }

    let wrapClassName = 'authok-lock-input-wrap';
    if (focused && isValid) {
      wrapClassName += ' authok-lock-focused';
    }

    if (icon) {
      wrapClassName += ' authok-lock-input-wrap-with-icon';
    }

    const errorTooltip =
      !isValid && invalidHint ? (
        <div role="alert" id={`authok-lock-error-msg-${name}`} className="authok-lock-error-msg">
          <div className="authok-lock-error-invalid-hint">{invalidHint}</div>
        </div>
      ) : null;

    return (
      <div className={blockClassName}>
        <div className={wrapClassName}>
          {icon}
          {this.props.children}
          {after}
        </div>
        {errorTooltip}
      </div>
    );
  }
}

InputWrap.propTypes = {
  after: PropTypes.element,
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element).isRequired
  ]),
  focused: PropTypes.bool,
  invalidHint: PropTypes.node,
  isValid: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.object
};

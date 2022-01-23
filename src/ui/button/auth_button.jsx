import PropTypes from 'prop-types';
import React from 'react';

const AuthButton = props => {
  const { label, onClick, strategy, icon, primaryColor, foregroundColor } = props;

  const backgroundStyle = primaryColor ? { backgroundColor: primaryColor } : {};
  const foregroundStyle = foregroundColor ? { color: foregroundColor } : {};
  const iconStyle = icon ? { backgroundImage: `url('${icon}')` } : {};

  return (
    <div
      className="ant-row authok-lock-auth-button authok-lock-auth-big-button"
      data-provider={strategy}
      onClick={onClick}
      style={backgroundStyle}
      type="button"
    >
      <a
        className="authok-lock-social-button authok-lock-social-big-button"
        data-provider={strategy}
        style={{ position: 'absolute' }}
      >
        <div className="authok-lock-social-button-icon" style={iconStyle} />
      </a>
      <div className="authok-lock-auth-button-text" style={foregroundStyle}>
        {label}
      </div>
    </div>
  );
};

AuthButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  strategy: PropTypes.string.isRequired,
  icon: PropTypes.string,
  primaryColor: PropTypes.string,
  foregroundColor: PropTypes.string
};

AuthButton.defaultProps = {
  disabled: false
};

export default AuthButton;

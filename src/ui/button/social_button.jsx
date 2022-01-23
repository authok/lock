import PropTypes from 'prop-types';
import React from 'react';

const SocialButton = props => {
  const { onClick, strategy, icon, primaryColor, foregroundColor } = props;

  const backgroundStyle = primaryColor ? { backgroundColor: primaryColor } : {};
  const iconStyle = icon ? { backgroundImage: `url('${icon}')` } : {};

  return (
    <a
      className="authok-lock-social-button authok-lock-social-big-button"
      data-provider={strategy}
      onClick={onClick}
      style={backgroundStyle}
      type="button"
    >
      <div className="authok-lock-social-button-icon" style={iconStyle} />
    </a>
  );
};

SocialButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  strategy: PropTypes.string.isRequired,
  icon: PropTypes.string,
  primaryColor: PropTypes.string,
  foregroundColor: PropTypes.string
};

SocialButton.defaultProps = {
  disabled: false
};

export default SocialButton;

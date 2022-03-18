import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { BackButton } from './button';

export default class Header extends React.Component {
  getDOMNode() {
    return ReactDOM.findDOMNode(this);
  }

  render() {
    const { backHandler, backgroundColor, backgroundUrl, logoUrl, name, title } = this.props;

    return (
      <div className="authok-lock-header">
        {backHandler && <BackButton onClick={backHandler} />}
        <Background imageUrl={backgroundUrl} backgroundColor={backgroundColor} grayScale={!!name} />
        <Welcome title={title} name={name} imageUrl={name ? undefined : logoUrl} />
      </div>
    );
  }
}

Header.propTypes = {
  backgroundUrl: PropTypes.string,
  logoUrl: PropTypes.string,
  name: PropTypes.string
};

class Welcome extends React.Component {
  // Cause a reflow when the image is loaded to fix an issue with the Lock content sometimes
  // not rendering in a popup on first load.
  // https://github.com/authok/lock/issues/1942
  onImageLoad = () => (document.querySelector('.authok-lock').style.fontSize = '1rem');

  render() {
    const { name, imageUrl, title } = this.props;
    const imgClassName = !!title ? 'authok-lock-header-logo' : 'authok-lock-header-logo centered';
    const img = <img alt="" className={imgClassName} src={imageUrl} onLoad={this.onImageLoad} />;
    const welcome = title ? <WelcomeMessage title={title} name={name} /> : null;

    return (
      <div className="authok-lock-header-welcome">
        {imageUrl && img}
        {welcome}
      </div>
    );
  }
}

Welcome.propTypes = {
  imageUrl: PropTypes.string,
  name: PropTypes.string
};

class WelcomeMessage extends React.Component {
  render() {
    const { name, title } = this.props;
    let className, message;

    if (name) {
      className = 'authok-lock-firstname';
      message = name;
    } else {
      className = 'authok-lock-name';
      message = title;
    }

    return (
      <div className={className} title={message}>
        {message}
      </div>
    );
  }
}

WelcomeMessage.propTypes = {
  name: PropTypes.string
};

const cssBlurSupport = (function () {
  if (typeof window === 'undefined') {
    return;
  }

  // Check stolen from Modernizr, see https://github.com/Modernizr/Modernizr/blob/29eab707f7a2fb261c8a9c538370e97eb1f86e25/feature-detects/css/filters.js
  const isEdge = window.navigator && !!window.navigator.userAgent.match(/Edge/i);
  if (typeof window.document === 'undefined' || isEdge) return false;

  const el = window.document.createElement('div');
  el.style.cssText = 'filter: blur(2px); -webkit-filter: blur(2px)';

  return (
    !!el.style.length &&
    (window.document.documentMode === undefined || window.document.documentMode > 9)
  );
})();

class Background extends React.Component {
  render() {
    const { backgroundColor, imageUrl, grayScale } = this.props;

    const props = {
      className: 'authok-lock-header-bg'
    };

    if (cssBlurSupport) {
      props.className += ' authok-lock-blur-support';
    }

    /*
    const blurProps = {
      className: 'authok-lock-header-bg-blur',
      style: { backgroundImage: `url('${imageUrl}')` }
    };

    if (grayScale) {
      blurProps.className += ' authok-lock-no-grayscale';
    }
    */

    const solidProps = {
      className: 'authok-lock-header-bg-solid',
      style: { backgroundColor: backgroundColor }
    };

    return (
      <div {...props}>
        <div />
        <div {...solidProps} />
      </div>
    );
  }
}

Background.propTypes = {
  backgorundColor: PropTypes.string,
  grayScale: PropTypes.bool,
  imageUrl: PropTypes.string
};

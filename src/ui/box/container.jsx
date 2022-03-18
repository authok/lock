import PropTypes from 'prop-types';
import React from 'react';
import Chrome from './chrome';
import { CloseButton } from './button';
import * as l from '../../core/index';
import * as c from '../../field/index';
import { swap, updateEntity } from '../../store/index';

const badgeSvg = (
  <svg focusable="false" width="21px" height="21px" viewBox="0 0 32 32">
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="logo-grey-horizontal">
        <g id="Group">
          <g id="LogoBadge" fillOpacity="0.4" fill="#FFFFFF">
            <path fill="#07C160" d="M16,0,3.86,2.55l-1.44,14a9.39,9.39,0,0,0,3.84,8.58l9.22,6.68a.87.87,0,0,0,1,0l9.22-6.68a9.39,9.39,0,0,0,3.84-8.58l-1.44-14Z"/>
            <polygon fill="#9CE6BF" points="4.14 2.49 16 24.24 16 11.83 10.65 1.12 4.14 2.49"/>
            <polygon fill="#FFFFFF" points="21.36 1.12 16 11.83 16 24.24 27.87 2.49 21.36 1.12"/>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const BottomBadge = ({ link }) => (
  <span className="authok-lock-badge-bottom">
    <a href={link} target="_blank" className="authok-lock-badge" rel="noopener noreferrer">
      {badgeSvg}<b>Authok提供技术支持</b>
    </a>
  </span>
);

const Avatar = ({ imageUrl }) => <img src={imageUrl} className="authok-lock-header-avatar" />;

Avatar.propTypes = {
  imageUrl: PropTypes.string.isRequired
};

class EscKeyDownHandler {
  constructor(f) {
    this.handler = e => {
      if (e.keyCode == 27 && e.target.tagName.toUpperCase() != 'INPUT') {
        f();
      }
    };
    window.document.addEventListener('keydown', this.handler, false);
  }

  release() {
    window.document.removeEventListener('keydown', this.handler);
  }
}

const IPHONE =
  typeof window !== 'undefined' &&
  window.navigator &&
  !!window.navigator.userAgent.match(/iPhone/i);

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }
  checkConnectionResolver(done) {
    const { contentProps } = this.props;
    const lock = contentProps.model;
    const connectionResolver = l.connectionResolver(lock);
    if (!connectionResolver) {
      return done();
    }
    const { connections, id } = lock.get('client').toJS();
    const context = { connections, id };
    const userInputValue = c.getFieldValue(lock, 'username') || c.getFieldValue(lock, 'email');
    connectionResolver(userInputValue, context, resolvedConnection => {
      swap(updateEntity, 'lock', l.id(lock), m => l.setResolvedConnection(m, resolvedConnection));
      done();
    });
  }

  componentDidMount() {
    if (this.props.isModal) {
      setTimeout(() => this.setState({ isOpen: true }), 17);
    }

    if (this.props.closeHandler) {
      this.escKeydown = new EscKeyDownHandler(::this.handleEsc);
    }
  }

  componentWillUnmount() {
    if (this.escKeydown) {
      this.escKeydown.release();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    // Safari does not disable form submits when the submit button is disabled
    // on single input (eg. passwordless) forms, so disable it manually.
    if (this.props.isSubmitting) {
      return;
    }

    this.checkConnectionResolver(() => {
      const { submitHandler } = this.props;
      if (submitHandler) {
        setTimeout(() => {
          if (!this.props.isSubmitting) {
            this.refs.chrome.focusError();
          }
        }, 17);
        submitHandler();
      }
    });
  }

  handleClose() {
    const { closeHandler, isSubmitting } = this.props;
    if (!isSubmitting) {
      closeHandler();
    }
  }

  handleEsc() {
    const { closeHandler, escHandler } = this.props;
    escHandler ? escHandler() : this.handleClose();
  }

  hide() {
    this.setState({ isOpen: false });
  }

  render() {
    const {
      autofocus,
      avatar,
      auxiliaryPane,
      backHandler,
      badgeLink,
      closeHandler,
      contentComponent,
      contentProps,
      extraComponent,
      extraProps,
      disableSubmitButton,
      disallowClose,
      error,
      info,
      isMobile, // TODO: not documented and should be removed (let the design team know first)
      isModal,
      isSubmitting,
      logo,
      primaryColor,
      backgroundColor,
      screenName,
      showBadge,
      submitButtonLabel,
      submitHandler,
      success,
      tabs,
      terms,
      title,
      classNames,
      scrollGlobalMessagesIntoView,
      suppressSubmitOverlay
    } = this.props;

    const badge = showBadge ? <BottomBadge link={badgeLink} /> : null;

    const overlay = isModal ? <div className="authok-lock-overlay">{badge}</div> : null;

    let className = 'authok-lock';

    if (isModal && this.state.isOpen) {
      className += ' authok-lock-opened';
    }

    if (!isModal) {
      className += ' authok-lock-opened-in-frame';
    }

    if (isMobile) {
      className += ' authok-lock-mobile';
    }

    if (isSubmitting && !suppressSubmitOverlay) {
      className += ' authok-lock-mode-loading';
    }

    if (auxiliaryPane) {
      className += ' authok-lock-auxiliary';
    }

    if (!submitHandler) {
      className += ' authok-lock-no-submit';
    }

    if (terms) {
      className += ' authok-lock-with-terms';
    }

    if (IPHONE) {
      className += ' authok-lock-iphone';
    }

    // TODO: this no longer makes sense, instead of taking a tabs
    // prop we should take extra class names.
    if (tabs) {
      className += ' authok-lock-with-tabs';
    }

    return (
      <div className={className} lang={this.props.language}>
        {overlay}
        <div className="authok-lock-center">
          <form
            className="authok-lock-widget"
            method="post"
            noValidate
            onSubmit={::this.handleSubmit}
          >
            {avatar && <Avatar imageUrl={avatar} />}
            {closeHandler && <CloseButton onClick={::this.handleClose} />}
            <div className="authok-lock-widget-container">
              <Chrome
                autofocus={autofocus}
                avatar={avatar}
                auxiliaryPane={auxiliaryPane}
                backHandler={backHandler}
                contentComponent={contentComponent}
                contentProps={contentProps}
                extraComponent={extraComponent}
                extraProps={extraProps}
                disableSubmitButton={disableSubmitButton}
                error={error}
                info={info}
                isSubmitting={isSubmitting}
                logo={logo}
                screenName={screenName}
                primaryColor={primaryColor}
                backgroundColor={backgroundColor}
                ref="chrome"
                showSubmitButton={!!submitHandler}
                submitButtonLabel={submitButtonLabel}
                success={success}
                tabs={tabs}
                terms={terms}
                title={title}
                classNames={classNames}
                scrollGlobalMessagesIntoView={scrollGlobalMessagesIntoView}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Container.propTypes = {
  autofocus: PropTypes.bool.isRequired,
  avatar: PropTypes.string,
  auxiliaryPane: PropTypes.element,
  backHandler: PropTypes.func,
  badgeLink: PropTypes.string.isRequired,
  closeHandler: PropTypes.func,
  contentComponent: PropTypes.func.isRequired, // TODO: it also can be a class component
  contentProps: PropTypes.object.isRequired,
  extraComponent: PropTypes.func, // TODO: it also can be a class component
  extraProps: PropTypes.object,
  disableSubmitButton: PropTypes.bool.isRequired,
  error: PropTypes.node,
  info: PropTypes.node,
  isMobile: PropTypes.bool.isRequired,
  isModal: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  language: PropTypes.string,
  logo: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  screenName: PropTypes.string.isRequired,
  showBadge: PropTypes.bool.isRequired,
  submitButtonLabel: PropTypes.string,
  success: PropTypes.node,
  tabs: PropTypes.bool,
  terms: PropTypes.element,
  title: PropTypes.string,
  classNames: PropTypes.string.isRequired,
  scrollGlobalMessagesIntoView: PropTypes.bool,
  suppressSubmitOverlay: PropTypes.bool
  // escHandler
  // submitHandler,
};

// NOTE: detecting the file protocol is important for things like electron.
const isFileProtocol =
  typeof window !== 'undefined' &&
  window.window &&
  window.location &&
  window.location.protocol === 'file:';

export const defaultProps = (Container.defaultProps = {
  autofocus: false,
  badgeLink: 'https://authok.cn/',
  contentProps: {},
  disableSubmitButton: false,
  isMobile: false,
  isSubmitting: false,
  language: 'zh',
  logo: `${
    isFileProtocol ? 'https:' : ''
  }//cdn.authok.cn/assets/authok-badge.png`,
  primaryColor: '#1890ff',
  backgroundColor: '#ffffff',
  showBadge: true,
  scrollGlobalMessagesIntoView: true
});

import PropTypes from 'prop-types';
import React from 'react';
import { BackButton, CloseButton } from './button';
import * as l from '../../core/index';

const ConfirmationPane = ({ lock, backHandler, children, closeHandler, svg }) => (
  <div className="authok-lock-confirmation">
    {closeHandler && <CloseButton lockId={l.id(lock)} onClick={closeHandler} />}
    {backHandler && <BackButton lockId={l.id(lock)} onClick={backHandler} />}
    <div className="authok-lock-confirmation-content">
      <span>{svg}</span>
      {children}
    </div>
  </div>
);

ConfirmationPane.propTypes = {
  backHandler: PropTypes.func,
  closeHandler: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element).isRequired
  ]),
  svg: PropTypes.element.isRequired
};

export default ConfirmationPane;

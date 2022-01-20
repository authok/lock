import PropTypes from 'prop-types';
import React from 'react';
import VcodeInput from '../../ui/input/vcode_input';
import * as l from '../../core/index';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import { setVcode } from '../vcode';
import { sendSMS } from '../../connection/passwordless/actions';

export default class VcodePane extends React.Component {
  handleVcodeChange = e => {
    e.preventDefault();
    swap(updateEntity, 'lock', l.id(this.props.lock), setVcode, e.target.value);
  };

  render() {
    const { lock, placeholder, resendLabel } = this.props;

    return (
      <div className="ant-row ant-row-middle ant-row-space-between">
        <div className="ant-col ant-col-15">
          <VcodeInput
            lockId={l.id(lock)}
            value={c.vcode(lock)}
            isValid={!c.isFieldVisiblyInvalid(lock, 'vcode') && !l.globalError(lock)}
            onChange={this.handleVcodeChange}
            placeholder={placeholder}
            disabled={l.submitting(lock)}
          />
        </div>
        <div className="ant-col ant-col-8 ant-col-offset-1">
          <Resend label={resendLabel} model={lock} />
        </div>
      </div>
    );
  }
}

VcodePane.propTypes = {
  lock: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  resendLabel: PropTypes.string.isRequired,
  onRestart: PropTypes.func.isRequired
};


const Resend = ({ label, model }) => {
  const handleSendVCode = e => {
    e.preventDefault();
    const send = l.hasSomeConnections(model, 'passwordless', 'sms') ? sendSMS : null;
    if (send) send(l.id(model));
  };

  return <button 
    className="ant-btn authok-lock-resend-code"
    onClick={handleSendVCode}
  >{label}</button>;
};
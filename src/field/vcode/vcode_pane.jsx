import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import VcodeInput from '../../ui/input/vcode_input';
import * as l from '../../core/index';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import { setVcode } from '../vcode';
import { sendSMS } from '../../connection/passwordless/actions';
import useCountDown from '../../hooks/useCountDown';

export default function VcodePane({ lock, placeholder, resendLabel }) {
  const [targetDate, setTargetDate] = useState();

  const handleVcodeChange = useCallback(e => {
    e.preventDefault();
    swap(updateEntity, 'lock', l.id(lock), setVcode, e.target.value);
  }, []);

  const handleSendVCode = e => {
    e.preventDefault();
    const send = l.hasSomeConnections(lock, 'passwordless', 'sms') ? sendSMS : null;
    if (send) {
      send(l.id(lock));

      setTargetDate(Date.now() + 60000);
    };
  };

  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
    },
  });

  return (
    <div className="ant-row ant-row-middle ant-row-space-between">
      <div className="ant-col ant-col-15">
        <VcodeInput
          lockId={l.id(lock)}
          value={c.vcode(lock)}
          isValid={!c.isFieldVisiblyInvalid(lock, 'vcode') && !l.globalError(lock)}
          onChange={handleVcodeChange}
          placeholder={placeholder}
          disabled={l.submitting(lock)}
        />
      </div>
      <div className="ant-col ant-col-8 ant-col-offset-1">
        <button 
          disabled={countdown !== 0}
          className="ant-btn authok-lock-resend-code" 
          onClick={handleSendVCode}>
           {countdown === 0 ? resendLabel : `${Math.round(countdown / 1000)}秒`}
        </button>
      </div>
    </div>
  );
}

VcodePane.propTypes = {
  lock: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  resendLabel: PropTypes.string.isRequired,
};
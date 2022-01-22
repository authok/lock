import PropTypes from 'prop-types';
import React from 'react';
import EmailPane from '../../field/email/email_pane';
import * as l from '../../core/index';

export default class ResetPasswordPane extends React.Component {
  static propTypes = {
    lock: PropTypes.object.isRequired
  };

  render() {
    const { header, i18n, lock } = this.props;

    return (
      <div>
        {header}
        <EmailPane
          i18n={i18n}
          lock={lock}
          placeholder={i18n.str('phoneInputPlaceholder')}
          strictValidation={false}
        />
      </div>
    );
  }
}

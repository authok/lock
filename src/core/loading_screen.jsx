import PropTypes from 'prop-types';
import React from 'react';
import Screen from './screen';
import { pinLoadingPane, unpinLoadingPane } from './actions';
import * as l from './index';

export default class LoadingScreen extends Screen {
  constructor() {
    super('loading');
  }

  render() {
    return LoadingPane;
  }
}

class LoadingPane extends React.Component {
  componentDidMount() {
    const { model } = this.props;
    pinLoadingPane(l.id(model));
    setTimeout(() => unpinLoadingPane(l.id(model)), 500);
  }

  render() {
    return (
      <div className="authok-loading-screen">
        <div className="authok-loading-container">
          <div className="authok-loading" />
        </div>
      </div>
    );
  }
}

LoadingPane.propTypes = {
  model: PropTypes.object.isRequired
};

import React from 'react'; // eslint-disable-line
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';

export const expectComponent = (children, opts) => {
  const component = renderer.create(children, opts);
  return expect(component);
};

export const expectShallowComponent = children => {
  const component = renderShallowComponent(children);
  return expect(component);
};

export const renderShallowComponent = children => {
  const renderer = new ShallowRenderer();

  renderer.render(children);
  return renderer.getRenderOutput();
};

const addDataToProps = props => {
  const returnedProps = {};
  Object.keys(props).forEach(k => (returnedProps[`data-${k}`] = props[k]));
  return returnedProps;
};

const removeDataFromProps = props => {
  const returnedProps = {};
  Object.keys(props).forEach(k => (returnedProps[k.replace('data-', '')] = props[k]));
  return returnedProps;
};

export const mockComponent =
  (type, domElement = 'div') =>
  ({ children, ...props }) =>
    React.createElement(
      domElement,
      {
        'data-__type': type,
        ...addDataToProps(props)
      },
      children
    );

export const extractPropsFromWrapper = (wrapper, index = 0) =>
  removeDataFromProps(wrapper.find('div').at(index).props());

//set urls with jest: https://github.com/facebook/jest/issues/890#issuecomment-298594389
export const setURL = (url, options = {}) => {
  const parser = document.createElement('a');
  parser.href = url;
  ['href', 'protocol', 'host', 'hostname', 'origin', 'port', 'pathname', 'search', 'hash'].forEach(
    prop => {
      let value = parser[prop];
      if (prop === 'origin' && options.noOrigin) {
        value = null;
      }
      Object.defineProperty(window.location, prop, {
        value,
        writable: true
      });
    }
  );
};

export const expectMockToMatch = ({ mock }, numberOfCalls) => {
  expect(mock.calls.length).toBe(numberOfCalls);
  for (var i = 0; i < numberOfCalls; i++) {
    expect(mock.calls[i]).toMatchSnapshot();
  }
};

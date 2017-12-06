import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global.shallow = shallow;
global.mount = mount;

// jest mocks
jest.mock('react-i18next', () => ({
  translate: () => Component => props => <Component t={() => ''} {...props} />
}));

Enzyme.configure({adapter: new Adapter()});

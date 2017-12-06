import React from 'react';

import WithActions from 'components/WithActions.component';
import Button from 'components/Button.component';

const props = {
  actions: {
    firstAction: {
      label: 'first',
      hideContent: true,
      item: <div data-test-id={'first-content'} />
    },
    secondAction: {
      label: 'second',
      item: <div data-test-id={'second-content'} />
    }
  },
  onActionChange: jest.fn(),
  children: 'content'
};

describe('<WithActions />', () => {
  it('should render actions to separate container no action selected', () => {
    const wrapper = mount(<WithActions {...props} />);
    const actions = wrapper.find('[data-test-id="actions-container"]');
    expect(actions.length).toBe(1);
    expect(actions.find(Button).length)
      .toBe(Object.keys(props.actions).length);
  });

  it('should not render actions if hideActions enabled', () => {
    const wrapper = mount(<WithActions {...props} hideActions />);
    expect(wrapper.find('[data-test-id="actions-container"]').length).toBe(0);
  });

  it('should not render actions if action selected', () => {
    const wrapper = mount(<WithActions {...props} action={'firstAction'} />);
    expect(wrapper.find('[data-test-id="actions-container"]').length).toBe(0);
  });

  it('should not render return button when no action is selected', () => {
    const wrapper = mount(<WithActions {...props} action={''} />);
    expect(wrapper.find('[data-test-id="action-return"]').length).toBe(0);
  });

  it('should not render return button when action is selected and forced', () => {
    const wrapper = mount(<WithActions {...props} forceDefaultAction action={'firstAction'} />);
    expect(wrapper.find('[data-test-id="action-return"]').length).toBe(0);
  });

  it('should not render content container if action active and hides content when selected', () => {
    const wrapper = mount(<WithActions {...props} action={'firstAction'} />);
    expect(wrapper.find('[data-test-id="content-container"]').length).toBe(0);
  });

  it('should render content if action active doesn\'t hide content when selected', () => {
    const wrapper = mount(<WithActions {...props} action={'secondAction'} />);
    expect(wrapper.find('[data-test-id="second-content"]').length).toBe(1);
  });

  it('should call onActionChange() when action button clicked', () => {
    const wrapper = mount(<WithActions {...props} />);
    const actions = wrapper.find('[data-test-id="actions-container"]');
    actions.find(Button).forEach(button => button.simulate('click'));
    expect(props.onActionChange.mock.calls.length).toBe(Object.keys(props.actions).length);
  });
});

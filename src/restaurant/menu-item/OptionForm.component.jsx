import React from 'react';
import Radium from 'radium';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {get, find, set, differenceWith} from 'lodash/fp';

import {getOptions} from 'graphql/restaurant/option.queries';
import {content} from 'styles/spacing';
import Checkbox from 'components/Checkbox.component';
import Button from 'components/Button.component';
import Form from 'components/Form.component';
import Select from 'components/Select.component';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  language: state.util.translation.language
});

const FormComponent = new Radium(props => <div {...props} />);

class OptionForm extends React.Component {
  static propTypes = {
    disabledOptions: PropTypes.arrayOf(PropTypes.object),
    option: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    submitText: PropTypes.string,
    forceOpen: PropTypes.bool
  };
  constructor(props) {
    super(props);
    this.state = Object.assign(
      {isOpen: false},
      props.option ?
        {isOpen: false, option: props.option.id, ...props.option}
      : {option: undefined, defaultValue: false}
    );
  }
  handleSubmit = () => {
    const {onSubmit, options} = this.props;
    const {option, defaultValue} = this.state;
    onSubmit(Object.assign(
      {},
      typeof option === 'number' ? find(o => o.id === option)(options) : {option},
      {defaultValue}
    ));
    this.setState({isOpen: false, option: undefined, defaultValue: false});
  };
  handleStateChange = (path, forceValue) => changed => {
    const value = typeof forceValue === 'undefined' ?
      Array.isArray(changed) ?
        changed.map(i => i.value || i)
      : get(['target', 'value'])(changed) || get('value')(changed) || changed
    : forceValue;
    this.setState(set(path)(value)(this.state));
  };
  handleClose = () => {
    this.setState({isOpen: false});
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  };
  toggleOpen = () => this.setState({isOpen: !this.state.isOpen});
  render() {
    const {
      t,
      options,
      language,
      forceOpen,
      submitText = t('add'),
      disabledOptions
    } = this.props;
    const {option, defaultValue} = this.state;
    const availableOptions = differenceWith(
      (a, b) => a.id === b.id && a.id !== option
    )(options)(disabledOptions) || [];
    return availableOptions.length ?
      this.state.isOpen || forceOpen ? (
        <Form
            FormComponent={FormComponent}
            fieldStyle={{marginRight: content}}
            onClose={this.handleClose}
            onSubmit={this.handleSubmit}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 0
            }}
            submitText={submitText}
        >
          <Select
              autoBlur
              clearable={false}
              onChange={this.handleStateChange('option')}
              options={availableOptions.map(option => ({
                label: get(['i18n', language, 'name'])(option),
                value: option.id
              }))}
              value={option}
          />
          <Checkbox
              checked={defaultValue}
              label={t('restaurant.option.enabledByDefault')}
              onClick={this.handleStateChange('defaultValue', !defaultValue)}
          />
        </Form>
      ) : (
        <Button onClick={this.toggleOpen}>
          {t('restaurant.menuItem.addNewOption')}
        </Button>
      )
    : null;
  }
};

export default compose(
  connect(mapStateToProps),
  getOptions
)(OptionForm);

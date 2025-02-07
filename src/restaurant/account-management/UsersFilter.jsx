import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {set, equals, get} from 'lodash/fp';
import {account} from 'walless-graphql';

import Input from 'components/Input';
import Form from 'components/Form';
import loadable from 'decorators/loadable';
import ItemsWithLabels from 'components/ItemsWithLabels';
import Select from 'components/Select';

@translate()
@loadable()
class UsersFilter extends React.Component {
  static propTypes = {
    filters: PropTypes.shape({
      roles: PropTypes.array
    }),
    onFiltersChange: PropTypes.func.isRequired,
    roles: PropTypes.array,
    t: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.resetFilter(props, state => this.state = state); // eslint-disable-line
  }
  componentWillReceiveProps(newProps) {
    this.resetFilter(newProps);
  }
  resetFilter = (props, setState = state => this.setState(state)) =>
    setState(props.filters);
  handleStateChange = path => changed => {
    const value = Array.isArray(changed) ?
      changed.map(i => i.value || i)
      : get(['target', 'value'])(changed) || get('value')(changed) || changed;
    this.setState(set(path)(value)(this.state));
  };
  handleSubmit = () => {
    this.props.onFiltersChange(this.state);
  };
  render() {
    const {t, roles = [], filters} = this.props;
    const {name = ''} = this.state;
    return (
      <Form
        isValid={!equals(this.state)(filters)}
        onSubmit={this.handleSubmit}
      >
        <ItemsWithLabels
          items={[
            <Input
              key='name'
              label={t('account.name')}
              onChange={this.handleStateChange('name')}
              value={name}
            />,
            {
              label: t('account.role'),
              item: (
                <Select
                  autoBlur
                  multi
                  onChange={this.handleStateChange('roles')}
                  options={
                    roles.map(role => ({
                      value: role.id,
                      label: role.name
                    }))
                  }
                  value={this.state.roles}
                />
              )
            }
          ]}
        />
      </Form>
    );
  }
}

export default compose(
  account.getAccountRolesForRestaurant
)(UsersFilter);

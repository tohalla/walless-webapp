import React from 'react';

import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';

export default class NewMenu extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func
  };
  static propTypes = {
    onSubmit: React.PropTypes.func,
    onCancel: React.PropTypes.func
  };
  state = {
    name: '',
    description: ''
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit;
  }
  render() {
    const {t} = this.context;
    const {description, name} = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
            className="block"
            id="name"
            label={t('restaurant.menus.creation.name')}
            onChange={this.handleInputChange}
            type="text"
            value={name}
        />
        <Input
            className="block"
            id="description"
            label={t('restaurant.menus.creation.description')}
            onChange={this.handleInputChange}
            rows={3}
            type="text"
            value={description}
        />
        <div>
          <Button colored type="submit">
            {t('restaurant.menus.creation.create')}
          </Button>
          <Button accent type="reset">
            {t('restaurant.menus.creation.cancel')}
          </Button>
        </div>
      </form>
    );
  }
}

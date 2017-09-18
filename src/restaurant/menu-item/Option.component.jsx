import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {get} from 'lodash/fp';

import Button from 'components/Button.component';
import OptionForm from 'restaurant/menu-item/OptionForm.component';

const mapStateToProps = state => ({
  language: state.util.translation.language
});

@Radium
class Option extends React.Component {
  static propTypes = {
    disabledOptions: PropTypes.arrayOf(PropTypes.object),
    option: PropTypes.object.isRequired,
    onEdit: PropTypes.func
  };
  state = {edit: false};
  toggleEdit = () => this.setState({
    edit: typeof this.props.onEdit === 'function' && !this.state.edit
  });
  handleEdit = option => {
    if (typeof this.props.onEdit === 'function') {
      this.setState({edit: false});
      this.props.onEdit(option, this.props.option);
    }
  };
  render() {
    const {option, language, disabledOptions, onEdit} = this.props;
    return this.state.edit ? (
      <OptionForm
          disabledOptions={disabledOptions}
          forceOpen
          onClose={this.toggleEdit}
          onSubmit={this.handleEdit}
          option={option}
      />
    ) : (
      <div style={styles.container}>
        {typeof onEdit === 'function' ?
          <Button onClick={this.toggleEdit} plain>
            <i className="material-icons">{'edit'}</i>
          </Button>
        : null}
        {get(['i18n', language, 'name'])(option)}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Option);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
};

import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import {hasIn} from 'lodash/fp';

import Button from 'mdl/Button.component';
import {
  getServingLocationsByRestaurant
} from 'graphql/restaurant/restaurant.queries';
import ServingLocation from
  'restaurant/serving-location/ServingLocation.component';
import ServingLocationForm from
  'restaurant/serving-location/ServingLocationForm.component';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  filter: hasIn(['form', 'servingLocationFilter', 'values'])(state) ?
    state.form.servingLocationFilter.values : {}

});

class ServingLocations extends React.Component {
  static PropTypes = {
    action: PropTypes.object,
    selectedItems: PropTypes.object,
    restaurant: PropTypes.object.isRequired
  }
  static defaultProps = {
    selectedItems: new Set()
  };
  state = {
    action: null
  };
  handleActionChange = action => e => {
    e.preventDefault();
    this.setState({action});
  };
  resetAction = () => {
    this.setState({action: null});
  };
  handleServingLocationCreated = () => {
    this.setState({action: null});
    this.props.getServingLocationsByRestaurant.data.refetch();
  };
  render() {
    const {
      getServingLocationsByRestaurant: {servingLocations} = {},
      restaurant,
      action: forceAction,
      filter,
      selectedItems,
      plain,
      t
    } = this.props;
    const action = forceAction || this.state.action || {};
    const returnButton = forceAction || action.hideReturn ? null : (
      <Button
          className="block"
          colored
          onClick={this.resetAction}
          type="button"
      >
        {t('return')}
      </Button>
    );
    return (
      <div>
        {
          action.hideSelection ? null :
            <div className={`container${plain ? '' : ' container--distinct'}`}>
              <div>
                <Button
                    colored
                    onClick={this.handleActionChange({
                      name: 'new',
                      hideItems: true,
                      hideReturn: true
                    })}
                    type="button"
                >
                  {t('restaurant.servingLocations.create')}
                </Button>
                <Button
                    colored
                    onClick={this.handleActionChange({
                      name: 'filter',
                      hideItems: false
                    })}
                    type="button"
                >
                  {t('restaurant.servingLocations.filter')}
                </Button>
              </div>
            </div>
        }
        {action.name ?
          <div className={`container${plain ? '' : ' container--distinct'}`}>
            {
              action.name === 'new' || action.name === 'edit' ?
                <div>
                  {returnButton}
                  <ServingLocationForm
                      onCancel={this.resetAction}
                      onSubmit={this.handleServingLocationCreated}
                      restaurant={restaurant}
                      servingLocation={action.name === 'edit' ? action.servingLocation : null}
                  />
                </div>
              : action.name === 'filter' ?
                <div>
                  {returnButton}
                </div>
              : null
            }
          </div> : null
        }
        {action.hideItems || !selectedItems instanceof Set ? null :
          <div className={`container${plain ? '' : ' container--distinct'}`}>
            {servingLocations && servingLocations.length ?
              servingLocations
                .filter(servingLocation =>
                  !filter.name || servingLocation.name.indexOf(filter.name) > -1
                )
                .map((servingLocation, index) => (
                  <ServingLocation
                      actions={plain ? [] : [
                        {
                          text: t('edit'),
                          onClick: this.handleActionChange({
                            name: 'edit',
                            hideItems: true,
                            hideSelection: true,
                            hideReturn: true,
                            servingLocation
                          })
                        }
                      ]}
                      className={selectedItems.has(servingLocation.id) ? 'container__item--selected' : null}
                      key={index}
                      servingLocation={servingLocation}
                  />
                )) : 'no serving locations'
            }
          </div>
        }
      </div>
    );
  }
}

export default compose(getServingLocationsByRestaurant)(
  connect(mapStateToProps, {})(ServingLocations)
);

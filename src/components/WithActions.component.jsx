import {get} from 'lodash/fp';
import {connect} from 'react-redux';

import {major} from 'styles/spacing';
import containers from 'styles/containers';
import Button from 'components/Button.component';

const mapStateToProps = state => ({
  t: state.util.translation.t
});

@Radium
class WithActions extends Component {
  static propTypes = {
    action: PropTypes.string,
    actions: PropTypes.shape({action: PropTypes.shape({
      label: PropTypes.string,
      hide: PropTypes.bool,
      hideItems: PropTypes.bool,
      hideReturn: PropTypes.bool,
      item: PropTypes.node,
      onClick: PropTypes.func
    })}),
    defaultAction: PropTypes.string,
    hideActions: PropTypes.bool,
    forceDefaultAction: PropTypes.bool,
    onActionChange: PropTypes.func.isRequired,
    children: PropTypes.node,
    plain: PropTypes.bool,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ])
  };
  handleActionChange = action => event => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    return typeof get(['action', 'onClick'])(action) === 'function' ?
      action.action.onClick() : this.props.onActionChange(action);
  }
  render() {
    const {
      actions,
      forceDefaultAction,
      t,
      action,
      plain,
      hideActions,
      style,
      children
    } = this.props;
    return (
      <div style={[styles.container, style]}>
        {
          action ? (
            <div
                style={[
                  containers.contentContainer,
                  styles.actionContainer,
                  plain ? styles.plain : {}
                ]}
            >
              {forceDefaultAction || actions[action].hideReturn ? null : (
                <Button onClick={this.handleActionChange()}>
                  {t('return')}
                </Button>
              )}
              {actions[action].item}
            </div>
          )
          : !hideActions && actions && Object.keys(actions).length && !action ?
            <div
                style={[
                  containers.contentContainer,
                  styles.actionContainer,
                  plain ? styles.plain : {}
                ]}
            >
              {Object.keys(actions)
                .filter(key => !actions[key].hide)
                .map(key => (
                  <Button
                      disabled={actions[key].disabled}
                      key={key}
                      loading={actions[key].loading}
                      onClick={this.handleActionChange({key, action: actions[key]})}
                  >
                    {actions[key].label}
                  </Button>
                ))
              }
            </div>
          : null
        }
        {
          get([action, 'hideItems'])(actions) ||
          !children ||
          (Array.isArray(children) && !children.length) ?
          null :
          <div
              style={[
                containers.contentContainer,
                plain ? styles.plain : {}
              ]}
          >
            {children}
          </div>
        }
      </div>
    );
  }
};

export default connect(mapStateToProps)(WithActions);


const styles = {
  actionContainer: {
    marginBottom: major,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  container: {
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  plain: {
    backgroundColor: 'transparent',
    border: 0,
    boxShadow: 'none',
    marginBottom: 0
  }
};

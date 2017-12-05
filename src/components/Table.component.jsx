import ReactTable from 'react-table';

import Checkbox from 'components/Checkbox.component';
import Loading from 'components/Loading.component';
import colors from 'styles/colors';
import {minimal, minor} from 'styles/spacing';

@Radium
export default class Table extends Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      Header: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      accessor: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    })).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    select: PropTypes.shape({
      toggleSelect: PropTypes.func.isRequired,
      selectedItems: PropTypes.instanceOf(Set).isRequired,
      onHeaderClick: PropTypes.func
    }),
    pageSize: PropTypes.number,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ])
  };
  static defaultProps = {
    pageSize: 10
  };
  getSelectHeaderProps = () =>
    typeof this.props.select.onHeaderClick === 'function' ?
      {onClick: this.props.select.onHeaderClick} : {};
  handleToggleSelect = data => () => this.props.select.toggleSelect(data);
  render() {
    const {data, style, columns, select, pageSize, ...props} = this.props;
    const finalPageSize = Math.min(data.length, pageSize);
    const finalColumns = [].concat(
      select ? {
        Header: '',
        id: 'select',
        accessor: data => (
          <Checkbox
            checked={select.selectedItems.has(data.id)}
            onClick={this.handleToggleSelect(data)}
          />
        ),
        maxWidth: 30,
        style: styles.select,
        resizable: false,
        sortable: false,
        getHeaderProps: this.getSelectHeaderProps,
        headerStyle: {padding: 0}
      } : [],
      columns
    );
    return data.length ? (
      <ReactTable
        columnStyle={styles.column}
        columns={finalColumns}
        headerColumnStyle={styles.headerColumn}
        headerStyle={styles.header}
        pageSize={finalPageSize}
        rowGroupStyle={styles.rowGroup}
        showPageJump={false}
        showPageSizeOptions={false}
        showPagination={finalPageSize < data.length}
        {...props}
        ExpanderComponent={
          <i className='material-icons' style={styles.expander}>
            {'arrow_drop_down'}
          </i>
        }
        LoadingComponent={Loading}
        data={data}
        style={[styles.container, style]}
        tableStyle={styles.table}
      />
    ) : null;
  }
};

const styles = {
  expander: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  table: {
    background: colors.backgroundLight,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderWidth: '1px 1px 0',
    overflow: 'none'
  },
  container: {
    flex: 1
  },
  column: {
    padding: `${minimal} ${minor}`,
    display: 'flex',
    alignItems: 'center',
    borderRight: `1px solid ${colors.gallery}`
  },
  headerColumn: {
    padding: `${minimal} ${minor}`,
    color: colors.foregroundLight,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    backgroundColor: colors.asphalt,
    boxShadow: '0 3px 6px rgba(0,0,0,0.14)'
  },
  select: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  rowGroup: {
    borderBottom: `1px solid ${colors.border}`
  }
};

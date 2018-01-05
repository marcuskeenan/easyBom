import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
// import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PartsCollection from '../../../api/Parts/Parts';
import Loading from '../../components/Loading/Loading';
import Tags from '../../components/Tags/Tags';


import './Parts.scss';

const handleRemove = (partId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('parts.remove', partId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Part deleted!', 'success');
      }
    });
  }
};

const imageFormatter = cell => (<img className="img-tn" src={cell} alt="pic" />);

const selectRow = {
  mode: 'checkbox',
  bgColor: 'rgb(238, 193, 213)',
};

const options = {
  clearSearch: true,
};


const linkFormatter = (cell, row) => (<Link to={`parts/${row._id}`}>{cell}</Link>);

const priceFormatter = (cell) => {
  if (isNaN(`${cell}`)) {
    return 'no cost listed';
  }
  return `<i>$</i>${cell}`;
};


const tagParser = (cell, row) => {
  let data = '<ol>\n';

  cell.map((tag) => {
    console.log(tag.id, tag.text);
    data += `<li>${tag.text}\n</li>`;
  });
  data += '</ol>';
  return data;
};

// <TableHeaderColumn width="30%" dataField="description">Description</TableHeaderColumn>
// manufacturer, manPartNumber, createdAt, updatedAt, name, description, vendors <TableHeaderColumn width='10%' dataField='action' export={ false }>Action</TableHeaderColumn>
const Parts = ({
  loading, parts, match, history,
}) => (!loading ? (
  <div className="Parts">
    <div className="page-header clearfix">
      <h4 className="pull-left">Parts</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Part</Link>
    </div>
    {parts.length ?
      <BootstrapTable
        data={parts}
        selectRow={selectRow}
        options={options}
        search
        multiColumnSearch
        exportCSV
        insertRow
        deleteRow
      >
        <TableHeaderColumn dataField="_id" isKey searchable={false} hidden export>Part ID</TableHeaderColumn>
        <TableHeaderColumn width="15%" dataField="imageURL" dataFormat={imageFormatter}>Image</TableHeaderColumn>
        <TableHeaderColumn width="30%" dataField="name" dataFormat={linkFormatter}>Part Name</TableHeaderColumn>
        <TableHeaderColumn width="10%" dataField="manufacturer">Manufacturer</TableHeaderColumn>
        <TableHeaderColumn width="15%" dataField="manPartNumber">MPC</TableHeaderColumn>
        <TableHeaderColumn width="10%" dataField="vendor" dataSort>Vendor</TableHeaderColumn>
        <TableHeaderColumn width="10%" dataField="cost" dataSort dataFormat={priceFormatter}>Cost</TableHeaderColumn>
        <TableHeaderColumn width="10%" dataField="tags" dataFormat={tagParser} dataSort>Tags</TableHeaderColumn>


      </BootstrapTable>
: <Alert bsStyle="warning">No parts yet!</Alert>}
  </div>
) : <Loading />);

Parts.propTypes = {
  loading: PropTypes.bool.isRequired,
  parts: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('parts');

  return {
    loading: !subscription.ready(),
    parts: PartsCollection.find().fetch(),
  };
})(Parts);

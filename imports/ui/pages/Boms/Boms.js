import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BomsCollection from '../../../api/Boms/Boms';
import Loading from '../../components/Loading/Loading';
import Tags from '../../components/Tags/Tags';


import './Boms.scss';

const handleRemove = (bomId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('boms.remove', bomId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Bom deleted!', 'success');
      }
    });
  }
};

// const imageFormatter = cell => (<img className="img-tn" src={cell} alt="pic" />);

const selectRow = {
  mode: 'checkbox',
  bgColor: 'rgb(238, 193, 213)',
};

const options = {
  clearSearch: true,
};


const linkFormatter = (cell, row) => (<Link to={`boms/${row._id}`}>{cell}</Link>);


/*
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
*/

const getOwnerName = (cell, row) => {
  const test = JSON.stringify(row);
  console.log(`${test}`);
  const name = Meteor.users.findOne(cell).profile.name;
  return `${name.first} ${name.last}`;
};

const formatTimeAgo = (cell) => {
  return timeago(cell);
};

// <TableHeaderColumn width="30%" dataField="description">Description</TableHeaderColumn>
// manufacturer, manBomNumber, createdAt, updatedAt, name, description, vendors <TableHeaderColumn width='10%' dataField='action' export={ false }>Action</TableHeaderColumn>
const Boms = ({
  loading, boms, match, history, users,
}) => (!loading ? (
  <div className="Boms">
    <div className="page-header clearfix">
      <h4 className="pull-left">Boms</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Bom</Link>
    </div>
    {boms.length ?
      <BootstrapTable
        data={boms}
        selectRow={selectRow}
        options={options}
        search
        multiColumnSearch
        exportCSV
        insertRow
        deleteRow
      >
        <TableHeaderColumn dataField="_id" isKey searchable={false} hidden export>Bom ID</TableHeaderColumn>
        <TableHeaderColumn width="30%" dataField="name" dataFormat={linkFormatter}>Bom Name</TableHeaderColumn>
        <TableHeaderColumn width="50%" dataField="description">Description</TableHeaderColumn>
        <TableHeaderColumn width="20%" dataField="owner" dataFormat={getOwnerName} dataSort>Owner</TableHeaderColumn>
        <TableHeaderColumn width="20%" dataField="createdAt" dataFormat={formatTimeAgo}dataSort>Created</TableHeaderColumn>
        <TableHeaderColumn width="20%" dataField="updatedAt" dataFormat={formatTimeAgo}dataSort>Last Update</TableHeaderColumn>
      </BootstrapTable>
: <Alert bsStyle="warning">No boms yet!</Alert>}
  </div>
) : <Loading />);

Boms.propTypes = {
  loading: PropTypes.bool.isRequired,
  boms: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('boms.list');

  return {
    loading: !subscription.ready(),
    boms: BomsCollection.find().fetch(),
    users: Meteor.users.find().fetch(),
  };
})(Boms);


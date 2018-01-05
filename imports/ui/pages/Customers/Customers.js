import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import CustomersCollection from '../../../api/Customers/Customers';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

import './Customers.scss';

const handleRemove = (customerId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('customers.remove', customerId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Customer deleted!', 'success');
      }
    });
  }
};

const Customers = ({
  loading, customers, match, history,
}) => (!loading ? (
  <div className="Customers">
    <div className="page-header clearfix">
      <h4 className="pull-left">Customers</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Customer</Link>
    </div>
    {customers.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Last Updated</th>
            <th>Created</th>
            <th>Owner</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {customers.map(({
            _id, title, createdAt, updatedAt,
          }) => (
            <tr key={_id}>
              <td>{title}</td>
              <td>{timeago(updatedAt)}</td>
              <td>{monthDayYearAtTime(createdAt)}</td>
              <td></td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => history.push(`${match.url}/${_id}`)}
                  block
                >
                  View
                </Button>
              </td>
              <td>
                <Button
                  bsStyle="danger"
                  onClick={() => handleRemove(_id)}
                  block
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <Alert bsStyle="warning">No customers yet!</Alert>}
  </div>
) : <Loading />);

Customers.propTypes = {
  loading: PropTypes.bool.isRequired,
  customers: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('customers');

  return {
    loading: !subscription.ready(),
    customers: CustomersCollection.find().fetch(),
  };
})(Customers);

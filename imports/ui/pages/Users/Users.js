import React from 'react';
import PropTypes from 'prop-types';
import { Table, Label, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

import './Users.scss';

const handleRemove = (userId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('users.remove', userId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
      }
    });
  }
};

const Users = ({
  loading, users, match, history,
}) => (!loading ? (
  <div className="Users">
    <div className="page-header clearfix">
      <h4 className="pull-left">Users</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add User</Link>
    </div>
    {users.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Role</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map(({
              _id, emails, roles, profile,
            }) => (
              <tr key={_id}>
                <td>{profile.name.first}</td>
                <td>{profile.name.last}</td>
                <td>{emails[0].address}</td>
                <td>{roles}</td>
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
      </Table> : <Alert bsStyle="warning">No users yet!</Alert>}
  </div>
) : <Loading />);
Users.propTypes = {
  loading: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users');
  return {
    loading: !subscription.ready(),
    users: Meteor.users.find().fetch(),
  };
})(Users);

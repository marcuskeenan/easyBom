/* eslint-disable jsx-a11y/no-href */

import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Counts } from 'meteor/tmeasday:publish-counts';
import Navigation from '../../components/Navigation/Navigation';
import Authenticated from '../../components/Authenticated/Authenticated';
import Public from '../../components/Public/Public';
import Index from '../../pages/Index/Index';
// Documents Route
import Documents from '../../pages/Documents/Documents';
import NewDocument from '../../pages/Documents/NewDocument';
import ViewDocument from '../../pages/Documents/ViewDocument';
import EditDocument from '../../pages/Documents/EditDocument';
// User Routes
import Signup from '../../pages/Signup/Signup';
import Login from '../../pages/Login/Login';
import Logout from '../../pages/Logout/Logout';
import VerifyEmail from '../../pages/VerifyEmail/VerifyEmail';
import RecoverPassword from '../../pages/RecoverPassword/RecoverPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import Notifications from '../../pages/Notifications/Notifications';
import NotFound from '../../pages/NotFound/NotFound';
import Footer from '../../components/Footer/Footer';
import Terms from '../../pages/Terms/Terms';
import Todos from '../../pages/Todos/Todos';
import Privacy from '../../pages/Privacy/Privacy';
import ExamplePage from '../../pages/ExamplePage/ExamplePage';
import VerifyEmailAlert from '../../components/VerifyEmailAlert/VerifyEmailAlert';
import Users from '../../pages/Users/Users';
import getUserName from '../../../modules/get-user-name';
// Customers Routes
import Customers from '../../pages/Customers/Customers';
// Parts Route
import Parts from '../../pages/Parts/Parts';
import NewPart from '../../pages/Parts/NewPart';
import ViewPart from '../../pages/Parts/ViewPart';
import EditPart from '../../pages/Parts/EditPart';

// Boms Route
import Boms from '../../pages/Boms/Boms';
import NewBom from '../../pages/Boms/NewBom';
import ViewBom from '../../pages/Boms/ViewBom';
import EditBom from '../../pages/Boms/EditBom';


import './App.scss';

const App = props => (
  <Router>
    {!props.loading ? (
      <div className="App">
        {props.authenticated ?
          <VerifyEmailAlert
            userId={props.userId}
            emailVerified={props.emailVerified}
            emailAddress={props.emailAddress}
          />
          : ''}
        <Navigation {...props} />
        <Grid>
          <Switch>
            <Route exact name="index" path="/" component={Index} />
            <Authenticated exact path="/users" component={Users} {...props} />
            <Authenticated exact path="/customers" component={Customers} {...props} />

            <Authenticated exact path="/documents" component={Documents} {...props} />
            <Authenticated exact path="/documents/new" component={NewDocument} {...props} />
            <Authenticated exact path="/documents/:_id" component={ViewDocument} {...props} />
            <Authenticated exact path="/documents/:_id/edit" component={EditDocument} {...props} />

            <Authenticated exact path="/parts" component={Parts} {...props} />
            <Authenticated exact path="/parts/new" component={NewPart} {...props} />
            <Authenticated exact path="/parts/:_id" component={ViewPart} {...props} />
            <Authenticated exact path="/parts/:_id/edit" component={EditPart} {...props} />

            <Authenticated exact path="/boms" component={Boms} {...props} />
            <Authenticated exact path="/boms/new" component={NewBom} {...props} />
            <Authenticated exact path="/boms/:_id" component={ViewBom} {...props} />
            <Authenticated exact path="/boms/:_id/edit" component={EditBom} {...props} />

            <Authenticated exact path="/profile" component={Profile} {...props} />
            <Authenticated exact path="/notifications" component={Notifications} {...props} />
            <Public path="/signup" component={Signup} {...props} />
            <Public path="/login" component={Login} {...props} />
            <Route path="/logout" component={Logout} {...props} />
            <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
            <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
            <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />
            <Route name="terms" path="/terms" component={Terms} />
            <Route name="todos" path="/todos" component={Todos} />
            <Route name="privacy" path="/privacy" component={Privacy} />
            <Route name="examplePage" path="/example-page" component={ExamplePage} />
            <Route component={NotFound} />
          </Switch>
        </Grid>
        <Footer />
      </div>
    ) : ''}
  </Router>
);

App.defaultProps = {
  userId: '',
  emailAddress: '',
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('app');
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    userId,
    emailAddress,
    emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true,
    unreadNotifications: Counts.get('app.unreadNotifications'),
  };
})(App);

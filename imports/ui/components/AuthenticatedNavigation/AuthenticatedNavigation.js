import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import Icon from '../Icon/Icon';
import Notifications from '../Notifications/Notifications';
import isMobile from '../../../modules/is-mobile';

import './AuthenticatedNavigation.scss';

class AuthenticatedNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showNotifications: false };
    this.handleShowNotifications = this.handleShowNotifications.bind(this);
    this.ignoredSelectors = [
      'Notifications__mark-all-as-read',
      'Notifications__notification-action',
      'ViewAllNotifications',
      'IconButton',
      'fa',
    ];
    this.isIgnored = this.isIgnored.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', (event) => {
      if (this.state.showNotifications && !this.isIgnored(event)) {
        this.setState({ showNotifications: false });
      }
    });
  }

  isIgnored(event) {
    const isViewAllLink = event.target.classList.contains('ViewAllNotifications');
    const isNotificationLink = (event.target && event.target.href && event.target.href.includes('notifications') && !isViewAllLink) || event.target.classList.contains('fa-globe');

    if (isNotificationLink) {
      event.preventDefault();
      return true;
    }

    return this.ignoredSelectors.indexOf(event.target.classList[0]) > -1;
  }

  handleShowNotifications(event) {
    if (!isMobile() && !this.isIgnored(event)) event.preventDefault();
    this.setState({ showNotifications: !this.state.showNotifications });
  }

  render() {
    const { name, unreadNotifications } = this.props;
    return (
      <div className="AuthenticatedNavigation">
        <Nav>
          <LinkContainer to="/documents">
            <NavItem eventKey={1} href="/documents">Documents</NavItem>
            
          </LinkContainer>
          <LinkContainer to="/users">
            <NavItem eventKey={1.1} href="/users">Systems</NavItem>
          </LinkContainer>
          <LinkContainer to="/customers">
            <NavItem eventKey={1.2} href="/customers">Devices</NavItem>
          </LinkContainer>
          <NavDropdown eventKey={2} title="Parts Catalog" id="user-nav-dropdown">
            <LinkContainer to="/parts">
              <NavItem eventKey={1.2} href="/parts"><i className="fa fa-list fa-fw" /> Parts</NavItem>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown eventKey={3} title="BOMS" id="user-nav-dropdown">
            <LinkContainer to="/boms">
              <NavItem eventKey={3.1} href="/boms">BOMS</NavItem>
            </LinkContainer>
          </NavDropdown>

        </Nav>
        <Nav pullRight>
          <span className="Notifications__popover">
            <LinkContainer to="/notifications" className="Notifications__popover-toggle">
              <NavItem eventKey={4} href="/notifications" onClick={this.handleShowNotifications}>
                {unreadNotifications > 0 ? <span className="Notifications__popover-toggle-badge">{unreadNotifications}</span> : ''}
                <span className="Notifications__popover-toggle-link">
                  <Icon icon="globe" /> <span>Notifications</span>
                </span>
              </NavItem>
            </LinkContainer>
            {this.state.showNotifications ? <Notifications showViewAll onSetShow={this.handleShowNotifications} /> : ''}
          </span>
          <NavDropdown eventKey={5} title={name} id="user-nav-dropdown">
            <LinkContainer to="/profile">
              <NavItem eventKey={5.1} href="/profile">Profile</NavItem>
            </LinkContainer>
            <MenuItem divider />
            <MenuItem eventKey={5.2} onClick={() => Meteor.logout()}>Logout</MenuItem>
            <NavDropdown eventKey={5.3} title="Admin" id="user-nav-dropdown">
              <LinkContainer to="/customers">
                <NavItem eventKey={5.4} href="/customers">Customers</NavItem>
              </LinkContainer>
              <LinkContainer to="/users">
                <NavItem eventKey={5.5} href="/customers">Users</NavItem>
              </LinkContainer>
            </NavDropdown>

          </NavDropdown>
        </Nav>
      </div>
    );
  }
}

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  unreadNotifications: PropTypes.number.isRequired,
};

export default AuthenticatedNavigation;

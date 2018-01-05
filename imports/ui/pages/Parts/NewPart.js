import React from 'react';
import PropTypes from 'prop-types';
import PartEditor from '../../components/PartEditor/PartEditor';

const NewPart = ({ history }) => (
  <div className="NewPart">
    <h4 className="page-header">New Part</h4>
    <PartEditor history={history} />
  </div>
);

NewPart.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewPart;

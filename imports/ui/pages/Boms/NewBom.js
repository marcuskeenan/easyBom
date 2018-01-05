import React from 'react';
import PropTypes from 'prop-types';
import BomEditor from '../../components/BomEditor/BomEditor';

const NewBom = ({ history }) => (
  <div className="NewBom">
    <h4 className="page-header">New Bom</h4>
    <BomEditor history={history} />
  </div>
);

NewBom.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewBom;

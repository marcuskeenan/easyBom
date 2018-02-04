import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Boms from '../../../api/Boms/Boms';
import BomAddParts from '../../components/BomEditor/BomAddParts';
import NotFound from '../NotFound/NotFound';

const AddPartsBom = ({ doc, history }) => (doc ? (
  <div className="EditBom">
    <h4 className="page-header">{`Add Parts to  "${doc.name}"`}</h4>
    <BomAddParts doc={doc} history={history} />
  </div>
) : <NotFound />);

AddPartsBom.defaultProps = {
  doc: null,
};

AddPartsBom.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const bomId = match.params._id;
  const subscription = Meteor.subscribe('boms.view', bomId);

  return {
    loading: !subscription.ready(),
    doc: Boms.findOne(bomId),
  };
})(AddPartsBom);

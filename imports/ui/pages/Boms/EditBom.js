import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Boms from '../../../api/Boms/Boms';
import BomEditor from '../../components/BomEditor/BomEditor';
import NotFound from '../NotFound/NotFound';

const EditBom = ({ doc, history }) => (doc ? (
  <div className="EditBom">
    <h4 className="page-header">{`Editing "${doc.name}"`}</h4>
    <BomEditor doc={doc} history={history} />
  </div>
) : <NotFound />);

EditBom.defaultProps = {
  doc: null,
};

EditBom.propTypes = {
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
})(EditBom);

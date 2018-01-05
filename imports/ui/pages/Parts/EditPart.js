import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Parts from '../../../api/Parts/Parts';
import PartEditor from '../../components/PartEditor/PartEditor';
import NotFound from '../NotFound/NotFound';

const EditPart = ({ doc, history }) => (doc ? (
  <div className="EditPart">
    <h4 className="page-header">{`Editing "${doc.name}"`}</h4>
    <PartEditor doc={doc} history={history} />
  </div>
) : <NotFound />);

EditPart.defaultProps = {
  doc: null,
};

EditPart.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const partId = match.params._id;
  const subscription = Meteor.subscribe('parts.view', partId);

  return {
    loading: !subscription.ready(),
    doc: Parts.findOne(partId),
  };
})(EditPart);

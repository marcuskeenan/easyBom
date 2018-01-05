import React from 'react';
import PropTypes from 'prop-types';


import { Alert, ButtonToolbar, ButtonGroup, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Boms from '../../../api/Boms/Boms';
import Parts from '../../../api/Parts/Parts';
import CommentsCollection from '../../../api/Comments/Comments';
import Comments from '../../components/Comments/Comments';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import Tags from '../../components/BomTags/Tags';
import BomPartsTable from '../../components/BomPartsTable/BomPartsTable';

import './ViewBom.scss';

const handleRemove = (bomId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('boms.remove', bomId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Bom deleted!', 'success');
        history.push('/boms');
      }
    });
  }
};

const handleFavorite = (documentId) => {
  Meteor.call('boms.favorite', documentId, (error) => {
    console.log(`The bom id is: ${documentId}`);
    if (error) {
      Bert.alert(error.reason, 'danger');
    }
  });
};

const popoverHoverDelete = (
  <Popover id="popover-trigger-hover-focus" title="Are you sure?">
    <strong>Holy guacamole! Clicking here will delete this bom!</strong>
  </Popover>
);

const popoverHoverFavorite = (
  <Popover id="popover-trigger-hover-focus" title="Favorite">
    <strong>Click here if you this is one of your favorite boms!</strong>
  </Popover>
);

const getOwnerName = (id) => {
  const name = Meteor.users.findOne(id).profile.name;
  return `${name.first} ${name.last}`;
};

const getOwnerCompany = (id) => {
  const company = 'company here'; // Meteor.users.findOne(id).profie.name.last;
  return `${company}`;
};

const renderBom = (doc, commentCount, comments, hasFavorited, match, history, tags, createdAt, updatedAt) => (doc ? (
  <div className="ViewBom">
    <div className="page-header clearfix">
      <div className="container">
        <div className="card">
          <div className="row">

            <div className="col-md-7">
              <div className="card-block">
                <h3 className="card-title">{ doc && doc.name }</h3>
                <h5 className="card-text"><strong>Description:</strong></h5><p> { doc && doc.description }</p>
                <h5 className="card-text"><strong>Owner:</strong> { doc && getOwnerName(doc.owner) }</h5>
                <h5 className="card-text"><strong>Company:</strong> { doc && getOwnerCompany(doc.owner) }</h5>
                <h5 className="card-text"><strong>Created At:</strong> { doc && monthDayYearAtTime(doc.createdAt)}</h5>
                <h5 className="card-text"><strong>Updated At:</strong> { doc && timeago(doc.updatedAt) }</h5>
                <h5 className="card-text"><strong>Cost:</strong> ${ doc && doc.cost}</h5>

              </div>
            </div>
          </div>
          <div className="row">
            <div className="float-md-right">
              <span className="btn-group pull-right">
                <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverFavorite}>
                  <Button onClick={() => handleFavorite(doc._id)}><i className={`fa fa-star ${hasFavorited ? 'text-primary' : ''}`} /></Button>
                </OverlayTrigger>
                <Button onClick={() => history.push(`${match.url}/edit`)}><i className="fa fa-pencil-square-o fa-lg" /> Edit
                </Button>
                <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverDelete}>
                  <Button onClick={() => handleRemove(doc._id, history)} className="btn btn-danger">
                    <i className="fa fa-trash-o fa-lg" /> Delete
                  </Button>
                </OverlayTrigger>
              </span>
            </div>
          </div>
          <hr />
          <div>
            {doc.parts.length ? <div /> : <Alert bsStyle="warning">No parts have been add to the BOM!</Alert>}
            <BomPartsTable
              bomId={doc._id}
              parts={doc.parts}
            />

          </div>
          <div className="row">
            <hr />
            <div className="float-md-left pull-left">
              <Tags
                documentId={doc._id}
                tags={doc.tags}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Comments
      documentId={doc._id}
      commentCount={commentCount}
      comments={comments}
    />
  </div>


) : <NotFound />);

const ViewBom = ({
  loading, doc, commentCount, comments, hasFavorited, match, history,
}) => (
  !loading ? renderBom(doc, commentCount, comments, hasFavorited, match, history) : <Loading />
);

ViewBom.defaultProps = {
  doc: null,
  commentCount: 0,
};

ViewBom.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  commentCount: PropTypes.number,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  // tags: PropTypes.array.isRequired,
};


export default withTracker(({ match }) => {
  const subscription1 = Meteor.subscribe('parts');
  const bomId = match.params._id;
  const documentId = bomId;
  const subscription = Meteor.subscribe('boms.view', bomId);


  return {
    loading: !subscription.ready() || !subscription1.ready(),
    doc: Boms.findOne(bomId),
    commentCount: Counts.get('documents.view.commentCount'),
    hasFavorited: !!Boms.findOne({ _id: documentId, favorites: { $in: [Meteor.userId()] } }),
    comments: CommentsCollection.find({ documentId, parent: { $exists: false } }).fetch(),
  };
})(ViewBom);

import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Counts } from 'meteor/tmeasday:publish-counts';
import Parts from '../../../api/Parts/Parts';
import CommentsCollection from '../../../api/Comments/Comments';
import Comments from '../../components/Comments/Comments';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import Tags from '../../components/Tags/Tags';

const handleRemove = (partId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('parts.remove', partId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Part deleted!', 'success');
        history.push('/parts');
      }
    });
  }
};

const handleFavorite = (documentId) => {
  Meteor.call('parts.favorite', documentId, (error) => {
    console.log(`The part id is: ${documentId}`);
    if (error) {
      Bert.alert(error.reason, 'danger');
    }
  });
};

const popoverHoverDelete = (
  <Popover id="popover-trigger-hover-focus" title="Are you sure?">
    <strong>Holy guacamole! Clicking here will delete this part!</strong>
  </Popover>
);

const popoverHoverFavorite = (
  <Popover id="popover-trigger-hover-focus" title="Favorite">
    <strong>Click here if you this is one of your favorite parts!</strong>
  </Popover>
);

const renderPart = (doc, commentCount, comments, hasFavorited, match, history, tags,) => (doc ? (
  <div className="ViewPart">
    <div className="page-header clearfix">
      <div className="container">
        <div className="card">
          <div className="row">
            <div className="col-md-5">
              <img src={doc.imageURL} className="img-tn" alt="pic" />
            </div>
            <div className="col-md-7">
              <div className="card-block">
                <h3 className="card-title">{ doc && doc.name }</h3>
                <h5 className="card-text"><strong>Description:</strong></h5><p> { doc && doc.description }</p>
                <h5 className="card-text"><strong>Manufacturer:</strong> { doc && doc.manufacturer }</h5>
                <h5 className="card-text"><strong>MPC:</strong> { doc && doc.manPartNumber }</h5>
                <h5 className="card-text"><strong>Vendor:</strong> { doc && doc.vendor }</h5>
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

const ViewPart = ({
  loading, doc, commentCount, comments, hasFavorited, match, history,
}) => (
  !loading ? renderPart(doc, commentCount, comments, hasFavorited, match, history) : <Loading />
);

ViewPart.defaultProps = {
  doc: null,
  commentCount: 0,
};

ViewPart.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  commentCount: PropTypes.number,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  //tags: PropTypes.array.isRequired,
};


export default withTracker(({ match }) => {
  const partId = match.params._id;
  const documentId = partId;
  const subscription = Meteor.subscribe('parts.view', partId);

  return {
    loading: !subscription.ready(),
    doc: Parts.findOne(partId),
    commentCount: Counts.get('documents.view.commentCount'),
    hasFavorited: !!Parts.findOne({ _id: documentId, favorites: { $in: [Meteor.userId()] } }),
    comments: CommentsCollection.find({ documentId, parent: { $exists: false } }).fetch(),
  };
})(ViewPart);

import React from 'react';
import PropTypes from 'prop-types';


import { Alert, ButtonToolbar, ButtonGroup, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Boms from '../../../api/Boms/Boms';
import Parts from '../../../api/Parts/Parts';
import CommentsCollection from '../../../api/Comments/Comments';
import Comments from '../../components/Comments/Comments';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import Tags from '../../components/BomTags/Tags';
import PartsTable from '../../components/PartsTable/PartsTable';

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

const popoverHoverAdd = (
  <Popover id="popover-trigger-hover-focus" title="Go for it!">
    <strong>Click here to add parts to your bom!</strong>
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

const cellEditProp = {
  mode: 'click',
  blurToSave: true,
  beforeSaveCell: onBeforeSaveCell, // a hook for before saving cell
  afterSaveCell: onAfterSaveCell,
  // a hook for after saving cell
};

const selectRow = {
  mode: 'checkbox',
  bgColor: 'rgb(238, 193, 213)',
};

const options = {
  clearSearch: true,
  afterDeleteRow: onAfterDeleteRow,
};


const getPartName = (cell, row) => {
  const name = cell;
  const id = row.id;
  const man = row.manufacturer;
  const mpn = row.manPartNumber;
  const text = `By: ${man}\nPart #: ${mpn}`;
  const newText = text.split('\n').map((item, i) => <p key={i}>  {item}</p>);
  return (<div><Link to={{ pathname: `/parts/${id}` }}>{name}</Link><br />
    {newText}
          </div>);
};

const imageFormatter = url => <img className="img-tn" src={url} alt="pic" />;


const priceFormatter = (value) => {
  if (isNaN(`${value}`)) {
    return 'no cost listed';
  }
  const formatedValue = parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${formatedValue}`;
};

const onAfterSaveCell = (row, cellName, cellValue) => {
  // this.setState(this.state);
  // getPartsData(this.state.data);
};

function onBeforeSaveCell(row, cellName, cellValue) {
  const bomId = row.bomId;
  const qty = parseFloat(cellValue);
  const part = { id: row.id, quantity: qty };
  console.log(`the part object is ${part}`);

  Meteor.call('boms.updatePart', bomId, part, (error) => {
    console.log('boms updatePart called from client');
    if (error) {
      Bert.alert(error.reason, 'danger');
      console.log("The update didn't work");
    }
  });

  return true;
}

function onAfterDeleteRow(rowKeys) {
  Meteor.call('boms.deletePart', this.doc._id, rowKeys, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
      console.log("The update didn't work");
    }
  });
  alert(`The rowkey you drop: ${rowKeys}`);
}

const handleDeleteRow = (bomId, rowKeys, name) => {
  const r = confirm(`Are you sure you want to remove ${name} from this BOM?`);
  if (r == true) {
    Meteor.call('boms.deletePart', bomId, rowKeys, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  } else {

  }
};

const renderDeleteButton = (cell, row) => {
  const bomId = row.bomId;
  const rowKey = [row.id];
  const name = row.name;
  return (<Button
    className="btn btn-xs btn-danger"
    onClick={() => handleDeleteRow(bomId, rowKey, name)}
  >
    <i className="fa fa-trash-o" />
          </Button>);
};

const getPartsData = (doc) => {
  const bomId = doc._id;
  const parts = doc.parts;
  const data = [];
  parts.map((p) => {
    const part = Parts.findOne({ _id: p.id });
    const quantity = p.quantity;
    const row = {
      bomId,
      id: p.id,
      image: part.imageURL,
      name: part.name,
      manufacturer: part.manufacturer,
      manPartNumber: part.manPartNumber,
      cost: priceFormatter(part.cost),
      quantity,
      total: priceFormatter(parseFloat(part.cost * quantity).toFixed(2)),
    };
    console.log(row);
    data.push(row);
  });
  return data;
};

// The function below needs to be fixed, the band-aid is checking to make sure it is not not a number. Why the extra loop?
const getPartsTotalCost = (doc) => {
  const bomId = doc._id;
  const parts = doc.parts;
  let data = 0;
  parts.forEach((p) => {
    const part = Parts.findOne({ _id: p.id });
    const quantity = p.quantity;
    const total = part.cost * quantity;
    console.log(total);
    if(total != NaN) {
      data += total;
      console.log(data);
    }
    
  });
  
  return priceFormatter(parseFloat(data));
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
                <h5 className="card-text"><strong>Version:</strong> v{ doc && doc.version}</h5>
                <h5 className="card-text"><strong>Owner:</strong> { doc && getOwnerName(doc.owner) }</h5>
                <h5 className="card-text"><strong>Company:</strong> { doc && doc.company }</h5>
                <h5 className="card-text"><strong>Created At:</strong> { doc && monthDayYearAtTime(doc.createdAt)}</h5>
                <h5 className="card-text"><strong>Updated At:</strong> { doc && timeago(doc.updatedAt) }</h5>
                <h5 className="card-text"><strong>Materials Cost:</strong> { doc && getPartsTotalCost(doc)}</h5>

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
            <BootstrapTable
              data={getPartsData(doc)}

              cellEdit={cellEditProp}
              // selectRow={selectRow}
              options={options}
              search
              multiColumnSearch
              bordered={false}
              exportCSV
            >
              <TableHeaderColumn dataField="id" isKey hidden searchable={false} export>id</TableHeaderColumn>
              <TableHeaderColumn dataField="bomId" hidden searchable={false}>bomId</TableHeaderColumn>
              <TableHeaderColumn width="15%" dataField="image" dataFormat={imageFormatter} dataAlign="left" editable={false}>Part</TableHeaderColumn>
              <TableHeaderColumn width="30%" dataField="name" dataSort dataFormat={getPartName} dataAlign="left" editable={false} />
              <TableHeaderColumn width="0%" dataField="manufacturer" dataSort dataAlign="left" editable={false}>Manufacturer</TableHeaderColumn>
              <TableHeaderColumn width="0%" dataField="manPartNumber" dataSort dataAlign="left" editable={false}>MPN</TableHeaderColumn>
              <TableHeaderColumn width="15%" dataField="cost" dataSort dataAlign="right" editable={false}>Cost</TableHeaderColumn>
              <TableHeaderColumn width="15%" dataField="quantity" editable={{ type: 'text' }} dataSort dataAlign="center">Qty</TableHeaderColumn>
              <TableHeaderColumn width="15%" dataField="total" dataSort dataAlign="right" editable={false}>Total</TableHeaderColumn>
              <TableHeaderColumn width="10%" dataField="id" dataFormat={renderDeleteButton} dataAlign="right" />
            </BootstrapTable>

          </div>

          <div className="row">
            <hr />
            <div className="float-md-right pull-right">
              <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverAdd}>
                <Button className="btn btn-primary" onClick={() => history.push(`${match.url}/bomaddparts`)}>
                  <i className="fa fa-plus fa-md" /> Add Parts
                </Button>
              </OverlayTrigger>
            </div>
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

import React from 'react';
import PropTypes from 'prop-types';
import Parts from '../../../api/Parts/Parts';


import { Alert, ButtonToolbar, ButtonGroup, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';


class BomPartsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parts: this.props.parts,
      bomId: this.props.bomId,

    };

    //this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    /*
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    */
  }

  render() {
    const { parts, bomId } = this.state;

    const cellEditProp = {
      mode: 'click',
      blurToSave: true,
      beforeSaveCell: onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: onAfterSaveCell, // a hook for after saving cell
    };

    const selectRow = {
      mode: 'checkbox',
      bgColor: 'rgb(238, 193, 213)',
    };

    const options = {
      clearSearch: true,
    };

    const getPartName = (id) => {
      const partName = Parts.findOne({ _id: id }).name;
      return <Link to={{ pathname: `/parts/${id}` }}>{partName}</Link>;
    };

    const getPartDescription = (id) => {
      const partDescription = Parts.findOne({ _id: id }).description;
      return `${partDescription}`;
    };

    const getPartManufacturer = (id) => {
      const partManufacturer = Parts.findOne({ _id: id }).manufacturer;
      return `${partManufacturer}`;
    };

    const getPartMPN = (id) => {
      const partMPN = Parts.findOne({ _id: id }).manPartNumber;
      return `${partMPN}`;
    };

    const imageFormatter = (id) => {
      const image = Parts.findOne({ _id: id }).imageURL;
      return <img className="img-tn" src={image} alt="pic" />;
    };

    const priceFormatter = (value) => {
      if (isNaN(`${value}`)) {
        return 'no cost listed';
      }
      return `<i>$</i>${value}`;
    };

    const getPartCost = (id, format = true) => {
      const cost = Parts.findOne({ _id: id }).cost;
      if (format) {
        return priceFormatter(`${cost}`);
      }
      return `${cost}`;
    };

    const getCostTotal = (cell, row) => {
      const cost = parseFloat(getPartCost(cell, false));
      const qty = parseFloat(row.quantity);
      const total = parseFloat(cost * qty).toFixed(2);
      return priceFormatter(total);
    };

    function onAfterSaveCell(row, cellName, cellValue) {

    }

    function onBeforeSaveCell(row, cellName, cellValue) {
      const partId = row.id;
      const qty = parseFloat(cellValue);
      const part = { id: partId, quantity: qty };
      console.log(`the part object is ${part}`);

      Meteor.call('boms.updatePart', bomId, part, (error) => {
        console.log("boms updatePart called from client");
        if (error) {
          Bert.alert(error.reason, 'danger');
          console.log("The update didn't work");
        }
      });

      return true;
    }

    return (
      <div>
        {bomId}
        <span><h3>Parts</h3>
          <BootstrapTable
            data={parts}
            cellEdit={cellEditProp}
            selectRow={selectRow}
            options={options}
            search
            multiColumnSearch
            exportCSV
            insertRow
            deleteRow
          >
            <TableHeaderColumn dataField="id" isKey searchable={false} export>Bom ID</TableHeaderColumn>
            <TableHeaderColumn width="10%" dataField="id" dataFormat={imageFormatter}>Image</TableHeaderColumn>
            <TableHeaderColumn width="30%" dataField="id" dataFormat={getPartName} dataSort>Part Name</TableHeaderColumn>
            <TableHeaderColumn width="30%" dataField="id" dataFormat={getPartManufacturer} dataSort>Manufacturer</TableHeaderColumn>
            <TableHeaderColumn width="20%" dataField="id" dataFormat={getPartMPN} dataSort>MPN</TableHeaderColumn>
            <TableHeaderColumn width="10%" dataField="quantity">QTY</TableHeaderColumn>
            <TableHeaderColumn width="10%" dataField="id" dataFormat={getPartCost}>Cost</TableHeaderColumn>
            <TableHeaderColumn width="10%" dataField="id" dataFormat={getCostTotal}>Total</TableHeaderColumn>
          </BootstrapTable>

        </span>
      </div>
    );
  }
}

BomPartsTable.defaultProps = {
  parts: [],
  bomId: { _id: '' },

};

BomPartsTable.propTypes = {
  parts: PropTypes.array,
  bomId: PropTypes.string,
};


export default BomPartsTable;

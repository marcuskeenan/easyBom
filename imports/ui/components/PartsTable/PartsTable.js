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


class PartsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parts: this.props.parts,
      bomId: this.props.bomId,
      data: [],

    };
  }

  getPartsData(parts) {
    const dataRows = [];
    parts.map(p => {
      const part = Parts.findOne({ _id: p.id });
      const quantity = p.quantity;
      const row = {
        id: p.id,
        image: part.imageURL,
        name: part.name,
        manufacturer: part.manufacturer,
        manPartNumber: part.manPartNumber,
        cost: priceFormatter(part.cost),
        quantity: quantity,
        total: priceFormatter(parseFloat(part.cost * quantity).toFixed(2)),
      }
      console.log(row);
      dataRows.push(row);

    });
    this.setState({dataRows});
  }

  componentDidMount() {
    getPartsData(this.state.parts)
  }
  render() {
    const { parts, bomId } = this.state;

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
      return <Link to={{ pathname: `/parts/${id}` }}>{name}</Link>;
    };


    const imageFormatter = (url) => {
      return <img className="img-tn" src={url} alt="pic" />;
    };

    const priceFormatter = (value) => {
      if (isNaN(`${value}`)) {
        return 'no cost listed';
      }
      return `$${value}`;
    };


    function onAfterSaveCell(row, cellName, cellValue) {
      //this.setState(this.state);
      getPartsData(this.state.data);
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
    function onAfterDeleteRow(rowKeys) {

      Meteor.call('boms.deletePart', bomId, rowKeys, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
          console.log("The update didn't work");
        }
      });
      alert('The rowkey you drop: ' + rowKeys);
    }



    return (
      <div>
        {bomId}
        <span><h3>Parts</h3>
          <BootstrapTable
            data={this.state.data}
            deleteRow={ true }
            cellEdit={cellEditProp}
            selectRow={selectRow}
            options={options}
            search
            multiColumnSearch
            exportCSV
            insertRow
            deleteRow
          >
            <TableHeaderColumn dataField="id" isKey searchable={false} export>id</TableHeaderColumn>
            <TableHeaderColumn width="10%" dataField="image" dataFormat={imageFormatter}>Image</TableHeaderColumn>
            <TableHeaderColumn width="30%" dataField="name" dataSort dataFormat={getPartName}>Part Name</TableHeaderColumn>
            <TableHeaderColumn width="30%" dataField="manufacturer" dataSort>Manufacturer</TableHeaderColumn>
            <TableHeaderColumn width="20%" dataField="manPartNumber" dataSort>MPN</TableHeaderColumn>
            <TableHeaderColumn width="10%" dataField="quantity">QTY</TableHeaderColumn>
            <TableHeaderColumn width="10%" dataField="cost">Cost</TableHeaderColumn>
            <TableHeaderColumn width="10%" dataField="total">Total</TableHeaderColumn>
          </BootstrapTable>

        </span>
      </div>
    );
  }
}

PartsTable.defaultProps = {
  parts: [],
  bomId: { _id: '' },

};

PartsTable.propTypes = {
  parts: PropTypes.array,
  bomId: PropTypes.string,
};


export default PartsTable;

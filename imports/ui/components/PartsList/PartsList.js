import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { WithContext as ReactPartsList } from 'react-partsList-input';

import './PartsList.scss';

class PartsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      partsList: this.props.partsList,
      documentId: this.props.documentId,
      // partsList: [{ id: 1, text: 'Thailand' }, { id: 2, text: 'India' }],
      suggestions: [],
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDelete(i) {
    const partsList = this.state.partsList;
    partsList.splice(i, 1);
    this.setState({ partsList });
    Meteor.call('parts.partsList', this.state.documentId, this.state.partsList, (error) => {
      console.log(`The part id is: ${partsList}`);
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  }

  handleAddition(partsList) {
    const partsList = this.state.partsList;
    partsList.push({
      id: partsList.length + 1,
      text: partsList,
    });
    this.setState({ partsList });
    console.log(`partsList from partsList component is ${this.state.partsList}`);
    Meteor.call('parts.partsList', this.state.documentId, this.state.partsList, (error) => {
      console.log(`The part id is: ${partsList}`);
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });


    console.log(partsList);
  }

  handleDrag(partsList, currPos, newPos) {
    const partsList = this.state.partsList;

    // mutate array
    partsList.splice(currPos, 1);
    partsList.splice(newPos, 0, partsList);

    // re-render
    this.setState({ partsList });
    Meteor.call('parts.partsList', this.state.documentId, this.state.partsList, (error) => {
      console.log(`The part id is: ${partsList}`);
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  }


  render() {
    const { partsList, suggestions, documentId } = this.state;
    return (
      <div>
        {documentId}
        <span><h3>PartsList</h3>
          <ReactPartsList
            partsList={partsList}
            suggestions={suggestions}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            handleDrag={this.handleDrag}
          />
        </span>
      </div>
    );
  }
}

PartsList.defaultProps = {
  partsList: { partsList: '' },
  documentId: { _id: '' },
};

PartsList.propTypes = {
  partsList: PropTypes.array,
  documentId: PropTypes.string,
};


export default PartsList;

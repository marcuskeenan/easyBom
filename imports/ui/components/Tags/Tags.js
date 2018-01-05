import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { WithContext as ReactTags } from 'react-tag-input';

import './Tags.scss';

class Tag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: this.props.tags,
      documentId: this.props.documentId,
      // tags: [{ id: 1, text: 'Thailand' }, { id: 2, text: 'India' }],
      suggestions: [],
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDelete(i) {
    const tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({ tags });
    Meteor.call('parts.tag', this.state.documentId, this.state.tags, (error) => {
      console.log(`The part id is: ${tags}`);
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  }

  handleAddition(tag) {
    const tags = this.state.tags;
    tags.push({
      id: tags.length + 1,
      text: tag,
    });
    this.setState({ tags });
    console.log(`tags from tag component is ${this.state.tags}`);
    Meteor.call('parts.tag', this.state.documentId, this.state.tags, (error) => {
      console.log(`The part id is: ${tags}`);
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });


    console.log(tags);
  }

  handleDrag(tag, currPos, newPos) {
    const tags = this.state.tags;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags });
    Meteor.call('parts.tag', this.state.documentId, this.state.tags, (error) => {
      console.log(`The part id is: ${tags}`);
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  }


  render() {
    const { tags, suggestions, documentId } = this.state;
    return (
      <div>
        {documentId}
        <span><h3>Tags</h3>
          <ReactTags
            tags={tags}
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

Tag.defaultProps = {
  tags: { tags: '' },
  documentId: { _id: '' },
};

Tag.propTypes = {
  tags: PropTypes.array,
  documentId: PropTypes.string,
};


export default Tag;

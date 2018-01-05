/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class BomEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        name: {
          required: true,
        },
        description: {
          required: true,
        },
        parts: {
          required: false,
        },
      },
      messages: {
        name: {
          required: 'Need a name in here, Seuss.',
        },
        description: {
          required: 'Please add bom description.',
        },
        parts: {
          required: 'Please add parts',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingBom = this.props.doc && this.props.doc._id;
    const methodToCall = existingBom ? 'boms.update' : 'boms.insert';
    const doc = {
      name: this.name.value.trim(),
      description: this.description.value.trim(),
      //parts: JSON.stringify(this.parts.value.trim()),
    };

    if (existingBom) doc._id = existingBom;

    Meteor.call(methodToCall, doc, (error, bomId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingBom ? 'Bom updated!' : 'Bom added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/boms/${bomId}`);
      }
    });
  
  }

  render() {
    const { doc } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="name"
            ref={name => (this.name = name)}
            defaultValue={doc && doc.name}
            placeholder=""
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <textarea
            rows="10"
            className="form-control"
            name="body"
            ref={description => (this.description = description)}
            defaultValue={doc && doc.description}
            placeholder=""
          />
        </FormGroup>

        <Button type="submit" bsStyle="success">
          {doc && doc._id ? 'Save Changes' : 'Add Bom'}
        </Button>
      </form>
    );
  }
}

BomEditor.defaultProps = {
  doc: {
    name: '', description: '',
  },
};

BomEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default BomEditor;

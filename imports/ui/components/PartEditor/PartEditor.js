/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class PartEditor extends React.Component {
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
        manufacturer: {
          required: true,
        },
        manPartNumber: {
          required: true,
        },
        vendor: {
          required: true,
        },
        cost: {
          required: true,
        },
        imageURL: {
          required: true,
        },
      },
      messages: {
        name: {
          required: 'Need a name in here, Seuss.',
        },
        description: {
          required: 'Please add part description.',
        },
        manufacturer: {
          required: 'Please add manufacturer',
        },
        manPartNumber: {
          required: 'Please add manufacturer part number',
        },
        vendor: {
          required: 'Please add vendor',
        },
        cost: {
          required: 'Please add cost',
        },
        imageURL: {
          required: 'Please add image',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingPart = this.props.doc && this.props.doc._id;
    const methodToCall = existingPart ? 'parts.update' : 'parts.insert';
    const doc = {
      name: this.name.value.trim(),
      description: this.description.value.trim(),
      manufacturer: this.manufacturer.value.trim(),
      manPartNumber: this.manPartNumber.value.trim(),
      vendor: this.vendor.value.trim(),
      cost: parseFloat(this.cost.value.trim()),
      imageURL: this.imageURL.value.trim(),
      //tags: this.tags.value.trim().split(','),
    };

    if (existingPart) doc._id = existingPart;

    Meteor.call(methodToCall, doc, (error, partId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingPart ? 'Part updated!' : 'Part added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/parts/${partId}`);
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
        <FormGroup>
          <ControlLabel>Manufacturer</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="manufacturer"
            ref={manufacturer => (this.manufacturer = manufacturer)}
            defaultValue={doc && doc.manufacturer}
            placeholder=""
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>MPN</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="manPartNumber"
            ref={manPartNumber => (this.manPartNumber = manPartNumber)}
            defaultValue={doc && doc.manPartNumber}
            placeholder=""
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Vendor</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="vendor"
            ref={vendor => (this.vendor = vendor)}
            defaultValue={doc && doc.vendor}
            placeholder=""
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Cost</ControlLabel>
          <input
            type="number"
            className="form-control"
            name="cost"
            ref={cost => (this.cost = cost)}
            defaultValue={doc && doc.cost}
            placeholder=""
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Image URL</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="imageURL"
            ref={imageURL => (this.imageURL = imageURL)}
            defaultValue={doc && doc.imageURL}
            placeholder=""
          />
        </FormGroup>
        <Button type="submit" bsStyle="success">
          {doc && doc._id ? 'Save Changes' : 'Add Part'}
        </Button>
      </form>
    );
  }
}

PartEditor.defaultProps = {
  doc: {
    name: '', description: '', manufacturer: '', manPartNumber: '', vendor: '', cost: '', imageURL: '',
  },
};

PartEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default PartEditor;

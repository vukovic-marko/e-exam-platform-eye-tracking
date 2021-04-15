import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CreateAreaOfInterestModal = (props) => {

    const [testDetails, setTestDetails] = useState({});
  
    const handleClose = () => {
        props.setShowModal(false);
    }

    const handleChange = e => {
        setTestDetails({
            ...testDetails,
            [e.target.name] : e.target.value
        })
    }

    const handleCreate = () => {
        props.createAreaOfInterest(testDetails);
    }

    return (
      <React.Fragment>  
        <Modal show={props.showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Area of Interest</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onChange={handleChange}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="string" name="caption" placeholder="Enter area of interest title" />
                </Form.Group>
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Dismiss
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Add Area
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }

export default CreateAreaOfInterestModal;

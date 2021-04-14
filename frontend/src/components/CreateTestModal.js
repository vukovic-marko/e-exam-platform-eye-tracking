import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CreateTestModal = (props) => {

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
        props.createTest(testDetails);
    }

    return (
      <React.Fragment>  
        <Modal show={props.showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Test</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onChange={handleChange}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Test Title</Form.Label>
                    <Form.Control type="string" name="title" placeholder="Enter test title" />
                </Form.Group>
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Dismiss
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create test
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }

export default CreateTestModal

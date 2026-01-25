import React, { useState } from 'react';
import { Form, FormGroup, Button, Row, Col, FormControl, InputGroup } from 'react-bootstrap';
import PreviewSearch from '../../shared/previewSearch/previewSearch';
import { MediaStatus, MediaType } from '../../utils/anilistInterfaces';

function ActivityCreator() {
  const [mediaTitle, setMediaTitle] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.BOTH);
  const [selectedMedia, setSelectedMedia] = useState<MediaStatus>(MediaStatus);

  // TODO: When media is selected with previewSearch, then also spit out the media entry. Use that to make the episode box a selector from 0 till max episodes / chapters.


  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(`Media Title: ${mediaTitle}`);
    console.log(`Status: ${status}`);
    console.log(`Progress: ${progress}`);
  };

  return (
    <div className="formContainer">
      <Form onSubmit={handleSubmit} id="activityCreatorForm">

        <div className="titleInput">
          <FormGroup controlId="animeTitleInput">
            <Form.Label>Title:</Form.Label>
            <PreviewSearch
              name="title"
              mediaType={mediaType}
              placeholder="Title of anime or manga"
              required
              className="aniInput"

            />
          </FormGroup>
        </div>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup controlId="statusSelect">
              <Form.Label>Status:</Form.Label>
              <FormControl as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Select Status</option>
                <option value={MediaStatus.PLANNING}>Planning</option>
                <option value={MediaStatus.CURRENT}>Current</option>
                <option value={MediaStatus.PAUSED}>Paused</option>
                <option value={MediaStatus.COMPLETED}>Completed</option>
                <option value={MediaStatus.DROPPED}>Dropped</option>
                <option value={MediaStatus.REPEATING}>Repeating</option>
              </FormControl>
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup controlId="progressInput">
              <Form.Label>Progress:</Form.Label>
              <InputGroup className={progress < 0 ? 'border-danger' : ''}>
                <FormControl type="number" onChange={(e) => setProgress(Number(e.target.value))} />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>

        <Button type="submit" className="aniSubmitButton" style={{ border: 'none' }}>
          Create Activity
        </Button>
      </Form>
    </div>
  );
}

export default ActivityCreator;
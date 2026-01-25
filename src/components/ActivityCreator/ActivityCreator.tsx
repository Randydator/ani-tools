import React, { useState } from 'react';
import { Form, FormGroup, Button, Row, Col, FormControl, InputGroup } from 'react-bootstrap';
import PreviewSearch from '../../shared/previewSearch/previewSearch';
import { MediaType } from '../../utils/anilistInterfaces';

function ActivityCreator() {
  const [mediaTitle, setMediaTitle] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.BOTH);

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
        
        <Button type="submit" className="aniSubmitButton" style={{ border: 'none' }}>
          Create Activity
        </Button>
      </Form>
    </div>
  );
}

export default ActivityCreator;
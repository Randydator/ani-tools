import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Button, Row, Col, FormControl, InputGroup } from 'react-bootstrap';
import PreviewSearch from '../../shared/previewSearch/previewSearch';
import { MediaStatus, MediaType, MediaPreview } from '../../utils/anilistInterfaces';
import './activityCreator.css'
import DomPurify from "dompurify"

function ActivityCreator() {
  const [progress, setProgress] = useState(0);
  const [selectedMediaMaxProgress, setSelectedMediaMaxProgress] = useState<number | null>(null)
  const [progressTitleText, setProgressTitleText] = useState<string>('Progress:')

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const searchPayload = Object.fromEntries(Array.from(new FormData(event.target).entries()).map(([key, value]) => [key, DomPurify.sanitize(value.toString().trim())]))
    console.log(searchPayload);
    console.log(event)
    
  };

  function handleProgressChange(event: React.ChangeEvent<HTMLInputElement>) { 
    const newProgress = Number(event.target.value);
    if (newProgress < 0) {
      setProgressTitleText("Progress: Can't be a negative number")
      setProgress(0);
    } else if (selectedMediaMaxProgress && newProgress > selectedMediaMaxProgress){
      setProgressTitleText("Progress: Can't be higher than max progress")
      setProgress(selectedMediaMaxProgress);
    }
    else if (!selectedMediaMaxProgress && newProgress > 0) {
      setProgressTitleText("Progress: Select Media title first")
      setProgress(0);
    }
    else {
      setProgressTitleText("Progress:")
      setProgress(newProgress);
    }
  }

  // MaxProgress was set to 12 through valid anime. MediaSelection changes, so we also need to reset the current input value to 0. (bcs max is now set to 1)
  useEffect(() => {
    setProgress(0);
  }, [selectedMediaMaxProgress])


  return (
    <div className="formContainer">
      <Form onSubmit={handleSubmit} className='activityCreatorForm'>

        <div className="titleInput">
          <FormGroup>
            <Form.Label>Title:</Form.Label>
            <PreviewSearch
              name="title"
              mediaType={MediaType.BOTH}
              placeholder="Title of anime or manga"
              required
              className="aniInput"
              onPreviewClicked={(media: MediaPreview) => {
                if (media){
                  setSelectedMediaMaxProgress(media.episodes ? media.episodes : media.chapters)
                } else {
                  setSelectedMediaMaxProgress(0)
                }
              }}
            />
          </FormGroup>
        </div>

        <FormGroup controlId="statusSelect">
          <Form.Label>Status:</Form.Label>
          <FormControl name="status"as="select">
            <option value="">Select Status</option>
            <option value={MediaStatus.PLANNING}>Planning</option>
            <option value={MediaStatus.CURRENT}>Current</option>
            <option value={MediaStatus.PAUSED}>Paused</option>
            <option value={MediaStatus.COMPLETED}>Completed</option>
            <option value={MediaStatus.DROPPED}>Dropped</option>
            <option value={MediaStatus.REPEATING}>Repeating</option>
          </FormControl>
        </FormGroup>

        <FormGroup controlId="progressInput">
          <Form.Label>{progressTitleText}</Form.Label>
          <InputGroup>
            <FormControl name="progress" type="number" max={selectedMediaMaxProgress ? selectedMediaMaxProgress + 1 : 1} min={-1} onChange={handleProgressChange} value={progress}/>
          </InputGroup>
        </FormGroup>
        
        <Button type="submit" className="aniSubmitButton" style={{ border: 'none' }}>
          Create Activity
        </Button>

<Button onClick={() => console.log(selectedMediaMaxProgress)}>Log Max Progress</Button>
      </Form>
    </div>
  );
}

export default ActivityCreator;
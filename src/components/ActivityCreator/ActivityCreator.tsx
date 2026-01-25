import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Button, FormControl, InputGroup } from 'react-bootstrap';
import PreviewSearch from '../../shared/previewSearch/previewSearch';
import { MediaStatus, MediaType, MediaPreview } from '../../utils/anilistInterfaces';
import './activityCreator.css'
import DomPurify from "dompurify"

function ActivityCreator() {
  const [progress, setProgress] = useState<number | string>('');
  const [status, setStatus] = useState<string>('');
  const [selectedMediaMaxProgress, setSelectedMediaMaxProgress] = useState<number | null>(null);

  // Error Messages
  const [titleErrorMsg, setTitleErrorMsg] = useState<string | null>(null);
  const [progressErrorMsg, setProgressErrorMsg] = useState<string | null>(null);
  const [statusErrorMsg, setStatusErrorMsg] = useState<string | null>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const titleValue = formData.get("title");

    let hasError = false;

    // Validate Title
    if (!titleValue || titleValue.toString().trim() === "") {
      setTitleErrorMsg("Please select a title");
      hasError = true;
    }

    // Validate Status
    if (!status) {
      setStatusErrorMsg("Please select a status");
      hasError = true;
    }

    if (status === MediaStatus.PLANNING && progress) {
      setProgressErrorMsg("Cannot set progress when planning an anime");
      hasError = true;
    }

    if (hasError) return;

    const searchPayload = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        DomPurify.sanitize(value.toString().trim())
      ])
    );

    console.log("Payload:", searchPayload);
  };

  function handleStatusChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setStatus(value);
    if (value) setStatusErrorMsg(null);
  }

  function handleProgressChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value;

    if (rawValue === '') {
      setProgress('');
      setProgressErrorMsg(null);
      return;
    }

    const newProgress = Number(rawValue);
    const max = selectedMediaMaxProgress ?? 0;

    if (newProgress < 0) {
      setProgressErrorMsg("Can't be negative");
      setProgress(0);
    } else if (selectedMediaMaxProgress !== null && newProgress > max) {
      setProgressErrorMsg(`Max is ${max}`);
      setProgress(max);
    } else if (selectedMediaMaxProgress === null && newProgress > 0) {
      setProgressErrorMsg("Select title first");
      setProgress(0);
    } else {
      setProgressErrorMsg(null);
      setProgress(newProgress);
    }
  }

  // MaxProgress was set to 12 through valid anime. MediaSelection changes, so we also need to reset the current input value to 0. (bcs max is now set to 1)
  useEffect(() => {
    setProgress('');
    setProgressErrorMsg(null);
    // Clear title error when a media is finally selected
    if (selectedMediaMaxProgress !== null) setTitleErrorMsg(null);
  }, [selectedMediaMaxProgress]);

  // Common style to prevent layout shifts
  const absoluteErrorStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '-22px',
    left: '0',
    fontSize: '0.85rem'
  };

  return (
    <div className="formContainer">
      <Form onSubmit={handleSubmit} className='activityCreatorForm' noValidate>

        <FormGroup className="mb-4 position-relative">
          <Form.Label>Title:</Form.Label>
          <PreviewSearch
            name="title"
            mediaType={MediaType.BOTH}
            placeholder="Title of anime or manga"
            required
            className={`aniInput ${titleErrorMsg ? 'is-invalid' : ''}`}
            onPreviewClicked={(media: MediaPreview) => {
              if (media) {
                setSelectedMediaMaxProgress(media.episodes ? media.episodes : media.chapters);
              } else {
                setSelectedMediaMaxProgress(0);
              }
            }}
          />
          {titleErrorMsg && (
            <div className="text-danger" style={absoluteErrorStyle}>
              {titleErrorMsg}
            </div>
          )}
        </FormGroup>

        <FormGroup controlId="statusSelect" className="mb-4 position-relative">
          <Form.Label>Status:</Form.Label>
          <FormControl
            name="status"
            as="select"
            value={status}
            onChange={handleStatusChange}
            isInvalid={!!statusErrorMsg}
          >
            <option value="">Select Status</option>
            <option value={MediaStatus.PLANNING}>Planning</option>
            <option value={MediaStatus.CURRENT}>Current</option>
            <option value={MediaStatus.PAUSED}>Paused</option>
            <option value={MediaStatus.COMPLETED}>Completed</option>
            <option value={MediaStatus.DROPPED}>Dropped</option>
            <option value={MediaStatus.REPEATING}>Repeating</option>
          </FormControl>
          <Form.Control.Feedback type="invalid" style={absoluteErrorStyle}>
            {statusErrorMsg}
          </Form.Control.Feedback>
        </FormGroup>

        <FormGroup controlId="progressInput" className="mb-4 position-relative">
          <Form.Label>Progress:</Form.Label>
          <InputGroup hasValidation>
            <FormControl
              name="progress"
              type="number"
              max={selectedMediaMaxProgress ? selectedMediaMaxProgress + 1 : 1}
              min={-1}
              onChange={handleProgressChange}
              value={progress}
              isInvalid={!!progressErrorMsg}
            />
            <Form.Control.Feedback type="invalid" style={absoluteErrorStyle}>
              {progressErrorMsg}
            </Form.Control.Feedback>
          </InputGroup>
        </FormGroup>

        <Button type="submit" className="aniSubmitButton mt-2" style={{ border: 'none', width: '100%' }}>
          Create Activity
        </Button>
      </Form>
    </div>
  );
}

export default ActivityCreator;
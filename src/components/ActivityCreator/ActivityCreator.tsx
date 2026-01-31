import { useEffect, useState } from 'react';
import { Form, FormGroup, Button, FormControl, InputGroup, Card } from 'react-bootstrap';
import PreviewSearch from '../../shared/previewSearch/previewSearch';
import { MediaStatus, MediaType, MediaPreview, ActivityCreatorSearchVariables } from '../../utils/anilistInterfaces';
import './activityCreator.css'
import DomPurify from "dompurify"
import { useActivityCreator } from './activityCreatorApi';

function ActivityCreator() {
  const [progress, setProgress] = useState<number | string>('');
  const [status, setStatus] = useState<string>('');
  const [selectedMediaPreview, setSelectedMediaPreview] = useState<MediaPreview | null>(null);

  const invalidNumberChars = ['e', 'E', '.', '+', '-', ','];

  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    error
  } = useActivityCreator();

  // Error Messages
  const [titleErrorMsg, setTitleErrorMsg] = useState<string | null>(null);
  const [progressErrorMsg, setProgressErrorMsg] = useState<string | null>(null);
  const [statusErrorMsg, setStatusErrorMsg] = useState<string | null>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const titleValue = formData.get("title");
    const media = selectedMediaPreview;
    let progressValue = Number(progress);

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

    if (!media || !media.type) {
      setTitleErrorMsg("Please select a media");
      // return bcs typescript doesn't understand that it is defined below
      return;
    }

    if (status === MediaStatus.PLANNING && progressValue) {
      setProgressErrorMsg("Cannot set progress when planning an anime");
      hasError = true;
    }

    if (status !== MediaStatus.PLANNING && !progressValue) {
      setProgressErrorMsg("Won't create an activity");
      hasError = true;
    }

    if (status === MediaStatus.COMPLETED && progressValue < (media.episodes ?? media.chapters ?? 0)) {
      setProgressErrorMsg(`Set to final progress count (${media.episodes ?? media.chapters ?? 0})`);
      hasError = true;
    }

    if (status !== MediaStatus.COMPLETED && (media.episodes ?? media.chapters ?? 0) === progressValue) {
      setProgressErrorMsg(`Set status to completed for final episode ${media.episodes ?? media.chapters ?? 0}`);
      hasError = true;
    }

    if (hasError) return;

    // AniList has a bug where episode count on paused creates an activity with messed up text
    if (status === MediaStatus.PAUSED && progress) {
      progressValue = 0
    }

    const mutationVariables: ActivityCreatorSearchVariables = {
      title: DomPurify.sanitize(titleValue?.toString().trim() || ""),
      status: status as MediaStatus,
      progress: Number(progress),
      // This is the clean way to handle the boolean from FormData
      noMerge: formData.has("noMerge"),
      type: media.type as MediaType
    };

    mutate(mutationVariables);
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
    const max = (selectedMediaPreview?.episodes ?? selectedMediaPreview?.chapters ?? 20000);

    if (newProgress < 0) {
      setProgressErrorMsg("Can't be negative");
      setProgress(0);
    } else if (selectedMediaPreview !== null && newProgress > max) {
      setProgressErrorMsg(`Max is ${max}`);
      setProgress(max);
    } else if (selectedMediaPreview === null && newProgress > 0) {
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
    if (selectedMediaPreview !== null) setTitleErrorMsg(null);
  }, [selectedMediaPreview]);

  // Common style to prevent layout shifts
  const absoluteErrorStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '-22px',
    left: '0',
    fontSize: '0.85rem'
  };

  return (
    <div className="formContainer">
      <Form.Label style={{ color: '#F0E68C', whiteSpace: 'pre-line' }}>
        {"Disclaimer: This will create a public activity.\nIt will not alter your existing media, only create a singular activity."}
      </Form.Label>
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
                setSelectedMediaPreview(media);
              } else {
                setSelectedMediaPreview(null);
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
              max={(selectedMediaPreview?.episodes ?? selectedMediaPreview?.chapters ?? 20000) + 1}
              min={-1}
              onChange={handleProgressChange}
              value={progress}
              isInvalid={!!progressErrorMsg}
              inputMode='numeric'
              pattern='[0-9]*'
              onKeyDown={(e) => {
                if (invalidNumberChars.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <Form.Control.Feedback type="invalid" style={absoluteErrorStyle}>
              {progressErrorMsg}
            </Form.Control.Feedback>
          </InputGroup>
        </FormGroup>

        <FormGroup controlId="checkboxInput">
          <Form.Check
            name="noMerge"
            label="Don't merge activity"
            type="checkbox"
          />
        </FormGroup>

        <Button type="submit" className="aniSubmitButton mt-2" style={{ border: 'none', width: '100%' }}>
          Create Activity
        </Button>
      </Form>

      <div>
        {isPending && (
          <Card className='activityCard'>
            <Card.Body>
              <Card.Title>
                <p>Loading...</p>
              </Card.Title>
            </Card.Body>
          </Card>
        )}
        {isError && (
          <Card className='activityCard'>
            <Card.Body>
              <Card.Title>
                <p>Error: {error.message}</p>
              </Card.Title>
            </Card.Body>
          </Card>
        )}
        {isSuccess && (
          <Card className='activityCard'>
            <Card.Body>
              <Card.Title>
                <p>Activity created!</p>
              </Card.Title>
            </Card.Body>
          </Card>
        )}
      </div>
    </div >
  );
}

export default ActivityCreator;
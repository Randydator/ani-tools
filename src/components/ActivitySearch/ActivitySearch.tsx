import { useState } from "react"
import { Form, FormGroup, Button} from "react-bootstrap"
import DomPurify from "dompurify"
import { Card } from "react-bootstrap"

import './activitySearch.css'
import { useActivitySearch } from "./activitySearchApi"
import ActivityCard from "./ActivityCard/ActivityCard"
import PreviewSearch from "../../shared/previewSearch/previewSearch"
import { MediaType } from "../../utils/anilistInterfaces"
import UserNameInput from "../../shared/userNameInput/usernameInput"

function ActivitySearch() {

  const [variables, setVariables] = useState({})
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.ANIME)
  const { isLoading, error, data } = useActivitySearch(variables)

  function handleMediaTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMediaType(event.target.value as MediaType)
  }

  const submitFunction = (event: any) => {
    event.preventDefault()
    // get all Form data, sanatize it and put it into an object
    const searchPayload = Object.fromEntries(Array.from(new FormData(event.target).entries()).map(([key, value]) => [key, DomPurify.sanitize(value.toString().trim())]))
    setVariables(searchPayload)
  }

  return (
    <div className="formContainer">
      <Form className="aniForm" onSubmit={submitFunction} id="activitySearchForm">

        <UserNameInput />

        <div>
          <FormGroup>
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

        <FormGroup controlId="typeSelect" onChange={handleMediaTypeChange}>
          <Form.Label>Type:</Form.Label>
          <div className="aniRadioButtons">
            <Form.Check
              type="radio"
              label={<label htmlFor="animeType">Anime</label>}
              name="type"
              value={MediaType.ANIME}
              defaultChecked
              id="animeType"
            />
            <Form.Check
              type="radio"
              label={<label htmlFor="mangaType">Manga</label>}
              name="type"
              value={MediaType.MANGA}
              id="mangaType"
            />
          </div>
        </FormGroup>

        <Button type="submit" className="aniSubmitButton" style={{ border: 'none' }}>
          Search
        </Button>
      </Form>

      <div>
        {isLoading && (
          <Card className='activityCard'>
            <Card.Body>
              <Card.Title>
                <p>Loading...</p>
              </Card.Title>
            </Card.Body>
          </Card>
        )}
        {error && (
          <Card className='activityCard'>
            <Card.Body>
              <Card.Title>
                <p>Error: {error.message}</p>
              </Card.Title>
            </Card.Body>
          </Card>
        )}
        {data && (
          <ActivityCard activities={data} />
        )}
      </div>
    </div>
  )
}

export default ActivitySearch
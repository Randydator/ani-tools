import { useState, useContext } from "react"
import { Form, FormGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import DomPurify from "dompurify"
import { Card } from "react-bootstrap"

import './activitySearch.css'
import { UserContext } from "../Header/UserContext"
import { useActivitySearch } from "./activitySearchApi"
import ActivityCard from "./ActivityCard/ActivityCard"
import { FaQuestionCircle } from "react-icons/fa"
import PreviewSearch from "../pageElements/previewSearch/previewSearch"
import { MediaType } from "../../utils/anilistInterfaces"

function ActivitySearch() {
  const user = useContext(UserContext)

  const [variables, setVariables] = useState({})
  const { isLoading, error, data } = useActivitySearch(variables)
  
  const submitFunction = (event: any) => {
    event.preventDefault()
    // get all Form data, sanatize it and put it into an object
    const searchPayload = Object.fromEntries(Array.from(new FormData(event.target).entries()).map(([key, value]) => [key, DomPurify.sanitize(value.toString())]))
    setVariables(searchPayload)
  }

  return (
    <div className="formContainer">
      <Form className="aniForm" onSubmit={submitFunction} id="activitySearchForm">

        <FormGroup controlId="usernameInput">
          <div className="iconLabel">
            <Form.Label>User: </Form.Label>
            <Form.Label style={{ flex: 1 }} />
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  Leaving this empty will search for your activities.
                </Tooltip>
              }
            >
              <Form.Label>
                <FaQuestionCircle className="icon" />
              </Form.Label>
            </OverlayTrigger>
          </div>

          <Form.Control name="username" type="text" placeholder={user?.username || ""} required={!user?.username} className="aniInput">
          </Form.Control>
        </FormGroup>

        <div className="titleInput">
          <FormGroup controlId="animeTitleInput">
            <Form.Label>Title:</Form.Label>
            <PreviewSearch
              name="title"
              type={MediaType.ANIME}
              placeholder="Title of anime or manga"
              required
              className="aniInput"
            />
          </FormGroup>
        </div>

        <FormGroup controlId="typeSelect">
          <Form.Label>Type:</Form.Label>
          <div className="aniRadioButtons">
            <Form.Check
              type="radio"
              label={<label htmlFor="animeType">Anime</label>}
              name="type"
              value="ANIME"
              defaultChecked
              id="animeType"
            />
            <Form.Check
              type="radio"
              label={<label htmlFor="mangaType">Manga</label>}
              name="type"
              value="MANGA"
              id="mangaType"
            />
          </div>
        </FormGroup>

        <Button type="submit" className="aniSubmitButton" style={{ border: 'none' }}>
          Search
        </Button>
      </Form>

      <div>
        {isLoading && <p>Loading...</p>}
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
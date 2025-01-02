import { useState, forwardRef } from "react"
import { Form, FormGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import { BsQuestionCircle } from "react-icons/bs"

import { useActivitySearch } from "./activitySearchApi"
import './activitySearch.css'

function ActivitySearch() {
  const [variables, setVariables] = useState({})
  const { isLoading, error, data } = useActivitySearch(variables)

  const submitFunction = (event: any) => {
    event.preventDefault()
    const searchPayload = Object.fromEntries(new FormData(event.target).entries())
    setVariables(searchPayload)
  }

  return (
    <div className="formContainer">
      <Form className="aniForm" onSubmit={submitFunction}>

        <FormGroup controlId="usernameInput">
          <div className="iconLabel">
            <Form.Label>User:</Form.Label>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  Leaving this empty will search your user.
                </Tooltip>
              }
            >
              <Form.Label>?</Form.Label>
            </OverlayTrigger>
          </div>

          <Form.Control name="username" type="text" placeholder="Username (optional)">
          </Form.Control>
        </FormGroup>

        <FormGroup controlId="animeTitleInput">
          <Form.Label>Title:</Form.Label>
          <Form.Control name="title" type="text" placeholder="Title of an anime or manga" required>
          </Form.Control>
        </FormGroup>

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

        <Button type="submit" style={{ color: 'var(--clr-surface-a0)', backgroundColor: 'var(--clr-primary-a0)' }}>
          Search
        </Button>
      </Form>

      <div>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error fetching data {error.message}. </p>}
        {data && (
          <div>
            <h3>Results:</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivitySearch
import React, { useState, useEffect } from 'react'
import { FormGroup, Form, FormLabel, FormControl, ListGroup, ListGroupItem } from 'react-bootstrap'
import { usePreviewSearch } from './previewSearchApi'
import { MediaType } from '../../../utils/anilistInterfaces';

function PreviewSearch({ type }: { type: MediaType }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchCompleted, setSearchCompleted] = useState(false);

    useEffect(() => {
        if (!searchTerm) {
            setSearchCompleted(false);
            return;
        }

        const timer = setTimeout(() => {
            setSearchCompleted(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    
    const { isLoading, error, data } = usePreviewSearch({ searchTerm: searchTerm, type: type }, searchCompleted)


    return (
        <>
            <Form>
                <FormGroup controlId="previewSearch">
                    <FormControl
                        name="previewSearch"
                        type="text"
                        placeholder="Title of anime or manga"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoComplete="off"
                    />
                </FormGroup>
            </Form>

            <div>
                {isLoading && <p>Loading...</p>}
                {error && (
                    <p>Error: {JSON.stringify(error)}</p>
                )}
                {data && (
                    <ListGroup>
                        {data.map((item, index) => (
                            <ListGroupItem key={index}>
                                {item.title.userPreferred }
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                )}
            </div>



        </>

    )
}
export default PreviewSearch



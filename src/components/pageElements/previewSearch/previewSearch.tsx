import { useState, useEffect, useRef } from 'react'
import { FormControl, ListGroup, ListGroupItem, Image } from 'react-bootstrap'
import { usePreviewSearch } from './previewSearchApi'
import { MediaType, MediaPreview } from '../../../utils/anilistInterfaces';
import './previewSearch.css'

type PreviewSearchProps = {
    type: MediaType,
    onPreviewClicked?: (item: any) => void
}

function PreviewSearch({ type, onPreviewClicked }: PreviewSearchProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchCompleted, setSearchCompleted] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const timeBeforePopup = 1000;

    const onSearchboxClick = () => {
        setShowPopup(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setShowPopup(false);
        }
    }

    function handlePreviewClick(item: MediaPreview) {
        setSearchTerm(item.title.userPreferred)
        setShowPopup(false)

        // trigger callback for function given to element
        if (onPreviewClicked) {
            onPreviewClicked(item);
        }
    }

    // to remove popup on click outside
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // timer delay
    useEffect(() => {
        if (!searchTerm) {
            setSearchCompleted(false);
            return;
        }
        const timer = setTimeout(() => {
            setSearchCompleted(true);
        }, timeBeforePopup);

        return () => clearTimeout(timer);
    }, [searchTerm]);
    
    
    const { isLoading, error, data } = usePreviewSearch({ searchTerm: searchTerm, type: type }, searchCompleted)

    return (
        <div className='previewSearch' ref={containerRef}>
            <FormControl
                name="previewSearch"
                type="text"
                placeholder="Title of anime or manga"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onClick={onSearchboxClick}
                autoComplete="off"
            />

            <div className='popUp' hidden={!showPopup}>
                {isLoading && <p>Loading...</p>}
                {error && (
                    <p>An error occured. Maybe you are on timeout? Wait for a bit!</p>
                )}
                {data && (
                    <ListGroup className="listGroup">
                        {data.map((item, index) => (
                            <ListGroupItem key={index} className="listGroupItem" action onClick={() => handlePreviewClick(item)}>
                                <p>
                                    {item.title.userPreferred }
                                </p>
                                <Image src={item.coverImage.medium} width={50} height={60} rounded />
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                )}
            </div>
        </div>
    )
}

export default PreviewSearch


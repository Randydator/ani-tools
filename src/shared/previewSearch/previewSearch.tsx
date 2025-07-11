import { useState, useEffect, useRef } from 'react'
import { FormControl, ListGroup, ListGroupItem, Image } from 'react-bootstrap'
import { usePreviewSearch } from './previewSearchApi'
import { MediaType, MediaPreview } from '../../utils/anilistInterfaces';
import './previewSearch.css'
import DomPurify from "dompurify"
import useDebounce from './useDebounce';

type PreviewSearchProps = {
    type: MediaType,
    onPreviewClicked?: (item: any) => void
}

function PreviewSearch({ type, onPreviewClicked, ...props }: PreviewSearchProps & React.ComponentProps<typeof FormControl>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchCompleted, setSearchCompleted] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const onInputChange = () => {
        // here code that runs after debounce
        setSearchCompleted(true);
        console.log("State value:", searchTerm);
    };
    const debouncedOnChange = useDebounce(onInputChange);


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


    const { isLoading, error, data } = usePreviewSearch({ searchTerm: DomPurify.sanitize(searchTerm), type: type }, searchCompleted)

    // to set searchCompleted to false again after search
    useEffect(() => {
        setSearchCompleted(false);
    }, [data]);

    return (
        <div className='previewSearch' ref={containerRef}>
            <FormControl
                {...props}
                value={searchTerm}
                onChange={e => {
                    debouncedOnChange();
                    setSearchTerm(e.target.value)
                }}
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
                                    {DomPurify.sanitize(item.title.userPreferred)}
                                </p>
                                <Image src={DomPurify.sanitize(item.coverImage.medium)} width={50} height={60} rounded />
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                )}
            </div>
        </div>
    )
}
export default PreviewSearch

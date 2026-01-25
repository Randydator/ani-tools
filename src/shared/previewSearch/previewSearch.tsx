import { useState, useEffect, useRef, useCallback } from 'react'
import { FormControl, ListGroup, ListGroupItem, Image, Button } from 'react-bootstrap'
import { usePreviewSearch } from './previewSearchApi'
import { MediaType, MediaPreview } from '../../utils/anilistInterfaces';
import './previewSearch.css'
import DomPurify from "dompurify"
import useDebounce from './useDebounce';
import { handleKeyboardEvent } from './previewSearchKeyboardHandler';
import { FaTimes } from 'react-icons/fa';

type PreviewSearchProps = {
    mediaType: MediaType,
    onPreviewClicked?: (item: any) => void
}

function PreviewSearch({ mediaType: mediaType, onPreviewClicked, ...props }: PreviewSearchProps & React.ComponentProps<typeof FormControl>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchCompleted, setSearchCompleted] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const keyboardItemSelectCss = 'keyboardItemSelect';
    const isFirstArrowKeyInputRef = useRef(true); // when popup resets, the first arrow key press should always go to first item

    const { isLoading, error, data } = usePreviewSearch({ searchTerm: DomPurify.sanitize(searchTerm.trim()), type: mediaType }, searchCompleted)

    const resetPopUp = useCallback(() => {
        setShowPopup(false);
        isFirstArrowKeyInputRef.current = true
        const recommendationListItems = document.querySelectorAll('.listGroupItem');
        recommendationListItems.forEach((item) => {
            item.classList.remove(keyboardItemSelectCss);
        });
    }, [setShowPopup, isFirstArrowKeyInputRef, keyboardItemSelectCss]);

    const onInputChange = () => {
        // here code that runs after debounce
        setSearchCompleted(true);
    };
    const debouncedOnChange = useDebounce(onInputChange);

    function selectPreviewItem(item: MediaPreview) {
        setSearchTerm(item.title.userPreferred)
        resetPopUp();

        // to get previews for newly inserted searchTerm. This kinda doubles API calls, remove if that becomes an issue (because else it just comes back on new input > debounce)
        setSearchCompleted(true);

        // trigger callback for function given to element
        if (onPreviewClicked) {
            onPreviewClicked(item);
        }
    }

    function handleKeyboardEventWrapper(e: React.KeyboardEvent<HTMLInputElement>) {
        handleKeyboardEvent(e, showPopup, setShowPopup, isFirstArrowKeyInputRef, data, selectPreviewItem, keyboardItemSelectCss, resetPopUp);
    }

    // when mediaType changes but searchTerm is same, we want to re-run the search
    useEffect(() => {
        debouncedOnChange();
    }, [mediaType, debouncedOnChange]);

    // to remove popup on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                resetPopUp()
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [resetPopUp]);

    // to set searchCompleted to false again after search.
    // Note: When data already present and searchTerm changes, this gets set to false, then after debounce time to true again to trigger new search, then false again when new data arrives
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
                    setSearchTerm(e.target.value);
                    setShowPopup(true);  // Show popup when typing new text
                }}
                onClick={() => setShowPopup(true)} // For when you type, press enter before preview and then click on it again
                onFocus={() => setShowPopup(true)}
                onKeyDown={handleKeyboardEventWrapper}
                autoComplete="off"
            />

            {searchTerm && (
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                        setSearchTerm('');
                        setShowPopup(false);
                        if (onPreviewClicked) {
                            onPreviewClicked(null);
                        }
                    }}
                    className="clearButton"
                >
                    <FaTimes />
                </Button>
            )}

            <div className='popUp' hidden={!showPopup}>
                <ListGroup className="listGroup">
                    {isLoading && (
                        <ListGroupItem className="listGroupItem">
                            <p>Loading...</p>
                        </ListGroupItem>
                    )}
                    {error && (
                        <ListGroupItem className="listGroupItem">
                            <p>Error: {error.message}</p>
                        </ListGroupItem>
                    )}
                </ListGroup>
                {data && (
                    <ListGroup className="listGroup">
                        {data.map((item, index) => (
                            <ListGroupItem key={index} className="listGroupItem" onClick={() => selectPreviewItem(item)}>
                                <p>
                                    {DomPurify.sanitize(item.title.userPreferred)}
                                    {mediaType === "BOTH" && (
                                        <span className="entryTypeText">
                                            ({item.type})
                                        </span>
                                    )}
                                </p>
                                <Image src={DomPurify.sanitize(item.coverImage.medium)} width="50px" height="60px" rounded />
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                )}
            </div>
        </div>
    )
}
export default PreviewSearch

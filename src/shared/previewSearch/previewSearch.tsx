import { useState, useEffect, useRef, useCallback } from 'react'
import { FormControl, ListGroup, ListGroupItem, Image } from 'react-bootstrap'
import { usePreviewSearch } from './previewSearchApi'
import { MediaType, MediaPreview } from '../../utils/anilistInterfaces';
import './previewSearch.css'
import DomPurify from "dompurify"
import useDebounce from './useDebounce';
import { handleKeyboardEvent } from './previewSearchKeyboardHandler';

type PreviewSearchProps = {
    type: MediaType,
    onPreviewClicked?: (item: any) => void
}

// TODO: The hover effect can resize the image and scale it, looks wonky. Test case: Kobayashi-san Chi no Maidragon S: Mini Dra
// Search string with anime type. Enter to send search. Then switch type to manga. Then focus on the previewInput. It only executes "showPopup" but with key manga, there is nothing loaded, so no preview seen until input change

function PreviewSearch({ type, onPreviewClicked, ...props }: PreviewSearchProps & React.ComponentProps<typeof FormControl>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchCompleted, setSearchCompleted] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const keyboardItemSelectCss = 'keyboardItemSelect';
    const isFirstArrowKeyInputRef = useRef(true); // when popup resets, the first arrow key press should always go to first item

    const { isLoading, error, data } = usePreviewSearch({ searchTerm: DomPurify.sanitize(searchTerm.trim()), type: type }, searchCompleted)

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
        resetPopUp()

        // trigger callback for function given to element
        if (onPreviewClicked) {
            onPreviewClicked(item);
        }
    }

    function handleKeyboardEventWrapper(e: React.KeyboardEvent<HTMLInputElement>) {
        handleKeyboardEvent(e, showPopup, setShowPopup, isFirstArrowKeyInputRef, data, selectPreviewItem, keyboardItemSelectCss, resetPopUp);
    }

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
                    setSearchTerm(e.target.value);
                    setShowPopup(true);  // Show popup when typing new text
                }}
                onFocus={() => setShowPopup(true)}
                onKeyDown={handleKeyboardEventWrapper}
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
                            <ListGroupItem key={index} className="listGroupItem" onClick={() => selectPreviewItem(item)}>
                                <p>
                                    {DomPurify.sanitize(item.title.userPreferred)}
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

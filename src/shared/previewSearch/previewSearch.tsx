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
    const keyboardItemSelectCss = 'keyboardItemSelect';
    let selectedRecommendationItem: number = 0;
    let isFirstArrowKeyInput: boolean = true // when popup resets, the first arrow key press should always go to first item


    const { isLoading, error, data } = usePreviewSearch({ searchTerm: DomPurify.sanitize(searchTerm.trim()), type: type }, searchCompleted)

    function resetPopUp() {
        setShowPopup(false);
        isFirstArrowKeyInput = true
        const recommendationListItems = document.querySelectorAll('.listGroupItem');
        recommendationListItems.forEach((item) => {
            item.classList.remove(keyboardItemSelectCss);
        });
    }

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
            resetPopUp()
        }
    }

    function handlePreviewItemClick(item: MediaPreview) {
        setSearchTerm(item.title.userPreferred)
        resetPopUp()

        // trigger callback for function given to element
        if (onPreviewClicked) {
            onPreviewClicked(item);
        }
    }

    function handleKeyboardEvent(e: React.KeyboardEvent<HTMLInputElement>) {
        const recommendationListItems = document.querySelectorAll('.listGroupItem');
        if (recommendationListItems.length === 0) return;
        if (!showPopup) setShowPopup(true);

        function getSelectedItem() {
            return recommendationListItems[selectedRecommendationItem];
        }

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (!data) return;
                handlePreviewItemClick(data[selectedRecommendationItem]);
                break;
            case 'ArrowDown':
            case 'Tab':
                e.preventDefault();
                // if this is first arrow key input of opened popup
                if (isFirstArrowKeyInput) {
                    isFirstArrowKeyInput = false;
                    recommendationListItems[0].classList.add(keyboardItemSelectCss);
                    break;
                }
                getSelectedItem().classList.remove(keyboardItemSelectCss);
                selectedRecommendationItem = (selectedRecommendationItem + 1) % recommendationListItems.length;
                getSelectedItem().classList.add(keyboardItemSelectCss);
                getSelectedItem().scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                break;
            case 'ArrowUp':
                e.preventDefault();
                getSelectedItem().classList.remove(keyboardItemSelectCss);
                selectedRecommendationItem = (selectedRecommendationItem - 1 + recommendationListItems.length) % recommendationListItems.length;
                getSelectedItem().classList.add(keyboardItemSelectCss);
                getSelectedItem().scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                break;
            default:
                break;
        }
    }

    // to remove popup on click outside
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                onKeyDown={handleKeyboardEvent}
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
                            <ListGroupItem key={index} className="listGroupItem" onClick={() => handlePreviewItemClick(item)}>
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

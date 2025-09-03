import type { MediaPreview } from '../../utils/anilistInterfaces';

let selectedRecommendationItem: number = 0;

// TODO: Sometimes cant press enter even tho selected :/ Stress test a bit.

export function handleKeyboardEvent(
    e: React.KeyboardEvent<HTMLInputElement>,
    showPopup: boolean, setShowPopup: React.Dispatch<React.SetStateAction<boolean>>,
    isFirstArrowKeyInputRef: React.MutableRefObject<boolean>, data: MediaPreview[] | undefined,
    selectPreviewItem: (item: MediaPreview) => void,
    keyboardItemSelectCss: string,
    resetPopUp: () => void
) {
    if (['Enter', 'ArrowDown', 'Tab', 'ArrowUp'].includes(e.key)) {
        const recommendationListItems = document.querySelectorAll('.listGroupItem');

        // in case enter is pressed before api has returned data (it executes default form submit after this)
        if (e.key === 'Enter' && recommendationListItems.length === 0) {
            resetPopUp();
            selectedRecommendationItem = 0;
            console.info('Enter normal function case, no recommendation items');
            return;
        }

        if (recommendationListItems.length === 0) return;
        if (!showPopup) setShowPopup(true);

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (!data) return;
                console.debug('Enter selecting item case', selectedRecommendationItem, data[selectedRecommendationItem]);
                selectPreviewItem(data[selectedRecommendationItem]);
                //resetPopUp();
                break;

            case 'ArrowDown':
            case 'Tab':
            case 'ArrowUp':
                e.preventDefault();
                // if this is first arrow key input of opened popup
                if (isFirstArrowKeyInputRef.current) {
                    isFirstArrowKeyInputRef.current = false;
                    recommendationListItems[0].classList.add(keyboardItemSelectCss);
                    break;
                }
                getSelectedItem(recommendationListItems).classList.remove(keyboardItemSelectCss);

                if (e.key === 'ArrowUp' ) {
                    selectedRecommendationItem = (selectedRecommendationItem - 1 + recommendationListItems.length) % recommendationListItems.length;
                } else {
                    selectedRecommendationItem = (selectedRecommendationItem + 1) % recommendationListItems.length;
                }

                getSelectedItem(recommendationListItems).classList.add(keyboardItemSelectCss);
                getSelectedItem(recommendationListItems).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                break;
        }
    }
}

function getSelectedItem(items: NodeListOf<Element>) {
    return items[selectedRecommendationItem];
}
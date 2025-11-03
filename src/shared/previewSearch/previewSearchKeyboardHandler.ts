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

        // If enter is pressed and there are no preview items (meaning preview is closed, search term is filled)
        // Or in case enter is pressed before api has returned data (it executes default form submit after this)
        // Or if the popup is not visible (meaning we're trying to submit the form)
        if (e.key === 'Enter' && (!showPopup || recommendationListItems.length === 0)) {
            resetPopUp();
            selectedRecommendationItem = 0;
            return;
        }

        if (recommendationListItems.length === 0) return;
        if (!showPopup) setShowPopup(true);

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (!data) return;
                selectPreviewItem(data[selectedRecommendationItem]);
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
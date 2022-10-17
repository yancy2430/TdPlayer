/*
See LICENSE.txt for this sample’s licensing information.

Abstract:
This class handles presenting the List template "Segment Bar" and "Tumbler" examples
*/

class ListController extends DocumentController {

    setupDocument(document) {
        super.setupDocument(document);

		// Resolve related content on highlight
		let listItemLockupElem = document.getElementsByTagName('listItemLockup');
		for (let i = 0, lockupElem; i < listItemLockupElem.length; ++i) {
			lockupElem = listItemLockupElem.item(i);
			lockupElem.addEventListener('highlight', (event) => this.handleListItemHighlightEvent(event));
		}

        let listElem = document.getElementsByTagName('list').item(0);
        let selectorElem = findSelectorElement();

        if (selectorElem) {
            this.handleSelectorBarHighightEvent(selectorElem.firstChild);
            selectorElem.addEventListener('highlight', (event) => this.handleSelectorBarHighightEvent(event));
        }

        function findSelectorElement() {
            let tumblerBarElems = document.getElementsByTagName('tumblerBar');
            if (tumblerBarElems.length) {
                return tumblerBarElems.item(0);
            }
            let segmentBarElems = document.getElementsByTagName('segmentBar');
            if (segmentBarElems.length) {
                return segmentBarElems.item(0);
            }
        }
    }

    handleListItemHighlightEvent(event) {
        let lockupElem = event.target;
        let ownerDocument = lockupElem.ownerDocument;

        let relatedContentURLElems = lockupElem.getElementsByTagName('relatedContentURL');
        if (relatedContentURLElems.length) {
            let relatedContentURL = relatedContentURLElems.item(0).textContent;
            this._documentLoader.fetch({
                url: relatedContentURL,
                success: showRelatedContentDocument
            });
        }

        function showRelatedContentDocument(relatedContentDocument) {
            let placeholderElems = lockupElem.getElementsByTagName('placeholder');
            while (placeholderElems.length) {
                lockupElem.removeChild(placeholderElems.item(0));
            }
            let relatedContentElems = lockupElem.getElementsByTagName('relatedContent');
            while (relatedContentElems.length) {
                lockupElem.removeChild(relatedContentElems.item(0));
            }

            let relatedContentDocumentElement = ownerDocument.adoptNode(relatedContentDocument.documentElement);
            let relatedContentElement = ownerDocument.createElement('relatedContent');
            relatedContentElement.appendChild(relatedContentDocumentElement);
            lockupElem.appendChild(relatedContentElement);
        }
    }

    handleSelectorBarHighightEvent(event) {
        let targetElem = event.target || event;
        let document = targetElem.ownerDocument;

        clearResults();

        let listElem = document.getElementsByTagName('list').item(0);
        let sectionElem = document.createElement('section');
        let newItemsCount = targetElem.getAttribute("numberOfItemsToCreate");
        for (let i = 1, lockupElem; i <= newItemsCount; i++) {
            lockupElem = createResultLockup(i);
            sectionElem.appendChild(lockupElem);
        }
        listElem.appendChild(sectionElem);

        function clearResults() {
            let sectionElems = document.getElementsByTagName('section');
            for (let i = sectionElems.length - 1, elem; i >= 0; i--) {
                elem = sectionElems.item(i);
                elem.parentNode.removeChild(elem);
            }
        }

        function createResultLockup(i) {
            let lockupElem = document.createElement("listItemLockup");
            let titleElem = document.createElement("title");
            titleElem.textContent = 'Title ' + i;
            lockupElem.appendChild(titleElem);
            return lockupElem;
        }
    }

}

registerAttributeName('listDocumentURL', ListController);

/*
See LICENSE.txt for this sample’s licensing information.

Abstract:
This class handles presenting the Alert template examples.
*/

class ModalController extends DocumentController {

	handleDocument(document) {
		navigationDocument.presentModal(document);
	}

	handleEvent(event) {
		const targetElem = event.target;
		if (targetElem.tagName !== 'description') {
			navigationDocument.dismissModal();
		}
		else {
    		super.handleEvent(event);
		}
	}

}

// Prevent parent DocumentController from displaying the loadingTemplate
ModalController.preventDefaultLoadingDocument = true;

registerAttributeName('modalDocumentURL', ModalController);

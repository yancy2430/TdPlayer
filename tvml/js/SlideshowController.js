/*
See LICENSE.txt for this sample’s licensing information.

Abstract:
This function handles presenting the Slideshow API example.
*/

function SlideshowController({ documentLoader, documentURL: imageURLsString }) {
	const imageURLs = imageURLsString.split(/\s+/).map(documentLoader.prepareURL);
	Slideshow.start(imageURLs, { showSettings: false });
}

// Prevent the DocumentController to display loadingTemplate
SlideshowController.preventDefaultLoadingDocument = true;

registerAttributeName("slideshowImageURLs", SlideshowController);

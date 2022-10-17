/*
See LICENSE.txt for this sample’s licensing information.

Abstract:
This class handles presenting the Menu Bar template example.
*/
class MenuBarController extends DocumentController {

    fetchDocument(documentURL, loadingDocument) {
        this._documentLoader.fetch({
            url: documentURL,
            success: (menuBarDocument) => {

                const menuBarElem = menuBarDocument.getElementsByTagName("menuBar").item(0);
                menuBarElem.addEventListener("select", (event) => {
                    this.selectMenuItem(event.target);
                });

                // Pre-load the document for the initial focused menu item or first item,
                // before presenting the menuBarTemplate on navigation stack.
                // NOTE: Pre-loading is optional
                const initialMenuItemElem = this.findInitialMenuItem(menuBarElem);
                const initialMenuItemController = this.selectMenuItem(initialMenuItemElem, true, () => {
                    this.handleDocument(menuBarDocument, loadingDocument);
                });
            },
            error: (xhr) => {
                const alertDocument = createLoadErrorAlertDocument(documentURL, xhr, false);
                this.handleDocument(alertDocument, loadingDocument);
            }
        });
    }

    findInitialMenuItem(menuBarElem) {
        let highlightIndex = 0;
        const menuItemElems = menuBarElem.childNodes;

        return menuItemElems.item(highlightIndex);
    }

    handleEvent(event) {
        var self = this,
            ele = event.target,
            videoURL = ele.getAttribute("videoURL")
        if (videoURL) {
            AVPlayer(videoURL);
        }

        // var self = this,
        //     ele = event.target,
        //     videoURL = ele.getAttribute("videoURL")
        // if(videoURL) {
        //     var player = new Player();
        //     var playlist = new Playlist();
        //     var mediaItem = new MediaItem("video", "http://localhost:9002/upgcxcode/04/85/848258504/848258504-1-30011.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1664795420&gen=playurlv2&os=mcdn&oi=3751564900&trid=00002f8158ab364d4f0da80f46f49aac1681u&mid=0&platform=pc&upsig=c812556b5ce21bd30d1de84a2b1249d3&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&mcdnid=1002682&bvc=vod&nettype=0&orderid=0,3&agrr=1&bw=25349&logo=A0000001");
        //     player.playlist = playlist;
        //     player.addEventListener('playbackError', function(event){
        //         console.log(event)
        //     });
        //     player.playlist.push(mediaItem);
        //     player.play();
        // }
    }

    async present(menuBarFeature, document, menuItemElem) {
        try {
            document.addEventListener("select", this.handleEvent);
            menuBarFeature.setDocument(document, menuItemElem);
            const response = await this._documentLoader.ajax("http://localhost:9001/list", {}, "GET");
            const sectionTemplate = document.getElementsByTagName("section").item(0);
            const newItems = response.map((item) => {
                const dataItem = new DataItem("artwork", item.aid);
                dataItem.url = "http://localhost:9001/pic?url=" + encodeURIComponent(item.pic);
                console.log(dataItem.url)
                dataItem.title = item.title;
                dataItem.tname = item.issuer.name
                return dataItem;
            });
            sectionTemplate.dataItem = new DataItem();
            sectionTemplate.dataItem.setPropertyPath("images", newItems);
            console.log("test", newItems, sectionTemplate.dataItem, sectionTemplate)
        } catch (error) {
            console.error("Error:", error);
        }
    }

    selectMenuItem(menuItemElem, isInitialItem, doneCallback) {
        const menuBarElem = menuItemElem.parentNode;
        const menuBarFeature = menuBarElem.getFeature("MenuBarDocument");
        const existingDocument = menuBarFeature.getDocument(menuItemElem);

        if (!existingDocument) {
            const controllerOptions = resolveControllerFromElement(menuItemElem);
            if (controllerOptions) {
                if (!isInitialItem) {
                    menuBarFeature.setDocument(createLoadingDocument(), menuItemElem);
                }
                controllerOptions.documentLoader = this._documentLoader;
                const controllerClass = controllerOptions.type;
                const controller = new controllerClass(controllerOptions);
                controller.handleDocument = (document) => {
                    if (isInitialItem) {
                        this.present(menuBarFeature, document, menuItemElem);
                        // menuBarFeature.setDocument(document, menuItemElem);
                    } else {
                        this.present(menuBarFeature, document, menuItemElem);
                        // menuBarFeature.setDocument(document, menuItemElem);
                    }
                    doneCallback && doneCallback();
                };
            }
        }
    }

}

registerAttributeName('menuBarDocumentURL', MenuBarController);

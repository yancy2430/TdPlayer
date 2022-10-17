/*
See LICENSE.txt for this sample’s licensing information.

Abstract:
This class handles loading templates from a remote server.
*/

class DocumentLoader {

    constructor(baseURL) {
        // Bind callback methods to current context
        this.prepareURL = this.prepareURL.bind(this);
        this.prepareElement = this.prepareElement.bind(this);
        // Validate arguments
        if (typeof baseURL !== "string") {
            throw new TypeError("DocumentLoader: baseURL argument must be a string.");
        }
        this.baseURL = baseURL;
    }

    ajax(url, options, method = "GET"){
        if (typeof url == "undefined") {
            console.error("No url specified for the ajax.");
            throw new TypeError("A URL is required for making the ajax request.");
        }

        if (typeof options === "undefined" && typeof url === "object" && url.url) {
            options = url;
            url = options.url;
        } else if (typeof url !== "string") {
            console.error("No url/options specified for the ajax.");
            throw new TypeError(
                "Options must be an object for making the ajax request."
            );
        }

        // default options
        options = Object.assign({}, {
            responseType: "json",
        }, options, { method: method });

        console.log(
            `initiating ajax request... url: ${url}`,
            " :: options:",
            options
        );

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            // set response type
            if (options.responseType) {
                xhr.responseType = options.responseType;
            }
            // open connection
            xhr.open(
                options.method,
                url,
                typeof options.async === "undefined" ? true : options.async,
                options.user,
                options.password
            );
            // set headers
            Object.keys(options.headers || {}).forEach(function (name) {
                xhr.setRequestHeader(name, options.headers[name]);
            });
            // listen to the state change
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }

                if (xhr.status >= 200 && xhr.status <= 300) {
                    resolve(xhr.response);
                } else {
                    reject(xhr);
                }
            };
            // error handling
            xhr.addEventListener("error", () => reject(xhr));
            xhr.addEventListener("abort", () => reject(xhr));
            // send request
            xhr.send(options.data);
        });
    };
    /*
     * Helper method to request templates from the server
     */
    fetch(options) {
        if (typeof options.url !== "string") {
            throw new TypeError("DocumentLoader.fetch: url option must be a string.");
        }
        // Cancel the previous request if it is still in-flight.
        if (options.concurrent !== true) {
            this.cancelFetch();
        }
        // Parse the request URL
        const docURL = this.prepareURL(options.url);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", docURL);
        xhr.responseType = "document";
        xhr.onload = () => {
            const responseDoc = xhr.response;
            this.prepareDocument(responseDoc);
            if (typeof options.success === "function") {
                options.success(responseDoc);
            } else {
                navigationDocument.pushDocument(responseDoc);
            }
        };
        xhr.onerror = () => {
            if (typeof options.error === "function") {
                options.error(xhr);
            } else {
                const alertDocument = createLoadErrorAlertDocument(docURL, xhr, true);
                navigationDocument.presentModal(alertDocument);
            }
        };
        xhr.send();
        // Preserve the request so it can be cancelled by the next fetch
        if (options.concurrent !== true) {
            this._fetchXHR = xhr;
        }
    }

    /*
     * Helper method to cancel a running XMLHttpRequest
     */
    cancelFetch() {
        const xhr = this._fetchXHR;
        if (xhr && xhr.readyState !== XMLHttpRequest.DONE) {
            xhr.abort();
        }
        delete this._fetchXHR;
    }

    /*
     * Helper method to convert a relative URL into an absolute URL
     */
    prepareURL(url) {
        // Handle URLs relative to the "server root" (baseURL)
        if (url.indexOf("/") === 0) {
            url = this.baseURL + url.substr(1);
        }
        return url;
    }

    /*
     * Helper method to mangle relative URLs in XMLHttpRequest response documents
     */
    prepareDocument(document) {
        let imgElemsQuery = ".//*[@src | @srcset]";
        const ORDERED_NODE_SNAPSHOT_TYPE = 7;
        let imgElemsResult = document.evaluate(imgElemsQuery, document, null, ORDERED_NODE_SNAPSHOT_TYPE);
        for (let i = 0, elem; i < imgElemsResult.snapshotLength; ++i) {
            elem = imgElemsResult.snapshotItem(i);
            this.prepareElement(elem)
        }
    }

    /*
     * Helper method to mangle relative URLs in DOM elements
     */
    prepareElement(elem) {
        if (elem.hasAttribute("src")) {
            const rawSrc = elem.getAttribute("src");
            const parsedSrc = this.prepareURL(rawSrc);
            elem.setAttribute("src", parsedSrc);
        }
        if (elem.hasAttribute("srcset")) {
            const rawSrcSet = elem.getAttribute("srcset");
            const parsedSrcSet = rawSrcSet.split(/\s*,\s*/).map((source) => {
                source = source.trim();
                const [rawURL] = source.split(/\s+/, 1);
                const parsedURL = this.prepareURL(rawURL);
                const descriptor = source.substr(rawURL.length);
                if (descriptor.length) {
                    return parsedURL + " " + descriptor;
                } else {
                    return parsedURL;
                }
            }).join(", ");
            elem.setAttribute("srcset", parsedSrcSet);
        }
    }

}

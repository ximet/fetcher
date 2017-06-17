const REQUEST_AND_CONNECT_TIMEOUT = 30000;

const fetcher = (options) => {
    return new Promise((resolve, reject) => {
        const customOptions = parseOptions(options);

        let XHR = new XMLHttpRequest();

        XHR.open(customOptions.method, customOptions.url, true);
        XHR = getContentType(customOptions, XHR);
        XHR.timeout = REQUEST_AND_CONNECT_TIMEOUT;

        XHR.onreadystatechange = function () {
            const XHR_READY_STATE_DONE = 4;

            if (XHR.readyState === XHR_READY_STATE_DONE) {
                resolve({ target: { status: XHR.status, data: options.json ? JSON.parse(XHR.response) : XHR.response }});
            }
        };

        XHR.onload = resolve;
        XHR.loadend = resolve;

        XHR.onerror = reject;
        XHR.onabort = reject;
        XHR.ontimeout = reject;

        method(XHR, customOptions);
    });
};

//FIXME only get and post. Need update
const responseMethod = (XHR, options) => {
  options.method === 'GET' ? XHR.send() : XHR.send(new FormData(options.form));
}

const getContentType = (options, xhr) => {
    const boundary = String(Math.random()).slice(2);

    if(options.method === 'GET') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    else if(options.json) {
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    }
    else {
        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    }

    return xhr;
};

const parseOptions = (options) => {
    let currentOptions = {};

    if (typeof options !== "string") {
        currentOptions.url = options.url;
        currentOptions.method = options.method;
        currentOptions.json = options.json;
    }
    else {
        currentOptions.url = options;
        currentOptions.method = 'GET'
    }

    return currentOptions;
};

const streamFetch = (options, onStream) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 3) {
                const freshData = xhr.response.substr(xhr.seenBytes);

                xhr.seenBytes = xhr.responseText.length;
                onStream(freshData);
            }
        };

        xhr.onload = function() {
            const status = xhr.status;
            const type = xhr.getResponseHeader('content-type') || '';
            let body = xhr.responseText;


            if (status < 100 || status > 527) {
                return reject(new TypeError('Network request failed'));
            }
            if (type.indexOf('application/json') !== -1) {
                try {
                    body = JSON.parse(body);
                }
                catch(e) {
                    reject(new TypeError('Not correct JSON'));
                }
            }
            else if ('response' in xhr) {
                body = xhr.response;
            }

            const options = {
                status: status,
                statusText: xhr.statusText,
                body: body,
                xhr: xhr
            };

            resolve(options);
        };

        xhr.onerror = reject;

        XHR.open(customOptions.method, customOptions.url, true);

        XHR = getContentType(customOptions, XHR);

        xhr.send(options.body);
    });
};

module.exports = {
    fetcher, streamFetch
};

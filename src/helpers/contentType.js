const DEFAULT_CONTENT_TYPE = {
  html: 'text/html',
  json: 'application/json; charset=utf-8',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
}

const getContentType = (options, xhr) => {
    const boundary = String(Math.random()).slice(2);

    if(options.method === 'GET') {
        xhr.setRequestHeader(DEFAULT_CONTENT_TYPE.urlencoded);
    }
    else if(options.json) {
        xhr.setRequestHeader('Content-type', DEFAULT_CONTENT_TYPE.json);
    }
    else {
        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    }

    return xhr;
};

module.exports = {
  getContentType
}

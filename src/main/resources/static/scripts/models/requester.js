let requester = (() => {

    function makeRequest(method, url) {

        return {
            method: method,
            url: url
        };
    }

    function get(url) {
        return $.ajax(makeRequest('GET', url));
    }

    function post(url, data) {
        let req = makeRequest('POST', url);
        req.data = JSON.stringify(data);
        req.contentType = 'application/json';

        return $.ajax(req);
    }
    
    function update(url, data) {
        let req = makeRequest('PUT', url);
        req.data = JSON.stringify(data);
        req.contentType = 'application/json';

        return $.ajax(req);
    }
    
    function remove(url) {
        return $.ajax(makeRequest('DELETE', url));
    }

    return {
        get,
        post,
        update,
        remove
    };
})();

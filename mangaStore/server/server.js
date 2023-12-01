(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('http'), require('fs'), require('crypto')) :
        typeof define === 'function' && define.amd ? define(['http', 'fs', 'crypto'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Server = factory(global.http, global.fs, global.crypto));
}(this, (function (http, fs, crypto) {
    'use strict';

    function _interopDefaultLegacy(e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
    var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
    var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

    class ServiceError extends Error {
        constructor(message = 'Service Error') {
            super(message);
            this.name = 'ServiceError';
        }
    }

    class NotFoundError extends ServiceError {
        constructor(message = 'Resource not found') {
            super(message);
            this.name = 'NotFoundError';
            this.status = 404;
        }
    }

    class RequestError extends ServiceError {
        constructor(message = 'Request error') {
            super(message);
            this.name = 'RequestError';
            this.status = 400;
        }
    }

    class ConflictError extends ServiceError {
        constructor(message = 'Resource conflict') {
            super(message);
            this.name = 'ConflictError';
            this.status = 409;
        }
    }

    class AuthorizationError extends ServiceError {
        constructor(message = 'Unauthorized') {
            super(message);
            this.name = 'AuthorizationError';
            this.status = 401;
        }
    }

    class CredentialError extends ServiceError {
        constructor(message = 'Forbidden') {
            super(message);
            this.name = 'CredentialError';
            this.status = 403;
        }
    }

    var errors = {
        ServiceError,
        NotFoundError,
        RequestError,
        ConflictError,
        AuthorizationError,
        CredentialError
    };

    const { ServiceError: ServiceError$1 } = errors;


    function createHandler(plugins, services) {
        return async function handler(req, res) {
            const method = req.method;
            console.info(`<< ${req.method} ${req.url}`);

            // Redirect fix for admin panel relative paths
            if (req.url.slice(-6) == '/admin') {
                res.writeHead(302, {
                    'Location': `http://${req.headers.host}/admin/`
                });
                return res.end();
            }

            let status = 200;
            let headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            };
            let result = '';
            let context;

            // NOTE: the OPTIONS method results in undefined result and also it never processes plugins - keep this in mind
            if (method == 'OPTIONS') {
                Object.assign(headers, {
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Credentials': false,
                    'Access-Control-Max-Age': '86400',
                    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Authorization'
                });
            } else {
                try {
                    context = processPlugins();
                    await handle(context);
                } catch (err) {
                    if (err instanceof ServiceError$1) {
                        status = err.status || 400;
                        result = composeErrorObject(err.code || status, err.message);
                    } else {
                        // Unhandled exception, this is due to an error in the service code - REST consumers should never have to encounter this;
                        // If it happens, it must be debugged in a future version of the server
                        console.error(err);
                        status = 500;
                        result = composeErrorObject(500, 'Server Error');
                    }
                }
            }

            res.writeHead(status, headers);
            if (context != undefined && context.util != undefined && context.util.throttle) {
                await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
            }
            res.end(result);

            function processPlugins() {
                const context = { params: {} };
                plugins.forEach(decorate => decorate(context, req));
                return context;
            }

            async function handle(context) {
                const { serviceName, tokens, query, body } = await parseRequest(req);
                if (serviceName == 'admin') {
                    return ({ headers, result } = services['admin'](method, tokens, query, body));
                } else if (serviceName == 'favicon.ico') {
                    return ({ headers, result } = services['favicon'](method, tokens, query, body));
                }

                const service = services[serviceName];

                if (service === undefined) {
                    status = 400;
                    result = composeErrorObject(400, `Service "${serviceName}" is not supported`);
                    console.error('Missing service ' + serviceName);
                } else {
                    result = await service(context, { method, tokens, query, body });
                }

                // NOTE: currently there is no scenario where result is undefined - it will either be data, or an error object;
                // this may change with further extension of the services, so this check should stay in place
                if (result !== undefined) {
                    result = JSON.stringify(result);
                }
            }
        };
    }



    function composeErrorObject(code, message) {
        return JSON.stringify({
            code,
            message
        });
    }

    async function parseRequest(req) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const tokens = url.pathname.split('/').filter(x => x.length > 0);
        const serviceName = tokens.shift();
        const queryString = url.search.split('?')[1] || '';
        const query = queryString
            .split('&')
            .filter(s => s != '')
            .map(x => x.split('='))
            .reduce((p, [k, v]) => Object.assign(p, { [k]: decodeURIComponent(v) }), {});
        const body = await parseBody(req);

        return {
            serviceName,
            tokens,
            query,
            body
        };
    }

    function parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', (chunk) => body += chunk.toString());
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    resolve(body);
                }
            });
        });
    }

    var requestHandler = createHandler;

    class Service {
        constructor() {
            this._actions = [];
            this.parseRequest = this.parseRequest.bind(this);
        }

        /**
         * Handle service request, after it has been processed by a request handler
         * @param {*} context Execution context, contains result of middleware processing
         * @param {{method: string, tokens: string[], query: *, body: *}} request Request parameters
         */
        async parseRequest(context, request) {
            for (let { method, name, handler } of this._actions) {
                if (method === request.method && matchAndAssignParams(context, request.tokens[0], name)) {
                    return await handler(context, request.tokens.slice(1), request.query, request.body);
                }
            }
        }

        /**
         * Register service action
         * @param {string} method HTTP method
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        registerAction(method, name, handler) {
            this._actions.push({ method, name, handler });
        }

        /**
         * Register GET action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        get(name, handler) {
            this.registerAction('GET', name, handler);
        }

        /**
         * Register POST action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        post(name, handler) {
            this.registerAction('POST', name, handler);
        }

        /**
         * Register PUT action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        put(name, handler) {
            this.registerAction('PUT', name, handler);
        }

        /**
         * Register DELETE action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        delete(name, handler) {
            this.registerAction('DELETE', name, handler);
        }
    }

    function matchAndAssignParams(context, name, pattern) {
        if (pattern == '*') {
            return true;
        } else if (pattern[0] == ':') {
            context.params[pattern.slice(1)] = name;
            return true;
        } else if (name == pattern) {
            return true;
        } else {
            return false;
        }
    }

    var Service_1 = Service;

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var util = {
        uuid
    };

    const uuid$1 = util.uuid;


    const data = fs__default['default'].readdirSync('./data').reduce((p, c) => {
        const content = JSON.parse(fs__default['default'].readFileSync('./data/' + c));
        const collection = c.slice(0, -5);
        p[collection] = {};
        for (let endpoint in content) {
            p[collection][endpoint] = content[endpoint];
        }
        return p;
    }, {});

    const actions = {
        get: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            return responseData;
        },
        post: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            // TODO handle collisions, replacement
            let responseData = data;
            for (let token of tokens) {
                if (responseData.hasOwnProperty(token) == false) {
                    responseData[token] = {};
                }
                responseData = responseData[token];
            }

            const newId = uuid$1();
            responseData[newId] = Object.assign({}, body, { _id: newId });
            return responseData[newId];
        },
        put: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined) {
                Object.assign(responseData, body);
            }
            return responseData;
        },
        delete: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (responseData.hasOwnProperty(token) == false) {
                    return null;
                }
                if (i == tokens.length - 1) {
                    const body = responseData[token];
                    delete responseData[token];
                    return body;
                } else {
                    responseData = responseData[token];
                }
            }
        }
    };

    const dataService = new Service_1();
    dataService.get(':collection', actions.get);
    dataService.post(':collection', actions.post);
    dataService.put(':collection', actions.put);
    dataService.delete(':collection', actions.delete);


    var jsonstore = dataService.parseRequest;

    /*
     * This service requires storage and auth plugins
     */

    const userService = new Service_1();

    userService.post('register', onRegister);
    userService.post('login', onLogin);
    userService.get('logout', onLogout);
    // TODO: get user details

    function onRegister(context, tokens, query, body) {
        return context.auth.register(body);
    }

    function onLogin(context, tokens, query, body) {
        return context.auth.login(body);
    }

    function onLogout(context, tokens, query, body) {
        return context.auth.logout();
    }

    var users = userService.parseRequest;

    /*
     * This service requires storage and auth plugins
     */

    const { NotFoundError: NotFoundError$1, RequestError: RequestError$1, CredentialError: CredentialError$1, AuthorizationError: AuthorizationError$1 } = errors;


    const dataService$1 = new Service_1();
    dataService$1.get(':collection', get);
    dataService$1.post(':collection', post);
    dataService$1.put(':collection', put);
    dataService$1.delete(':collection', del);

    function validateRequest(context, tokens, query) {
        /*
        if (context.params.collection == undefined) {
            throw new RequestError('Please, specify collection name');
        }
        */
        if (tokens.length > 1) {
            throw new RequestError$1();
        }
    }

    function parseWhere(query) {
        const operators = {
            '<=': (prop, value) => record => record[prop] <= JSON.parse(value),
            '<': (prop, value) => record => record[prop] < JSON.parse(value),
            '>=': (prop, value) => record => record[prop] >= JSON.parse(value),
            '>': (prop, value) => record => record[prop] > JSON.parse(value),
            '=': (prop, value) => record => record[prop] == JSON.parse(value),
            ' like ': (prop, value) => record => record[prop].toLowerCase().includes(JSON.parse(value).toLowerCase()),
            ' in ': (prop, value) => record => JSON.parse(`[${/\((.+?)\)/.exec(value)[1]}]`).includes(record[prop]),
        };
        const pattern = new RegExp(`^(.+?)(${Object.keys(operators).join('|')})(.+?)$`, 'i');

        try {
            let clauses = [query.trim()];
            let check = (a, b) => b;
            let acc = true;
            if (query.match(/ and /gi)) {
                // inclusive
                clauses = query.split(/ and /gi);
                check = (a, b) => a && b;
                acc = true;
            } else if (query.match(/ or /gi)) {
                // optional
                clauses = query.split(/ or /gi);
                check = (a, b) => a || b;
                acc = false;
            }
            clauses = clauses.map(createChecker);

            return (record) => clauses
                .map(c => c(record))
                .reduce(check, acc);
        } catch (err) {
            throw new Error('Could not parse WHERE clause, check your syntax.');
        }

        function createChecker(clause) {
            let [match, prop, operator, value] = pattern.exec(clause);
            [prop, value] = [prop.trim(), value.trim()];

            return operators[operator.toLowerCase()](prop, value);
        }
    }


    function get(context, tokens, query, body) {
        validateRequest(context, tokens);

        let responseData;

        try {
            if (query.where) {
                responseData = context.storage.get(context.params.collection).filter(parseWhere(query.where));
            } else if (context.params.collection) {
                responseData = context.storage.get(context.params.collection, tokens[0]);
            } else {
                // Get list of collections
                return context.storage.get();
            }

            if (query.distinct) {
                const props = query.distinct.split(',').filter(p => p != '');
                responseData = Object.values(responseData.reduce((distinct, c) => {
                    const key = props.map(p => c[p]).join('::');
                    if (distinct.hasOwnProperty(key) == false) {
                        distinct[key] = c;
                    }
                    return distinct;
                }, {}));
            }

            if (query.count) {
                return responseData.length;
            }

            if (query.sortBy) {
                const props = query.sortBy
                    .split(',')
                    .filter(p => p != '')
                    .map(p => p.split(' ').filter(p => p != ''))
                    .map(([p, desc]) => ({ prop: p, desc: desc ? true : false }));

                // Sorting priority is from first ot last, therefore we sort from last to first
                for (let i = props.length - 1; i >= 0; i--) {
                    let { prop, desc } = props[i];
                    responseData.sort(({ [prop]: propA }, { [prop]: propB }) => {
                        if (typeof propA == 'number' && typeof propB == 'number') {
                            return (propA - propB) * (desc ? -1 : 1);
                        } else {
                            return propA.localeCompare(propB) * (desc ? -1 : 1);
                        }
                    });
                }
            }

            if (query.offset) {
                responseData = responseData.slice(Number(query.offset) || 0);
            }
            const pageSize = Number(query.pageSize) || 10;
            if (query.pageSize) {
                responseData = responseData.slice(0, pageSize);
            }

            if (query.select) {
                const props = query.select.split(',').filter(p => p != '');
                responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                function transform(r) {
                    const result = {};
                    props.forEach(p => result[p] = r[p]);
                    return result;
                }
            }

            if (query.load) {
                const props = query.load.split(',').filter(p => p != '');
                props.map(prop => {
                    const [propName, relationTokens] = prop.split('=');
                    const [idSource, collection] = relationTokens.split(':');
                    console.log(`Loading related records from "${collection}" into "${propName}", joined on "_id"="${idSource}"`);
                    const storageSource = collection == 'users' ? context.protectedStorage : context.storage;
                    responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                    function transform(r) {
                        const seekId = r[idSource];
                        const related = storageSource.get(collection, seekId);
                        delete related.hashedPassword;
                        r[propName] = related;
                        return r;
                    }
                });
            }

        } catch (err) {
            console.error(err);
            if (err.message.includes('does not exist')) {
                throw new NotFoundError$1();
            } else {
                throw new RequestError$1(err.message);
            }
        }

        return responseData;
    }

    function post(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length > 0) {
            throw new RequestError$1('Use PUT to update records');
        }

        let responseData;

        if (context.user) {
            body._ownerId = context.user._id;
        } else {
            throw new AuthorizationError$1();
        }

        try {
            responseData = context.storage.add(context.params.collection, body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function put(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;

        if (!context.user) {
            throw new AuthorizationError$1();
        }

        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        if (context.user._id !== existing._ownerId) {
            throw new CredentialError$1();
        }

        try {
            responseData = context.storage.set(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function del(context, tokens, query, body) {
        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;

        if (!context.user) {
            throw new AuthorizationError$1();
        }

        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        if (context.user._id !== existing._ownerId) {
            throw new CredentialError$1();
        }

        try {
            responseData = context.storage.delete(context.params.collection, tokens[0]);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }


    var data$1 = dataService$1.parseRequest;

    const imgdata = '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Td4DLneAwSddMiRH8tMU8nng/Yy+KQsM3AKBNbe35j5OH4A0dbV8AxwcAqMFyl73eHd3e2//nmn29wOGi3Kv+RixSgAAEkxpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjdjZDM3NWM3LTcwNmItNDlkMy1hOWRkLWNmM2Q3MmMwY2I4ZCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NGY2YTJlYy04ZjA5LTRkZTMtOTY3ZC05MTUyY2U5NjYxNTAiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMmE1NzI5Mi1kNmJkLTRlYjQtOGUxNi1hODEzYjMwZjU0NWYiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjEzMzAwNzI5NTMwNjQzIgogICBHSU1QOlZlcnNpb249IjIuMTAuMTIiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMvaVN0b2NrcGhvdG8iCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5pc3RvY2twaG90by5jb20vbGVnYWwvbGljZW5zZS1hZ3JlZW1lbnQ/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmwiPgogICA8aXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgIDxpcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvblNob3duPgogICA8aXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgIDxpcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpSZWdpc3RyeUlkPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjOTQ2M2MxMC05OWE4LTQ1NDQtYmRlOS1mNzY0ZjdhODJlZDkiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoV2luZG93cykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjEtMDItMTRUMTM6MDU6MjkiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogICA8cGx1czpJbWFnZVN1cHBsaWVyPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VTdXBwbGllcj4KICAgPHBsdXM6SW1hZ2VDcmVhdG9yPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VDcmVhdG9yPgogICA8cGx1czpDb3B5cmlnaHRPd25lcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkNvcHlyaWdodE93bmVyPgogICA8cGx1czpMaWNlbnNvcj4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgcGx1czpMaWNlbnNvclVSTD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL3Bob3RvL2xpY2Vuc2UtZ20xMTUwMzQ1MzQxLT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIvPgogICAgPC9yZGY6U2VxPgogICA8L3BsdXM6TGljZW5zb3I+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5WbGFkeXNsYXYgU2VyZWRhPC9yZGY6bGk+CiAgICA8L3JkZjpTZXE+CiAgIDwvZGM6Y3JlYXRvcj4KICAgPGRjOmRlc2NyaXB0aW9uPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5TZXJ2aWNlIHRvb2xzIGljb24gb24gd2hpdGUgYmFja2dyb3VuZC4gVmVjdG9yIGlsbHVzdHJhdGlvbi48L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpkZXNjcmlwdGlvbj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmWJCnkAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflAg4LBR0CZnO/AAAARHRFWHRDb21tZW50AFNlcnZpY2UgdG9vbHMgaWNvbiBvbiB3aGl0ZSBiYWNrZ3JvdW5kLiBWZWN0b3IgaWxsdXN0cmF0aW9uLlwvEeIAAAMxSURBVHja7Z1bcuQwCEX7qrLQXlp2ynxNVWbK7dgWj3sl9JvYRhxACD369erW7UMzx/cYaychonAQvXM5ABYkpynoYIiEGdoQog6AYfywBrCxF4zNrX/7McBbuXJe8rXx/KBDULcGsMREzCbeZ4J6ME/9wVH5d95rogZp3npEgPLP3m2iUSGqXBJS5Dr6hmLm8kRuZABYti5TMaailV8LodNQwTTUWk4/WZk75l0kM0aZQdaZjMqkrQDAuyMVJWFjMB4GANXr0lbZBxQKr7IjI7QvVWkok/Jn5UHVh61CYPs+/i7eL9j3y/Au8WqoAIC34k8/9k7N8miLcaGWHwgjZXE/awyYX7h41wKMCskZM2HXAddDkTdglpSjz5bcKPbcCEKwT3+DhxtVpJvkEC7rZSgq32NMSBoXaCdiahDCKrND0fpX8oQlVsQ8IFQZ1VARdIF5wroekAjB07gsAgDUIbQHFENIDEX4CQANIVe8Iw/ASiACLXl28eaf579OPuBa9/mrELUYHQ1t3KHlZZnRcXb2/c7ygXIQZqjDMEzeSrOgCAhqYMvTUE+FKXoVxTxgk3DEPREjGzj3nAk/VaKyB9GVIu4oMyOlrQZgrBBEFG9PAZTfs3amYDGrP9Wl964IeFvtz9JFluIvlEvcdoXDOdxggbDxGwTXcxFRi/LdirKgZUBm7SUdJG69IwSUzAMWgOAq/4hyrZVaJISSNWHFVbEoCFEhyBrCtXS9L+so9oTy8wGqxbQDD350WTjNESVFEB5hdKzUGcV5QtYxVWR2Ssl4Mg9qI9u6FCBInJRXgfEEgtS9Cgrg7kKouq4mdcDNBnEHQvWFTdgdgsqP+MiluVeBM13ahx09AYSWi50gsF+I6vn7BmCEoHR3NBzkpIOw4+XdVBBGQUioblaZHbGlodtB+N/jxqwLX/x/NARfD8ADxTOCKIcwE4Lw0OIbguMYcGTlymEpHYLXIKx8zQEqIfS2lGJPaADFEBR/PMH79ErqtpnZmTBlvM4wgihPWDEEhXn1LISj50crNgfCp+dWHYQRCfb2zgfnBZmKGAyi914anK9Coi4LOMhoAn3uVtn+AGnLKxPUZnCuAAAAAElFTkSuQmCC';
    const img = Buffer.from(imgdata, 'base64');

    var favicon = (method, tokens, query, body) => {
        console.log('serving favicon...');
        const headers = {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        };
        let result = img;

        return {
            headers,
            result
        };
    };

    var require$$0 = "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>SUPS Admin Panel</title>\r\n    <style>\r\n        * {\r\n            padding: 0;\r\n            margin: 0;\r\n        }\r\n\r\n        body {\r\n            padding: 32px;\r\n            font-size: 16px;\r\n        }\r\n\r\n        .layout::after {\r\n            content: '';\r\n            clear: both;\r\n            display: table;\r\n        }\r\n\r\n        .col {\r\n            display: block;\r\n            float: left;\r\n        }\r\n\r\n        p {\r\n            padding: 8px 16px;\r\n        }\r\n\r\n        table {\r\n            border-collapse: collapse;\r\n        }\r\n\r\n        caption {\r\n            font-size: 120%;\r\n            text-align: left;\r\n            padding: 4px 8px;\r\n            font-weight: bold;\r\n            background-color: #ddd;\r\n        }\r\n\r\n        table, tr, th, td {\r\n            border: 1px solid #ddd;\r\n        }\r\n\r\n        th, td {\r\n            padding: 4px 8px;\r\n        }\r\n\r\n        ul {\r\n            list-style: none;\r\n        }\r\n\r\n        .collection-list a {\r\n            display: block;\r\n            width: 120px;\r\n            padding: 4px 8px;\r\n            text-decoration: none;\r\n            color: black;\r\n            background-color: #ccc;\r\n        }\r\n        .collection-list a:hover {\r\n            background-color: #ddd;\r\n        }\r\n        .collection-list a:visited {\r\n            color: black;\r\n        }\r\n    </style>\r\n    <script type=\"module\">\nimport { html, render } from 'https://unpkg.com/lit-html?module';\nimport { until } from 'https://unpkg.com/lit-html/directives/until?module';\n\nconst api = {\r\n    async get(url) {\r\n        return json(url);\r\n    },\r\n    async post(url, body) {\r\n        return json(url, {\r\n            method: 'POST',\r\n            headers: { 'Content-Type': 'application/json' },\r\n            body: JSON.stringify(body)\r\n        });\r\n    }\r\n};\r\n\r\nasync function json(url, options) {\r\n    return await (await fetch('/' + url, options)).json();\r\n}\r\n\r\nasync function getCollections() {\r\n    return api.get('data');\r\n}\r\n\r\nasync function getRecords(collection) {\r\n    return api.get('data/' + collection);\r\n}\r\n\r\nasync function getThrottling() {\r\n    return api.get('util/throttle');\r\n}\r\n\r\nasync function setThrottling(throttle) {\r\n    return api.post('util', { throttle });\r\n}\n\nasync function collectionList(onSelect) {\r\n    const collections = await getCollections();\r\n\r\n    return html`\r\n    <ul class=\"collection-list\">\r\n        ${collections.map(collectionLi)}\r\n    </ul>`;\r\n\r\n    function collectionLi(name) {\r\n        return html`<li><a href=\"javascript:void(0)\" @click=${(ev) => onSelect(ev, name)}>${name}</a></li>`;\r\n    }\r\n}\n\nasync function recordTable(collectionName) {\r\n    const records = await getRecords(collectionName);\r\n    const layout = getLayout(records);\r\n\r\n    return html`\r\n    <table>\r\n        <caption>${collectionName}</caption>\r\n        <thead>\r\n            <tr>${layout.map(f => html`<th>${f}</th>`)}</tr>\r\n        </thead>\r\n        <tbody>\r\n            ${records.map(r => recordRow(r, layout))}\r\n        </tbody>\r\n    </table>`;\r\n}\r\n\r\nfunction getLayout(records) {\r\n    const result = new Set(['_id']);\r\n    records.forEach(r => Object.keys(r).forEach(k => result.add(k)));\r\n\r\n    return [...result.keys()];\r\n}\r\n\r\nfunction recordRow(record, layout) {\r\n    return html`\r\n    <tr>\r\n        ${layout.map(f => html`<td>${JSON.stringify(record[f]) || html`<span>(missing)</span>`}</td>`)}\r\n    </tr>`;\r\n}\n\nasync function throttlePanel(display) {\r\n    const active = await getThrottling();\r\n\r\n    return html`\r\n    <p>\r\n        Request throttling: </span>${active}</span>\r\n        <button @click=${(ev) => set(ev, true)}>Enable</button>\r\n        <button @click=${(ev) => set(ev, false)}>Disable</button>\r\n    </p>`;\r\n\r\n    async function set(ev, state) {\r\n        ev.target.disabled = true;\r\n        await setThrottling(state);\r\n        display();\r\n    }\r\n}\n\n//import page from '//unpkg.com/page/page.mjs';\r\n\r\n\r\nfunction start() {\r\n    const main = document.querySelector('main');\r\n    editor(main);\r\n}\r\n\r\nasync function editor(main) {\r\n    let list = html`<div class=\"col\">Loading&hellip;</div>`;\r\n    let viewer = html`<div class=\"col\">\r\n    <p>Select collection to view records</p>\r\n</div>`;\r\n    display();\r\n\r\n    list = html`<div class=\"col\">${await collectionList(onSelect)}</div>`;\r\n    display();\r\n\r\n    async function display() {\r\n        render(html`\r\n        <section class=\"layout\">\r\n            ${until(throttlePanel(display), html`<p>Loading</p>`)}\r\n        </section>\r\n        <section class=\"layout\">\r\n            ${list}\r\n            ${viewer}\r\n        </section>`, main);\r\n    }\r\n\r\n    async function onSelect(ev, name) {\r\n        ev.preventDefault();\r\n        viewer = html`<div class=\"col\">${await recordTable(name)}</div>`;\r\n        display();\r\n    }\r\n}\r\n\r\nstart();\n\n</script>\r\n</head>\r\n<body>\r\n    <main>\r\n        Loading&hellip;\r\n    </main>\r\n</body>\r\n</html>";

    const mode = process.argv[2] == '-dev' ? 'dev' : 'prod';

    const files = {
        index: mode == 'prod' ? require$$0 : fs__default['default'].readFileSync('./client/index.html', 'utf-8')
    };

    var admin = (method, tokens, query, body) => {
        const headers = {
            'Content-Type': 'text/html'
        };
        let result = '';

        const resource = tokens.join('/');
        if (resource && resource.split('.').pop() == 'js') {
            headers['Content-Type'] = 'application/javascript';

            files[resource] = files[resource] || fs__default['default'].readFileSync('./client/' + resource, 'utf-8');
            result = files[resource];
        } else {
            result = files.index;
        }

        return {
            headers,
            result
        };
    };

    /*
     * This service requires util plugin
     */

    const utilService = new Service_1();

    utilService.post('*', onRequest);
    utilService.get(':service', getStatus);

    function getStatus(context, tokens, query, body) {
        return context.util[context.params.service];
    }

    function onRequest(context, tokens, query, body) {
        Object.entries(body).forEach(([k, v]) => {
            console.log(`${k} ${v ? 'enabled' : 'disabled'}`);
            context.util[k] = v;
        });
        return '';
    }

    var util$1 = utilService.parseRequest;

    var services = {
        jsonstore,
        users,
        data: data$1,
        favicon,
        admin,
        util: util$1
    };

    const { uuid: uuid$2 } = util;


    function initPlugin(settings) {
        const storage = createInstance(settings.seedData);
        const protectedStorage = createInstance(settings.protectedData);

        return function decoreateContext(context, request) {
            context.storage = storage;
            context.protectedStorage = protectedStorage;
        };
    }


    /**
     * Create storage instance and populate with seed data
     * @param {Object=}  Associative array with data. Each property is an object with properties in format {key: value}
     */
    function createInstance(seedData = {}) {
        const collections = new Map();

        // Initialize seed data from file    
        for (let collectionName in seedData) {
            if (seedData.hasOwnProperty(collectionName)) {
                const collection = new Map();
                for (let recordId in seedData[collectionName]) {
                    if (seedData.hasOwnProperty(collectionName)) {
                        collection.set(recordId, seedData[collectionName][recordId]);
                    }
                }
                collections.set(collectionName, collection);
            }
        }


        // Manipulation

        /**
         * Get entry by ID or list of all entries from collection or list of all collections
         * @param {string=} collection Name of collection to access. Throws error if not found. If omitted, returns list of all collections.
         * @param {number|string=} id ID of requested entry. Throws error if not found. If omitted, returns of list all entries in collection.
         * @return {Object} Matching entry.
         */
        function get(collection, id) {
            if (!collection) {
                return [...collections.keys()];
            }
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!id) {
                const entries = [...targetCollection.entries()];
                let result = entries.map(([k, v]) => {
                    return Object.assign(deepCopy(v), { _id: k });
                });
                return result;
            }
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            const entry = targetCollection.get(id);
            return Object.assign(deepCopy(entry), { _id: id });
        }

        /**
         * Add new entry to collection. ID will be auto-generated
         * @param {string} collection Name of collection to access. If the collection does not exist, it will be created.
         * @param {Object} data Value to store.
         * @return {Object} Original value with resulting ID under _id property.
         */
        function add(collection, data) {
            const record = assignClean({ _ownerId: data._ownerId }, data);

            let targetCollection = collections.get(collection);
            if (!targetCollection) {
                targetCollection = new Map();
                collections.set(collection, targetCollection);
            }
            let id = uuid$2();
            // Make sure new ID does not match existing value
            while (targetCollection.has(id)) {
                id = uuid$2();
            }

            record._createdOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Update entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Shallow merge will be performed!
         * @return {Object} Updated entry.
         */
        function set(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = deepCopy(targetCollection.get(id));
            const record = assignClean(existing, data);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Delete entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @return {{_deletedOn: number}} Server time of deletion.
         */
        function del(collection, id) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            targetCollection.delete(id);

            return { _deletedOn: Date.now() };
        }

        /**
         * Search in collection by query object
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {Object} query Query object. Format {prop: value}.
         * @return {Object[]} Array of matching entries.
         */
        function query(collection, query) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            const result = [];
            // Iterate entries of target collection and compare each property with the given query
            for (let [key, entry] of [...targetCollection.entries()]) {
                let match = true;
                for (let prop in entry) {
                    if (query.hasOwnProperty(prop)) {
                        const targetValue = query[prop];
                        // Perform lowercase search, if value is string
                        if (typeof targetValue === 'string' && typeof entry[prop] === 'string') {
                            if (targetValue.toLocaleLowerCase() !== entry[prop].toLocaleLowerCase()) {
                                match = false;
                                break;
                            }
                        } else if (targetValue != entry[prop]) {
                            match = false;
                            break;
                        }
                    }
                }

                if (match) {
                    result.push(Object.assign(deepCopy(entry), { _id: key }));
                }
            }

            return result;
        }

        return { get, add, set, delete: del, query };
    }


    function assignClean(target, entry, ...rest) {
        const blacklist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let key in entry) {
            if (blacklist.includes(key) == false) {
                target[key] = deepCopy(entry[key]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }

    function deepCopy(value) {
        if (Array.isArray(value)) {
            return value.map(deepCopy);
        } else if (typeof value == 'object') {
            return [...Object.entries(value)].reduce((p, [k, v]) => Object.assign(p, { [k]: deepCopy(v) }), {});
        } else {
            return value;
        }
    }

    var storage = initPlugin;

    const { ConflictError: ConflictError$1, CredentialError: CredentialError$2, RequestError: RequestError$2 } = errors;

    function initPlugin$1(settings) {
        const identity = settings.identity;

        return function decorateContext(context, request) {
            context.auth = {
                register,
                login,
                logout
            };

            const userToken = request.headers['x-authorization'];
            if (userToken !== undefined) {
                let user;
                const session = findSessionByToken(userToken);
                if (session !== undefined) {
                    const userData = context.protectedStorage.get('users', session.userId);
                    if (userData !== undefined) {
                        console.log('Authorized as ' + userData[identity]);
                        user = userData;
                    }
                }
                if (user !== undefined) {
                    context.user = user;
                } else {
                    throw new CredentialError$2('Invalid access token');
                }
            }

            function register(body) {
                if (body.hasOwnProperty(identity) === false ||
                    body.hasOwnProperty('password') === false ||
                    body[identity].length == 0 ||
                    body.password.length == 0) {
                    throw new RequestError$2('Missing fields');
                } else if (context.protectedStorage.query('users', { [identity]: body[identity] }).length !== 0) {
                    throw new ConflictError$1(`A user with the same ${identity} already exists`);
                } else {
                    const newUser = {
                        [identity]: body[identity],
                        hashedPassword: hash(body.password)
                    };
                    const result = context.protectedStorage.add('users', newUser);
                    delete result.hashedPassword;

                    const session = saveSession(result._id);
                    result.accessToken = session.accessToken;

                    return result;
                }
            }

            function login(body) {
                const targetUser = context.protectedStorage.query('users', { [identity]: body[identity] });
                if (targetUser.length == 1) {
                    if (hash(body.password) === targetUser[0].hashedPassword) {
                        const result = targetUser[0];
                        delete result.hashedPassword;

                        const session = saveSession(result._id);
                        result.accessToken = session.accessToken;

                        return result;
                    } else {
                        throw new CredentialError$2('Email or password don\'t match');
                    }
                } else {
                    throw new CredentialError$2('Email or password don\'t match');
                }
            }

            function logout() {
                if (context.user !== undefined) {
                    const session = findSessionByUserId(context.user._id);
                    if (session !== undefined) {
                        context.protectedStorage.delete('sessions', session._id);
                    }
                } else {
                    throw new CredentialError$2('User session does not exist');
                }
            }

            function saveSession(userId) {
                let session = context.protectedStorage.add('sessions', { userId });
                const accessToken = hash(session._id);
                session = context.protectedStorage.set('sessions', session._id, Object.assign({ accessToken }, session));
                return session;
            }

            function findSessionByToken(userToken) {
                return context.protectedStorage.query('sessions', { accessToken: userToken })[0];
            }

            function findSessionByUserId(userId) {
                return context.protectedStorage.query('sessions', { userId })[0];
            }
        };
    }


    const secret = 'This is not a production server';

    function hash(string) {
        const hash = crypto__default['default'].createHmac('sha256', secret);
        hash.update(string);
        return hash.digest('hex');
    }

    var auth = initPlugin$1;

    function initPlugin$2(settings) {
        const util = {
            throttle: false
        };

        return function decoreateContext(context, request) {
            context.util = util;
        };
    }

    var util$2 = initPlugin$2;

    var identity = "email";
    var protectedData = {
        users: {
            "35c62d76-8152-4626-8712-eeb96381bea8": {
                email: "peter@abv.bg",
                hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1"
            },
            "847ec027-f659-4086-8032-5173e2f9c93a": {
                email: "george@abv.bg",
                hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1"
            },
            "60f0cf0b-34b0-4abd-9769-8c42f830dffc": {
                email: "admin@abv.bg",
                hashedPassword: "fac7060c3e17e6f151f247eacb2cd5ae80b8c36aedb8764e18a41bbdc16aa302"
            }
        },
        sessions: {
        }
    };
    var seedData = {
        manga: {
            "ff35152b-aceb-4f5f-b0ed-503ff26caabf": {
                _id: "ff35152b-aceb-4f5f-b0ed-503ff26caabf",
                _createdOn: 1701443936660,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81s8xJUzWGL._SY466_.jpg",
                name: "Chainsaw Man",
                volume: "1",
                price: 7.19,
                author: "Tatsuki Fujimoto",
                genre: "action",
                status: "ongoing",
                pages: 192,
                language: "English",
                synopsis: "Denji was a small-time devil hunter just trying to survive in a harsh world. After being killed on a job, he is revived by his pet devil Pochita and becomes something new and dangerous—Chainsaw Man! Denji's a poor young man who'll do anything for money, even hunting down devils with his pet devil Pochita. He's a simple man with simple dreams, drowning under a mountain of debt. But his sad life gets turned upside down one day when he's betrayed by someone he trusts. Now with the power of a devil inside him, Denji's become a whole new man—Chainsaw Man!"
            },
            "c5326bcc-6c4c-4e41-9768-333bf894267a": {
                _id: "c5326bcc-6c4c-4e41-9768-333bf894267a",
                _createdOn: 1701444738411,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/513xaEKX-aL._SY445_SX342_.jpg",
                name: "Chainsaw Man",
                volume: "3",
                price: 6.65,
                author: "Tatsuki Fujimoto",
                genre: "action",
                status: "ongoing",
                pages: 192,
                language: "English",
                synopsis: "Denji was a small-time devil hunter just trying to survive in a harsh world. After being killed on a job, he is revived by his pet devil Pochita and becomes something new and dangerous—Chainsaw Man! A mysterious devil is demanding Denji's heart! But will the devil hunters from Division 4 agree to this deal to save themselves? Or will Denji have to do what Denji does best—turn into a chainsaw and carve up everything that gets in his way?!"
            },
            "89632330-42a7-43e0-9403-86b720343ffe": {
                _id: "89632330-42a7-43e0-9403-86b720343ffe",
                _createdOn: 1701444881902,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/51F5K1HjseL._SY445_SX342_.jpg",
                name: "Chainsaw Man",
                volume: "4",
                price: 7.99,
                author: "Tatsuki Fujimoto",
                genre: "action",
                status: "ongoing",
                pages: 192,
                language: "English",
                synopsis: "Denji was a small-time devil hunter just trying to survive in a harsh world. After being killed on a job, he is revived by his pet devil Pochita and becomes something new and dangerous—Chainsaw Man! Devil Extermination Special Division 4 is in serious trouble as a devil has sent a whole team of assassins to take Denji's heart. In order to survive the onslaught, Denji, Power and Aki will have to get stronger. But is Denji smart enough to learn how to control his devil powers? Can you can teach an old chainsaw-dog-devil new tricks?"
            },
            "075f31f7-cc7f-4f1f-bae8-d6fc1bd09ce4": {
                _id: "075f31f7-cc7f-4f1f-bae8-d6fc1bd09ce4",
                _createdOn: 1701445079981,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81fAfyWEEiL._SY466_.jpg",
                name: "D.Gray-man",
                volume: "1, 2, 3",
                price: 14.70,
                author: "Katsura Hoshino",
                genre: "action",
                status: "ongoing",
                pages: 576,
                language: "English",
                synopsis: "D.Gray-man is the story of Allen Walker, who roams a fictional 19th century Earth in search of Innocence, a mysterious substance used to fight demons called akuma. Allen Walker travels to the headquarters of the Black Order, a group of exorcists out to destroy the Millennium Earl, the creator of the akuma. Allen is already a strong exorcist and wants to join the Black Order, but he might not even survive getting past the guard!"
            },
            "ab74501b-743e-491b-a965-f4d83014e894": {
                _id: "ab74501b-743e-491b-a965-f4d83014e894",
                _createdOn: 1701445145047,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81M+KORBw9L._SY466_.jpg",
                name: "D.Gray-man",
                volume: "26",
                price: 9.99,
                author: "Katsura Hoshino",
                genre: "action",
                status: "ongoing",
                pages: 200,
                language: "English",
                synopsis: "Set in a fictional 19th century England, D.Gray-man is the story of Allen Walker, a 15-year-old boy who roams the earth in search of Innocence. Washed away to unknown parts of the world after The Great Flood, Innocence is the mysterious substance used to create weapons that obliterate demons known as akuma. Allen has long been host to Nea, a dangerous entity also known as the Fourteenth. Nea was dormant, but he's since roused and is now dominant. Johnny, Allen's most stalwart ally, tries to restore Allen to consciousness, but can he manage it in time?"
            },
            "93aa2cec-193f-44f4-99cc-72c315a564a5": {
                _id: "93aa2cec-193f-44f4-99cc-72c315a564a5",
                _createdOn: 1701445270766,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81wC++rSTPL._SY466_.jpg",
                name: "Yona of the Dawn",
                volume: "1",
                price: 9.49,
                author: "Mizuho Kusanagi",
                genre: "romance",
                status: "ongoing",
                pages: 200,
                language: "English",
                synopsis: "Princess Yona lives an ideal life as the only princess of her kingdom. Doted on by her father, the king, and protected by her faithful guard Hak, she cherishes the time spent with the man she loves, Su-won. But everything changes on her 16th birthday when tragedy strikes her family! Yona reels from the shock of witnessing a loved one's murder and having to fight for her life. With Hak's help, she flees the palace and struggles to survive while evading her enemy's forces. But where will this displaced princess go when all the paths before her are uncertain?"
            },
            "e6154fe4-c6f8-45d0-a04d-df792b8c0d5c": {
                _id: "e6154fe4-c6f8-45d0-a04d-df792b8c0d5c",
                _createdOn: 1701445333176,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81BORSK0fSL._SY466_.jpg",
                name: "Yona of the Dawn",
                volume: "2",
                price: 9.49,
                author: "Mizuho Kusanagi",
                genre: "romance",
                status: "ongoing",
                pages: 192,
                language: "English",
                synopsis: "Princess Yona lives an ideal life as the only princess of her kingdom. Doted on by her father, the king, and protected by her faithful guard Hak, she cherishes the time spent with the man she loves, Su-won. But everything changes on her 16th birthday when tragedy strikes her family! While on the run, Yona and Hak head to Hak's hometown, where she attempts to heal her broken heart. However, she can't rest there for long once she discovers that Su-won may soon become king! What will Yona choose to do in the wake of this news?"
            },
            "25db9603-253e-4eec-8962-24c62654d744": {
                _id: "25db9603-253e-4eec-8962-24c62654d744",
                _createdOn: 1701445333176,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81GIb6GMhRL._SY466_.jpg",
                name: "The Promised Neverland",
                volume: "1",
                price: 6.10,
                author: "Kaiu Shirai",
                genre: "mystery",
                status: "completed",
                pages: 192,
                language: "English",
                synopsis: "Life at Grace Field House is good for Emma and her fellow orphans. While the daily studying and exams they have to take are tough, their loving caretaker provides them with delicious food and plenty of playtime. But perhaps not everything is as it seems… Emma, Norman and Ray are the brightest kids at the Grace Field House orphanage. And under the care of the woman they refer to as “Mom,” all the kids have enjoyed a comfortable life. Good food, clean clothes and the perfect environment to learn—what more could an orphan ask for? One day, though, Emma and Norman uncover the dark truth of the outside world they are forbidden from seeing."
            },
            "8e95357b-9ee8-46be-8ef3-deed1ddc862c": {
                _id: "8e95357b-9ee8-46be-8ef3-deed1ddc862c",
                _createdOn: 1701445333176,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81atHQymv+L._SY466_.jpg",
                name: "The Promised Neverland",
                volume: "3",
                price: 6.10,
                author: "Kaiu Shirai",
                genre: "mystery",
                status: "completed",
                pages: 192,
                language: "English",
                synopsis: "Life at Grace Field House is good for Emma and her fellow orphans. While the daily studying and exams they have to take are tough, their loving caretaker provides them with delicious food and plenty of playtime. But perhaps not everything is as it seems… In order to escape the orphanage where they are being raised as food for demons, Emma, Norman and Ray begin recruiting allies. But convincing the other children to believe them may not be an easy task."
            },
            "09ba98bc-022b-4a9d-8963-fca6cf6a733f": {
                _id: "09ba98bc-022b-4a9d-8963-fca6cf6a733f",
                _createdOn: 1701445508624,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/912y5oJyJLL._SY466_.jpg",
                name: "Black Butler",
                volume: "14",
                price: 13.00,
                author: "Yana Toboso",
                genre: "mystery",
                status: "ongoing",
                pages: 178,
                language: "English",
                synopsis: "The veil of mystery cast over the Aurora Society's 'absolute salvation' is torn away, and the true mastermind behind the scheme steps forward at long last. In the ensuing battle, Earl Ciel Phantomhive looks on in horror as Sebastian, his infallible manservant, is struck down by the death scythe of an unforeseen combatant. Devil though he may be, even Sebastian is not immune to the blade of a reaper's scythe. As Sebastian's cinematic record spills forth, the tale of how a devil became a butler to a little lost lord flickers to life in shades of sepia, blood, and ash..."
            },
            "401e86ef-6385-4bab-8221-5702676d9b01": {
                _id: "401e86ef-6385-4bab-8221-5702676d9b01",
                _createdOn: 1701445566130,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/517mzKOIdXL._SY445_SX342_.jpg",
                name: "Black Butler",
                volume: "31",
                price: 13.00,
                author: "Yana Toboso",
                genre: "mystery",
                status: "ongoing",
                pages: 178,
                language: "English",
                synopsis: "Mey-Rin and Ran-Mao's victory is secured as they thoroughly dismantle the operation in North Yorkshire. Meanwhile, Baldo and Lau are headed to Wiltshire to investigate a sanatorium for war veterans that is rumored to be headed by a “miracle healer.” The skeptical cook is disinclined to believe in the existence of angels―but the incredulous sight that unfolds before his eyes might change his mind…"
            },
            "dc7e6b97-de37-4324-be4b-79ee3253bdbd": {
                _id: "dc7e6b97-de37-4324-be4b-79ee3253bdbd",
                _createdOn: 1701445696184,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/51IrW578SQL._SY445_SX342_.jpg",
                name: "Berserk Deluxe",
                volume: "1",
                price: 50.00,
                author: "Kentaro Miura",
                genre: "horror",
                status: "ongoing",
                pages: 696,
                language: "English",
                synopsis: "Guts, a former mercenary now known as the 'Black Swordsman', is out for revenge. After a tumultuous childhood, he finally finds someone he respects and believes he can trust, only to have everything fall apart when this person takes away everything important to Guts for the purpose of fulfilling his own desires. Now marked for death, Guts becomes condemned to a fate in which he is relentlessly pursued by demonic beings. Setting out on a dreadful quest riddled with misfortune, Guts, armed with a massive sword and monstrous strength, will let nothing stop him, not even death itself, until he is finally able to take the head of the one who stripped him—and his loved one—of their humanity."
            },
            "2a90d959-350d-4a78-bd82-42ef54a36f65": {
                _id: "2a90d959-350d-4a78-bd82-42ef54a36f65",
                _createdOn: 1701445750889,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81gv-D-LqhL._SY466_.jpg",
                name: "Tokyo Ghoul",
                volume: "1",
                price: 9.99,
                author: "Sui Ishida",
                genre: "horror",
                status: "completed",
                pages: 224,
                language: "English",
                synopsis: "Ghouls live among us, the same as normal people in every way—except their craving for human flesh. Ken Kaneki is an ordinary college student until a violent encounter turns him into the first half-human half-ghoul hybrid. Trapped between two worlds, he must survive Ghoul turf wars, learn more about Ghoul society and master his new powers. Shy Ken Kaneki is thrilled to go on a date with the beautiful Rize. But it turns out that she's only interested in his body—eating it, that is. When a morally questionable rescue transforms him into the first half-human half-Ghoul hybrid, Ken is drawn into the dark and violent world of Ghouls, which exists alongside our own."
            },
            "d922bc54-7c1b-4726-a498-6ef1f180dd0c": {
                _id: "d922bc54-7c1b-4726-a498-6ef1f180dd0c",
                _createdOn: 1701445808185,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/61dmrRwKh1L._SY466_.jpg",
                name: "Tokyo Ghoul: re",
                volume: "1",
                price: 9.99,
                author: "Sui Ishida",
                genre: "horror",
                status: "completed",
                pages: 216,
                language: "English",
                synopsis: "The Commission of Counter Ghoul is the only organization fighting the Ghoul menace, and they will use every tool at their disposal to protect humanity from its ultimate predator. Their newest weapon in this hidden war is an experimental procedure that implants human investigators with a Ghoul's Kagune, giving them Ghoul powers and abilities. But both the procedure and the newly formed Qs Squad are untested. Will they become heroes…or monsters?! Haise Sasaki has been tasked with teaching Qs Squad how to be outstanding investigators, but his assignment is complicated by the troublesome personalities of his students and his own uncertain grasp of his Ghoul powers. Can he pull them together as a team, or will Qs Squad first assignment be their last?"
            },
            "5706a74f-c5d8-4be5-b443-9e46ec7883cc": {
                _id: "5706a74f-c5d8-4be5-b443-9e46ec7883cc",
                _createdOn: 1701445901538,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81qip4V12SL._SY466_.jpg",
                name: "Horimiya",
                volume: "1",
                price: 9.11,
                author: "HERO",
                genre: "romance",
                status: "completed",
                pages: 176,
                language: "English",
                synopsis: "At school, Kyouko Hori is known for being smart, attractive, and popular. On the other hand, her classmate, the boring, gloomy Izumi Miyamura tends to get painted as a 'loser fanboy'. But when a liberally pierced and tattooed (not to mention downright gorgeous) Miyamura appears unexpectedly on the doorstep of secretly plain-Jane homebody Hori, these two similarly dissimilar teenagers discover that there are multiple sides to every story...and person!"
            },
            "daac9329-c7d5-4545-a886-e6094f2c576c": {
                _id: "daac9329-c7d5-4545-a886-e6094f2c576c",
                _createdOn: 1701445990353,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/51pyc5sYK7L._SY445_SX342_.jpg",
                name: "Horimiya",
                volume: "2",
                price: 9.11,
                author: "HERO",
                genre: "romance",
                status: "completed",
                pages: 192,
                language: "English",
                synopsis: "By all appearances, Kyouko Hori and Izumi Miyamura are worlds apart. Bright and capable, Hori is always surrounded by classmates, the center of attention. For Miyamura, a quirky loner, getting through class unnoticed counts as a good day. But ever since these two started sharing secrets, they've found themselves drawn into each other's orbit little by little and the distance between them shrinking bit by bit..."
            },
            "d3e58f90-12fc-470d-a9de-d719fa7b7715": {
                _id: "d3e58f90-12fc-470d-a9de-d719fa7b7715",
                _createdOn: 1701446089892,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81k6fYmHN6L._SY466_.jpg",
                name: "The Quintessential Quintuplets",
                volume: "1",
                price: 10.99,
                author: "Negi Haruba",
                genre: "romance",
                status: "completed",
                pages: 192,
                language: "English",
                synopsis: "Five girls who want to do anything but study, and their tutor: A high school boy who's got book smarts and not much else. Futaro Uesugi took the tutoring gig because he was desperate for cash, but when his students--the five beautiful daughters of a wealthy businessman--find five times the excuses to slack off, what can he do?! At this rate, the sisters won't graduate, so if he wants to get paid, Futaro must think of a plan to suit each of them... Which feels hopeless when five out of five of them think he's a loser!"
            },
            "9c830ba8-f007-4618-8d58-681d1a8f0c04": {
                _id: "9c830ba8-f007-4618-8d58-681d1a8f0c04",
                _createdOn: 1701446158947,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81JCbXEyYKL._SY466_.jpg",
                name: "The Quintessential Quintuplets",
                volume: "4",
                price: 10.99,
                author: "Negi Haruba",
                genre: "romance",
                status: "completed",
                pages: 192,
                language: "English",
                synopsis: "Futaro continues to lead the Quints to academic aptitude, but there are some treats in store for him as well! Having nearly missed his long-awaited school trip, Futaro tries to make the best of the situation and works on getting closer to all five girls. After getting a tip from one of the sisters, Futaro takes a different approach to getting the girls interested in their studies. Will they accept him into their lives...? Or will this really be the end of his short tutoring career?"
            },
            "037d18a7-e35a-4fef-91f2-49ed1f261091": {
                _id: "037d18a7-e35a-4fef-91f2-49ed1f261091",
                _createdOn: 1701446216446,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/8125DI58M+L._SY466_.jpg",
                name: "Haikyu!!",
                volume: "1",
                price: 5.99,
                author: "Haruichi Furudate",
                genre: "sports",
                status: "completed",
                pages: 192,
                language: "English",
                synopsis: "Ever since he saw the legendary player known as “the Little Giant” compete at the national volleyball finals, Shoyo Hinata has been aiming to be the best volleyball player ever! Who says you need to be tall to play volleyball when you can jump higher than anyone else? After losing his first and last volleyball match against Tobio Kageyama, “the King of the Court,” Shoyo Hinata swears to become his rival after graduating middle school. But what happens when the guy he wants to defeat ends up being his teammate?!"
            },
            "38e6fcea-a1bf-4d42-b1c0-c1fb76709d75": {
                _id: "38e6fcea-a1bf-4d42-b1c0-c1fb76709d75",
                _createdOn: 1701446271272,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/51lDTDxNgiL._SY445_SX342_.jpg",
                name: "Haikyu!!",
                volume: "4",
                price: 5.99,
                author: "Haruichi Furudate",
                genre: "sports",
                status: "completed",
                pages: 216,
                language: "English",
                synopsis: "Ever since he saw the legendary player known as “the Little Giant” compete at the national volleyball finals, Shoyo Hinata has been aiming to be the best volleyball player ever! Who says you need to be tall to play volleyball when you can jump higher than anyone else? The training camp kicks off with a bang! Hinata and his teammates train their hearts out in preparation for the practice game against Nekoma, but they'll need to polish their receiving skills if they want to win. After all their hard work, the moment they've all been waiting for finally arrives—the revival of the long-standing rivalry between the Cats and the Crows! And Nekoma's starting setter looks vaguely familiar…"
            },
            "ee08a6f2-4e09-4fdc-bb58-33f2efa5b6a2": {
                _id: "ee08a6f2-4e09-4fdc-bb58-33f2efa5b6a2",
                _createdOn: 1701446336146,
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                imageUrl: "https://m.media-amazon.com/images/I/81uROkePvYL._SY466_.jpg",
                name: "Haikyu!!",
                volume: "44",
                price: 5.99,
                author: "Haruichi Furudate",
                genre: "sports",
                status: "completed",
                pages: 192,
                language: "English",
                synopsis: "Ever since he saw the legendary player known as “the Little Giant” compete at the national volleyball finals, Shoyo Hinata has been aiming to be the best volleyball player ever! Who says you need to be tall to play volleyball when you can jump higher than anyone else? Hinata and Kageyama finally meet again, this time in the V.League. Even amid the high-level plays between the top-tier Adlers and Black Jackals, Hinata shows off all that he can do and makes big waves on the court! Once again facing Hinata as an opponent, Kageyama watches him with growing excitement as he navigates the court."
            },
            "59009b3d-2ff5-4d18-9474-c235082423c4": {
                _id: "59009b3d-2ff5-4d18-9474-c235082423c4",
                _createdOn: 1701446484133,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/71Ov8pDg16L._SY466_.jpg",
                name: "Blue Lock",
                volume: "9",
                price: 10.99,
                author: "Muneyuki Kaneshiro",
                genre: "sports",
                status: "ongoing",
                pages: 208,
                language: "English",
                synopsis: "Thanks to Barou's awakening, Isagi's team manages to defeat the trio of Kunigami, Chigiri, and Reo. And the one that Isagi chooses to steal is... The new four-man team sets out for a rematch against the Top Three and Bachira. Will the 'monster' that fuels Isagi's ego be enough to take down the prodigy striker Rin Itoshi?!"
            },
            "3d2f63ae-d9de-4f82-ba6f-aee5c0b680cb": {
                _id: "3d2f63ae-d9de-4f82-ba6f-aee5c0b680cb",
                _createdOn: 1701446598598,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/81W9TXFd6xL._SY466_.jpg",
                name: "Blue Lock",
                volume: "5",
                price: 10.99,
                author: "Muneyuki Kaneshiro",
                genre: "sports",
                status: "ongoing",
                pages: 208,
                language: "English",
                synopsis: "In the face of Team V, Team Z has managed to catch up 3-3 with fifteen minutes remaining. Amid this tense environment, all the players seek their 'awakening' that will take their skills to the next level... Will they manage to beat Team V and qualify for the next selection--or will they be stuck on the playing field with nowhere to go?"
            },
            "a6b66221-b57d-4595-ada7-7dbf0d6d48b6": {
                _id: "a6b66221-b57d-4595-ada7-7dbf0d6d48b6",
                _createdOn: 1701446678899,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/514l+Y9eApL._SY445_SX342_.jpg",
                name: "Blue Lock",
                volume: "2",
                price: 10.99,
                author: "Muneyuki Kaneshiro",
                genre: "sports",
                status: "ongoing",
                pages: 208,
                language: "English",
                synopsis: "Yoichi Isagi, one of three hundred high school soccer players is in Team Z--the lowest ranked group in the controversial training facility, Blue Lock, where the aim is to create Japan's best striker. To survive their first round-robin tournament, Isagi's Team Z will need to find a way to use their unique 'weapons', while struggling through a clash of egos. But Isagi grapples to understand what his strength is as a striker..."
            },
            "c6a10d0d-4ac0-40e8-80a9-46d5235777d5": {
                _id: "c6a10d0d-4ac0-40e8-80a9-46d5235777d5",
                _createdOn: 1701446745566,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/81CeGGwz+BL._SY466_.jpg",
                name: "Uzumaki",
                volume: "1, 2, 3",
                price: 33.99,
                author: "Junji Ito",
                genre: "horror",
                status: "completed",
                pages: 648,
                language: "English",
                synopsis: "Kurouzu-cho, a small fogbound town on the coast of Japan, is cursed. According to Shuichi Saito, the withdrawn boyfriend of teenager Kirie Goshima, their town is haunted not by a person or being but a pattern: UZUMAKI, the spiral—the hypnotic secret shape of the world. The bizarre masterpiece horror manga is now available all in a single volume. Fall into a whirlpool of terror!"
            },
            "ddb1c067-5314-4ffb-91d0-54572967f45e": {
                _id: "ddb1c067-5314-4ffb-91d0-54572967f45e",
                _createdOn: 1701446935390,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/91-um1ueRqL._SY466_.jpg",
                name: "Dorohedoro",
                volume: "1",
                price: 12.59,
                author: "Q Hayashida",
                genre: "comedy",
                status: "completed",
                pages: 176,
                language: "English",
                synopsis: "In a city so dismal it's known only as 'the Hole', a clan of Sorcerers have been plucking people off the streets to use as guinea pigs for atrocious 'experiments' in the black arts. In a dark alley, Nikaido found Caiman, a man with a reptile head and a bad case of amnesia. To undo the spell, they're hunting and killing the Sorcerers in the Hole, hoping that eventually they'll kill the right one. But when En, the head Sorcerer, gets word of a lizard-man slaughtering his people, he sends a crew of 'cleaners' into the Hole, igniting a war between two worlds."
            },
            "39f33d15-281d-40d6-9997-353dea766c4e": {
                _id: "39f33d15-281d-40d6-9997-353dea766c4e",
                _createdOn: 1701447002398,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/81RUuav+oxL._SY466_.jpg",
                name: "Dorohedoro",
                volume: "2",
                price: 12.59,
                author: "Q Hayashida",
                genre: "comedy",
                status: "completed",
                pages: 160,
                language: "English",
                synopsis: "In a city so dismal it's known only as 'the Hole', a clan of Sorcerers has been plucking people off the streets to use as guinea pigs for atrocious 'experiments' in the black arts. In a dark alley, Nikaido found Caiman, a man with a reptile head and a bad case of amnesia. To undo the spell, they're hunting and killing the Sorcerers in the Hole, hoping that eventually they'll kill the right one. But when En, the head Sorcerer, gets word of a lizard-man slaughtering his people, he sends a crew of 'cleaners' into the Hole, igniting a war between two worlds. Once a year, hordes of the dead rise and roam the streets of the Hole, hungry for live flesh. And every year, Caiman and Nikaido sign up for the local zombie-killing contest! Whoever sends the most zombies back into the ground will win some fantastic prizes. But the fun ends quickly when En's cleaners finally track down Caiman and Nikaido. Somebody's going to lose their head. Literally."
            },
            "442c0bef-d7fa-4293-991d-694f11ed7168": {
                _id: "442c0bef-d7fa-4293-991d-694f11ed7168",
                _createdOn: 1701447078137,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/616nT3lazIL._SY466_.jpg",
                name: "Dorohedoro",
                volume: "3",
                price: 12.59,
                author: "Q Hayashida",
                genre: "comedy",
                status: "completed",
                pages: 176,
                language: "English",
                synopsis: "In a city so dismal it's known only as 'the Hole', a clan of Sorcerers has been plucking people off the streets to use as guinea pigs for atrocious 'experiments' in the black arts. In a dark alley, Nikaido found Caiman, a man with a reptile head and a bad case of amnesia. To undo the spell, they're hunting and killing the Sorcerers in the Hole, hoping that eventually they'll kill the right one. But when En, the head Sorcerer, gets word of a lizard-man slaughtering his people, he sends a crew of 'cleaners' into the Hole, igniting a war between two worlds. While En seeks out a new partner with unique magic powers, his crew has a run-in with an underground organization that controls the distribution of 'black powder', a magic-enhancing drug used by weaker Sorcerers. Meanwhile, Caiman and Nikaido spend New Year's in the haunted mansion of a mysterious doctor who specializes in the anatomy of Sorcerers. The doctor reveals to them the only known portal to the Sorcerers' dimension..."
            },
            "a06de3f4-5618-4e96-a56c-3f9b6bc495db": {
                _id: "a06de3f4-5618-4e96-a56c-3f9b6bc495db",
                _createdOn: 1701447143078,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/91toFx95GzL._SY466_.jpg",
                name: "Ajin",
                volume: "2",
                price: 11.99,
                author: "Gamon Sakurai",
                genre: "horror",
                status: "completed",
                pages: 200,
                language: "English",
                synopsis: "A bright high schooler has discovered to his horror that death is just a repeatable event for him - and that humanity has no mercy for a demi-human. To avoid becoming a science experiment for the rest of his interminable life, Kei Nagai must seek out others of his kind. But what would a community of them stand for?"
            },
            "12046ffb-2d92-488c-bea7-de305d34605b": {
                _id: "12046ffb-2d92-488c-bea7-de305d34605b",
                _createdOn: 1701447193013,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/719AXHRvCiL._SY466_.jpg",
                name: "Ajin",
                volume: "3",
                price: 11.99,
                author: "Gamon Sakurai",
                genre: "horror",
                status: "completed",
                pages: 194,
                language: "English",
                synopsis: "The true aim of the raid on the research center is revealed by demi-human mastermind Sato, whose Bolshevik ruthlessness and cunning prove worthy of his choice of headgear."
            },
            "10a339cf-fcea-4d3e-893f-6a5fb19420d0": {
                _id: "10a339cf-fcea-4d3e-893f-6a5fb19420d0",
                _createdOn: 1701447243121,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/81VAgJoB3BL._SY466_.jpg",
                name: "One Punch Man",
                volume: "1",
                price: 9.99,
                author: "ONE",
                genre: "comedy",
                status: "ongoing",
                pages: 200,
                language: "English",
                synopsis: "Nothing about Saitama passes the eyeball test when it comes to superheroes, from his lifeless expression to his bald head to his unimpressive physique. However, this average-looking guy has a not-so-average problem—he just can't seem to find an opponent strong enough to take on! Every time a promising villain appears, Saitama beats the snot out of 'em with one punch! Can he finally find an opponent who can go toe-to-toe with him and give his life some meaning? Or is he doomed to a life of superpowered boredom?"
            },
            "a7147d5b-3046-45a0-ad4e-6c69a7a66c3d": {
                _id: "a7147d5b-3046-45a0-ad4e-6c69a7a66c3d",
                _createdOn: 1701447298854,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/810RdR69pBL._SY466_.jpg",
                name: "One Punch Man",
                volume: "2",
                price: 9.99,
                author: "ONE",
                genre: "comedy",
                status: "ongoing",
                pages: 200,
                language: "English",
                synopsis: "Nothing about Saitama passes the eyeball test when it comes to superheroes, from his lifeless expression to his bald head to his unimpressive physique. However, this average-looking guy has a not-so-average problem—he just can't seem to find an opponent strong enough to take on! Saitama's easily taken out a number of monsters, including a crabby creature, a malicious mosquito girl and a muscly meathead. But his humdrum life takes a drastic turn when he meets Genos—a cyborg who wants to uncover the secret behind his strength!"
            },
            "6cc6b6e3-031a-486f-8850-d2e81ee31901": {
                _id: "6cc6b6e3-031a-486f-8850-d2e81ee31901",
                _createdOn: 1701447360221,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/71vMGRog+iL._SY466_.jpg",
                name: "Spy x Family",
                volume: "1",
                price: 6.99,
                author: "Tatsuya Endo",
                genre: "comedy",
                status: "ongoing",
                pages: 220,
                language: "English",
                synopsis: "Master spy Twilight is unparalleled when it comes to going undercover on dangerous missions for the betterment of the world. But when he receives the ultimate assignment—to get married and have a kid—he may finally be in over his head! Not one to depend on others, Twilight has his work cut out for him procuring both a wife and a child for his mission to infiltrate an elite private school. What he doesn't know is that the wife he's chosen is an assassin and the child he's adopted is a telepath!"
            },
            "f3a6b495-8bfd-49c3-af3b-9b705994ec68": {
                _id: "f3a6b495-8bfd-49c3-af3b-9b705994ec68",
                _createdOn: 1701447509714,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/61iyxqz5ZhL._SY466_.jpg",
                name: "Vagabond",
                volume: "1",
                price: 24.99,
                author: "Takehiko Inoue",
                genre: "action",
                status: "hiatus",
                pages: 600,
                language: "English",
                synopsis: "At seventeen years of age, Miyamoto Musashi--still known by his childhood name, Shinmen Takezō--was a wild young brute just setting out along the way of the sword. In the aftermath of the epic Battle of Sekigahara, Takezō finds himself a fugitive survivor on the losing side of the war. Takezō's vicious nature has made him an outcast even in his own village, and he is hunted down like an animal. At this crucial crossroads in Takezō's life, an eccentric monk and a childhood friend are the only ones who can help him find his way."
            },
            "7c742f49-61fd-466c-8185-db8a918e3a3a": {
                _id: "7c742f49-61fd-466c-8185-db8a918e3a3a",
                _createdOn: 1701447562494,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/71y+XnBXm4L._SY466_.jpg",
                name: "One Piece",
                volume: "1",
                price: 9.99,
                author: "Eiichiro Oda",
                genre: "action",
                status: "ongoing",
                pages: 216,
                language: "English",
                synopsis: "As a child, Monkey D. Luffy dreamed of becoming King of the Pirates. But his life changed when he accidentally gained the power to stretch like rubber…at the cost of never being able to swim again! Years, later, Luffy sets off in search of the “One Piece,” said to be the greatest treasure in the world... As a child, Monkey D. Luffy was inspired to become a pirate by listening to the tales of the buccaneer 'Red-Haired' Shanks. But his life changed when Luffy accidentally ate the Gum-Gum Devil Fruit and gained the power to stretch like rubber...at the cost of never being able to swim again! Years later, still vowing to become the king of the pirates, Luffy sets out on his adventure...one guy alone in a rowboat, in search of the legendary 'One Piece', said to be the greatest treasure in the world..."
            },
            "d184c493-48a4-4006-9dab-fba1341e7e64": {
                _id: "d184c493-48a4-4006-9dab-fba1341e7e64",
                _createdOn: 1701447617883,
                _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
                imageUrl: "https://m.media-amazon.com/images/I/A1F6J2dBalL._SY466_.jpg",
                name: "One Piece",
                volume: "52",
                price: 9.99,
                author: "Eiichiro Oda",
                genre: "action",
                status: "ongoing",
                pages: 216,
                language: "English",
                synopsis: "In his effort to save Camie the mermaid from being sold to the highest bidder, Luffy's attack on an exalted Celestial Dragon has given the Navy the green light to send the Admirals in after him. But the Straw Hats get help from an unexpected source--a mysterious outlaw who knows all about Gold Roger, the original King of the Pirates!"
            }
        },
        comments: {
            "0a272c58-b7ea-4e09-a000-7ec988248f66": {
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                content: "Great recipe!",
                recipeId: "8f414b4f-ab39-4d36-bedb-2ad69da9c830",
                _createdOn: 1614260681375,
                _id: "0a272c58-b7ea-4e09-a000-7ec988248f66"
            }
        },
        likes: {
        }
    };
    var settings = {
        identity: identity,
        protectedData: protectedData,
        seedData: seedData
    };

    const plugins = [
        storage(settings),
        auth(settings),
        util$2()
    ];

    const server = http__default['default'].createServer(requestHandler(plugins, services));

    const port = 3030;
    server.listen(port);
    console.log(`Server started on port ${port}. You can make requests to http://localhost:${port}/`);
    console.log(`Admin panel located at http://localhost:${port}/admin`);

    var softuniPracticeServer = {

    };

    return softuniPracticeServer;

})));

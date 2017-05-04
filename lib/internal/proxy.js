/*!
 * Copyright 2014 Apereo Foundation (AF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var http = require('http');
var xml2js = require('xml2js');

var executeBBBCall = module.exports.executeBBBCall = function (url, callback) {
    http.request(url, _callResultHandler(callback, null)
    ).on('error', function(err){
        log().info('problem with request: ' + err);
        return callback(err);
    }).end();
};

var executeBBBCallExtended = module.exports.executeBBBCallExtended = function (fullURL, responseType, method, data, contentType, callback) {

    var url = require("url");
    var urlParts = url.parse(fullURL, true);

    // option defaults
    var options = {'port' : 80, 'method' : 'GET'};
    options.hostname = urlParts.hostname;
    options.path = urlParts.path;
    if (urlParts.port) {
        options.port = urlParts.port;
    }

    if (method && method === 'post') {
        options.method = 'POST';
        var headers = {'Content-Type' : 'text/xml'};
        if(contentType) {
            headers['Content-Type'] = contentType; // Regulaly 'application/x-www-form-urlencoded';
        }

        if (data) {
            /** global: Buffer */
            headers['Content-Length'] = Buffer.byteLength(data);
        }
        options.headers = headers;
    }

    var req = http.request(options, _callResultHandler(callback, responseType)
    ).on('error', function(err){
        log().info('problem with request: ' + err);
        return callback(err);
    });

    if (options.method = 'POST' && data) {
        req.write(data);
    }

    req.end();
};

var _callResultHandler = function(callback, type) {
    return function(res) {
        var parseString = xml2js.parseString;

        res.setEncoding('utf8');
        var completeResponse = '';
        res.on('data', function (chunk) {
            completeResponse += chunk;
        });
        res.on('end', function() {
            if (type === 'raw') {
                return callback(null, completeResponse);
            }

            parseString(completeResponse, {trim: true, explicitArray: false}, function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (type === null || 'response' in result) {
                    return callback(null, result['response']);
                } else {
                    return callback(null, result);
                }
            });
        });
    }
}

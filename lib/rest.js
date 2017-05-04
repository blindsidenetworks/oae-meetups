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

var log = require('oae-logger').logger('oae-meetups-rest');
var OAE = require('oae-util/lib/oae');
var Config = require('oae-config').config('oae-meetups');
var MeetupsAPI = require('oae-meetups');
var MeetupsConstants = require('oae-meetups/lib/constants').MeetupsConstants;

/**
 * @REST executeJoinApiCall
 *
 * Get a response for the action
 *
 * @Server      tenant
 * @Method      GET
 * @Path        /meetup/{groupId}/join
 * @PathParam   {string}                groupId             The id of the meetup to get
 * @HttpResponse                        301                 Redirects to BBB server meetup URL
 * @HttpResponse                        400                 groupId must be a valid resource id
 * @HttpResponse                        401                 You are not authorized to view this meetup
 * @HttpResponse                        404                 Could not find the specified meetup
 */
OAE.tenantRouter.on('get', '/api/meetup/:groupId/join', function(req, res) {
    //// Forbid action if BBB is disabled
    if (!Config.getValue(req.ctx.tenant().alias, 'bbb', 'enabled')) {
        res.send(403, 'Action forbiden');
    }

    MeetupsAPI.Meetups.joinMeetup(req.ctx, req.params.groupId, function(err, joinInfo) {
        if(err) {
            res.send(503, 'Fatal error');
        }

        //Join the meetup
        res.writeHead(301, {Location: joinInfo.url} );
        res.end();
    });
});

/**
 * @REST executeMeetupRecordingApiCall
 *
 * Get a response for the action
 *
 * @Server      tenant
 * @Method      GET
 * @Path        /meetup/{groupId}/recording
 * @PathParam   {string}                groupId             The id of the group to add recording
 * @Return      {void}
 * @HttpResponse                        200                 Recording ready notification successfully received
 * @HttpResponse                        401                 You are not authorized to view this meetup
 */
OAE.tenantRouter.on('post', '/api/meetup/:groupId/recording', function(req, res) {
    log().info('recording');

    MeetupsAPI.Meetups.createRecordingLink(req.ctx, req.params.groupId, req.body.signed_parameters, function(err) {
        if (err) {
            res.send(err.code, null);
        }
        res.send(200, null);
    });
});

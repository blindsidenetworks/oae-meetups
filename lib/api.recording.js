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

 var MeetupsDAO = require('./internal/dao');

 var BBBProxy = require('./internal/proxy');
 var ContentAPI = require('oae-content/lib/api');

 var createRecording = function(ctx, decoded, groupProfile, recordings, callback) {
     // get the meeting info
     BBBProxy.executeBBBCall(recordings.url, function(err, recordingsInfo) {
         if(recordingsInfo && recordingsInfo.returncode === 'SUCCESS' && recordingsInfo.recordings) {
             var recordings = recordingsInfo.recordings.recording;
             var members = {};
             members[groupProfile.id] = 'viewer';

             // make sure recordings is an array before proceeding
             var temp = recordings;
             recordings = [];
             recordings.push(temp);

             var numRecordings = recordings.length;

             var highest = 0;
             for (var r = 0; r < numRecordings; r++) {

                 if (parseInt(recordings[r].startTime) > parseInt(recordings[highest].startTime)) {
                     highest = r;
                 }
             }

             var date = new Date(parseInt(recordings[highest].endTime));
             var link = recordings[highest].playback.format[0] ? recordings[highest].playback.format[0].url : recordings[highest].playback.format.url;
             MeetupsDAO.getRecording(decoded.record_id, function (err, recording){
                 if (err) {
                     log().info(err);
                 } else if (!recording) {
                     ContentAPI.createLink(ctx, groupProfile.displayName + " - " + date.toString(), 'description', 'private', link, members, [], function(err, contentObj) {
                         if (err) {
                             log().info(err);
                         } else if (contentObj) {
                             MeetupsDAO.createRecording(decoded.record_id, contentObj.id, ctx.user().id, null);
                         }
                     });
                 }
                 //do nothing if recording
             });
         }
     });
 }

 var deleteRecording = function(recordingsInfo, recordingID, callback) {
     // delete recordings from BBB server
     BBBProxy.executeBBBCall(recordingsInfo.url, function(err, recordingsInfo) {
         if(recordingsInfo && recordingsInfo.returncode === 'SUCCESS') {
             //delete the recording from Cassandra
             MeetupsDAO.deleteRecording(recordingID, function(err) {
                 if (err) {
                     return callback(err);
                 }

                 return callback(null);
             });
         } else if(err) {
             return callback(err);
         }
     });
 }

 module.exports = {
     'createRecording': createRecording,
     'deleteRecording': deleteRecording,
 };

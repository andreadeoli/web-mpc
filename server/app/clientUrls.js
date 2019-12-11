/**
 * Route endpoints for managing and retreiving user keys and associated urls.
 * The endpoints are executed AFTER payload validation and authentication are successful.
 */

// DB Operation Wrappers
const modelWrappers = require('../models/modelWrappers.js');
const config = require('../config/config.js');
const helpers = require('./helpers.js');
const emailHelper = require('./emailHelper.js');
const table_template = require('../../client/app/' + config.client.table_template + '.js');

const MAX_SIZE = config.MAX_SIZE;

// Export route handlers
module.exports = {};

// end point for setting the number of cohorts in a session
module.exports.createNewCohort = function (context, body, response, sessionInfoObj) {
  // Password verified already by authentication!
  if (sessionInfoObj.status !== 'PAUSE') {
    response.status(500).send('Session status is ' + sessionInfoObj.status);
    return;
  }
  const cohortMapping = sessionInfoObj.cohort_mapping;

  for (var c of cohortMapping) {
    if (c.name === body.cohort) {
      response.status(500).send('Cohort already exists.');
      return;
    }
  }

  const cohortNum = cohortMapping.length;

  // Do not need to verify since joi already did it
  sessionInfoObj.cohorts = cohortNum;
  sessionInfoObj.cohort_mapping.push({id: cohortNum, name: body.cohort});

  // Update sessionInfo in database
  var promise = modelWrappers.SessionInfo.update(sessionInfoObj);
  promise.then(function () {
    console.log('Updated cohorts:', body.session, sessionInfoObj.cohorts);
    response.json({cohortId: cohortNum, cohortMapping: sessionInfoObj.cohort_mapping});
  }).catch(function (err) {
    console.log('Error creating new cohort', err);
    response.status(500).send('Error during session cohorts update.');
  });
};

module.exports.sendResultEmails = function(context, body) {
  emailHelper.sendResultEmail(body.session, body.participants, body.result, body.shouldSendParticipants);
}

// Need to get cohorts from multiple locations
module.exports.getCohorts = function (context, body, res) {
  var promise = modelWrappers.SessionInfo.get(body.session);

  promise.then(function (data) {
    res.json({cohorts: data.cohort_mapping});

  }).catch(function (err) {
    console.log('Error getting cohorts', err);
    res.status(500).send('Error getting cohorts.');
  });
};

// endpoint for returning previously created client urls
module.exports.getClientUrls = function (context, body, res) {
  // Password verified already by authentication!
  var promise = modelWrappers.UserKey.query(body.session);

  promise.then(function (data) {
    var urls = {};
    for (var d of data) {
      var cohort = table_template.cohort_selection === true ? 0 : d.cohort;
      var arr = urls[cohort] == null ? [] : urls[cohort];
      arr.push('?session=' + body.session + '&participationCode=' + d.userkey);
      urls[cohort] = arr;
    }

    console.log('URLs fetched:', body.session);
    res.json({ result: urls });
  }).catch(function (err) {
    console.log('Error in getting client urls', err);
    res.status(500).send('Error getting participation codes.')
  });
};

// endpoint for returning participant info
module.exports.getParticipantInfo = function (context, body, res) {
  // Password verified already by authentication!
  var promise = modelWrappers.UserKey.query(body.session);

  promise.then(function (data) {
    var participantInfo = {};
    for (var d of data) {
      var cohort = table_template.cohort_selection === true ? 0 : d.cohort;
      var arr = participantInfo[cohort] == null ? [] : participantInfo[cohort];
      arr.push({userkey: d.userkey, email: d.email, name: d.name });
      participantInfo[cohort] = arr;
    }

    console.log('Participant info fetched:', body.session);
    res.json({ result: participantInfo });
  }).catch(function (err) {
    console.log('Error in getting participant info', err);
    res.status(500).send('Error getting participation codes.')
  });
};

// endpoint for creating new client urls
module.exports.createClientUrls = function (context, body, response, sessionInfoObj) {
  var cohortId = body.cohort;

  var promise = modelWrappers.UserKey.query(body.session);
  promise.then(function (data) {
    var count = 1 + data.length; // starts at 1, because the first party is the analyst
    if (body.participantInfo.length + count > MAX_SIZE) {
      response.status(500).send('Maximum size exceeded by query, only ' + (MAX_SIZE - count) + ' parties can be added.');
      return;
    }

    var userKeys = {}; // fast lookup
    var jiffIds = {}; // fast lookup

    for (var d of data) {
      userKeys[d.userkey] = true;
      jiffIds[d.jiff_party_id] = true;
    }

    // Create count many unique (per session) user keys.
    let resultingInfos = [], dbObjs = [];
    let participantInfo = body.participantInfo;

    for (var i = 0; i < Math.min(participantInfo.length, MAX_SIZE - count);) {
      var userkey = helpers.generateRandomBase32();

      var jiff_party_id = context.jiff.serverInstance.helpers.random(MAX_SIZE - 1);
      jiff_party_id = parseInt(jiff_party_id.toString(), 10) + 2;  // in case of BigNumber objects

      // If user key already exists, repeat.
      if (userKeys[userkey] || jiffIds[jiff_party_id]) {
        continue;
      }

      // Mark as used
      userKeys[userkey] = true;
      jiffIds[jiff_party_id] = true;

      let name = participantInfo[i].name;
      let email = participantInfo[i].email;
      let url = '?session=' + body.session + '&participationCode=' + userkey;
      emailHelper.sendEmail(body.session, email, url);

      // Generate URL and add dbObject
      resultingInfos.push({
        name: name,
        email: email,
        userkey: userkey,
        session: body.session,
        url: url
      });
      dbObjs.push({
        session: body.session,
        userkey: userkey,
        name: participantInfo[i].name,
        email: participantInfo[i].email,
        jiff_party_id: jiff_party_id,
        cohort: cohortId
      });
      i++;
    }

    // Save the userKeys into the db.
    var promise = modelWrappers.UserKey.insertMany(dbObjs);
    promise.then(function () {
      console.log('URLs generated:', body.session, resultingInfos);
      response.json({ result: resultingInfos, cohort: cohortId });
    }).catch(function (err) {
      console.log('Error in inserting client urls', err);
      response.status(500).send('Error during storing keys.');
    });
  }).catch(function (err) {
    console.log('Error getting client urls in createClientUrls', err);
    response.status(500).send('Error getting participation codes.');
  });
};

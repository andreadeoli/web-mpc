/* eslint-env node, mocha */
const assert = require('assert');

// Helpers
const driverWrapper = require('./helpers/driver.js');
const compute = require('./helpers/compute.js');
const csv = require('./helpers/csv.js');

const tableTemplate = require('../../client/app/data/election.js');

// import test API
const session = require('./api/session.js');
const manage = require('./api/manage.js');
const submission = require('./api/submission.js');
const unmasking = require('./api/unmasking.js');

const UPLOAD_FILE = '/test/selenium/files/election.xlsx';

describe('Election Tests', function () {
  // Create the chrome driver before tests and close it after tests
  before(function () {
    driverWrapper.create();
  });
  after(function () {
    driverWrapper.quit();
  });

  // End-to-end Workflow
  describe('End-to-end Workflow', function () {
    let sessionKey, password, links, driver, inputs, clientCohortMap;

    const COHORT_COUNT = tableTemplate.cohorts.length;
    const CONTRIBUTOR_COUNT = 20;
    const RESUBMISSION_COUNT = 7;

    before(function () {
      driver = driverWrapper.getDriver();
      inputs = { all: [] };
    });

    // Create session
    it('Session Creation', async function () {
      let returned = await session.createSession(driver);
      sessionKey = returned.sessionKey;
      password = returned.password;
    });

    // Generate Participation Links
    it('Generate Links', async function () {
      await manage.login(driver, sessionKey, password); // Login to Session Management
      links = await manage.generateLinksNoCohorts(driver, CONTRIBUTOR_COUNT);
    });

    // Start Session
    it('Start Session', async function () {
      await manage.changeSessionStatus(driver, 'start');
    });

    // Submit
    it('Data Submissions', async function () {
      clientCohortMap = {};
      for (let i = 0; i < links.length; i++) {
        const cohort = (i % COHORT_COUNT) + 1;
        const uploadFile = i % 3 === 0 ? UPLOAD_FILE : undefined;

        const submissionID = '\tSubmission: ' + (i+1) + '. Cohort: ' + cohort + '. ' + (uploadFile == null ? 'Manual' : 'Upload');
        console.time(submissionID);
        const input = await submission.submitCohortSelf(driver, links[i], cohort, uploadFile);
        console.timeEnd(submissionID);

        // Add input to inputs
        const cohortInputs = inputs[cohort] || [];
        cohortInputs.push(input);
        inputs[cohort] = cohortInputs;
        inputs['all'].push(input);

        // Remember cohort
        clientCohortMap[i] = { cohort: cohort, index: cohortInputs.length-1 };
      }
    });

    // Resubmissions
    it('Data Resubmissions', async function () {
      for (let i = 0; i < RESUBMISSION_COUNT; i++) {
        // force the first party to first resubmit 3 times to randomly chosen (possibly overlapping) cohorts
        // just to test several resubmissions by the same party
        // other resubmissions are chosen randomly
        const submitter = i < 3 ? 0 : Math.floor(Math.random() * links.length);
        const link = links[submitter];

        // change cohort randomly with probability 0.5
        const randomCohort = Math.floor(Math.random() * (COHORT_COUNT - 1)) + 1;
        const oldCohort = clientCohortMap[submitter]['cohort'];
        const cohort = Math.random() < 0.5 ? randomCohort : oldCohort;

        // Randomly choose upload or manually (with equal likelihood)
        const uploadFile = Math.random() < 0.5 ? UPLOAD_FILE : undefined;

        // Logging message
        const submissionID = '\tResubmission #: ' + (i+1) + '. Replacing: ' + (submitter+1)
          + '. Old Cohort: ' + oldCohort + '. New Cohort: ' + cohort + '. '
          + (uploadFile == null ? 'Manual' : 'Upload');

        // Resubmit
        console.time(submissionID);
        const input = await submission.submitCohortSelf(driver, link, cohort, uploadFile);
        console.timeEnd(submissionID);

        // Add new input to inputs
        const cohortInputs = inputs[cohort] || [];
        cohortInputs.push(input);
        inputs[cohort] = cohortInputs;
        inputs['all'][submitter] = input; // replace old input

        // Remove previous submission in cohort
        var oldCohortIndex = clientCohortMap[submitter]['index'];
        inputs[oldCohort][oldCohortIndex] = null;
        clientCohortMap[submitter] = { cohort: cohort, index: cohortInputs.length-1 };
      }

      // remove nulls
      for (let i = 0; i < COHORT_COUNT; i++) {
        if (inputs[i+1] == null) {
          inputs[i + 1] = [];
        }
        inputs[i + 1] = inputs[i + 1].filter(input => input != null);
      }
    });

    // Stop session
    it('Stop Session', async function () {
      await manage.login(driver, sessionKey, password);
      await manage.changeSessionStatus(driver, 'stop');
    });

    // Verify History is correct with all resubmissions
    it('Verify History', async function () {
      const history = await manage.getHistory(driver, COHORT_COUNT);
      for (let cohort = 1; cohort <= COHORT_COUNT; cohort++) {
        assert.equal(history[cohort], (inputs[cohort] || []).length, 'Incorrect submission count in history for cohort ' + cohort);
      }
    });

    // Verify participation link are *exactly* the same (including order)
    it('Verify Participation Links', async function () {
      const newLinks = await manage.getExistingLinksNoCohorts(driver);
      assert.deepEqual(newLinks, links, 'Participation links have changed after submission and resubmission');
    });

    // Sleep to give server time to finish processing
    it('Sleep 20 seconds', async function () {
      await driver.sleep(20000);
    });

    // Unmask
    it('Unmasking', async function () {
      const { tablesContent, averagesContent, deviationsContent } = await unmasking.unmask(driver, sessionKey, password, inputs['all'][0].length);

      // Parse CSV and check results are correct
      const { cohorts: averagesCohorts, parsed: averages } = csv.parseCSVCohorts(averagesContent);
      const { cohorts: deviationsCohorts, parsed: deviations } = csv.parseCSVCohorts(deviationsContent);

      // Check cohorts are what we expected
      averagesCohorts.sort();
      deviationsCohorts.sort();
      const cohorts = Object.keys(inputs).filter(i => (i !== 'all' && inputs[i].length > 0)).sort();

      assert.deepEqual(averagesCohorts, cohorts, 'Average CSV file does not have correct cohorts');
      assert.deepEqual(deviationsCohorts, [], 'Standard Deviation CSV file does not have correct cohorts (should have only "all")');

      // Verify results for UI
      const allAverage = compute.computeAverage(inputs['all']);
      const allDeviation = compute.computeDeviation(inputs['all']);
      assert.deepEqual(tablesContent, allAverage, 'UI Average over all cohorts is incorrect');

      // Verify results from csv
      assert.equal(averages['all'].count, inputs['all'].length, 'CSV Average over all cohorts has incorrect # of participants');
      assert.deepEqual(averages['all'].values, allAverage, 'CSV Average over all cohorts is incorrect');

      assert.equal(deviations['all'].count, inputs['all'].length, 'CSV Deviation over all cohorts has incorrect # of participants');
      assert.deepEqual(deviations['all'].values, allDeviation, 'CSV Deviation over all cohorts is incorrect');

      // Check each cohort
      for (const cohort of cohorts) {
        const cohortAverage = compute.computeAverage(inputs[cohort]);
        assert.equal(averages[cohort].count, inputs[cohort].length, 'CSV Average - Cohort ' + cohort + ' has incorrect # of participants');
        assert.deepEqual(averages[cohort].values, cohortAverage, 'CSV Average - Cohort ' + cohort + ' has incorrect # of participants');
      }
    });
  });

  describe('UI Tests', function () {
    const CONTRIBUTOR_COUNT = 100;
    const UNASSIGNED_COHORT = '0';

    let driver;

    // Create the chrome driver before tests and close it after tests
    before(function () {
      driver = driverWrapper.getDriver();
    });

    // Test that creating a session with empty title/description gives errors
    describe('/create', function () {
      it('Empty session information', async function() {
        await session.createEmptySession(driver);
      });
    });

    // Test that we can download participation links properly
    describe('/manage', function () {
      it('Download links', async function() {
        let returned = await session.createSession(driver);
        const sessionKey = returned.sessionKey;
        const password = returned.password;
        await manage.login(driver, sessionKey, password); // Login to Session Management
        await manage.downloadLinks(driver, UNASSIGNED_COHORT, 0);
        await manage.generateLinksNoCohorts(driver, CONTRIBUTOR_COUNT);
        await manage.downloadLinks(driver, UNASSIGNED_COHORT, CONTRIBUTOR_COUNT);
      });
    });
  });
});

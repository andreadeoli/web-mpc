/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

define(['jquery', 'controllers/jiffController', 'controllers/tableController', 'controllers/analystController', 'helper/drop_sheet', 'alertHandler', 'table_template', 'spin', 'forge'],
  function ($, jiffController, tableController, analystController, DropSheet, alertHandler, table_template, Spinner, forge) {
    function error(msg) {
      alertHandler.error(msg);
    }

    function handle_file(event) {
      var f;

      var dropArea = document.getElementById('drop-area');
      var spinner = new Spinner().spin(dropArea);

      if (event.type === 'drop') {
        f = event.dataTransfer.files[0];
      } else if (event.type === 'change') {
        f = event.target.files[0];
      }

      if (f) {
        var keyReader = new FileReader();
        keyReader.readAsText(f);

        $(keyReader).on('load', function (e) {
          var sessionKey = $('#session').val();
          var sessionPass = $('#session-password').val();
          var privateKey = e.target.result;

          jiffController.analyst.computeAndFormat(sessionKey, sessionPass, privateKey, error, function (result) {
            analystController.getExistingCohorts(sessionKey, sessionPass).then(function (cohortMapping) {
              tableController.saveTables(result['averages'], sessionKey, 'Averages', result['cohorts'], cohortMapping);
              tableController.saveTables(result['deviations'], sessionKey, 'Standard_Deviations', result['cohorts'], cohortMapping);
              tableController.saveTables(result['sums'], sessionKey, 'Sums', result['cohorts'], cohortMapping);

            });

            if (result['hasQuestions'] === true) {
              tableController.saveQuestions(result['questions'], sessionKey, result['cohorts']);
            }
            if (result['hasUsability'] === true) {
              tableController.saveUsability(result['usability'], sessionKey, result['cohorts']);
            }
            console.log(result);
            $('#tables-area').show();
            $('#participant-list').show();

            spinner.stop();

            // Only display sums in the table
            tableController.createTableElems(table_template.tables, '#tables-area');
            tableController.displayReadTable(result['sums']['all']);

            let votersPromise = analystController.getVotingRecord(sessionKey, sessionPass);
            let voterInfoPromise = analystController.getExistingParticipants(sessionKey, sessionPass);
            Promise.all([votersPromise, voterInfoPromise]).then(function (datas) {
              let voterKeys = datas[0].map(enc => decryptUserKeyString(privateKey, enc));
              let participantInfos = datas[1];
              let nameEmailStrings = [];
              for (let cohort in participantInfos) {
                if (participantInfos[cohort] != null) {
                  for(let i = 0; i < participantInfos[cohort].length; i++) {
                    let elem = participantInfos[cohort][i];
                    if(voterKeys.indexOf(elem.userkey) >= 0) {
                      nameEmailStrings.push(elem.name + ", " + elem.email);
                    }
                  }
                }
              }
              var participantContainer = $('#participant-list');
              for(let i = 0; i < nameEmailStrings.length; i++) {
                $('<p>').text(nameEmailStrings[i])
                  .appendTo(participantContainer);
              }
            });
          });
        });
      }
    }

    function decryptUserKeyString(privateKeyStr, encryptedUserKey) {
      let pk = forge.pki.privateKeyFromPem(privateKeyStr);
      return pk.decrypt(encryptedUserKey, 'RSA-OAEP', { md: forge.md.sha256.create() });
    }

    function expandTable(button, area) {
      var expand_button = $(button);

      $(expand_button).click(function () {
        var ta = $(area);
        if (ta.css('display') === 'none') {
          ta.show();
        } else {
          ta.hide();
          tableController.resetTableWidth()
        }
      });
    }

    function unmaskView() {
      $(document).ready(function () {
        $('#tables-area').hide();
        $('#participant-list').hide();
        expandTable("#expand-table-button", '#tables-area');
        expandTable("#expand-participant-list", '#participant-list');

        var _target = document.getElementById('drop-area');
        var _choose = document.getElementById('choose-file-button');

        DropSheet({
          drop: _target,
          choose: _choose,
          on: {},
          errors: {},
          handle_file: handle_file
        });
      });
    }

    return unmaskView;
  }
);

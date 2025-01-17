define(['jquery', 'controllers/analystController', 'table_template', 'Ladda', 'filesaver', 'alertHandler', 'bootstrap'], function ($, analystController, tableTemplate, Ladda, filesaver, alertHandler) {
  function trackView() {
    var SELF_SELECT = false;
    var session, password;

    var sessionParam = analystController.getParameterByName('session');
    if (sessionParam) {
      $('#session').val(sessionParam);
    }

    // Login
    $('#login').on('click', function (e) {
      e.preventDefault();
      session = $('#session').val();
      password = $('#password').val();

      if (!session || !password) {
        alertHandler.error('Enter a valid Session Key and Password');
        return;
      }

      setInterval(function () {
        analystController.checkStatus(session, password).then(function (sessionInfo) {
          if (sessionInfo.status === 'STOP') {
            changeStatusButtons('STOP');
          }
        });
      }, 2000);

      analystController.checkTime(session, password).then(function (sessionInfo) {
        $("#expiration_message").text("This election has an expiration of " + sessionInfo.time);
      });

      var la = Ladda.create(document.getElementById('login'));
      la.start();

      let participantPromise = analystController.getExistingParticipants(session, password)
        .then(participantInfo => {
          let piMap = {};
          for (let cohort in participantInfo) {
            piMap[cohort] = participantInfo[cohort] !== null
              ? participantInfo[cohort].map(pi => pi.name + ", " + pi.email)
              : [];
          }
          return piMap;
        });
      var statusPromise = analystController.checkStatus(session, password);
      Promise.all([participantPromise, statusPromise]).then(function (results) {
        // Only logs in if both requests succeed
        var existingParticipants = results[0];
        var status = results[1];

        // if self-selection, add participant agnostic link div
        if (Object.keys(tableTemplate).includes('cohort_selection') && tableTemplate['cohort_selection']) {
          SELF_SELECT = true;

          var unassignedCohort = '0';

          $('#session-content-left').append(createLinkGeneration(unassignedCohort));

          $('#cohort-0').removeClass('col-md-4');
          $('#cohort-0').addClass('card');

          enableCohortSubmit(unassignedCohort);

          var $cohortArea = $('#cohort-area').addClass('col-sm-7 card col-md-offset-1');
          var $historyTitle = document.createElement('h2');
          $historyTitle.setAttribute('class', 'text-center');
          $historyTitle.innerText = 'Submission History';
          $cohortArea.append($historyTitle);
          $('#session-content').append($cohortArea);

          createAndEnableDownloadBtn(unassignedCohort);

        } else {
          $('#cohort-card').collapse();
        }

        if (Object.keys(tableTemplate).includes('cohorts') && tableTemplate['cohorts'].length > 0) {
          analystController.getExistingCohorts(session, password).then(function (cohorts) {
            for (var c of cohorts) {
              createCohort(c.name, c.id);
              enableCohortSubmit(c.id);
            }

            handleExistingParticipants(existingParticipants);
            pollHistory(session, password, 0, cohorts);
          });
        }

        // Handle status
        changeStatusButtons(status.status);

        // Remove login panel and show control panel
        $('#session-login').collapse();
        $('#session-panel').collapse();
      }).catch(function (error) {
        la.stop();
        alertHandler.error(error.message);
      });
    });

    $('#cohort-generate').on('click', function (e) {
      e.preventDefault();

      var cohortName = $('#cohort-input').val();
      analystController.addCohort(session, password, cohortName).then(function (res) {
        if (res != null) {
          var cohortId = res.cohortId.toString();
          createCohort(cohortName, cohortId);
          enableCohortSubmit(cohortId);

          // scroll to correct cohort
          $('html, body').animate({
            scrollTop: $('#' + cohortId).offset().top
          }, 500);
        }
      });
    });

    function createAndEnableDownloadBtn(cohort) {
      var btn = $('<div class="form-group"><button type="submit" id="participants-download-'+ cohort +'" class="btn btn-primary btn-block">Download Participant Info</button></div>');
      $('#cohort-' + cohort).append(btn);
      $('#participants-download-' + cohort).on('click', function (e) {
        var allLinks = [];
        var newLinks = $('#participants-new-' + cohort).text().split('\n');

        if (newLinks.length > 1 || (newLinks.length === 1 && newLinks[0].includes('session'))) {
          allLinks = allLinks.concat(newLinks);
        }

        var existingLinks = $('#participants-existing-' + cohort).text().split('\n');
        if (existingLinks.length > 1 || (existingLinks.length === 1 && existingLinks[0].includes('session'))) {
          allLinks = allLinks.concat(existingLinks);
        }

        if (allLinks.length > 0) {
          filesaver.saveAs(new Blob([allLinks.join('\n')], {type: 'text/plain;charset=utf-8'}), 'Participant_Links_' + allLinks.length +  '.csv');
        } else {
          alertHandler.error('No participant links to download. Please enter new participants.');
        }
      });
    }

    // Handle existing participants
    function handleExistingParticipants(existingParticipants) {
      // Handle cohort-agnostic links
      if (existingParticipants['undefined'] && $('#participants-existing-null')) {
        var urls = existingParticipants['undefined'];
        var $existingParticipants = $('#participants-existing-null');
        $existingParticipants.html(urls.join('\n'));
      }

      for (var cohortId in existingParticipants) {
        if (!existingParticipants.hasOwnProperty(cohortId)) {
          continue;
        }

        urls = existingParticipants[cohortId];
        $existingParticipants = $('#participants-existing-' + cohortId);
        $existingParticipants.html(urls.join('\n'));
      }
    }

    function createCohort(cohortName, cohortId) {
      var $cohortDiv = createCohortContainer(cohortName, cohortId);
      $('#cohort-area').append($cohortDiv);

      if (!SELF_SELECT) {
        $cohortDiv.append(createLinkGeneration(cohortId));
      }
      $cohortDiv.append(displayCohortHistory(cohortName, cohortId));
    }

    // Manage session
    $('#session-start').on('click', function (e) {
      e.preventDefault();
      analystController.changeStatus(session, password, analystController.START)
        .then(function () {
          changeStatusButtons(analystController.START);
        });
    });

    $('#session-pause').on('click', function (e) {
      e.preventDefault();
      analystController.changeStatus(session, password, analystController.PAUSE)
        .then(function () {
          changeStatusButtons(analystController.PAUSE);
        });
    });

    $('#session-stop').on('click', function (e) {
      e.preventDefault();
    });

    $('#session-close-confirm').on('click', function (e) {
      e.preventDefault();
      analystController.changeStatus(session, password, analystController.STOP)
        .then(function () {
          changeStatusButtons(analystController.STOP);
        });
    });

    function pollHistory(session, password, timestamp, cohortMapping) {
      var previous = Date.now();
      analystController.getSubmissionHistory(session, password, timestamp)
        .then(function (res) {
          if (res != null) {
            for (var cohort in res) {
              if (res.hasOwnProperty(cohort)) {
                displaySubmissionHistory(cohort, res[cohort].history, res[cohort].count);
              }
            }
          }

          // Poll every 10 seconds
          setTimeout(function () {
            pollHistory(session, password, previous, cohortMapping)
          }, 10000);
        });
    }

    function displaySubmissionHistory(cohort, data, resubmissionCount) {
      var count = $('#table-' + cohort + ' tbody tr').length;
      for (var i = 0; i < data.length; i++) {
        count++;

        $('#table-' + cohort + ' tbody').append(
          $('<tr>')
            .append('<td>' + count + '</td>')
            .append('<td>' + new Date(data[i]).toLocaleString() + '</td>')
        );
      }

      var counter = $('#table-' + cohort + ' thead i');
      counter.html(parseInt(counter.html()) + resubmissionCount);
    }

    function isValidEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).trim().toLowerCase());
    }

    function parseParticipantInfo(participantInfoStr) {
      let parsed = [];
      let lines = participantInfoStr.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === "") continue;
        let nameEmail = lines[i].split(",");
        if (nameEmail.length !== 2 || !isValidEmail(nameEmail[1]))
          return -1;
        parsed.push({
          name: nameEmail[0].trim(),
          email: nameEmail[1].trim()
        });
      }
      return parsed;
    }

    function enableCohortSubmit(cohortId) {
      $('#participants-submit-' + cohortId).on('click', function (e) {
        e.preventDefault();

        var la = Ladda.create(document.getElementById('participants-submit-' + cohortId));
        la.start();

        let participantInfo = parseParticipantInfo(document.getElementById("participant-info").value);

        if (participantInfo === -1) {
          alertHandler.error("Could not parse the participant info, please follow the specified format.");
          la.stop();
          return;
        } else if (participantInfo.length === 0) {
          alertHandler.error("Please enter at least one new participant.");
          la.stop();
          return;
        }

        analystController.generateNewParticipationCodes(session, password, participantInfo, cohortId)
          .then(function (res) {

            var $newParticipants = $('#participants-new-' + cohortId);
            if ($newParticipants.html() !== '') {
              $newParticipants.append('\n');
            }

            $newParticipants.append(res[cohortId].join('\n')).removeClass('hidden');
            $('#participants-new-hr-' + cohortId).removeClass('hidden');
            $('#participants-new-h2-' + cohortId).show();
            la.stop();
          });
      });
    }

    function displayCohortHistory(cohortName, cohortId) {

      // Create new elements
      var $historySection = document.createElement('div');

      var $historyTable = document.createElement('table');
      $historyTable.setAttribute('id', 'table-' + cohortId);
      $historyTable.setAttribute('class', 'table table-striped');

      var $historyNum = document.createElement('h4');
      var $thead = document.createElement('thead');
      var $tbody = document.createElement('tbody');
      var $tr = document.createElement('tr');
      var $idCell = document.createElement('th');
      var $timeCell = document.createElement('th');
      var $header = document.createElement('div');
      var $title;
      $header.setAttribute('class', 'text-center');

      if (SELF_SELECT) {
        $historyTable.style.marginBottom = '75px';
        $title = document.createElement('h3');
        $title.setAttribute('class', 'historySubTitle');
        $title.innerText = cohortName;
        $header.appendChild($title);
      } else {
        $title.innerText = 'Submission History';
        $header.appendChild($title);
        $historySection.setAttribute('class', 'col-md-7 col-md-offset-1');
      }

      // Attach elements
      $historySection.appendChild($header);

      $historySection.appendChild($historyTable);
      $historySection.appendChild($historyNum);

      $historyTable.appendChild($thead);
      $historyTable.appendChild($tbody);

      $tr.appendChild($idCell);
      $tr.appendChild($timeCell);
      $thead.appendChild($tr);

      // Content
      // TODO: do we need this if the id already shows how many?
      // $historyNum.innerHTML = 'Total number of submissions: <i>0</i>';
      $idCell.innerText = 'Submission #';
      $timeCell.innerText = 'Timestamp';

      return $historySection
    }

    function createLinkGeneration(cohortId) {
      var $form = $('<form>');
      var $participants = $('<div>', {class: 'form-group'})
        .append('<label class="control-label" for="participants-count">New participants</label>')
        .append('<textarea id="participant-info" class="form-control" rows="10" style="font-size: 11px;" placeholder="John Doe, john.doe@yale.edu\nJane Doe, jane.doe@yale.edu" maxlength="4096"></textarea>')
        .append('<span id="new-participants-success" class="success-icon glyphicon glyphicon-ok form-control-feedback hidden" aria-hidden="true"></span>')
        .append('<span id="new-participants-fail" class="fail-icon glyphicon glyphicon-remove form-control-feedback hidden" aria-hidden="true"></span>')
        .append('<span id="new-participants-fail-help" class="fail-help help-block hidden">Please input participant names and email addresses.</span>');

      var $submitBtn = $('<div>', {class: 'form-group'})
        .append('<button type="submit" id="participants-submit-' + cohortId + '"  class="btn btn-primary ladda-button btn-block">Add Participants</button>');

      $form.append($participants);
      $form.append($submitBtn);

      var $cohortSection = $('<section>', {id: 'cohort-' + cohortId, class: 'col-md-4'})
        .append('<h2 class="text-center">Add Participants</h2>')
        .append('<p class="text-center">Please enter participant names and email addresses in accordance with the format below.</p>')
        .append($form)
        .append('<hr id="participants-new-hr-' + cohortId + '" class="hidden"/>')
        .append('<h2 id="participants-new-h2-' + cohortId + '" class="text-center" style="display:none;">New participants</h2>')
        .append('<pre id="participants-new-' + cohortId + '" class="hidden"></pre>')
        .append('<hr/>')
        .append('<h2 class="text-center">Existing participants</h2>')
        .append('<p class-"text-center">View a list of existing participant names and emals.</p>')
        .append('<pre id="participants-existing-' + cohortId + '">No existing participants found</pre>');

      return $cohortSection;
    }

    function createCohortContainer(cohortName, cohortId) {

      var $cohortDiv = $('<section>', {class: 'row', id: cohortId});
      if (!SELF_SELECT) {
        $cohortDiv.addClass('card')
          .append('<h2 class="text-center">' + cohortName + '</h2>')
          // .append('<p class="text-center">Add new participants and manage existing participation on the left. View cohort submission history on the right</p>')
          .append('<hr/>');
      }

      return $cohortDiv
    }

    function changeStatusButtons(status) {
      var $start = $('#session-start'),
        $pause = $('#session-pause'),
        $stop = $('#session-stop'),
        $sessionStatus = $('#session-status'),
        $sessionUnmask = $('#session-unmask');

      switch (status) {
        case 'START':
          $start.addClass('hidden');
          $pause.removeClass('hidden');
          $stop.removeClass('hidden');
          $sessionStatus.html('STARTED');
          break;
        case 'PAUSE':
          $start.removeClass('hidden');
          $pause.addClass('hidden');
          $stop.removeClass('hidden');
          $sessionStatus.html('PAUSED');
          break;
        case 'STOP':
          $start.addClass('hidden');
          $pause.addClass('hidden');
          $stop.addClass('hidden');
          $sessionStatus.html('STOPPED');
          $sessionUnmask.removeClass('hidden');
          $sessionUnmask.find('a').attr('href', '/unmask?session=' + session);
          break;
      }
    }
  }

  return trackView;
});

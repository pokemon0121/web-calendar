var API_KEY = 'AIzaSyDvCRXC4jHo6OR0Gz2rc3rseF9ZdncCElA';
var CLIENT_ID =
  '1053922014560-ieg507hrun9brjopinvau268bfpj63oc.apps.googleusercontent.com';
var users = [];
var MASTER_COLOR = 'bg-danger';
var COLORS = ['danger', 'success', 'info', 'warning'];
var DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
];
var SCOPES = 'https://www.googleapis.com/auth/calendar';
//var COLORS = ['red', 'green', 'indigo', 'orange'];

var authorizeButton = $('#authorize-button');
var signoutButton = $('#signout-button');

let PRIMARY = 'primary';
let OTHERS = 'others';

let TIMEMIN_FOR_SELF = '2018-02-01T00:00:00-07:00';
let TIMEMIN_FOR_OTHERS = '2018-02-01T00:00:00-07:00';
let TIMEMAX_FOR_OTHERS = '2018-04-01T00:00:00-07:00';

function addUsers(user) {
  $('#user-list')
    .find('ul')
    .append(
      '<li class="list-group-item list-group-item-action list-group-item-warning">' +
        user +
        '</li>'
    );
}

$(function() {
  gapi.load('client:auth2', initClient);
  $('#add-user').on('submit', function(event) {
    event.preventDefault();
    //console.log(event);
    console.log(event.target['0'].value);
    testUser(event.target['0'].value);
    $('#add-user').trigger('reset');
  });
  //console.log('ready to load calendar');
});

function createAttendeesFromUsersList() {
  return users.map(function(user) {
    return {
      email: user
    };
  });
}

function initializeCalendar() {
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    navLinks: true,
    editable: false,
    selectable: true,
    selectHelper: true,
    select: function(start, end) {
      var title = prompt('Please input the title of the event:');
      var eventData;
      if (title) {
        eventData = {
          title: title,
          start: start,
          end: end,
          editable: true,
          className: 'text-white bg-success'
        };
        $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
      }
      $('#calendar').fullCalendar('unselect');
    },
    displayEventTime: true,
    timeFormat: 'h:mmt',
    eventClick: function(event, jsEvent, view) {
      jsEvent.preventDefault();
      // opens events in a popup window
      $('.modal-body').html('');
      const eventDetails =
        'event source: ' +
        event.source.constructor.name +
        '<br>start: ' +
        event.start._d +
        '<br>end: ' +
        (event.end === null ? 'not set' : event.end._d) +
        '<br>title: ' +
        event.title;
      console.log('event: ', event);
      $('.modal-body').html(eventDetails);
      $('#create-event').on(
        'click',
        createEvent({
          sendNotifications: true,
          calendarId: 'primary',
          summary: event.title,
          start: {
            dateTime: event.start._d
          },
          end: {
            dateTime: event.end === null ? '' : event.end._d
          },
          attendees: createAttendeesFromUsersList()
        })
      );
      $('#bookEventModal').modal();
      //console.log('jsEvent: ', jsEvent);
      //console.log('view: ', view);
    }
  });
  console.log('calendar initialized.');
}

function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(function() {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      //console.log(authorizeButton);
      //console.log(document.getElementById('authorize-button'));
      authorizeButton.click(handleAuthClick);
      signoutButton.click(handleSignoutClick);
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    // log in, initialize calendar, get events from primary calendars first
    // and enable submit email address function
    console.log('signed in.');
    console.log(
      'current user: ',
      gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile()
        .getEmail()
    );
    authorizeButton.addClass('d-none');
    signoutButton.removeClass('d-none');
    $('#submit-email').prop('disabled', false);
    $('#input-email').prop('disabled', false);
    initializeCalendar();
    $('#calendar').fullCalendar('render');
    console.log('try to get events from primary calendar');
    gapi.client.calendar.events
      .list({
        calendarId: 'primary',
        timeMin: TIMEMIN_FOR_SELF,
        showDeleted: false,
        singleEvents: true,
        maxResults: 30,
        orderBy: 'startTime'
      })
      .then(function(response) {
        console.log('got events.');
        $('#calendar').fullCalendar(
          'addEventSource',
          createEventObjects(response.result.items, PRIMARY)
        );
        $('#calendar').removeClass('d-none');
      });
  } else {
    console.log('signed out.');
    // when log out destory calendar
    // disable form
    $('#submit-email').prop('disabled', true);
    $('#input-email').prop('disabled', true);
    authorizeButton.removeClass('d-none');
    signoutButton.addClass('d-none');
    $('#calendar').addClass('d-none');
    $('#calendar').fullCalendar('destroy');
  }
}

function createEventObjects(events, type) {
  return events.map(function(event) {
    if (type == PRIMARY) {
      return {
        id: event.id,
        title: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime
      };
    } else if (type == OTHERS) {
      return {
        title: 'busy',
        start: event.start,
        end: event.end,
        className: 'bg-warning'
      };
    } else return {};
  });
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  event.preventDefault();
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  event.preventDefault();
  gapi.auth2.getAuthInstance().signOut();
}

function createEvent(newEvent) {
  return function() {
    console.log('create event clicked.');
    console.log('new event:', newEvent);
    gapi.client.calendar.events.insert(newEvent).then(function(response) {
      console.log(response);
      if (response.status == 200) {
        console.log('created!');
        $('#bookEventModal').modal('hide');
      } else {
        console.log('something went wrong!');
      }
    });
  };
}

function testUser(user) {
  if (
    user ==
    gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getBasicProfile()
      .getEmail()
  )
    return;
  console.log('trying to get query of busy time.');
  gapi.client.calendar.freebusy
    .query({
      timeMin: TIMEMIN_FOR_OTHERS,
      timeMax: TIMEMAX_FOR_OTHERS,
      items: [
        {
          id: user
        }
      ]
    })
    .then(function(response) {
      console.log(response);
      if (response.result.calendars[user].errors) {
        console.log(
          'not valid user or no access to his/her freebusy time: ',
          user
        );
        return;
      }
      // we can access this user's freebusy times
      addUsers(user);
      users.push(user);
      $('#calendar').fullCalendar(
        'addEventSource',
        createEventObjects(response.result.calendars[user].busy, OTHERS)
      );
      console.log('events added');
    });
}

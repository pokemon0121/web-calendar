var API_KEY = 'AIzaSyDvCRXC4jHo6OR0Gz2rc3rseF9ZdncCElA';
var users = ['gardevoir0121@gmail.com', 'yimugao@udel.edu', 'dkaw'];
var MASTER_COLOR = 'bg-danger';
//var COLORS = ['bg-danger', 'bg-success', 'bg-primary', 'bg-warning'];
var COLORS = ['red', 'green', 'indigo', 'orange'];

function showUsers() {
  appendPre('user-list', 'User list:');
  for (var i in users) {
    appendPre('user-list', users[i]);
  }
}

$(document).ready(function() {
  //showUsers();
  //gapi.load('client', start);
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
          className: 'text-white'
        };
        $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
      }
      $('#calendar').fullCalendar('unselect');
    },
    displayEventTime: true,
    timeFormat: 'h:mmt',
    googleCalendarApiKey: API_KEY,
    events: [
      {
        title: 'seewhathappens',
        start: '2018-02-17T17:30:00',
        end: '2018-02-17T18:30:00',
        editable: true,
        color: 'default',
        className: 'text-white'
      }
    ],
    eventSources: users.map(function(user, i) {
      return {
        googleCalendarId: user,
        color: COLORS[i % COLORS.length]
      };
    }),
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
      $('#bookEventModal').modal();
      //console.log('jsEvent: ', jsEvent);
      //console.log('view: ', view);
    }
  });
});

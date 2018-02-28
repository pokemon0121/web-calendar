Calendar app using Google Calendar API and Google OAuth2 for signing in/out.

Brief walkthrough of the app:
Use red button to sign in or out.
Calendar events showed here is from a hardcoded date time range.
Dark blue events are pulled from your calendar.
Add users to this calendar to see their busy/free times(time range hardcoded). If not accessiable, their email will not show in the users list.
Yellow events would be the busy times of other users.
On week agenda view, select multiple time slots to create a event on this app. After creation the event would be green.
Click green events you will have a pop up and you can create this event on your calendar and invite other users(users that are in the user list on the top) to this event. They would get email invitations. Make sure only click once.
If anything is not working, try to refresh.

What you can do here:
Sign in with google account is a must, otherwise you cannot use the app.
You can add other people's email here, and if they shared their busy/free time with you, you can create events and add them as attendees.
Do create event once.

What you don't do:
Create an event many times. This will send multiple API calls of same event, which would flood up your calendar.

What I can add to this app:
Too much things on the todo list, like:
Refactor the code;
Prevent user from creating same events;
Many other unknown bugs;
Add some more work flow and logic of the app;
Support more user interfaces;
...

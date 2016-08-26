<!--### Deliverable

Design user stories, data structures, development stories, and potential challenges for a **racing game** in which two players use the keyboard to control "cars" that race across the screen.

Here are some popular bonus features that would affect your data structure plan:

1. How would you make your player's "cars" use custom images?
2. Can a player type in their name to see custom win messages?
3. Can you enable a reset button to restart the race?
4. How about a win counter that spans across multiple races?

As you work, you can edit this README to add a section at the top with your name, a link to the original repository, and a 3-5 sentence reflection on completing this assignment. Push your updates to GitHub and add a link to the repo to the "My Work" section of your website!-->

#Andrew Vinocur -- WDI 31 -- Project 0: Racing game


##Deliverable 

###User Stories
Before Game Begins: Allow players to enter a name and choose the color of their car

1) At least 2 users will enter into the game w/ their chosen cars

2) A countdown will appear (somewhere visible to both players) and will cue the players to start at the end of the countdown

3) After the countdown, players will "Start" and go around the track

4) After # of laps, the player that crosses the finish line first will win

5) Game ends and players will be given an option to race again

###Data Structures

1) Cars

* Collison box (function)
* Color (CSS/Function)
* Object

2) Track

* Walls (function)

3) Start/Finish line

* (Function) keeps track of players crossing start/finish line

4) Time clock

* (Function) A clock that will expire after a set amount of time preventing infinite races

5) Background

* Image


###Development Stories

1) Users see an intro screen, enter name and choose car color

* HTML to display the screen and JS/jQ to apply name to chosen car

2) Race starts, users press keys to direct their car

* jQuery listener + CSS animation to make it move

3) Players race around the track 

* JS Counter to keep track of laps
* jQ listener to detect collision, crossing of line

4) User that completes # of laps first will be declared winner

* JS/jQ alert that appends to an element in the DOM

###Potential Challenges

*Mapping keys to the different movements

*Determing acceleration/speed of the cars

*Hitboxes to determine crashes



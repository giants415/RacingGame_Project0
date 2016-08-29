<!--### Deliverable

Design user stories, data structures, development stories, and potential challenges for a **racing game** in which two players use the keyboard to control "cars" that race across the screen.

Here are some popular bonus features that would affect your data structure plan:

1. How would you make your player's "cars" use custom images?
2. Can a player type in their name to see custom win messages?
3. Can you enable a reset button to restart the race?
4. How about a win counter that spans across multiple races?

As you work, you can edit this README to add a section at the top with your name, a link to the original repository, and a 3-5 sentence reflection on completing this assignment. Push your updates to GitHub and add a link to the repo to the "My Work" section of your website!-->

#Andrew Vinocur -- WDI 31
##Project 0: Racing Game

####Link: andrewvracinggame.bitballoon.com

##Deliverable 

###Description
Players choose to drive either the blue or orange car by pressing L or A. Upon reaching the end of the track, the users are notified of the winning car by a message above the track and the sound of a cheering crowd.

###User Stories

1) Users read the rules at the top of the page. 

2) Users choose whether to pilot the blue or orange car. 

3) After choosing, players press the corresponding key to make their car move. 

4) After reaching the end of the track, a winner is declared. 

5) Players may manually refresh the page to race again. 

###Data Structures

1) Cars

* Javascript, HTML, CSS

2) Track

* jQuery/Javascript, HTML


###Development Stories

Future: Users will press 0 to begin a countdown for the start of the race.
* Javascript

1) Users press A or L to make cars move.

* jQuery listener, Javascript manipulates padding to make cars advance

2) Once a car reaches the end of the track, a message displays above the track and sound effect plays  

* jQuery/Javascript
* HTML DOM manipulation 


###Future Improvements

* Fixed stopping point when race ends (Solved 8/29, thank you to Misha for the idea)
* Reset button 
* Countdown timer to signal start of the game after user initiation 
* Background image of crowd in the stands



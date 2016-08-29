var audio = new Audio('sounds/99633__tomlija__small-crowd-cheering-and-clapping-2.wav');

$(document).ready( function() {
  console.log("main JS is linked");
  $("#lane1").append('<img class=\"car\" id=\"car1\" src="imgs/blueCar.png" />');
  $("#lane2").append('<img class=\"car\" id=\"car2\" src="imgs/orangeCar.png" />');
  var car1 = document.getElementById('#car1');
  var car2 = document.getElementById('#car2');
  // $("#msgDisplay").append("Imagine a really cool countdown");
  $(document).on("keypress", function(event) {
    $('#msgDisplay').empty();
      if (event.originalEvent.charCode == 97) {
        carMover1();
      } else if (event.originalEvent.charCode == 108) {
        carMover2();
      } else if (event.originalEvent.charCode == 48) {
        ///reset button or game start command
      } else {
        console.log("you didnt press A, L, or 0")
      }
  });
});

function carMover1() {
    $('#car1').css("padding-left", "+=20");
    declareWinner();
}

function carMover2() {
    $('#car2').css("padding-left", "+=20");
    declareWinner();
}

function declareWinner () {
  if ($('#car1').css("padding-left") === "1700px") {
    audio.play();
    $('#msgDisplay').append("Car 1 has won the race!");
    $(document).off("keypress");
  } else if ($('#car2').css("padding-left") === "1700px") {
    audio.play();
    $('#msgDisplay').append("Car 2 has won the race!");
    $(document).off("keypress");
  }
}

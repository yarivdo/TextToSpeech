// Global variables here
var numberOfDigits = 3; // This will be the starting point
var currentDigitsStringInStringFormat;
var numOfRounds = 0;
var minSucceed = 0; // you remebered at least 1 on the two trials in the digits series.
var maxSucceed = 0; // you remembered 2 of the trials inthe same digit-series
var numOfErrors = 0; // Gamelogic is: if two consecutive fails in the same number of digits -> STOP the test
var numOfSuccess = 0; // Game logic: if you succeed 2 consecutive in the same Digits-number --> that's your Max memory length
var startTime;
var endTime;

// Delete the audio files reference
// Add this global variables for the sake of the speech engine
// get all voices that browser offers
var available_voices = window.speechSynthesis.getVoices();
var english_voice = available_voices[0]; // this will hold an english voice (hopefully the first language in the system definition)


// I guess that if we have a different language installed, it will start speaking in Hindu.. or something..


$(document).ready(function () {
    $('#btnSubmit').on("click", checkAnswer);
    $('#userInput').hide();

    // I need to start with a delay of 2 seconds to allow the client to orient himself..
    var countSeconds = 0;
    $('#head').hide();
    var delay = function () {
        if (countSeconds == 1) {
            startTime = new Date().getTime(); // Start the clock
            startRound(3); // Start the test
        } else {
            setTimeout(delay, 1000);
            countSeconds += 1;
        }
    }

    delay();

});




function startRound(numDigits) {
    $('#headline').show().html('Try to recall the next ' + numDigits + " digits");
    $('#displayDigits').html('').show();
    $('#userInput').hide();

    var digitsToDisplay = prepareDigitsString(numDigits);
    var varisFinished = false;

    // Display the digits
    digitCounter = -1; // this is my starting point..... will turn to 0 soon...

    // This is a self-invoking, recursive function.
    //   http://patrickmuff.ch/blog/2014/03/12/for-loop-with-delay-in-javascript/


    (function next() {

        if (digitCounter++ >= numDigits) {
            $('#displayDigits').fadeOut(500);

            displayInputElements();
            return;
        }
        setTimeout(function () {
            $('#displayDigits').html(digitsToDisplay[digitCounter]);
            sayThisDigit(digitsToDisplay[digitCounter]);
            next();
        }, 1400);
    })();

}



function prepareDigitsString(numOfDigits) {
    var finalString = [];
    var chooseFrom = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    currentDigitsStringInStringFormat = ''; // Reset this variable

    for (var i = 0; i < numOfDigits; i++) {
        var digitPlace = Math.floor((Math.random() * chooseFrom.length));
        var chosenDigit = chooseFrom[digitPlace];
        // Now we need to add the Chosen digit to our final digits string, PLUs remove it from the digits Pool:
        finalString.push(chosenDigit); //build the final string
        chooseFrom.splice(digitPlace, 1); // remove the selected digits, so there will be no repeats
        currentDigitsStringInStringFormat += chosenDigit.toString();
    }
    return finalString;
}

function displayInputElements() {
    $('#inputBox').val('');
    $('#userInput').show().focus();
    $('#displayDigits').hide();
    $('#inputBox').select();


}

function checkAnswer() {
    numOfRounds += 1;
    var userAnswer = $('#inputBox').val();

    if (numOfRounds == 1) {

        if (userAnswer == currentDigitsStringInStringFormat) { // RIGHT
            console.log("Right");
            numOfSuccess += 1;
            minSucceed = numberOfDigits;
            console.log("min Success achieved, and it is: " + minSucceed + " digits");
            startRound(numberOfDigits);

        } else { // WRONG
            console.log("WRONG");
            numOfErrors += 1
            startRound(numberOfDigits);
        }
    }

    if (numOfRounds == 2) {

        if (userAnswer == currentDigitsStringInStringFormat) { // RIGHT
            console.log("Right");
            numOfSuccess += 1;

            if (numOfSuccess == 1) {
                minSucceed = numberOfDigits;
                console.log("min Success achieved, and it is: " + minSucceed + " digits");
            }
            if (numOfSuccess == 2) {
                maxSucceed = numberOfDigits;
                console.log("MAX Success achieved, and it is: " + minSucceed + " digits");
            }

            // Now for the next round
            numOfSuccess = 0;
            numOfErrors = 0;
            numberOfDigits += 1;
            numOfRounds = 0;
            startRound(numberOfDigits);

        } else { // WRONG
            console.log("WRONG");
            numOfErrors += 1

            if (numOfErrors == 2) {
                endTime = new Date().getTime();
                var totalTime = endTime - startTime;
                // Build the results
                Cookies.set('totalTime', totalTime, {
                    expires: 30
                });
                Cookies.set('minAchieved', minSucceed, {
                    expires: 30
                });
                Cookies.set('maxAchieved', maxSucceed, {
                    expires: 30
                });


                // Now move to the next test
                swal({
                        title: "Done !",
                        text: "This test has been completed",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#3ed63e",
                        confirmButtonText: "Click to proceed",
                        closeOnConfirm: false
                    },
                    function () {
                        window.location.href = "../trailsMaking/pTrails_Instructions.html"
                    });

            } else {
                // Now for the next round
                numOfSuccess = 0;
                numOfErrors = 0;
                numOfRounds = 0;
                numberOfDigits += 1;
                startRound(numberOfDigits);
            }
        }
    }
}

function sayThisDigitOLD(numSay) {
    if (numSay == 0) {
        var mySound = new Audio(say0);
    } else if (numSay == 1) {
        var mySound = new Audio(say1);
    } else if (numSay == 2) {
        var mySound = new Audio(say2);
    } else if (numSay == 3) {
        var mySound = new Audio(say3);
    } else if (numSay == 4) {
        var mySound = new Audio(say4);
    } else if (numSay == 5) {
        var mySound = new Audio(say5);
    } else if (numSay == 6) {
        var mySound = new Audio(say6);
    } else if (numSay == 7) {
        var mySound = new Audio(say7);
    } else if (numSay == 8) {
        var mySound = new Audio(say8);
    } else if (numSay == 9) {
        var mySound = new Audio(say9);
    } else {
        var mySound = null;
    }

    // And now play..
    if (mySound != null) {
        mySound.play();
    }

}

function sayThisDigit(whatToSay) {
    // new SpeechSynthesisUtterance object
    var utter = new SpeechSynthesisUtterance();
    utter.rate = 1;
    utter.pitch = 2.5;
    utter.text = String(whatToSay);
    utter.voice = english_voice;

    // event after text has been spoken
    

    // speak
    window.speechSynthesis.speak(utter);
}

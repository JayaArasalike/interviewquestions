// Initialize Firebase
var config = {
    apiKey: "AIzaSyD15_MQCpSIeLmOaujqowZkF-djMIi0UlY",
    authDomain: "interviewquestions-ca991.firebaseapp.com",
    databaseURL: "https://interviewquestions-ca991.firebaseio.com",
    projectId: "interviewquestions-ca991",
    storageBucket: "interviewquestions-ca991.appspot.com",
    messagingSenderId: "139540148275"
};
firebase.initializeApp(config);

var database = firebase.database();





//Setup linkedIn login
var liLogin = function() { // Setup an event listener to make an API call once auth is complete
    IN.UI.Authorize().params({"scope":["r_basicprofile", "r_emailaddress"]}).place();
    IN.Event.on(IN, 'auth', getProfileData);
}

var getProfileData = function() { // Use the API call wrapper to request the member's basic profile data
    IN.API.Profile("me").fields("id,firstName,lastName,email-address,picture-urls::(original),public-profile-url,location:(name)").result(function (me) {
        var profile = me.values[0];
        var id = profile.id;
        var firstName = profile.firstName;
        var lastName = profile.lastName;
        var emailAddress = profile.emailAddress;
        var pictureUrl = profile.pictureUrls.values[0];
        var profileUrl = profile.publicProfileUrl;
        var country = profile.location.name;

        /*var user = {
          emailId: emailAddress,
          profile: {
            fName: firstName,
            lName: lastName,
            pUrl: profileUrl
          }
        };*/

    });
}
// Handle the successful return from the API call
function onSuccess(data) {
    console.log(data);
}

// Handle an error response from the API call
function onError(error) {
    console.log(error);
}

//function to logout from the session
var liLogout = function() {
    IN.User.logout(callbackFunction);
    }

function callbackFunction() {
    alert("You have successfully logged out.")
    }


var questionArray = [];
var intervalId;

var myData;

var interviewQuestions = {

    indexNumber: 0,
    maxTime: 30,
    maxQuestions: 10,
    correctCount: 0,
    incorrectCount: 0,
    unansweredCount: 0,
    timer: 0,

    initialScreen: function() {
        startScreen = "<div class='container'><form class='form-signin'>";
        startScreen += "<h2 class='form-signin-heading'>Please sign in</h2>";
        startScreen += "<label for='firstName' class='sr-only'>First Name</label>";
        startScreen += "<input type='email' id='inputEmail' class='form-control' placeholder='First Name' required autofocus>";
        startScreen += "<label for='lastName' class='sr-only'>Last Name</label>";
        startScreen += "<input type='email' id='inputEmail' class='form-control' placeholder='Last Name' required autofocus>";
        startScreen += "<label for='inputEmail' class='sr-only'>Email address</label>";
        startScreen += "<input type='email' id='inputEmail' class='form-control' placeholder='Email address' required autofocus>";
        startScreen += "<label for='inputPassword' class='sr-only'>Password</label>";
        startScreen += "<input type='password' id='inputPassword' class='form-control' placeholder='Password'>";
        startScreen += "<div class='checkbox'>";
        startScreen += "<label><input type='checkbox' value='remember-me'> Remember me</label>";
        startScreen += "</div>";
        startScreen += "<button id='signin' class='btn btn-lg btn-primary btn-block' type='submit'>Sign in</button></form></div>";
        $(".mainArea").html(startScreen);

    },
    displaySubject: function() {
        newHTML = "<p>Please choose a subject:</p>";
        // newHTML += "<input type='button' class='btn btn-default btn-lg answerBtn' name='subject' id='html' value='HTML'>";
        // newHTML += "<input type='button' class='btn btn-default btn-lg answerBtn' name='subject' id='css' value='CSS'>";
        // newHTML += "<input type='button' class='btn btn-default btn-lg answerBtn' name='subject' id='javascript' value='Javascript'>";
        // newHTML += "<input type='button' class='btn btn-default btn-lg answerBtn' name='subject' id='jQuery' value='JQuery'>";
        newHTML += "<label><input type='radio' name='subject' id='html' value='html.json'>HTML</label><br>";
        newHTML += "<label><input type='radio' name='subject' id='css' value='css.json'>CSS</label><br>";
        newHTML += "<label><input type='radio' name='subject' id='javascript' value='javascript.json'>Javascript</label><br>";
        newHTML += "<label><input type='radio' name='subject' id='jQuery' value='jquery.json'>JQuery</label><br>";
        newHTML += "<button id='submitSubject' class='btn btn-lg btn-primary btn-block' type='submit'>Submit</button></form></div>";
        $(".mainArea").html(newHTML);

    },
    processSubject: function() {

        var temp = $('input[name="subject"]:checked').val();
        console.log(temp);

        var queryURL = "./assets/json/" + temp;
        console.log(queryURL);

        $.ajax({
            type: "GET",
            url: queryURL,
            dataType: "json",
            success: function(result) {
                myData = result.interview;

                $(".mainArea").empty();

                for(var j = 0; j < result.interview.length; j++) {

                    var questionLine = $("<p>");
                    questionLine.text(result.interview[j].question);
                    $(".mainArea").append(questionLine);
                    console.log(result.interview[j].question);

                    for(var i = 0; i < result.interview[j].choices.length; i++) {

                        var answerChoice = $("<input>");
                        answerChoice.attr("value", i + 1);  // value '0' is unanswered
                        answerChoice.attr("type","radio");
                        answerChoice.attr("name","question" + j);
                        answerChoice.attr("class", "radioButtons");
                        $(".mainArea").append(answerChoice);
                        $(".mainArea").append("<b>" + result.interview[j].choices[i] + "</b><br>");

                        // var answerChoice = $("<input class='btn btn-default btn-lg'>" + result.interview[j].choices[i] + "</button>");
                        // answerChoice.attr("value", i + 1);  // value '0' is unanswered
                        // answerChoice.attr("type","button");
                        // answerChoice.attr("name","question" + j);
                        // answerChoice.attr("class", "answerBtn");
                        // $(".mainArea").append(answerChoice);
                        // $(".mainArea").append("<b>" + result.interview[j].choices[i] + "</b><br>");

                        console.log(result.interview[j].choices[i]);
                    }
                }
                $(".mainArea").append("<button id='doneButton' class='btn btn-lg btn-primary btn-block'>Done</button>");

            },
            error: function(result){
                console.log("Unable to get data");
            }

        });    
    },
    displayResults: function() {

        // clearInterval(intervalId);
        // $("#timer").text("");
        console.log(myData);

        console.log(myData.length);

        for(i = 0; i < myData.length; i++) {

            var name = "question" + i;
            var temp = $('input[name="' + name + '"]:checked').val();
            console.log(temp);
            console.log(myData[i].correct);

            if(isNaN(temp)) {
                interviewQuestions.unansweredCount++;
            }
            else if (temp === myData[i].correct) {
                interviewQuestions.correctCount++;
            }
            else {
                interviewQuestions.incorrectCount++;
            }
        }


      //      function initMap() {
      //   var uluru = {lat: -25.363, lng: 131.044};
      //   var map = new google.maps.Map(document.getElementById('map'), {
      //     zoom: 4,
      //     center: uluru
      //   });
      //   var marker = new google.maps.Marker({
      //     position: uluru,
      //     map: map
      //   });
      // };

        $(".mainArea").empty();
        console.log("done");

        $(".mainArea").append("<h2>All Done!</h2>");
        $(".mainArea").append("<h2>Correct Answers: " + interviewQuestions.correctCount + "</h2>");
        $(".mainArea").append("<h2>Incorrect Answers: " + interviewQuestions.incorrectCount + "</h2>");
        $(".mainArea").append("<h2>Unanswered: " + interviewQuestions.unansweredCount + "</h2>");
        $(".mainArea").append("<button id='resetButton' class='btn btn-lg btn-primary btn-block'>Reset</button>");


    }
    // decrement: function() {

    //     timer -= 1;

    //     $("#timer").text("Time Remaining:  " + timer + " secs");

    //     if (timer === 0) {
    //       clearInterval(intervalId);
    //       interviewQuestions.displayResults();
    //     }
    // }
}

$(document).ready(function() {

    // call initial start screen
    interviewQuestions.initialScreen ();
    initMap() ;

});



$("body").on("click", "#signin", function(event){

    event.preventDefault();

    interviewQuestions.displaySubject();


}); 


$("body").on("click", "#submitSubject", function(event){

    event.preventDefault();

    interviewQuestions.processSubject(event); 


}); 

$("body").on("click", "#doneButton", function(event){

    event.preventDefault();

    interviewQuestions.displayResults();


}); 

$("body").on("click", "#resetButton", function(event){

    event.preventDefault();

    interviewQuestions.unansweredCount = 0;
    interviewQuestions.correctCount = 0;
    interviewQuestions.incorrectCount = 0;

    interviewQuestions.displaySubject();


}); 


var latitude;
var longitude;


// Googe Map API with location finding code

function initMap() {
       

$.getJSON("http://freegeoip.net/json/", function(data) {
    var country_code = data.country_code;
    var country = data.country_name;
    var ip = data.ip;
    var time_zone = data.time_zone;
    var latitude = data.latitude;
     var longitude = data.longitude;
     var city= data.city;


         var uluru = {lat: latitude, lng: longitude};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
   

});




 }


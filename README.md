# interview questions webapp

This project is deployed at: https://philmao.github.io/interviewquestions/index.html

We designed and developed this website, with the intention of providing practice interview questions for students who are learning web development like us.

Since aspiring web developers generally have linkedIn account that shows their skill set, we decided that we would provide user sign-in through linkedIn. If the user is successfully authenticated, then user will be redirected our website choose a subject area (HTML, CSS, JavaScript, jQuery or combination). 

At the same time we retrieve user profile information like name and picture, along with unique member id and we will save it the firebase.

Once the user selected the subject area, user will be given multiple choice questions, one after other. At the same time count up timer is displayed, for the use to keep track of time. User can go back or forward using previous and next buttons. 

Once the user completes the quiz, test results will be displayed with correct answers, incorrect answers, unansweres, highest score so far (if user had taken the test before). User can go back review the his/her answers. And also correct answer is shown in the bottom.

User is also provided with score history that includes - Score, Duration (total time taken to finish the test), Test Date and Time, and the Test Location. We used moment.js to track the time and Google Maps API to find test location.

Lastly, if user wishes he/she can go and select another, or choose to logout from our applicaiton.


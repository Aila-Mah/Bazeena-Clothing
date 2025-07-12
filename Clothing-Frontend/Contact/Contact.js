$(document).ready(function () {

  /** CONTACT FORM VALIDATION **/
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    // Clear old errors
    $("#nameError, #emailError, #subjectError, #messageError").text("");
    $("#form-message-success").hide();
    $("#form-message-warning").hide();

    let isValid = true;

    // Get values
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const subject = $("#subject").val().trim();
    const message = $("#message").val().trim();

    // Validate Name
    if (name === "") {
      $("#nameError").text("Please enter your full name.");
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      $("#contactEmailError").text("Please enter your email address.");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      $("#contactEmailError").text("Please enter a valid email address.");
      isValid = false;
    }

    // Validate Subject
    if (subject === "") {
      $("#subjectError").text("Please enter a subject.");
      isValid = false;
    }

    // Validate Message
    if (message === "") {
      $("#messageError").text("Please enter your message.");
      isValid = false;
    }

    if (isValid) {
      $("#form-message-success").show().text("Your message was sent, thank you!");
      $("#contactForm")[0].reset();
    } else {
      $("#form-message-warning").show().text("Please correct the errors above and try again.");
    }
  });


});

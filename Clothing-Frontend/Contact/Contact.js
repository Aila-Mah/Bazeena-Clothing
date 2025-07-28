$(document).ready(function () {
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    // Clear old errors
    $("#nameError, #contactEmailError, #subjectError, #messageError").text("");
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
      const $submitBtn = $("input[type=submit]");
      $submitBtn.prop("disabled", true).val("Sending...");

      $.ajax({
        url: 'http://localhost:5000/api/contact',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, email, subject, message }),
        success: function (res) {
          $("#form-message-success").show().text(res.message);
          $("#contactForm")[0].reset();
        },
        error: function (xhr) {
          $("#form-message-warning").show().text("Failed to send message. Please try again later.");
        },
        complete: function () {
          $submitBtn.prop("disabled", false).val("Send Message");
        }
      });
    }
  });
});

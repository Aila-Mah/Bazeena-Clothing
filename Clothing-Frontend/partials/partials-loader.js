async function loadPartial(id, url) {
    console.log(`Loading partial: ${url}`);
    try {
      const res = await fetch(url);
      const html = await res.text();
      document.getElementById(id).innerHTML = html;
      console.log(`✅ Loaded ${url}`);
    } catch (e) {
      console.error(`❌ Failed to load ${url}`, e);
    }
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    await loadPartial('navbar-placeholder', '../partials/navbar.html');

    highlightActiveNav();
    await loadPartial('footer-placeholder', '../partials/footer.html');
    setupNewsletterValidation();
  });
  
  function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.toLowerCase().includes(currentPage)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  

  function setupNewsletterValidation() {
    $("#newsletterForm").on("submit", function (e) {
      e.preventDefault();
  
      const email = $("#newsletterEmail").val().trim();
      const errorDiv = $("#emailError");
      errorDiv.text("");
  
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (email === "") {
        errorDiv.text("Please enter your email address.");
      } else if (!emailPattern.test(email)) {
        errorDiv.text("Please enter a valid email address.");
      } else {
        errorDiv.css("color", "green").text("Thank you! Your email has been submitted.");
        $("#newsletterEmail").val("");
      }
    });
  }


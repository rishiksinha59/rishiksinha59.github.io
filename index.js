$(document).ready(function () {
  $(window).scroll(function () {
    // sticky nav-menu on scroll script (fixed selector from class to ID)
    if (this.scrollY > 20) {
      $("#nav-menu").addClass("sticky");
    } else {
      $("#nav-menu").removeClass("sticky");
    }

    // scroll-up button show/hide script
    if (this.scrollY > 500) {
      $(".scroll-up-btn").addClass("show");
    } else {
      $(".scroll-up-btn").removeClass("show");
    }
  });

  // slide-up script
  $(".scroll-up-btn").click(function () {
    $("html").animate({ scrollTop: 0 });
    // removing smooth scroll on slide-up button click
    $("html").css("scrollBehavior", "auto");
  });

  $("#nav-menu .menu li a").click(function () {
    // applying again smooth scroll on menu items click
    $("html").css("scrollBehavior", "smooth");
  });

  // toggle menu/nav-menu script
  $(".menu-btn").click(function () {
    $("#nav-menu .menu").toggleClass("active");
    $(".menu-btn i").toggleClass("active");
  });

  // typing text animation script
  new Typed(".typing", {
    strings: ["Full-Stack Software Developer", "React & Next.js Expert", "Full-Stack Engineer"],
    typeSpeed: 80,
    backSpeed: 40,
    loop: true,
  });

  new Typed(".typing-2", {
    strings: ["Full-Stack Developer", "Problem Solver", "Software Engineer"],
    typeSpeed: 80,
    backSpeed: 40,
    loop: true,
  });

  // owl carousel script
  $(".carousel").owlCarousel({
    margin: 20,
    loop: true,
    nav: true,
    navText: ["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"],
    autoplay: true,
    autoplayTimeOut: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1024: {
        items: 3,
      },
    },
  });
});

// Advanced Contact Form Submission logic with user friendly UI validation
const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const statusDiv = document.getElementById("form-status");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop default form navigation

  // UI loading feedback
  submitBtn.disabled = true;
  submitBtn.innerText = "Sending...";
  statusDiv.style.display = "none";
  statusDiv.className = "form-status";

  const formData = new FormData(form);

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      submitBtn.disabled = false;
      submitBtn.innerText = "Send Message";
      if (data.success) {
        statusDiv.innerText = "Message sent successfully! Thank you.";
        statusDiv.className = "form-status success";
        form.reset();
        // Hide success message after 5 seconds
        setTimeout(() => {
          statusDiv.style.display = "none";
        }, 5000);
      } else {
        statusDiv.innerText = data.message || "Something went wrong! Please try again.";
        statusDiv.className = "form-status error";
      }
    })
    .catch(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = "Send Message";
      statusDiv.innerText = "Failed to connect. Please check your network connection.";
      statusDiv.className = "form-status error";
    });
});
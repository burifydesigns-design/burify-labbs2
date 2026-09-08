(function () {
  "use strict";

  /* ===== Scroll Reveal ===== */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    var revealElements = document.querySelectorAll("[data-reveal]");

    if (revealElements.length > 0 && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -40px 0px",
        }
      );

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealElements.forEach(function (el) {
        el.classList.add("is-revealed");
      });
    }
  }

  /* ===== FAQ Accordion ===== */
  var faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
      var isExpanded = question.getAttribute("aria-expanded") === "true";
      var answerId = question.getAttribute("aria-controls");
      var answer = document.getElementById(answerId);

      faqQuestions.forEach(function (q) {
        q.setAttribute("aria-expanded", "false");
        var otherAnswerId = q.getAttribute("aria-controls");
        var otherAnswer = document.getElementById(otherAnswerId);
        if (otherAnswer) {
          otherAnswer.hidden = true;
        }
      });

      if (!isExpanded && answer) {
        question.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });
  });
})();

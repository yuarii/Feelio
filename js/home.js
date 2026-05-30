document.addEventListener("DOMContentLoaded", () => {
    console.log("Feelio Home Engine Started! 🚀");

    const revealOptions = {
        threshold: 0.20,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                
                if(entry.target.classList.contains('quote-container')) {
                    console.log("Motivation loading... ✨");
                }
            } else {
                entry.target.classList.remove("active");
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach(el => revealObserver.observe(el));

    const quotes = document.querySelectorAll(".quote-item");
    let currentIdx = 0;

    function rotateQuotes() {
        if (quotes.length <= 1) return;

        quotes[currentIdx].classList.remove("active");
        currentIdx = (currentIdx + 1) % quotes.length;

        setTimeout(() => {
            quotes[currentIdx].classList.add("active");
        }, 50);
    }

    let quoteInterval;
    if (quotes.length > 1) {
        quoteInterval = setInterval(rotateQuotes, 4000);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const revealOptions = {
        threshold: 0.20,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
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

    if (quotes.length > 1) {
        setInterval(rotateQuotes, 4000);
    }

    const checkInBtn = document.getElementById('btn-checkin-popup');
    const modal = document.getElementById('checkin-modal');
    const authBtn = document.getElementById('go-to-auth');
    const closeModal = modal ? modal.querySelector('.close-modal') : null;

    const hideModal = () => {
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    };

    if (checkInBtn && modal) {
        checkInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    if (authBtn) {
        authBtn.addEventListener('click', () => {
            hideModal();
            setTimeout(() => {
                const triggerRegister = () => {
                    const registerTrigger = document.querySelector('.nav-register-btn') || 
                                            document.querySelector('.register-btn') || 
                                            document.getElementById('registerBtn');

                    if (registerTrigger) {
                        registerTrigger.click();
                    } else {
                        const profileTrigger = document.getElementById('profileTrigger');
                        if (profileTrigger) {
                            profileTrigger.click();
                            setTimeout(() => {
                                const innerRegister = document.querySelector('.nav-register-btn');
                                if (innerRegister) innerRegister.click();
                            }, 150);
                        } else if (typeof openRegisterModal === 'function') {
                            openRegisterModal();
                        }
                    }
                };
                triggerRegister();
            }, 400);
        });
    }

    document.querySelectorAll('a[href^="#"], .btn-secondary').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            let targetId = this.getAttribute('href');

            if (!targetId || targetId === '#') {
                const text = this.innerText.toLowerCase();
                if (text.includes("learn more") || text.includes("explore")) {
                    targetId = "#info-section";
                }
            }

            if (targetId && targetId.startsWith("#") && targetId !== "#") {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
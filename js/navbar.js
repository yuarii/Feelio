const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const profileTrigger = document.getElementById("profileTrigger");
const dropdownMenu = document.getElementById("dropdownMenu");
const navbar = document.querySelector(".navbar");

const notifTrigger = document.getElementById("notifTrigger");
const notifDropdown = document.getElementById("notifDropdown");
const markReadBtn = document.querySelector(".mark-read");
const notifContent = document.querySelector(".notif-content");
const notifBadge = document.querySelector(".notification-icon .badge");

const authModal = document.getElementById("authModal");
const closeModalBtn = document.getElementById("closeModal");
const modalFormContainer = document.getElementById("modalFormContainer");

function showCustomAlert(message, isSuccess = true) {
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: white;
        padding: 15px 25px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border-left: 5px solid ${isSuccess ? '#8B6CFF' : '#ff6b6b'};
    `;
    
    alertBox.innerHTML = `
        <span style="font-size: 20px;">${isSuccess ? '✨' : '⚠️'}</span>
        <span style="color: #333; font-weight: 500; font-family: sans-serif;">${message}</span>
    `;

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);

    setTimeout(() => {
        alertBox.style.transform = 'translateX(-50%) translateY(-100px)';
        alertBox.style.opacity = '0';
        setTimeout(() => alertBox.remove(), 500);
    }, 3000);
}

window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

if (notifTrigger && notifDropdown) {
    notifTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = notifDropdown.classList.contains("show");
        if (!isOpen) {
            if (dropdownMenu) dropdownMenu.classList.remove("show");
            if (profileTrigger) profileTrigger.classList.remove("active");
            notifDropdown.style.display = "block";
            void notifDropdown.offsetWidth; 
            notifDropdown.classList.add("show");
        } else {
            notifDropdown.classList.remove("show");
            setTimeout(() => {
                if (!notifDropdown.classList.contains("show")) {
                    notifDropdown.style.display = "none";
                }
            }, 300);
        }
    });
}

if (markReadBtn && notifContent) {
    markReadBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifContent.style.opacity = "0";
        notifContent.style.transition = "0.3s";
        setTimeout(() => {
            notifContent.innerHTML = `
                <div class="notif-empty" style="padding: 30px; text-align: center; color: #AAA; font-size: 13px;">
                    <p>No new notifications ✨</p>
                </div>
            `;
            notifContent.style.opacity = "1";
            if (notifBadge) notifBadge.style.display = "none";
        }, 300);
    });
}

if (profileTrigger && dropdownMenu) {
    profileTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        if (notifDropdown) notifDropdown.classList.remove("show");
        const isOpen = dropdownMenu.classList.toggle("show");
        if (isOpen) {
            profileTrigger.classList.add("active");
        } else {
            setTimeout(() => {
                if (!dropdownMenu.classList.contains("show")) {
                    profileTrigger.classList.remove("active");
                }
            }, 150);
        }
    });
}

function handleAuthAction(type) {
    const form = document.getElementById(type === 'login' ? 'loginForm' : 'registerForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let users = JSON.parse(localStorage.getItem('feelio_users')) || [];

        if (type === 'register') {
            const name = form.querySelector('.auth-name').value;
            const email = form.querySelector('.auth-email').value;
            const password = form.querySelector('.auth-password').value;

            const isExist = users.find(u => u.email === email);
            if (isExist) {
                showCustomAlert("This email is already registered!", false);
                return;
            }

            users.push({ name, email, password });
            localStorage.setItem('feelio_users', JSON.stringify(users));
            showCustomAlert("Registration Successful! ✨");
            setTimeout(() => openAuthModal('login'), 1500);
        } 
        
        else if (type === 'login') {
            const email = form.querySelector('.auth-email').value;
            const password = form.querySelector('.auth-password').value;

            const user = users.find(u => u.email === email);

            if (!user) {
                showCustomAlert("Account not found. Please register!", false);
            } else if (user.password !== password) {
                showCustomAlert("Wrong password! Please try again.", false);
            } else {
                showCustomAlert(`Welcome back, ${user.name}! ✨`);
                localStorage.setItem('currentUser', JSON.stringify(user));
                authModal.classList.remove("show");
                setTimeout(() => window.location.reload(), 1500);
            }
        }
    });
}

function openAuthModal(type) {
    if (!authModal || !modalFormContainer) return;

    let content = "";
    if (type === 'login') {
        content = `
            <form id="loginForm">
                <h2>Welcome Back!</h2>
                <input type="email" class="auth-email" placeholder="Email" required>
                <input type="password" class="auth-password" placeholder="Password" required>
                <button type="submit" class="auth-btn">Sign In</button>
                <p style="margin-top:15px; font-size:12px; color:#666">Don't have an account? <a href="#" onclick="openAuthModal('register')" style="color:#8B6CFF">Register here</a></p>
            </form>
        `;
    } else if (type === 'register') {
        content = `
            <form id="registerForm">
                <h2>Create Account</h2>
                <input type="text" class="auth-name" placeholder="Full Name" required>
                <input type="email" class="auth-email" placeholder="Email" required>
                <input type="password" class="auth-password" placeholder="Password" required>
                <button type="submit" class="auth-btn">Register Now</button>
                <p style="margin-top:15px; font-size:12px; color:#666">Already have an account? <a href="#" onclick="openAuthModal('login')" style="color:#8B6CFF">Login here</a></p>
            </form>
        `;
    }

    modalFormContainer.innerHTML = content;
    authModal.classList.add("show");
    
    handleAuthAction(type);

    if (dropdownMenu) dropdownMenu.classList.remove("show");
    if (notifDropdown) notifDropdown.classList.remove("show");
    setTimeout(() => {
        if (profileTrigger) profileTrigger.classList.remove("active");
    }, 150);
}

document.addEventListener("click", (e) => {
    const item = e.target.closest(".dropdown-item");
    if (!item) return;

    const text = item.textContent.trim().toLowerCase();
    if (text === "login") {
        e.preventDefault();
        openAuthModal('login');
    } else if (text === "register") {
        e.preventDefault();
        openAuthModal('register');
    }
});

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
        authModal.classList.remove("show");
    });
}

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

window.addEventListener("click", (e) => {
    if (authModal && e.target === authModal) {
        authModal.classList.remove("show");
    }
    if (dropdownMenu && dropdownMenu.classList.contains("show")) {
        if (!profileTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("show");
            setTimeout(() => { profileTrigger.classList.remove("active"); }, 150);
        }
    }
    if (notifDropdown && notifDropdown.classList.contains("show")) {
        if (!notifTrigger.contains(e.target) && !notifDropdown.contains(e.target)) {
            notifDropdown.classList.remove("show");
        }
    }
    if (navLinks && navLinks.classList.contains("active")) {
        if (hamburger && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove("active");
        }
    }
});

console.log("Feelio Auth System Ready: Custom Pop-ups Integrated! ✨");
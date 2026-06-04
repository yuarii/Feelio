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
const registerHint = document.getElementById("registerHint");

let tempRegisterData = null;

function updateProfileDropdown() {
    if (!dropdownMenu) return;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        dropdownMenu.innerHTML = `
            <div class="dropdown-header" style="padding: 15px; border-bottom: 1px solid #eee;">
                <p style="font-weight: 600; color: #8B6CFF; margin: 0;">Hi, ${currentUser.name} ✨</p>
            </div>
            <a href="#" class="dropdown-item">My Profile</a>
            <a href="#" class="dropdown-item">Settings</a>
            <hr style="margin: 5px 0; border: none; border-top: 1px solid #eee;">
            <a href="#" class="dropdown-item logout-action" style="color: #ff6b6b !important;">Logout</a>
        `;
    } else {
    dropdownMenu.innerHTML = `
        <div class="dropdown-header" style="padding: 10px 20px; font-weight: 600; color: #8B6CFF;">Selamat Datang!</div>
        <hr style="border:none; border-top:1px solid #eee; margin: 0;">
        <a href="#" class="dropdown-item login-trigger">Login</a>
        <a href="#" class="dropdown-item register-trigger highlight-register">Register</a>
    `;
    }
}

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
        z-index: 1000000;
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
    if (navbar) {
        if (window.scrollY > 20) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
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
    updateProfileDropdown();
    
    if (notifDropdown) notifDropdown.classList.remove("show");
    
    const isOpen = dropdownMenu.classList.toggle("show");
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (isOpen) {
        profileTrigger.classList.add("active");
        if (!currentUser && registerHint) {
            registerHint.classList.add("show");
        }
    } else {
        profileTrigger.classList.remove("active");
        if (registerHint) registerHint.classList.remove("show");
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

            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('feelio_users', JSON.stringify(users));
            
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            showCustomAlert("Registration Successful! Welcome ✨");
            
            closeAuthModal();
            updateProfileDropdown();
            setTimeout(() => window.location.reload(), 1500);
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
                closeAuthModal();
                tempRegisterData = null; 
                updateProfileDropdown();
                setTimeout(() => window.location.reload(), 1500);
            }
        }
    });
}

function openAuthModal(type) {
    if (!authModal || !modalFormContainer) return;

    const fillEmail = (tempRegisterData && tempRegisterData.email) ? tempRegisterData.email : "";
    const fillPass = (tempRegisterData && tempRegisterData.password) ? tempRegisterData.password : "";

    let content = "";
    if (type === 'login') {
        content = `
            <form id="loginForm" autocomplete="off">
                <input type="text" style="display:none">
                <input type="password" style="display:none">
                <h2 style="margin-bottom: 20px; color: #8B6CFF;">Welcome Back!</h2>
                <input type="email" class="auth-email" placeholder="Email" value="${fillEmail}" autocomplete="new-password" required>
                <div class="password-wrapper">
                    <input type="password" class="auth-password" placeholder="Password" value="${fillPass}" autocomplete="new-password" required>
                    <img src="https://cdn-icons-png.flaticon.com/512/3064/3064155.png" class="toggle-password-img" data-locked="true">
                </div>
                <button type="submit" class="auth-btn">Sign In</button>
                <p style="margin-top:15px; font-size:12px; color:#666">Don't have an account? <a href="#" class="register-trigger" style="color:#8B6CFF; font-weight:600; text-decoration:none;">Register here</a></p>
            </form>
        `;
    } else {
        content = `
            <form id="registerForm" autocomplete="off">
                <h2 style="margin-bottom: 20px; color: #8B6CFF;">Create Account</h2>
                <input type="text" class="auth-name" placeholder="Full Name" autocomplete="new-password" required>
                <input type="email" class="auth-email" placeholder="Email" autocomplete="new-password" required>
                <div class="password-wrapper">
                    <input type="password" class="auth-password" placeholder="Password" autocomplete="new-password" required>
                    <img src="https://cdn-icons-png.flaticon.com/512/3064/3064155.png" class="toggle-password-img" data-locked="true">
                </div>
                <button type="submit" class="auth-btn">Register Now</button>
                <p style="margin-top:15px; font-size:12px; color:#666">Already have an account? <a href="#" class="login-trigger" style="color:#8B6CFF; font-weight:600; text-decoration:none;">Login here</a></p>
            </form>
        `;
    }

    modalFormContainer.innerHTML = content;

    const currentForm = modalFormContainer.querySelector('form');
    if (currentForm) {
        if (!tempRegisterData) {
            currentForm.reset();
            const inputs = currentForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.value = "";
                input.setAttribute('value', '');
            });
        }
    }

    authModal.classList.add("show");
    document.body.style.overflow = 'hidden';
    handleAuthAction(type);

    if (dropdownMenu) dropdownMenu.classList.remove("show");
    if (notifDropdown) notifDropdown.classList.remove("show");
    if (profileTrigger) profileTrigger.classList.remove("active");
    if (registerHint) registerHint.classList.remove("show");
}

function closeAuthModal() {
    if (authModal) {
        authModal.classList.remove("show");
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener("click", (e) => {
    const loginBtn = e.target.closest(".login-trigger");
    const registerBtn = e.target.closest(".register-trigger");
    const logoutBtn = e.target.closest(".logout-action");
    const toggleImg = e.target.closest(".toggle-password-img");

    if (loginBtn) {
        e.preventDefault();
        openAuthModal('login');
    } 
    else if (registerBtn) {
        e.preventDefault();
        openAuthModal('register');
    }
    else if (logoutBtn) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        tempRegisterData = null; 
        showCustomAlert("Successfully logged out! See you soon ✨");
        updateProfileDropdown();
        setTimeout(() => {
            window.location.href = window.location.pathname;    
        }, 1000);
    }
    else if (toggleImg) {
        const input = toggleImg.parentElement.querySelector('input');
        const isLocked = toggleImg.getAttribute('data-locked') === 'true';

        if (isLocked) {
            input.type = "text";
            toggleImg.src = "https://cdn-icons-png.flaticon.com/512/3064/3064197.png"; 
            toggleImg.setAttribute('data-locked', 'false');
        } else {
            input.type = "password";
            toggleImg.src = "https://cdn-icons-png.flaticon.com/512/3064/3064155.png"; 
            toggleImg.setAttribute('data-locked', 'true');
        }
    }
});

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeAuthModal);
}

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
    document.body.style.overflow = 'auto';
}

document.addEventListener("click", (e) => {
    const target = e.target;
    
    if (target.textContent === "My Profile") {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            document.getElementById('displayProfileName').innerText = currentUser.name;
            document.getElementById('displayProfileEmail').innerText = currentUser.email;
            document.getElementById('profileModal').classList.add("show");
            document.body.style.overflow = 'hidden';
            dropdownMenu.classList.remove("show");
        }
    }

    if (target.textContent === "Settings") {
        e.preventDefault();
        document.getElementById('settingsModal').classList.add("show");
        document.body.style.overflow = 'hidden';
        dropdownMenu.classList.remove("show");
    }
});

window.addEventListener("click", (e) => {
    if (authModal && e.target === authModal) closeAuthModal();
    if (e.target.id === 'profileModal') closeModal('profileModal');
    if (e.target.id === 'settingsModal') closeModal('settingsModal');

    if (dropdownMenu && !profileTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove("show");
        profileTrigger.classList.remove("active");
        if (registerHint) registerHint.classList.remove("show");
    }

    if (notifDropdown && !notifTrigger.contains(e.target) && !notifDropdown.contains(e.target)) {
        notifDropdown.classList.remove("show");
        setTimeout(() => {
            if (!notifDropdown.classList.contains("show")) {
                notifDropdown.style.display = "none";
            }
        }, 300);
    }
});

const checkNavbar = setInterval(() => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (navLinks.length > 0) {
        const currentPath = window.location.pathname.split("/").pop() || "home.html";
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });

        clearInterval(checkNavbar);
    }
}, 100);

document.addEventListener("DOMContentLoaded", updateProfileDropdown);
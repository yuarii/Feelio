let selectedQuote = "";
let savedMessages = JSON.parse(localStorage.getItem('feelio_saved_quotes')) || [];

function canPickCookie() {
    return true; 
}

document.addEventListener('DOMContentLoaded', () => {
    renderSavedMessages();

    if (!canPickCookie()) {
        lockCookies();
    }

    const container = document.querySelector('.messages-container');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (container && nextBtn && prevBtn) {
        const scrollAmount = 265; 
        nextBtn.addEventListener('click', () => {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', () => {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
    
    reveal();
});

function lockCookies() {
    const grid = document.querySelector('.cookies-grid');
    const instruction = document.querySelector('.choose-instruction');
    
    if (grid) {
        grid.style.opacity = "0.5";
        grid.style.pointerEvents = "none";
    }
    if (instruction) {
        instruction.innerText = "You've got your daily light. See you tomorrow! ✨";
    }
}

function openPopup(quote) {
    if (!canPickCookie()) {
        alert("You've got your daily light. See you tomorrow! ✨");
        return;
    }

    selectedQuote = quote;
    const popup = document.getElementById('quote-popup');
    const popupText = document.getElementById('popup-text');
    const popupContent = popup.querySelector('.popup-content');
    
    if (popupText) {
        popupText.innerText = `"${quote}"`;
    }
    
    popupContent.classList.remove('closing');
    popup.classList.remove('hidden');
    popup.style.opacity = '1';
}

function closePopup() {
    const popup = document.getElementById('quote-popup');
    const popupContent = popup.querySelector('.popup-content');

    popupContent.classList.add('closing');
    popup.style.opacity = '0';

    setTimeout(() => {
        popup.classList.add('hidden');
        popup.style.opacity = ''; 
        popupContent.classList.remove('closing');
    }, 400);
}

function saveQuote() {
    const resultSection = document.getElementById('result-section');
    const finalQuoteText = document.getElementById('final-quote-text');
    
    if (!finalQuoteText || !resultSection) return;

    finalQuoteText.innerText = `"${selectedQuote}"`;
    
    const today = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);

    const newEntry = {
        quote: selectedQuote,
        date: dateString,
        bg: getRandomBg() 
    };

    savedMessages.unshift(newEntry);
    localStorage.setItem('feelio_saved_quotes', JSON.stringify(savedMessages));

    renderSavedMessages();
    closePopup();
    lockCookies();
    
    setTimeout(() => {
        resultSection.classList.remove('hidden');
        resultSection.style.display = 'flex';
        
        if (typeof feather !== 'undefined') { feather.replace(); }
        
        resultSection.classList.add('active');
        
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
}

function renderSavedMessages() {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;

    const saved = JSON.parse(localStorage.getItem('feelio_saved_quotes')) || [];

    const originalCards = `
        <div class="message-card" style="background-image: url('../assets/images/quote-mascot-blue.png');">
            <span class="date">May 20, 2024</span>
            <p>"You're allowed to take up space."</p>
        </div>
        <div class="message-card" style="background-image: url('../assets/images/quote-mountain.png');">
            <span class="date">May 19, 2024</span>
            <p>"Small steps still move you forward."</p>
        </div>
        <div class="message-card" style="background-image: url('../assets/images/quote-heart.png');">
            <span class="date">May 18, 2024</span>
            <p>"You're doing better than you think."</p>
        </div>
        <div class="message-card" style="background-image: url('../assets/images/quote-moon.png');">
            <span class="date">May 17, 2024</span>
            <p>"Believe in your potential."</p>
        </div>
        <div class="message-card" style="background-image: url('../assets/images/quote-flower.png');">
            <span class="date">May 16, 2024</span>
            <p>"Peace begins with a smile."</p>
        </div>
        <div class="message-card" style="background-image: url('../assets/images/quote-fortune.png');">
            <span class="date">May 15, 2024</span>
            <p>"Your mind is a powerful thing."</p>
        </div>
    `;

    let dynamicContent = "";
    saved.forEach(item => {
        dynamicContent += `
            <div class="message-card" style="background-image: url('${item.bg}');">
                <span class="date">${item.date}</span>
                <p>"${item.quote}"</p>
            </div>
        `;
    });

    messagesList.innerHTML = dynamicContent + originalCards;
}

function getRandomBg() {
    const bgs = [
        '../assets/images/quote-mascot-blue.png',
        '../assets/images/quote-mountain.png',
        '../assets/images/quote-heart.png',
        '../assets/images/quote-moon.png',
        '../assets/images/quote-flower.png',
        '../assets/images/quote-fortune.png'
    ];
    return bgs[Math.floor(Math.random() * bgs.length)];
}

const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const elementVisible = 100; // Jarak pemicu muncul

        if (elementTop < windowHeight - elementVisible && elementBottom > 0) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
};

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

function openViewAll() {
    const popup = document.getElementById('view-all-popup');
    const grid = document.getElementById('allMessagesGrid');
    const saved = JSON.parse(localStorage.getItem('feelio_saved_quotes')) || [];

    // Ambil template kartu pesan (sama seperti fungsi renderSavedMessages)
    let content = "";
    
    // Gabungkan pesan yang disimpan + pesan default (originalCards)
    saved.forEach(item => {
        content += `
            <div class="message-card" style="background-image: url('${item.bg}');">
                <span class="date">${item.date}</span>
                <p>"${item.quote}"</p>
            </div>
        `;
    });

    grid.innerHTML = content; // Masukkan ke dalam grid popup
    
    popup.classList.remove('hidden');
    popup.style.display = 'flex';
    setTimeout(() => { popup.style.opacity = '1'; }, 10);
}

function closeViewAll() {
    const popup = document.getElementById('view-all-popup');
    popup.style.opacity = '0';
    setTimeout(() => {
        popup.classList.add('hidden');
        popup.style.display = 'none';
    }, 400);
}
// 1.GARDEN SYSTEM & GLOBAL VARIABLES
let currentJournalData = {
    photo: null,
    category: 'General',
    mood: null 
};
let happyJournalCount = 0; 
let gardenLevel = 1;       

// --- ARRAY GLOBAL KATEGORI ---
let availableCategories = ['Work', 'Personal', 'Health', 'Study', 'Travel'];


// 2.FUNGSI UTAMA & INISIALISASI
document.addEventListener("DOMContentLoaded", () => {
    // --- Inisialisasi Elemen Mood ---
    const moodButtons = document.querySelectorAll(".mood-btn");
    const emotionSkyImg = document.getElementById("emotionSkyImg");
    const skyStatusText = document.getElementById("skyStatusText");

    const skyMap = {
        happy: { img: "../assets/background/Sky/happy.jpeg", text: "Happy Day ☀️" },
        neutral: { img: "../assets/background/Sky/natural.jpeg", text: "Calm & Balanced ☁️" },
        sad: { img: "../assets/background/Sky/sad.jpeg", text: "Rainy & Blue Mood 🌧️" },
        stressed: { img: "../assets/background/Sky/stress.jpeg", text: "Stormy Mind ⚡" },
        tired: { img: "../assets/background/Sky/tired.jpeg", text: "Twilight Rest 🌙" },
        angry: { img: "../assets/background/Sky/angry.jpeg", text: "Overheated Sky 🔥" },
        disappointed: { img: "../assets/background/Sky/disappointed.jpeg", text: "Overcast Sky 🌫️" }
    };

    moodButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedMood = button.getAttribute("data-mood");
            
            // Rekam data mood yang dipilih ke variabel global
            if (typeof currentJournalData !== 'undefined') {
                currentJournalData.mood = selectedMood;
            }
            
            if (skyMap[selectedMood]) {
                moodButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                if (emotionSkyImg) {
                    emotionSkyImg.style.opacity = "0";
                    setTimeout(() => {
                        emotionSkyImg.src = skyMap[selectedMood].img;
                        skyStatusText.textContent = skyMap[selectedMood].text;
                        emotionSkyImg.style.opacity = "1";
                    }, 200);
                }
            }
        });
    });

    // --- Inisialisasi Tombol My Garden ---
    const gardenBtn = document.getElementById('openGardenBtn');
    if (gardenBtn) {
        gardenBtn.addEventListener('click', showGardenPopup);
    }
});


// ==================== LOGIKA FUTURE LETTER SYSTEM ====================
const writeLetterBtn = document.getElementById('writeLetterBtn');
const letterModalStep1 = document.getElementById('letterModalStep1');
const letterModalStep2 = document.getElementById('letterModalStep2');
const nextLetterStepBtn = document.getElementById('nextLetterStepBtn');
const finalizeLetterBtn = document.getElementById('finalizeLetterBtn');
const futureLetterText = document.getElementById('futureLetterText');
const unlockDateInput = document.getElementById('unlockDate');

if (writeLetterBtn) {
    writeLetterBtn.addEventListener('click', () => {
        futureLetterText.value = '';
        unlockDateInput.value = '';
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const tomorrowStr = today.toISOString().split('T')[0];
        unlockDateInput.setAttribute('min', tomorrowStr);
        letterModalStep1.classList.add('active');
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

if (nextLetterStepBtn) {
    nextLetterStepBtn.addEventListener('click', () => {
        if (futureLetterText.value.trim() === "") {
            alert("Please write something to your future self first! 💜");
            futureLetterText.focus();
            return;
        }
        letterModalStep1.classList.remove('active');
        letterModalStep2.classList.add('active');
    });
}

function backToStep1() {
    letterModalStep2.classList.remove('active');
    letterModalStep1.classList.add('active');
}

if (finalizeLetterBtn) {
    finalizeLetterBtn.addEventListener('click', () => {
        const chosenDate = unlockDateInput.value;
        if (!chosenDate) {
            alert("Please pick a date when you want to open this letter! 📅");
            return;
        }

        const targetDate = new Date(chosenDate).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        if (writeLetterBtn) {
            const cardContainer = writeLetterBtn.closest('.card'); 
            if (cardContainer) {
                cardContainer.innerHTML = `
                    <div class="letter-state-locked">
                        <div class="locked-envelope-wrapper">
                            <span style="font-size: 45px; display: block; filter: drop-shadow(0 4px 8px rgba(139,124,230,0.3));">✉️🔒</span>
                        </div>
                        <h4 class="lock-status-title">Your Time Capsule is Sealed ✨</h4>
                        <p class="card-sub" style="font-size: 13px; color: #7E74BA; margin-bottom: 12px; text-align: center;">The precious letter to your future has been safely stored in a time capsule.</p>
                        <div class="lock-status-countdown">
                            🔒 Unlocks on: <strong>${targetDate}</strong>
                        </div>
                    </div>
                `;
            }
        }

        alert(`🔒 Letter Locked Securely!\n\nYour secret message has been sealed and sent to the time capsule. It will be available to open on ${targetDate}.`);
        letterModalStep2.classList.remove('active');
    });
}

function openGeneralModal(title, contentHtml) {
    const modal = document.getElementById('generalModal');
    const titleEl = document.getElementById('generalModalTitle');
    const contentEl = document.getElementById('generalModalContent');
    titleEl.innerText = title;
    contentEl.innerHTML = contentHtml;
    modal.classList.add('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('generalModal');
    if (event.target == modal) {
        closeModal('generalModal');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const bodyInput = document.getElementById('journalBody');
    const charCount = document.getElementById('charCount');

    if (bodyInput && charCount) {
        bodyInput.addEventListener('input', () => {
            const currentLength = bodyInput.value.length;
            charCount.textContent = currentLength;
            if (currentLength > 2000) {
                charCount.style.color = 'red';
            } else {
                charCount.style.color = '#7E74BA';
            }
        });
    }
});


function openModal(type) {
    const modal = document.getElementById('generalModal');
    const modalTitle = document.getElementById('generalModalTitle');
    const modalContent = document.getElementById('generalModalContent');
    modal.classList.add('active');
    
    if (type === 'photo') {
        modalTitle.textContent = 'Add Photo';
        modalContent.innerHTML = `
            <input type="file" id="photoInput" accept="image/*" class="input-control">
            <p style="font-size: 12px; color: #7E74BA; margin-top:10px;">Choose your memorable photo today.</p>
        `;
        
        const photoInput = document.getElementById('photoInput');
        if (photoInput) {
            photoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        currentJournalData.photo = event.target.result; 
                        const addPhotoBtn = document.getElementById('addPhotoBtn');
                        if (addPhotoBtn) {
                            let fileName = file.name;
                            if (fileName.length > 15) fileName = fileName.substring(0, 15) + '...';
                            
                            addPhotoBtn.innerHTML = `<i class="fa-solid fa-image"></i> ${fileName}`;
                            addPhotoBtn.style.backgroundColor = '#EAE5F9'; 
                        }
                        closeGeneralModal(); 
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    } else if (type === 'category') {
        modalTitle.textContent = 'Choose Category';
        renderCategoryContent(modalContent); // Panggil fungsi render khusus kategori
    }
}

// --- FUNGSI RENDER KATEGORI ---
function renderCategoryContent(container) {
    container.innerHTML = `
        <div id="categoryList" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px; max-height: 150px; overflow-y: auto; padding-right: 5px;">
            ${availableCategories.map(c => `<button class="btn-outline" onclick="selectCategory('${c}')" style="justify-content: center;">${c}</button>`).join('')}
        </div>
        
        <hr style="border: 0; border-top: 1px dashed #E2DCF5; margin: 15px 0;">
        
        <p style="font-size: 12px; color: #7E74BA; margin-bottom: 8px; text-align: left; font-weight: 500;">Or create your own:</p>
        <div style="display: flex; gap: 8px;">
            <input type="text" id="newCatInput" class="input-control" placeholder="New category name..." style="padding: 8px 12px; font-size: 13px;">
            <button class="btn-primary" onclick="addNewCategory()" style="padding: 8px 16px; border-radius: 12px; font-size: 13px; width: auto;">Add</button>
        </div>
    `;
}

// --- FUNGSI MENAMBAHKAN KATEGORI BARU ---
window.addNewCategory = function() {
    const inputEl = document.getElementById('newCatInput');
    const newCat = inputEl.value.trim();
    
    if (newCat === "") {
        alert("The category name cannot be empty! ✨");
        inputEl.focus();
        return;
    }
    
    const exists = availableCategories.some(c => c.toLowerCase() === newCat.toLowerCase());
    if (exists) {
        alert("This category is already on the list! 😉");
        inputEl.value = "";
        return;
    }
    
    availableCategories.push(newCat);
    selectCategory(newCat); // Otomatis pilih
};

function closeGeneralModal() {
    document.getElementById('generalModal').classList.remove('active');
}

function selectCategory(cat) {
    currentJournalData.category = cat;
    closeGeneralModal();
    const btnCat = document.getElementById('chooseCatBtn');
    if (btnCat) {
        btnCat.innerHTML = `<i class="fa-solid fa-tags"></i> ${cat}`;
        btnCat.style.backgroundColor = '#EAE5F9'; // Efek visual terpilih
    }
}

const addPhotoBtn = document.getElementById('addPhotoBtn');
if(addPhotoBtn) addPhotoBtn.addEventListener('click', () => openModal('photo'));

const chooseCatBtn = document.getElementById('chooseCatBtn');
if(chooseCatBtn) chooseCatBtn.addEventListener('click', () => openModal('category'));

// ==================== FUNGSI SAVE JOURNAL FINAL & UPDATE GARDEN ==================== //
const saveBtn = document.getElementById('saveJournalBtn');
if (saveBtn) {
    saveBtn.onclick = function() {
        const titleInput = document.getElementById('journalTitle').value;
        const bodyInput = document.getElementById('journalBody').value;

        if (titleInput.trim() === "" || bodyInput.trim() === "") {
            alert("Judul dan isi jurnal harus diisi ya! ✨");
            return;
        }

        let selectedMoodIcon = '../assets/background/Mood/Happy_mood.png';
        if (currentJournalData && currentJournalData.mood) {
            const moodIconMap = {
                'happy': '../assets/background/Mood/Happy_mood.png',
                'neutral': '../assets/background/Mood/Natural.png',
                'sad': '../assets/background/Mood/Sad.png',
                'stressed': '../assets/background/Mood/Stress.png',
                'tired': '../assets/background/Mood/Tired.png',
                'angry': '../assets/background/Mood/Angry.png',
                'disappointed': '../assets/background/Mood/Disappointed.png'
            };
            selectedMoodIcon = moodIconMap[currentJournalData.mood] || selectedMoodIcon;
        }

        const recentContainer = document.getElementById('recentListContainer');
        if (!recentContainer) {
            console.error("Wadah recentListContainer tidak ditemukan di HTML!");
            return;
        }

        const newJournalItem = document.createElement('div');
        newJournalItem.className = 'recent-item';

        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const previewText = bodyInput.length > 50 ? bodyInput.substring(0, 50) + '...' : bodyInput;
        const safeBodyInput = bodyInput.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        const photoHtmlData = currentJournalData.photo ? `<div class="saved-photo-data" style="display: none;">${currentJournalData.photo}</div>` : '';

        newJournalItem.innerHTML = `
            <div class="recent-info">
                <div class="mood-indicator-img"><img src="${selectedMoodIcon}" alt="Mood"></div>
                <div class="recent-text">
                    <h4>${titleInput}</h4>
                    <p>${previewText}</p>
                    <div class="full-body-text" style="display: none;">${safeBodyInput}</div>
                    ${photoHtmlData}
                    <span class="date-sub">${dateString} • ${timeString}</span>
                </div>
            </div>
            <div class="recent-meta">
                <i class="fa-solid fa-ellipsis-vertical action-trigger"></i>
            </div>
        `;

        recentContainer.prepend(newJournalItem);
        const cat = currentJournalData.category ? currentJournalData.category : 'General';
        alert(`Jurnal tersimpan dengan kategori: ${cat}`);

        // --- UPDATE LOGIKA MY GARDEN ---
        if (currentJournalData.mood === 'happy' || currentJournalData.mood === null) { 
            happyJournalCount++;
            if (gardenLevel < 10) {
                gardenLevel++;
            }
            const floatingBadgeCount = document.getElementById('floatingBadgeCount');
            const floatingGardenImg = document.getElementById('floatingGardenImg');
            
            if (floatingBadgeCount) floatingBadgeCount.innerText = happyJournalCount; 
            
            if (floatingGardenImg) floatingGardenImg.src = `../assets/background/Garden/level_${gardenLevel}.png`;
        }

        // --- RESET FORM & BUTTONS ---
        document.getElementById('journalTitle').value = '';
        document.getElementById('journalBody').value = '';
        const charCountEl = document.getElementById('charCount');
        if (charCountEl) charCountEl.innerText = '0';
        
        currentJournalData = { photo: null, category: 'General', mood: null };
        
        const btnCat = document.getElementById('chooseCatBtn');
        if (btnCat) {
            btnCat.innerHTML = '<i class="fa-solid fa-tags"></i> Choose Category';
            btnCat.style.backgroundColor = ''; 
        }
        
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
        
        const btnPhoto = document.getElementById('addPhotoBtn');
        if (btnPhoto) {
            btnPhoto.innerHTML = '<i class="fa-regular fa-image"></i> Add Photo';
            btnPhoto.style.backgroundColor = ''; 
        }
    };
}


// ==================== SISTEM MENU TITIK TIGA, VIEW, & DELETE ====================

function closeActionMenu(menu) {
    if (!menu) return;
    menu.classList.remove('active'); 
    menu.removeAttribute('data-active-id');
    setTimeout(() => {
        if (!menu.classList.contains('active')) {
            menu.style.display = 'none';
        }
    }, 300);
}

document.addEventListener('click', function(event) {
    const targetTrigger = event.target.closest('.action-trigger');
    const actionMenuPopup = document.getElementById('actionMenuPopup');

    if (!actionMenuPopup) return;

    if (targetTrigger) {
        event.stopPropagation(); 

        const activeCard = targetTrigger.closest('.recent-item');
        
        if (activeCard && !activeCard.hasAttribute('data-id')) {
            activeCard.setAttribute('data-id', 'journal-' + Date.now());
        }

        const cardId = activeCard ? activeCard.getAttribute('data-id') : null;

        const isMenuOpenHere = actionMenuPopup.classList.contains('active') && 
                               actionMenuPopup.getAttribute('data-active-id') === cardId;

        if (isMenuOpenHere) {
            closeActionMenu(actionMenuPopup);
        } else {
            if (cardId) {
                actionMenuPopup.setAttribute('data-active-id', cardId);
            }
            
            const rect = targetTrigger.getBoundingClientRect();
            actionMenuPopup.style.position = 'absolute';
            actionMenuPopup.style.zIndex = '9999'; 
            
            actionMenuPopup.style.top = `${rect.bottom + window.scrollY + 5}px`;
            let leftPos = rect.left + window.scrollX - 110;
            actionMenuPopup.style.left = `${Math.max(10, leftPos)}px`; 

            actionMenuPopup.style.display = 'block';
            setTimeout(() => {
                actionMenuPopup.classList.add('active');
            }, 10);
        }
    } 
    else if (!event.target.closest('#actionMenuPopup')) {
        closeActionMenu(actionMenuPopup);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const ctxView = document.getElementById('ctxView');
    const ctxDelete = document.getElementById('ctxDelete');
    const actionMenuPopup = document.getElementById('actionMenuPopup');

    if (ctxView) {
        ctxView.addEventListener('click', () => {
            const activeId = actionMenuPopup.getAttribute('data-active-id');
            if (!activeId) return;

            const activeCard = document.querySelector(`.recent-item[data-id="${activeId}"]`);
            if (activeCard) {
                const title = activeCard.querySelector('h4') ? activeCard.querySelector('h4').innerText : 'Untitled';
                
                const fullTextEl = activeCard.querySelector('.full-body-text');
                let bodyContent = fullTextEl ? fullTextEl.innerHTML : (activeCard.querySelector('p') ? activeCard.querySelector('p').innerText : '');
                
                const savedPhotoEl = activeCard.querySelector('.saved-photo-data');
                const photoSrc = savedPhotoEl ? savedPhotoEl.innerText : null;
                let photoDisplayHtml = '';
                if (photoSrc) {
                    photoDisplayHtml = `<img src="${photoSrc}" alt="Journal Photo" style="width: 100%; border-radius: 12px; margin-top: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); object-fit: cover; max-height: 250px;">`;
                }
                
                const dateText = activeCard.querySelector('.date-sub') ? activeCard.querySelector('.date-sub').innerText : '';
                const imgEl = activeCard.querySelector('.mood-indicator-img img');
                const moodImgSrc = imgEl ? imgEl.src : '';

                const contentHtml = `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${moodImgSrc}" alt="Mood" style="width: 140px; height: 140px; object-fit: contain; margin-bottom: 12px;">
                        <p style="font-size: 14px; color: #7E74BA; margin: 0; font-weight: 600;">${dateText}</p>
                    </div>
                    <div style="background: #F8F7FF; padding: 20px; border-radius: 12px; font-size: 14px; color: #4A4276; line-height: 1.6; text-align: left; max-height: 220px; overflow-y: auto; white-space: pre-wrap;">
                        ${bodyContent}
                        ${photoDisplayHtml}
                    </div>
                `;
                
                openGeneralModal(title, contentHtml);
            }
            closeActionMenu(actionMenuPopup);
        });
    }

    if (ctxDelete) {
        ctxDelete.addEventListener('click', () => {
            const activeId = actionMenuPopup.getAttribute('data-active-id');
            if (!activeId) return;

            const activeCard = document.querySelector(`.recent-item[data-id="${activeId}"]`);
            if (activeCard) {
                const confirmDelete = confirm("Erase this memory? Deleted data cannot be recovered.");
                if (confirmDelete) {
                    activeCard.remove(); 
                }
            }
            closeActionMenu(actionMenuPopup);
        });
    }
}); 

// ========================================================
// FUNGSI MENAMPILKAN POP-UP MY GARDEN
// ========================================================
function showGardenPopup() {
    const title = "🌱 My Happy Garden";
    
    const imgPath = `../assets/background/Garden/level_${gardenLevel}.png`; 
    
    let statusText = "Keep collecting happy moments to grow your garden. ☀️";
    if (gardenLevel === 10) {
        statusText = "Your garden is growing to its full potential! Keep shining and be happy! 🌻";
    }

    const contentHtml = `
        <div style="text-align: center; padding: 10px;">
            <img src="${imgPath}" alt="Garden Level ${gardenLevel}" style="width: 180px; height: 180px; object-fit: contain; margin-bottom: 15px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">
            
            <h3 style="color: #5D54A4; margin-bottom: 10px; font-size: 22px;">Level ${gardenLevel}</h3>
            
            <p style="color: #7E74BA; font-size: 14px; line-height: 1.6;">  
            You've taken notes <strong>${happyJournalCount}</strong> happy memory!<br>
                ${statusText}
            </p>
            
            <div style="width: 100%; background: #F0EDFF; border-radius: 10px; height: 12px; margin-top: 20px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                <div style="width: ${gardenLevel * 10}%; background: linear-gradient(90deg, #A59BC8 0%, #8B7CE6 100%); height: 100%; border-radius: 10px; transition: width 0.5s ease-in-out;"></div>
            </div>
        </div>
    `;
    
    openGeneralModal(title, contentHtml);
}
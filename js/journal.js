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

// ==================== FUNGSI CUSTOM TOAST (NOTIFIKASI) ====================
function showToast(message, type = 'normal') {
    const toast = document.getElementById('customToast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.querySelector('.toast-icon i');

    // 1. Masukkan teks pesan
    toastMessage.innerText = message;

    // 2. Reset class
    toast.className = 'custom-toast'; 
    
    // 3. Atur warna & ikon berdasarkan tipe
    if (type === 'success') {
        toast.classList.add('success');
        toastIcon.className = 'fa-solid fa-circle-check';
    } else if (type === 'warning') {
        toast.classList.add('warning');
        toastIcon.className = 'fa-solid fa-circle-exclamation';
    } else {
        toastIcon.className = 'fa-solid fa-bell';
    }

    // 4. Munculkan notifikasi
    toast.classList.add('show');

    // 5. Sembunyikan otomatis setelah 3.5 detik
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}


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
        
        // Menggunakan Waktu Lokal (Local Time) untuk akurasi maksimal
        const today = new Date();
        today.setDate(today.getDate() + 1); // Tambah 1 hari (Besok)
        
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const tomorrowStr = `${yyyy}-${mm}-${dd}`;
        
        // Kunci kalender agar tanggal sebelumnya dan hari ini tidak bisa diklik
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
            showToast("Please write something to your future self first! 💜", "warning");
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
            showToast("Please pick a date when you want to open this letter! 📅", "warning");
            return;
        }

        const targetDate = new Date(chosenDate).toLocaleDateString('en-US', {
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
                        <p class="card-sub" style="font-size: 13px; color: #7E74BA; margin-bottom: 12px; text-align: center;">Your precious letter for the future has been safely stored in the time capsule.</p>
                        <div class="lock-status-countdown">
                            🔒 Unlocks on: <strong>${targetDate}</strong>
                        </div>
                    </div>
                `;
            }
        }

        showToast(`🔒 Letter Locked Securely!\n\nYour secret message has been sealed and sent to the time capsule. It will be available to open on ${targetDate}.`, "success");
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
        modalTitle.textContent = 'Add Photo ✨';
        
        modalContent.innerHTML = `
            <input type="file" id="photoInput" accept="image/*" style="display: none;">
            <label for="photoInput" class="upload-area" id="uploadLabel">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <span class="upload-title" id="uploadText">Click to browse photo</span>
                <span class="upload-subtitle">Supports JPG, PNG, JPEG</span>
            </label>
        `;
        
        const photoInput = document.getElementById('photoInput');
        if (photoInput) {
            photoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    
                    const uploadText = document.getElementById('uploadText');
                    const uploadIcon = document.querySelector('.upload-area i');
                    if(uploadText) uploadText.innerText = "Processing...";
                    if(uploadIcon) uploadIcon.className = "fa-solid fa-spinner fa-spin"; 
                    
                    reader.onload = function(event) {
                        currentJournalData.photo = event.target.result; 
                        const addPhotoBtn = document.getElementById('addPhotoBtn');
                        if (addPhotoBtn) {
                            let fileName = file.name;
                            if (fileName.length > 15) fileName = fileName.substring(0, 15) + '...';
                            
                            addPhotoBtn.innerHTML = `<i class="fa-solid fa-image"></i> ${fileName}`;
                            addPhotoBtn.style.backgroundColor = '#EAE5F9'; 
                        }
                        
                        setTimeout(() => {
                            closeGeneralModal();
                        }, 400);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    } else if (type === 'category') {
        modalTitle.textContent = 'Choose Category';
        renderCategoryContent(modalContent); 
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
        
        <div style="display: flex; gap: 8px; align-items: center;">
            <input type="text" id="newCatInput" class="input-control" placeholder="New category name..." style="flex: 1; height: 42px; margin: 0; padding: 0 14px; font-size: 13px; border-radius: 12px; border: 1px solid #E2DCF5; outline: none; background: #F4F1FC;">
            <button class="btn-primary" onclick="addNewCategory()" style="height: 42px; margin: 0; padding: 0 20px; border-radius: 12px; font-size: 13px; width: auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(139, 124, 230, 0.2);">Add</button>
        </div>
    `;
}

// --- FUNGSI MENAMBAHKAN KATEGORI BARU ---
window.addNewCategory = function() {
    const inputEl = document.getElementById('newCatInput');
    const newCat = inputEl.value.trim();
    
    if (newCat === "") {
        showToast("Category name cannot be empty! ✨", "warning");
        inputEl.focus();
        return;
    }
    
    const exists = availableCategories.some(c => c.toLowerCase() === newCat.toLowerCase());
    if (exists) {
        showToast("This category already exists! 😉", "warning");
        inputEl.value = "";
        return;
    }
    
    availableCategories.push(newCat);
    selectCategory(newCat); 
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
        btnCat.style.backgroundColor = '#EAE5F9'; 
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
            showToast("Journal title and content must be filled! ✨", "warning");
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
        newJournalItem.className = 'recent-item reveal';

        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const previewText = bodyInput.length > 50 ? bodyInput.substring(0, 50) + '...' : bodyInput;
        const safeBodyInput = bodyInput.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        const photoHtmlData = currentJournalData.photo ? `<div class="saved-photo-data" style="display: none;">${currentJournalData.photo}</div>` : '';
        const cat = currentJournalData.category ? currentJournalData.category : 'General';

        newJournalItem.innerHTML = `
            <div class="recent-info">
                <div class="mood-indicator-img"><img src="${selectedMoodIcon}" alt="Mood"></div>
                <div class="recent-text">
                    <h4>${titleInput}</h4>
                    <p>${previewText}</p>
                    <div class="full-body-text" style="display: none;">${safeBodyInput}</div>
                    ${photoHtmlData}
                    
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                        <span class="category-badge"><i class="fa-solid fa-tag"></i> ${cat}</span>
                        <span class="date-sub">${dateString} • ${timeString}</span>
                    </div>
                    
                    <div class="saved-category-data" style="display: none;">${cat}</div>
                </div>
            </div>
            <div class="recent-meta">
                <i class="fa-solid fa-ellipsis-vertical action-trigger"></i>
            </div>
        `;

        recentContainer.prepend(newJournalItem);
        
        setTimeout(() => {
            newJournalItem.classList.add('active');
        }, 50);

        showToast(`Journal saved successfully under: ${cat} ✨`, "success"); 
        
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
            
            document.body.appendChild(actionMenuPopup);
            
            const rect = targetTrigger.getBoundingClientRect();
            actionMenuPopup.style.position = 'absolute';
            
            actionMenuPopup.style.zIndex = '999999'; 
            
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

                const savedCatEl = activeCard.querySelector('.saved-category-data');
                const catText = savedCatEl ? savedCatEl.innerText : 'General';

                const contentHtml = `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${moodImgSrc}" alt="Mood" style="width: 140px; height: 140px; object-fit: contain; margin-bottom: 12px;">
                        
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <span style="background: #F4F1FC; color: #8B7CE6; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; border: 1px solid #E2DCF5;"><i class="fa-solid fa-tag"></i> ${catText}</span>
                            <p style="font-size: 13px; color: #7E74BA; margin: 0; font-weight: 600;">${dateText}</p>
                        </div>
                    </div>
                    <div style="background: #F8F7FF; padding: 20px; border-radius: 12px; font-size: 14px; color: #4A4276; line-height: 1.6; text-align: left; max-height: 220px; overflow-y: auto; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;">
                        ${bodyContent}
                        ${photoDisplayHtml}
                    </div>
                `;
                
                openGeneralModal(title, contentHtml);
            }
            
            closeActionMenu(actionMenuPopup);

            if (typeof closeViewAllModal === 'function') {
                closeViewAllModal();
            }
        });
    }

    window.itemToDelete = null;

    if (ctxDelete) {
        ctxDelete.addEventListener('click', () => {
            const activeId = actionMenuPopup.getAttribute('data-active-id');
            if (!activeId) return;

            window.itemToDelete = document.querySelector(`.recent-item[data-id="${activeId}"]`);
            
            if (window.itemToDelete) {
                const deleteModal = document.getElementById('deleteConfirmModal');
                if (deleteModal) deleteModal.classList.add('active');
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
    
    let statusText = "Keep collecting beautiful moments (Happy Mood) to grow your garden. ☀️";
    if (gardenLevel === 10) {
        statusText = "Your garden has reached its maximum growth! Keep shining and stay happy! 🌻";
    }

    const contentHtml = `
        <div style="text-align: center; padding: 10px;">
            <img src="${imgPath}" alt="Garden Level ${gardenLevel}" style="width: 180px; height: 180px; object-fit: contain; margin-bottom: 15px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));">
            
            <h3 style="color: #5D54A4; margin-bottom: 10px; font-size: 22px;">Level ${gardenLevel}</h3>
            
            <p style="color: #7E74BA; font-size: 14px; line-height: 1.6;">
                You have recorded <strong>${happyJournalCount}</strong> happy memories!<br>
                ${statusText}
            </p>
            
            <div style="width: 100%; background: #F0EDFF; border-radius: 10px; height: 12px; margin-top: 20px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                <div style="width: ${gardenLevel * 10}%; background: linear-gradient(90deg, #A59BC8 0%, #8B7CE6 100%); height: 100%; border-radius: 10px; transition: width 0.5s ease-in-out;"></div>
            </div>
        </div>
    `;
    
    openGeneralModal(title, contentHtml);
}


// ========================================================
// 8. SCROLL REVEAL ANIMATION (Updated)
// ========================================================
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 50; 

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        } 
        else {
            reveals[i].classList.remove("active");
        }
    }
}

window.addEventListener("scroll", reveal);


// ========================================================
// 9. VIEW ALL JOURNALS SYSTEM (Trik Meminjam Container)
// ========================================================
let originalRecentParent = null;
let originalRecentSibling = null;

document.addEventListener("DOMContentLoaded", () => {
    const recentContainer = document.getElementById('recentListContainer');
    if (recentContainer) {
        recentContainer.classList.add('limit-view');
        originalRecentParent = recentContainer.parentElement;
        originalRecentSibling = recentContainer.nextElementSibling;
    }

    const viewAllBtn = document.querySelector('.btn-view-all');
    const viewAllModalOverlay = document.getElementById('viewAllModalOverlay');
    const viewAllScrollArea = document.getElementById('viewAllScrollArea');

    if (viewAllBtn && viewAllModalOverlay && viewAllScrollArea) {
        viewAllBtn.addEventListener('click', () => {
            const recentContainer = document.getElementById('recentListContainer');
            if (!recentContainer) return;

            viewAllScrollArea.appendChild(recentContainer);
            
            recentContainer.classList.remove('limit-view');
            
            const items = recentContainer.querySelectorAll('.recent-item');
            items.forEach(item => item.classList.add('active'));
            
            viewAllModalOverlay.classList.add('active');
        });
    }

    if (viewAllModalOverlay) {
        viewAllModalOverlay.addEventListener('click', (e) => {
            if (e.target === viewAllModalOverlay) {
                closeViewAllModal();
            }
        });
    }
});

// Fungsi Menutup Modal
window.closeViewAllModal = function() {
    const recentContainer = document.getElementById('recentListContainer');
    const viewAllModalOverlay = document.getElementById('viewAllModalOverlay');
    
    if (!recentContainer || !originalRecentParent) return;

    if (originalRecentSibling) {
        originalRecentParent.insertBefore(recentContainer, originalRecentSibling);
    } else {
        originalRecentParent.appendChild(recentContainer);
    }

    recentContainer.classList.add('limit-view');
    
    if (viewAllModalOverlay) {
        viewAllModalOverlay.classList.remove('active');
    }
};

// ========================================================
// 10. EKSEKUSI DELETE MODAL
// ========================================================
window.closeDeleteModal = function() {
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal) deleteModal.classList.remove('active');
    window.itemToDelete = null; 
};

document.addEventListener('DOMContentLoaded', () => {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (window.itemToDelete) {
                window.itemToDelete.remove(); 
                showToast("Memory deleted successfully 🗑️", "success"); 
                window.itemToDelete = null;
            }
            closeDeleteModal();
        });
    }
});
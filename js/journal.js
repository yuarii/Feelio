document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil semua elemen yang dibutuhkan
    const moodButtons = document.querySelectorAll(".mood-btn");
    const emotionSkyImg = document.getElementById("emotionSkyImg");
    const skyStatusText = document.getElementById("skyStatusText");

    // 2. Petakan data-mood ke file gambar Sky dan Teks Statusnya
    const skyMap = {
        happy: {
            img: "../assets/background/Sky/happy.jpeg",
            text: "Happy Day ☀️"
        },
        neutral: {
            img: "../assets/background/Sky/natural.jpeg", // Sesuaikan nama file aslimu
            text: "Calm & Balanced ☁️"
        },
        sad: {
            img: "../assets/background/Sky/sad.jpeg", // Sesuaikan nama file aslimu
            text: "Rainy & Blue Mood 🌧️"
        },
        stressed: {
            img: "../assets/background/Sky/stress.jpeg", // Sesuaikan nama file aslimu
            text: "Stormy Mind ⚡"
        },
        tired: {
            img: "../assets/background/Sky/tired.jpeg", // Sesuaikan nama file aslimu
            text: "Twilight Rest 🌙"
        },
        angry: { // Sensitif huruf besar sesuai data-mood="Angry" di HTML
            img: "../assets/background/Sky/angry.jpeg", // Sesuaikan nama file aslimu
            text: "Overheated Sky 🔥"
        },
        disappointed: { // Sensitif huruf besar sesuai data-mood="Disappointed" di HTML
            img: "../assets/background/Sky/disappointed.jpeg", // Sesuaikan nama file aslimu
            text: "Overcast Sky 🌫️"
        }
    };

    // 3. Pasang fungsi klik ke setiap tombol mood
    moodButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Ambil nama mood dari atribut data-mood
            const selectedMood = button.getAttribute("data-mood");

            // Validasi apakah mood tersebut ada di dalam map kita
            if (skyMap[selectedMood]) {
                // Hapus kelas 'active' dari semua tombol
                moodButtons.forEach(btn => btn.classList.remove("active"));
                
                // Tambahkan kelas 'active' ke tombol yang sedang diklik
                button.classList.add("active");

                // Berikan efek transisi halus saat berganti gambar
                emotionSkyImg.style.opacity = "0";

                setTimeout(() => {
                    // Ganti source gambar sky dan teks status di bawahnya
                    emotionSkyImg.src = skyMap[selectedMood].img;
                    skyStatusText.textContent = skyMap[selectedMood].text;
                    
                    // Kembalikan ke opasitas penuh setelah gambar berubah
                    emotionSkyImg.style.opacity = "1";
                }, 200); // Waktu jeda transisi (200ms)
            }
        });
    });
});

// ==================== LOGIKA FUTURE LETTER SYSTEM ====================
// Elemen-elemen DOM
const writeLetterBtn = document.getElementById('writeLetterBtn');
const letterModalStep1 = document.getElementById('letterModalStep1');
const letterModalStep2 = document.getElementById('letterModalStep2');
const nextLetterStepBtn = document.getElementById('nextLetterStepBtn');
const finalizeLetterBtn = document.getElementById('finalizeLetterBtn');
const futureLetterText = document.getElementById('futureLetterText');
const unlockDateInput = document.getElementById('unlockDate');

// 1. Aksi ketika tombol "Write a Letter" utama di klik
if (writeLetterBtn) {
    writeLetterBtn.addEventListener('click', () => {
        // Reset form sebelum dibuka
        futureLetterText.value = '';
        unlockDateInput.value = '';
        
        // Atur tanggal minimal adalah besok (tidak bisa memilih tanggal hari ini / masa lalu)
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const tomorrowStr = today.toISOString().split('T')[0];
        unlockDateInput.setAttribute('min', tomorrowStr);

        // Buka modal step 1
        letterModalStep1.classList.add('active');
    });
}

// 2. Fungsi umum untuk menutup modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// 3. Pindah dari Step 1 ke Step 2 (Next Button)
if (nextLetterStepBtn) {
    nextLetterStepBtn.addEventListener('click', () => {
        // Validasi: Pengguna tidak boleh mengunci surat kosong
        if (futureLetterText.value.trim() === "") {
            alert("Please write something to your future self first! 💜");
            return;
        }
        
        // Sembunyikan Step 1, Tampilkan Step 2
        letterModalStep1.classList.remove('active');
        letterModalStep2.classList.add('active');
    });
}

// 4. Tombol Back dari Step 2 kembali ke Step 1
function backToStep1() {
    letterModalStep2.classList.remove('active');
    letterModalStep1.classList.add('active');
}

// 5. Finalisasi Surat (Mengunci Surat Secara Aman)
if (finalizeLetterBtn) {
    finalizeLetterBtn.addEventListener('click', () => {
        const chosenDate = unlockDateInput.value;
        
        // Validasi: Pastikan tanggal sudah dipilih
        if (!chosenDate) {
            alert("Please pick a date when you want to open this letter! 📅");
            return;
        }

        // Data Surat Berhasil Disimpan
        const targetDate = new Date(chosenDate).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // KODE MENGUBAH TAMPILAN CARD
        if (writeLetterBtn) {
            const cardContainer = writeLetterBtn.closest('.card'); 
            if (cardContainer) {
                cardContainer.innerHTML = `
                    <div class="letter-state-locked">
                        <div class="locked-envelope-wrapper">
                            <span style="font-size: 45px; display: block; filter: drop-shadow(0 4px 8px rgba(139,124,230,0.3));">✉️🔒</span>
                        </div>
                        <h4 class="lock-status-title">Your Time Capsule is Sealed ✨</h4>
                        <p class="card-sub" style="font-size: 13px; color: #7E74BA; margin-bottom: 12px; text-align: center;">Surat berharga untuk masa depanmu telah disimpan dengan aman di dalam kapsul waktu.</p>
                        <div class="lock-status-countdown">
                            🔒 Unlocks on: <strong>${targetDate}</strong>
                        </div>
                    </div>
                `;
            }
        }

        // Tampilkan pesan sukses interaktif untuk pengguna
        alert(`🔒 Letter Locked Securely!\n\nYour secret message has been sealed and sent to the time capsule. It will be available to open on ${targetDate}.`);
        
        // Tutup modal step 2 secara total
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

// Fitur Tambahan: Klik di luar kotak modal untuk menutup
window.onclick = function(event) {
    const modal = document.getElementById('generalModal');
    if (event.target == modal) {
        closeModal('generalModal');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveJournalBtn');
    const titleInput = document.getElementById('journalTitle');
    const bodyInput = document.getElementById('journalBody');
    const charCount = document.getElementById('charCount');

    // 1. Logic Character Counter
    bodyInput.addEventListener('input', () => {
        const currentLength = bodyInput.value.length;
        charCount.textContent = currentLength;

        // Opsional: Kasih warna merah kalau lebih dari 2000 karakter
        if (currentLength > 2000) {
            charCount.style.color = 'red';
        } else {
            charCount.style.color = '#7E74BA';
        }
    });

    // 2. Logic Save Journal
    saveBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();

        // Validasi simpel
        if (title === '' || body === '') {
            alert("Tolong isi judul dan isi jurnalnya dulu ya!");
            return;
        }

        // Membuat objek data
        const newJournal = {
            id: Date.now(), // ID unik berdasarkan waktu
            title: title,
            body: body,
            date: new Date().toLocaleDateString()
        };

        // Ambil data lama (jika ada) dan simpan data baru
        let journals = JSON.parse(localStorage.getItem('myJournals') || '[]');
        journals.push(newJournal);
        localStorage.setItem('myJournals', JSON.stringify(journals));

        // Feedback untuk user
        alert("Yay! Jurnal kamu berhasil disimpan.");

        // Reset form
        titleInput.value = '';
        bodyInput.value = '';
        charCount.textContent = '0';
    });
});


// Variabel penyimpan data sementara
let currentJournalData = {
    photo: null,
    category: 'General',
    mood: null // Ini Diambahkan untuk data menyimpan mood
};

const modal = document.getElementById('generalModal');
const modalTitle = document.getElementById('generalModalTitle');
const modalContent = document.getElementById('generalModalContent');

// Fungsi membuka modal dengan konten berbeda
function openModal(type) {
    modal.classList.add('active');
    
    if (type === 'photo') {
        modalTitle.textContent = 'Add Photo';
        modalContent.innerHTML = `
            <input type="file" id="photoInput" accept="image/*" class="input-control">
            <p style="font-size: 12px; color: #7E74BA; margin-top:10px;">Pilih foto kenanganmu hari ini.</p>
        `;
    } else if (type === 'category') {
        modalTitle.textContent = 'Choose Category';
        const cats = ['Work', 'Personal', 'Health', 'Study', 'Travel'];
        modalContent.innerHTML = `
            <div style="display:grid; gap:10px; margin-top:10px;">
                ${cats.map(c => `<button class="btn-outline" onclick="selectCategory('${c}')">${c}</button>`).join('')}
            </div>
        `;
    }
}

// Fungsi menutup modal
function closeGeneralModal() {
    modal.classList.remove('active');
}

// Fungsi memilih kategori
function selectCategory(cat) {
    currentJournalData.category = cat;
    alert(`Kategori "${cat}" terpilih!`);

    closeGeneralModal();

    document.getElementById('chooseCatBtn').innerHTML =
        `<i class="fa-solid fa-tags"></i> ${cat}`;
}

// Event Listener untuk tombol Add Photo
document.getElementById('addPhotoBtn').addEventListener('click', () => openModal('photo'));
document.getElementById('chooseCatBtn').addEventListener('click', () => openModal('category'));

// Update Event Listener Save
document.getElementById('saveJournalBtn').addEventListener('click', () => {
    // Logic save sebelumnya...
    const title = document.getElementById('journalTitle').value;
    const body = document.getElementById('journalBody').value;
    
    const finalData = {
        title,
        body,
        photo: currentJournalData.photo, // Mengambil dari data sementara
        category: currentJournalData.category,
        date: new Date().toLocaleDateString()
    };
    
    console.log("Data siap disimpan:", finalData);
    alert("Jurnal tersimpan dengan kategori: " + finalData.category);
    
    // Reset data setelah simpan
    currentJournalData = { photo: null, category: 'General' };
});



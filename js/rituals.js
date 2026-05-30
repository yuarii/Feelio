const rituals = [
  {
    title: 'Morning Breath',
    time: '5 min',
    desc: 'Start your day with mindful breathing.',
    icon: '../assets/images/cloud.png',
    schedule: '07:00 AM'
  },
  {
    title: 'Gratitude Note',
    time: '3 min',
    desc: 'Write down three things you are grateful for.',
    icon: '../assets/images/book.png',
    schedule: '12:00 PM'
  },
  {
    title: 'Evening Wind Down',
    time: '10 min',
    desc: 'Relax your mind before bedtime.',
    icon: '../assets/images/moon.png',
    schedule: '09:00 PM'
  },
  {
    title: 'Self-Love Affirmation',
    time: '5 min',
    desc: 'Speak kind words to yourself.',
    icon: '../assets/images/flower.png',
    schedule: '04:00 PM'
  },
  {
    title: 'Digital Detox',
    time: '15 min',
    desc: 'Take a break from screens and reset.',
    icon: '../assets/images/star.png',
    schedule: '08:00 PM'
  }
];

const ritualGrid = document.querySelector('#ritualGrid');
const routineList = document.querySelector('#routineList');
const resetButton = document.querySelector('#resetRituals');
const randomButton = document.querySelector('#addRandomRitual');

let selectedRituals = JSON.parse(localStorage.getItem('feelioRituals')) || rituals.slice(0, 3);

function saveRituals(){
  localStorage.setItem('feelioRituals', JSON.stringify(selectedRituals));
}

function isSelected(title){
  return selectedRituals.some(ritual => ritual.title === title);
}

function renderRitualCards(){
  if(!ritualGrid) return;
  ritualGrid.innerHTML = rituals.map(ritual => {
    const added = isSelected(ritual.title);

    return `
      <article class="ritual-card">
        <img src="${ritual.icon}" alt="${ritual.title} icon">
        <h3>${ritual.title}</h3>
        <span class="time"><i class="fa-regular fa-clock"></i>${ritual.time}</span>
        <p>${ritual.desc}</p>
        <button class="add-ritual ${added ? 'added' : ''}" data-title="${ritual.title}" aria-label="Add ${ritual.title}">
          ${added ? '✓' : '+'}
        </button>
      </article>
    `;
  }).join('');
}

function renderRoutine(){
  if(!routineList) return;
  if(selectedRituals.length === 0){
    routineList.innerHTML = '<div class="empty-state">No ritual yet. Add one from Popular Rituals.</div>';
    return;
  }

  routineList.innerHTML = selectedRituals.map(ritual => `
    <article class="routine-item">
      <time>${ritual.schedule}</time>

      <p class="routine-title">
        <img class="routine-icon" src="${ritual.icon}" alt="">
        ${ritual.title}
      </p>

      <small>${ritual.time}</small>

      <button class="remove-btn" data-title="${ritual.title}" aria-label="Remove ${ritual.title}">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </article>
  `).join('');
}

function toggleRitual(title){
  const ritual = rituals.find(item => item.title === title);
  if(!ritual) return;

  if(isSelected(title)){
    selectedRituals = selectedRituals.filter(item => item.title !== title);
  }else{
    selectedRituals.push(ritual);
  }

  saveRituals();
  renderAll();
}

function addRandomRitual(){
  const available = rituals.filter(ritual => !isSelected(ritual.title));
  if(available.length === 0) return;

  const randomRitual = available[Math.floor(Math.random() * available.length)];
  selectedRituals.push(randomRitual);
  saveRituals();
  renderAll();
}

function renderAll(){
  renderRitualCards();
  renderRoutine();
}

if(ritualGrid){
  ritualGrid.addEventListener('click', event => {
    const button = event.target.closest('.add-ritual');
    if(!button) return;
    toggleRitual(button.dataset.title);
  });
}

if(routineList){
  routineList.addEventListener('click', event => {
    const button = event.target.closest('.remove-btn');
    if(!button) return;
    toggleRitual(button.dataset.title);
  });
}

if(resetButton){
  resetButton.addEventListener('click', () => {
    selectedRituals = [];
    saveRituals();
    renderAll();
  });
}

if(randomButton){
  randomButton.addEventListener('click', addRandomRitual);
}

renderAll();
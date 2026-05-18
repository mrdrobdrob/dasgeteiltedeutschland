// Shared utilities for all stations

function getTeamname() {
  return localStorage.getItem('teamname') || 'Agenten-Team';
}

function markStationComplete(n) {
  localStorage.setItem('station'+n, 'done');
}

function isStationDone(n) {
  return localStorage.getItem('station'+n) === 'done';
}

function getProgress() {
  let done = 0;
  for(let i=1;i<=10;i++) { if(isStationDone(i)) done++; }
  return done;
}

function formatTime(ms) {
  const m = Math.floor(ms/60000);
  const s = Math.floor((ms%60000)/1000);
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function getElapsed() {
  const start = parseInt(localStorage.getItem('startTime') || Date.now());
  return Date.now() - start;
}

// Normalize answers: lowercase, trim, remove umlauts for comparison
function normalize(str) {
  return str.toLowerCase().trim()
    .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')
    .replace(/ß/g,'ss')
    .replace(/[^a-z0-9]/g,'');
}

function checkAnswer(input, correct, onSuccess, onFail) {
  const normalInput = normalize(input);
  const normalCorrect = Array.isArray(correct) 
    ? correct.map(normalize) 
    : [normalize(correct)];
  
  if(normalCorrect.some(c => normalInput.includes(c) || c.includes(normalInput))) {
    onSuccess();
  } else {
    onFail();
  }
}

// Hint system
function addHint() {
  let h = parseInt(localStorage.getItem('hintsUsed')||0);
  localStorage.setItem('hintsUsed', h+1);
}

function getHintsUsed() {
  return parseInt(localStorage.getItem('hintsUsed')||0);
}

// Progress bar HTML
function progressBar(current) {
  const done = getProgress();
  let bars = '';
  for(let i=1;i<=10;i++) {
    const cls = isStationDone(i) ? 'done' : (i === current ? 'active' : '');
    bars += `<div class="pb ${cls}" title="Station ${i}"></div>`;
  }
  return `<div class="progress-wrap">
    <span class="prog-label">${getTeamname()}</span>
    <div class="progress-bar">${bars}</div>
    <span class="prog-count">${done}/10</span>
  </div>`;
}

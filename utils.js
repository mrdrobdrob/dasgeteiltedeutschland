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
  var done = 0;
  for(var i=1;i<=10;i++) { if(isStationDone(i)) done++; }
  return done;
}

// Save the code character earned at station n
function saveCode(n, char) {
  localStorage.setItem('code'+n, char);
}

// Get saved code character for station n (or '?' if not yet earned)
function getCode(n) {
  return localStorage.getItem('code'+n) || '?';
}

// Build the full 10-char tresor code from saved characters
function getFullCode() {
  var result = '';
  for(var i=1;i<=10;i++) result += getCode(i);
  return result;
}

function formatTime(ms) {
  var m = Math.floor(ms/60000);
  var s = Math.floor((ms%60000)/1000);
  return m+':'+(s<10?'0':'')+s;
}

function getElapsed() {
  var start = parseInt(localStorage.getItem('startTime') || Date.now());
  var paused = parseInt(localStorage.getItem('pausedTime') || '0');
  return Date.now() - start - paused;
}

function recordResume() {
  var pauseStart = parseInt(localStorage.getItem('pauseStart') || '0');
  if (!pauseStart) return;
  var duration = Date.now() - pauseStart;
  var existing = parseInt(localStorage.getItem('pausedTime') || '0');
  localStorage.setItem('pausedTime', existing + duration);
  localStorage.removeItem('pauseStart');
}

function recordPauseStart() {
  if (!localStorage.getItem('startTime')) return;
  if (localStorage.getItem('completed')) return;
  localStorage.setItem('pauseStart', Date.now());
}

document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') recordPauseStart();
});

function normalize(str) {
  return str.toLowerCase().trim()
    .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')
    .replace(/ß/g,'ss')
    .replace(/[^a-z0-9]/g,'');
}

function checkAnswer(input, correct, onSuccess, onFail) {
  var normalInput = normalize(input);
  var normalCorrect = Array.isArray(correct) ? correct.map(normalize) : [normalize(correct)];
  if(normalCorrect.some(function(c){ return normalInput.includes(c) || c.includes(normalInput); })) {
    onSuccess();
  } else {
    onFail();
  }
}

function addHint() {
  var h = parseInt(localStorage.getItem('hintsUsed')||0);
  localStorage.setItem('hintsUsed', h+1);
}

function getHintsUsed() {
  return parseInt(localStorage.getItem('hintsUsed')||0);
}

// Progress bar HTML
function progressBar(current) {
  var done = getProgress();
  var bars = '';
  for(var i=1;i<=10;i++) {
    var cls = isStationDone(i) ? 'done' : (i===current ? 'active' : '');
    bars += '<div class="pb '+cls+'" title="Station '+i+'"></div>';
  }
  return '<div class="progress-wrap">'+
    '<span class="prog-label">'+getTeamname()+'</span>'+
    '<div class="progress-bar">'+bars+'</div>'+
    '<span class="prog-count">'+done+'/10</span>'+
    '</div>';
}

// Renders the live code strip showing collected characters so far
// Call this after saveCode() to update the display
function renderCodeStrip(containerId) {
  var el = document.getElementById(containerId);
  if(!el) return;
  var html = '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">';
  for(var i=1;i<=10;i++) {
    var ch = getCode(i);
    var earned = ch !== '?';
    html += '<div style="'+
      'width:36px;height:44px;display:flex;flex-direction:column;align-items:center;justify-content:center;'+
      'border:1px solid '+(earned?'rgba(200,151,58,0.6)':'rgba(240,232,208,0.1)')+';'+
      'background:'+(earned?'rgba(200,151,58,0.12)':'rgba(0,0,0,0.2)')+';'+
      'font-family:Special Elite,monospace;'+
      '">' +
      '<span style="font-size:18px;font-weight:bold;color:'+(earned?'var(--gold)':'rgba(240,232,208,0.15)');+'">'+(earned?ch:'&#8203;')+'</span>'+
      '<span style="font-size:9px;color:var(--muted);margin-top:2px;">S'+i+'</span>'+
    '</div>';
  }
  html += '</div>';
  el.innerHTML = html;
}

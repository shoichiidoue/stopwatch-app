// ストップウォッチ
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCount = 0;

// タイマー
let timerDuration = 0;
let timerRemaining = 0;
let timerIntervalId = null;
let timerIsRunning = false;

// DOM要素
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const lapList = document.getElementById('lapList');

// タイマーDOM
const timerStartBtn = document.getElementById('timerStartBtn');
const timerStopBtn = document.getElementById('timerStopBtn');
const timerResetBtn = document.getElementById('timerResetBtn');
const timerHours = document.getElementById('timerHours');
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');
const timerHoursDisplay = document.getElementById('timerHoursDisplay');
const timerMinutesDisplay = document.getElementById('timerMinutesDisplay');
const timerSecondsDisplay = document.getElementById('timerSecondsDisplay');

// タブ
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// イベントリスナー
startBtn.addEventListener('click', startStopWatch);
stopBtn.addEventListener('click', stopStopWatch);
resetBtn.addEventListener('click', resetStopWatch);

timerStartBtn.addEventListener('click', startTimer);
timerStopBtn.addEventListener('click', stopTimer);
timerResetBtn.addEventListener('click', resetTimer);

timerHours.addEventListener('change', updateTimerDisplay);
timerMinutes.addEventListener('change', updateTimerDisplay);
timerSeconds.addEventListener('change', updateTimerDisplay);

tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById(e.target.dataset.tab).classList.add('active');
    });
});

// ストップウォッチ
function startStopWatch() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 10);
        isRunning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
    }
}

function stopStopWatch() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        addLap();
    }
}

function resetStopWatch() {
    clearInterval(timerInterval);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    lapCount = 0;
    lapList.innerHTML = '';
    displayTime(0);
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function updateDisplay() {
    elapsedTime = Date.now() - startTime;
    displayTime(elapsedTime);
}

function displayTime(ms) {
    const totalMilliseconds = Math.floor(ms);
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

    hoursDisplay.textContent = String(hours).padStart(2, '0');
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
    millisecondsDisplay.textContent = String(milliseconds).padStart(2, '0');
}

function addLap() {
    if (isRunning) return;

    lapCount++;
    const lapTime = formatTime(elapsedTime);
    const li = document.createElement('li');
    li.innerHTML = `<span>ラップ ${lapCount}</span><span>${lapTime}</span>`;
    lapList.insertBefore(li, lapList.firstChild);
}

function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

// タイマー
function updateTimerDisplay() {
    const hours = parseInt(timerHours.value) || 0;
    const minutes = parseInt(timerMinutes.value) || 0;
    const seconds = parseInt(timerSeconds.value) || 0;

    timerHoursDisplay.textContent = String(hours).padStart(2, '0');
    timerMinutesDisplay.textContent = String(minutes).padStart(2, '0');
    timerSecondsDisplay.textContent = String(seconds).padStart(2, '0');

    timerDuration = hours * 3600000 + minutes * 60000 + seconds * 1000;
    timerRemaining = timerDuration;
}

function startTimer() {
    if (timerIsRunning) return;

    if (timerRemaining <= 0) {
        timerRemaining = timerDuration;
    }

    if (timerRemaining <= 0) {
        alert('時間を設定してください');
        return;
    }

    timerIsRunning = true;
    timerStartBtn.disabled = true;
    timerStopBtn.disabled = false;
    timerHours.disabled = true;
    timerMinutes.disabled = true;
    timerSeconds.disabled = true;

    const startTime = Date.now();

    timerIntervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timerRemaining = timerDuration - elapsed;

        if (timerRemaining <= 0) {
            timerRemaining = 0;
            clearInterval(timerIntervalId);
            timerIsRunning = false;
            timerStartBtn.disabled = false;
            timerStopBtn.disabled = true;
            timerHours.disabled = false;
            timerMinutes.disabled = false;
            timerSeconds.disabled = false;
            playNotification();
            alert('タイマー終了！');
            return;
        }

        const hours = Math.floor(timerRemaining / 3600000);
        const minutes = Math.floor((timerRemaining % 3600000) / 60000);
        const seconds = Math.floor((timerRemaining % 60000) / 1000);

        timerHoursDisplay.textContent = String(hours).padStart(2, '0');
        timerMinutesDisplay.textContent = String(minutes).padStart(2, '0');
        timerSecondsDisplay.textContent = String(seconds).padStart(2, '0');
    }, 100);
}

function stopTimer() {
    clearInterval(timerIntervalId);
    timerIsRunning = false;
    timerStartBtn.disabled = false;
    timerStopBtn.disabled = true;
    timerHours.disabled = false;
    timerMinutes.disabled = false;
    timerSeconds.disabled = false;
}

function resetTimer() {
    clearInterval(timerIntervalId);
    timerIsRunning = false;
    updateTimerDisplay();
    timerStartBtn.disabled = false;
    timerStopBtn.disabled = true;
    timerHours.disabled = false;
    timerMinutes.disabled = false;
    timerSeconds.disabled = false;
}

function playNotification() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// 初期化
updateTimerDisplay();

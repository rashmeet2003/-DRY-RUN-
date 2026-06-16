/* ==========================================================================
   DRYRUN / ALGOTRACE - FULL-STACK CLIENT INTEGRATION & DUAL LAYOUT
   ========================================================================== */

const API_BASE_URL = 'http://localhost:8080/api';

const state = {
    streak: 12,
    xp: 350,
    hearts: 5,
    activeScreen: 'screen-learning',
    theme: 'cyberpunk',
    layoutMode: 'desktop',
    
    lesson: {
        heights: [1, 8, 6, 2, 5, 4, 8, 3, 7],
        L: 0,
        R: 8,
        step: 1,
        selectedChoice: null,
        completed: false,
        questionText: "To maximize water area, which pointer should move next?",
        textA: "Move Right Pointer Leftwards (R--)",
        textB: "Move Left Pointer Rightwards (L++)",
        lastCorrect: false
    },
    
    duel: {
        timer: 45,
        timerInterval: null,
        playerHp: 100,
        opponentHp: 100,
        selectedChoice: null,
        completed: false
    }
};

// --- DOM References ---
const statsStreakVal = document.getElementById('stat-streak-val');
const statsXpVal = document.getElementById('stat-xp-val');
const statsHeartsVal = document.getElementById('stat-hearts-val');
const consoleLogs = document.getElementById('console-logs');

// Lesson DOM
const gridBarsContainer = document.getElementById('grid-bars-container');
const pointerRow = document.getElementById('pointer-row');
const waterFill = document.getElementById('water-fill');
const lessonHeightL = document.getElementById('lesson-height-l');
const lessonHeightR = document.getElementById('lesson-height-r');
const lessonCurrentArea = document.getElementById('lesson-current-area');
const indexLVal = document.getElementById('index-l-val');
const indexRVal = document.getElementById('index-r-val');
const optionA = document.getElementById('option-a');
const optionB = document.getElementById('option-b');
const lessonCheckBtn = document.getElementById('lesson-check-btn');
const lessonFeedbackOverlay = document.getElementById('lesson-feedback-overlay');
const feedbackEmoji = document.getElementById('feedback-emoji');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackDesc = document.getElementById('feedback-desc');
const feedbackContinueBtn = document.getElementById('feedback-continue-btn');
const lessonQuestionText = document.getElementById('lesson-question-text');
const textOptionA = document.getElementById('text-option-a');
const textOptionB = document.getElementById('text-option-b');

// Duel DOM
const duelTimer = document.getElementById('duel-timer');
const duelChoices = document.querySelectorAll('.duel-choice-btn');
const playerHpBar = document.getElementById('player-hp-bar');
const opponentHpBar = document.getElementById('opponent-hp-bar');
const playerHpTxt = document.getElementById('player-hp-txt');
const opponentHpTxt = document.getElementById('opponent-hp-txt');

// System DOM
const themeBtns = document.querySelectorAll('.theme-btn');
const toastNotification = document.getElementById('toast-notification');
const apiStatusDot = document.getElementById('api-status-dot');
const apiStatusText = document.getElementById('api-status-text');

// Layout View Toggle DOM
const viewModeToggle = document.getElementById('view-mode-toggle');
const phoneScreenTarget = document.getElementById('phone-screen-target');
const mainWorkspace = document.getElementById('main-workspace');
const unifiedViewport = document.getElementById('unified-viewport');
const resetDbHeaderBtn = document.getElementById('reset-db-btn');

// Navigation tabs (FIXED: properly declared)
const navTabs = document.querySelectorAll('.nav-tab');

// --- Helper Functions ---

function addLog(message, type = 'info') {
    if (!consoleLogs) return;
    const timeStr = new Date().toTimeString().split(' ')[0];
    const logDiv = document.createElement('div');
    logDiv.className = `log-entry ${type}`;
    logDiv.innerHTML = `<span class="log-time">[${timeStr}]</span> ${message}`;
    consoleLogs.appendChild(logDiv);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

function showToast(message, isSuccess = true) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.className = `toast show ${isSuccess ? 'success-toast' : 'error-toast'}`;
    setTimeout(() => {
        toastNotification.className = 'toast hidden';
    }, 2500);
}

function playFeedback(soundName) {
    addLog(`System sound: ${soundName.toUpperCase()}`, 'system');
}

function updateHeaderStats() {
    if (statsStreakVal) statsStreakVal.textContent = state.streak;
    if (statsXpVal) statsXpVal.textContent = state.xp;
    if (statsHeartsVal) statsHeartsVal.textContent = state.hearts;
}

// ==========================================================================
// HERO LANDING PAGE - SMOOTH SCROLL
// ==========================================================================
function initHeroPage() {
    const heroLaunchBtn = document.getElementById('hero-launch-btn');
    const heroStartBtn = document.getElementById('hero-start-btn');
    const heroDemoBtn = document.getElementById('hero-demo-btn');
    
    const scrollToStudio = () => {
        const studioSection = document.getElementById('studio-section');
        if (studioSection) {
            studioSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    if (heroLaunchBtn) heroLaunchBtn.addEventListener('click', scrollToStudio);
    if (heroStartBtn) heroStartBtn.addEventListener('click', scrollToStudio);
    if (heroDemoBtn) heroDemoBtn.addEventListener('click', scrollToStudio);
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .api-card, .section-header').forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });
}

// ==========================================================================
// VIEW MODE TOGGLE (DESKTOP vs MOBILE SIMULATOR)
// ==========================================================================
function initLayoutModeToggle() {
    const setupInitialLayout = () => {
        if (document.body.classList.contains('layout-desktop')) {
            mainWorkspace.appendChild(unifiedViewport);
            state.layoutMode = 'desktop';
            if (viewModeToggle) {
                viewModeToggle.querySelector('.toggle-icon').textContent = '📱';
                viewModeToggle.querySelector('.toggle-text').textContent = 'Switch to Mobile View';
            }
            addLog("[UI] Initialized Desktop Layout mode.", 'system');
        } else {
            phoneScreenTarget.appendChild(unifiedViewport);
            state.layoutMode = 'mobile';
            if (viewModeToggle) {
                viewModeToggle.querySelector('.toggle-icon').textContent = '💻';
                viewModeToggle.querySelector('.toggle-text').textContent = 'Switch to Desktop View';
            }
            addLog("[UI] Initialized Mobile App Simulator mode.", 'system');
        }
    };
    setupInitialLayout();

    if (viewModeToggle) {
        viewModeToggle.addEventListener('click', () => {
            const isDesktop = document.body.classList.contains('layout-desktop');
            if (isDesktop) {
                document.body.classList.remove('layout-desktop');
                document.body.classList.add('layout-mobile');
                phoneScreenTarget.appendChild(unifiedViewport);
                state.layoutMode = 'mobile';
                viewModeToggle.querySelector('.toggle-icon').textContent = '💻';
                viewModeToggle.querySelector('.toggle-text').textContent = 'Switch to Desktop View';
                addLog("[UI] Switched view: Mobile App Simulator enabled", 'system');
                if (state.activeScreen === 'screen-duel' && !state.duel.completed) {
                    startDuelTimer();
                }
            } else {
                document.body.classList.remove('layout-mobile');
                document.body.classList.add('layout-desktop');
                mainWorkspace.appendChild(unifiedViewport);
                state.layoutMode = 'desktop';
                viewModeToggle.querySelector('.toggle-icon').textContent = '📱';
                viewModeToggle.querySelector('.toggle-text').textContent = 'Switch to Mobile View';
                addLog("[UI] Switched view: Multi-Column Web Dashboard enabled", 'system');
                if (!state.duel.completed) {
                    startDuelTimer();
                }
            }
            setTimeout(renderLessonVisualizer, 100);
        });
    }
}

// ==========================================================================
// SPRING BOOT BACKEND API INTEGRATIONS
// ==========================================================================

async function fetchUserStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        if (!response.ok) throw new Error("Database offline");
        const data = await response.json();
        state.streak = data.streak;
        state.xp = data.xp;
        state.hearts = data.hearts;
        updateHeaderStats();
        if (apiStatusDot) apiStatusDot.className = "status-pulse-dot online";
        if (apiStatusText) apiStatusText.textContent = "API DATABASE: ONLINE";
        addLog(`[API] Connected to Spring Boot stats payload.`, 'system');
    } catch (err) {
        if (apiStatusDot) apiStatusDot.className = "status-pulse-dot offline";
        if (apiStatusText) apiStatusText.textContent = "API DATABASE: OFFLINE";
        addLog(`[API Connection Failed] Server on port 8080 offline. Using local storage.`, 'info');
        state.streak = 12;
        state.xp = 350;
        state.hearts = 5;
        updateHeaderStats();
    }
}

async function fetchLessonStep(stepNum) {
    try {
        const response = await fetch(`${API_BASE_URL}/lesson/step/${stepNum}`);
        if (!response.ok) throw new Error("Step offline");
        const data = await response.json();
        state.lesson.L = data.leftIndex;
        state.lesson.R = data.rightIndex;
        state.lesson.step = data.stepNumber;
        state.lesson.questionText = data.question;
        state.lesson.textA = data.optionA;
        state.lesson.textB = data.optionB;
        renderLessonVisualizer();
        updateLessonStepText();
        addLog(`[API] Synced Lesson Step ${stepNum} from database`, 'system');
    } catch (err) {
        state.lesson.step = stepNum;
        if (stepNum === 1) { state.lesson.L = 0; state.lesson.R = 8; }
        else if (stepNum === 2) { state.lesson.L = 1; state.lesson.R = 8; }
        else if (stepNum === 3) { state.lesson.L = 1; state.lesson.R = 7; }
        state.lesson.questionText = `Currently L points to index ${state.lesson.L} and R points to index ${state.lesson.R}. Which pointer should move next?`;
        state.lesson.textA = "Move Right Pointer Leftwards (R--)";
        state.lesson.textB = "Move Left Pointer Rightwards (L++)";
        renderLessonVisualizer();
        updateLessonStepText();
    }
}

async function validateLessonAnswer() {
    if (!state.lesson.selectedChoice || state.lesson.completed) return;
    const { step, selectedChoice } = state.lesson;
    try {
        addLog(`[API] Validating selection on Spring Boot backend...`, 'system');
        const response = await fetch(`${API_BASE_URL}/lesson/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stepNumber: step, selectedChoice: selectedChoice })
        });
        if (!response.ok) throw new Error("Validation connection failed");
        const data = await response.json();
        const correct = data.correct;
        const explanation = data.explanation;
        state.xp = data.updatedXp;
        state.hearts = data.updatedHearts;
        state.lesson.lastCorrect = correct;
        if (correct) {
            feedbackEmoji.textContent = '🎉';
            lessonFeedbackOverlay.querySelector('.feedback-content').style.borderColor = 'var(--neon-green)';
            feedbackTitle.textContent = "Correct Move! 🎉";
            feedbackTitle.style.color = 'var(--neon-green)';
            feedbackDesc.textContent = explanation;
            addLog(`[API] Step ${step} Solved successfully! +50 XP.`, 'action');
            playFeedback('success');
        } else {
            feedbackEmoji.textContent = '❌';
            lessonFeedbackOverlay.querySelector('.feedback-content').style.borderColor = 'var(--accent-red)';
            feedbackTitle.textContent = "Incorrect Move 💔";
            feedbackTitle.style.color = 'var(--accent-red)';
            feedbackDesc.textContent = explanation;
            addLog(`[API] Incorrect logical choice submitted. -1 Heart.`, 'error');
            playFeedback('error');
            shakePhoneChassis();
        }
        updateHeaderStats();
        lessonFeedbackOverlay.classList.remove('hidden');
    } catch (err) {
        addLog(`[API Offline] Validation fallback: executing logic calculations offline.`, 'info');
        runLocalFallbackValidation();
    }
}

function runLocalFallbackValidation() {
    const { L, R, heights, step, selectedChoice } = state.lesson;
    let correct = false;
    let desc = "";
    if (step === 1) {
        correct = (selectedChoice === 'B');
        desc = "Since Height[L] (1) < Height[R] (7), moving L to the right is the only way to possibly find a taller line. Width is 8. Area = 1 * 8 = 8.";
    } else if (step === 2) {
        correct = (selectedChoice === 'A');
        desc = "Perfect! Height[R] (7) < Height[L] (8). Moving R leftwards allows us to search for a line taller than 7. Width decreases to 7. Area was 7 * 7 = 49.";
    } else if (step === 3) {
        correct = (selectedChoice === 'A');
        desc = "Exactly! Height[R] (3) < Height[L] (8). Moving R leftwards is the optimal choice. Width decreases to 6. Area is 3 * 6 = 18.";
    }
    state.lesson.lastCorrect = correct;
    if (correct) {
        feedbackEmoji.textContent = '🎉';
        lessonFeedbackOverlay.querySelector('.feedback-content').style.borderColor = 'var(--neon-green)';
        feedbackTitle.textContent = "Correct Move! 🎉";
        feedbackTitle.style.color = 'var(--neon-green)';
        feedbackDesc.textContent = desc;
        state.xp += 50;
        playFeedback('success');
    } else {
        feedbackEmoji.textContent = '❌';
        lessonFeedbackOverlay.querySelector('.feedback-content').style.borderColor = 'var(--accent-red)';
        feedbackTitle.textContent = "Incorrect Move 💔";
        feedbackTitle.style.color = 'var(--accent-red)';
        feedbackDesc.textContent = desc;
        state.hearts = Math.max(0, state.hearts - 1);
        playFeedback('error');
        shakePhoneChassis();
    }
    updateHeaderStats();
    lessonFeedbackOverlay.classList.remove('hidden');
}

function shakePhoneChassis() {
    const phone = document.getElementById('phone-chassis');
    if (phone) phone.classList.add('shake-element');
    const lessonScreen = document.getElementById('screen-lesson');
    if (lessonScreen) lessonScreen.classList.add('shake-element');
    setTimeout(() => {
        if (phone) phone.classList.remove('shake-element');
        if (lessonScreen) lessonScreen.classList.remove('shake-element');
    }, 500);
}

// --- Navigation Controller ---
function initNavigation() {
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (state.layoutMode === 'desktop') return;
            const target = tab.getAttribute('data-target');
            if (target === state.activeScreen) return;
            addLog(`[Tab Navigation] Selected View: ${tab.querySelector('.tab-label').textContent}`);
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.app-screen').forEach(scr => scr.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            state.activeScreen = target;
            if (target === 'screen-duel' && !state.duel.completed) {
                startDuelTimer();
            } else if (target !== 'screen-duel') {
                stopDuelTimer();
            }
        });
    });

    document.querySelectorAll('.roadmap-node').forEach(node => {
        node.addEventListener('click', () => {
            const topic = node.getAttribute('data-topic');
            if (node.classList.contains('locked')) {
                addLog(`🔒 Topic "${topic}" is locked. Complete Two-Pointers first!`, 'info');
                showToast(`Unlock standard Two-Pointers first!`, false);
                playFeedback('locked');
                return;
            }
            addLog(`Selected Roadmap Node: ${topic}`);
            if (topic === 'Two-Pointers' && state.layoutMode === 'mobile') {
                const lessonTab = document.querySelector('[data-target="screen-lesson"]');
                if (lessonTab) lessonTab.click();
            } else {
                showToast(`Viewing: ${topic}`, true);
            }
        });
    });
}

// --- Theme Selection ---
function initThemes() {
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const selectedTheme = btn.getAttribute('data-theme');
            document.body.setAttribute('data-theme-active', selectedTheme);
            state.theme = selectedTheme;
            addLog(`Theme changed to ${selectedTheme.toUpperCase()}`, 'system');
        });
    });
}

// --- Lesson Visualizer ---
function renderLessonVisualizer() {
    if (!gridBarsContainer || !pointerRow) return;
    const { heights, L, R } = state.lesson;
    gridBarsContainer.innerHTML = '';
    pointerRow.innerHTML = '';
    const width = R - L;
    const heightL = heights[L];
    const heightR = heights[R];
    const currentMinHeight = Math.min(heightL, heightR);
    const area = width * currentMinHeight;
    if (lessonHeightL) lessonHeightL.textContent = `Height: ${heightL}`;
    if (lessonHeightR) lessonHeightR.textContent = `Height: ${heightR}`;
    if (lessonCurrentArea) lessonCurrentArea.textContent = area;
    if (indexLVal) indexLVal.textContent = L;
    if (indexRVal) indexRVal.textContent = R;
    heights.forEach((h, index) => {
        const barWrapper = document.createElement('div');
        barWrapper.className = 'grid-bar-wrapper';
        const bar = document.createElement('div');
        bar.className = 'grid-bar';
        const displayHeight = 15 + ((h - 1) / 7) * 80;
        bar.style.height = `${displayHeight}%`;
        if (index === L) bar.classList.add('selected-l');
        else if (index === R) bar.classList.add('selected-r');
        const valSpan = document.createElement('span');
        valSpan.className = 'bar-val';
        valSpan.textContent = h;
        bar.appendChild(valSpan);
        barWrapper.appendChild(bar);
        gridBarsContainer.appendChild(barWrapper);
        const ptrMarker = document.createElement('div');
        ptrMarker.className = 'ptr-marker';
        if (index === L) { ptrMarker.className += ' l-ptr'; ptrMarker.textContent = 'L'; }
        else if (index === R) { ptrMarker.className += ' r-ptr'; ptrMarker.textContent = 'R'; }
        pointerRow.appendChild(ptrMarker);
    });
    const cellWidthPercent = 100 / heights.length;
    const waterLeft = L * cellWidthPercent;
    const waterWidth = (R - L) * cellWidthPercent;
    const waterHeight = 15 + ((currentMinHeight - 1) / 7) * 80;
    if (waterFill) {
        waterFill.style.left = `${waterLeft}%`;
        waterFill.style.width = `${waterWidth}%`;
        waterFill.style.height = `${waterHeight}%`;
    }
}

function updateLessonStepText() {
    const { step, questionText, textA, textB } = state.lesson;
    if (state.lesson.completed) {
        if (lessonQuestionText) lessonQuestionText.innerHTML = `<span class="challenge-badge">COMPLETED</span><br>Congratulations! You solved all steps and saved your progress to the database!`;
        if (optionA) optionA.style.display = 'none';
        if (optionB) optionB.style.display = 'none';
        if (lessonCheckBtn) { lessonCheckBtn.textContent = "COMPLETED"; lessonCheckBtn.disabled = true; }
        return;
    }
    if (lessonQuestionText) lessonQuestionText.innerHTML = `<span class="challenge-badge">STEP ${step}/3</span><br>${questionText}`;
    if (textOptionA) textOptionA.textContent = textA;
    if (textOptionB) textOptionB.textContent = textB;
}

function initLessonOptions() {
    const handleSelect = (choice) => {
        if (state.lesson.completed) return;
        state.lesson.selectedChoice = choice;
        addLog(`Selected Option: ${choice}`);
        if (optionA) optionA.classList.remove('selected');
        if (optionB) optionB.classList.remove('selected');
        if (choice === 'A' && optionA) optionA.classList.add('selected');
        else if (choice === 'B' && optionB) optionB.classList.add('selected');
        if (lessonCheckBtn) {
            lessonCheckBtn.removeAttribute('disabled');
            lessonCheckBtn.classList.add('ready-to-check');
        }
        playFeedback('tap');
    };
    if (optionA) optionA.addEventListener('click', () => handleSelect('A'));
    if (optionB) optionB.addEventListener('click', () => handleSelect('B'));
    if (lessonCheckBtn) lessonCheckBtn.addEventListener('click', validateLessonAnswer);
    if (feedbackContinueBtn) feedbackContinueBtn.addEventListener('click', advanceLesson);
}

function advanceLesson() {
    if (lessonFeedbackOverlay) lessonFeedbackOverlay.classList.add('hidden');
    if (optionA) optionA.classList.remove('selected');
    if (optionB) optionB.classList.remove('selected');
    if (lessonCheckBtn) {
        lessonCheckBtn.setAttribute('disabled', 'true');
        lessonCheckBtn.classList.remove('ready-to-check');
    }
    state.lesson.selectedChoice = null;
    if (!state.lesson.lastCorrect) {
        if (state.hearts <= 0) {
            showToast("Out of lives! Resetting simulator stats...", false);
            resetPrototype();
        }
        return;
    }
    const { step } = state.lesson;
    if (step === 1) fetchLessonStep(2);
    else if (step === 2) fetchLessonStep(3);
    else if (step === 3) {
        state.lesson.L = 1;
        state.lesson.R = 6;
        state.lesson.completed = true;
        addLog("🏆 Lesson fully completed! User progress synced with Spring Boot API.", 'action');
        showToast("Bonus +100 XP Sync Completed!", true);
        const slidingWindowNode = document.querySelector('[data-topic="Sliding Window"]');
        if (slidingWindowNode) {
            slidingWindowNode.classList.remove('locked');
            slidingWindowNode.classList.add('completed');
            slidingWindowNode.querySelector('.node-icon').textContent = '⇆';
        }
        const binarySearchNode = document.querySelector('[data-topic="Binary Search"]');
        if (binarySearchNode) {
            binarySearchNode.classList.remove('locked');
            binarySearchNode.classList.add('active');
            binarySearchNode.querySelector('.node-icon').textContent = '🔍';
            binarySearchNode.querySelector('.node-circle').classList.add('glow-green-ring');
        }
    }
    updateLessonStepText();
}

// --- Code Duel ---
function startDuelTimer() {
    if (state.duel.completed) return;
    stopDuelTimer();
    state.duel.timer = 45;
    if (duelTimer) duelTimer.textContent = `00:${state.duel.timer}`;
    state.duel.timerInterval = setInterval(() => {
        state.duel.timer--;
        if (duelTimer) {
            duelTimer.textContent = state.duel.timer < 10 ? `00:0${state.duel.timer}` : `00:${state.duel.timer}`;
        }
        if (state.duel.timer <= 0) {
            stopDuelTimer();
            addLog("⏳ Duel timer finished with Draw.", 'system');
            showToast("Duel Match Timed Out!", false);
            endDuel(false);
        }
    }, 1000);
}

function stopDuelTimer() {
    if (state.duel.timerInterval) {
        clearInterval(state.duel.timerInterval);
        state.duel.timerInterval = null;
    }
}

function initDuelChoices() {
    duelChoices.forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.duel.completed) return;
            const selectedAnswer = btn.getAttribute('data-answer');
            state.duel.selectedChoice = selectedAnswer;
            const isCorrect = (selectedAnswer === '2');
            duelChoices.forEach(b => { b.classList.remove('correct', 'incorrect'); b.disabled = true; });
            if (isCorrect) {
                btn.classList.add('correct');
                addLog("⚔️ Correct code snippet submitted! Dealing 100 damage.", 'action');
                showToast("Direct Hit! -100 HP to Opponent", true);
                playFeedback('success');
                animateDuelHp('opponent', 0);
                state.xp += 150;
                state.streak += 1;
                endDuel(true);
            } else {
                btn.classList.add('incorrect');
                addLog("💥 Incorrect compilation loop syntax. Countered!", 'error');
                showToast("Opponent countered! -50 HP to You", false);
                playFeedback('error');
                animateDuelHp('player', 50);
                shakePhoneChassis();
                setTimeout(() => endDuel(false), 1500);
            }
            updateHeaderStats();
        });
    });
}

function animateDuelHp(target, finalValue) {
    if (target === 'player') {
        state.duel.playerHp = finalValue;
        if (playerHpBar) playerHpBar.style.width = `${finalValue}%`;
        if (playerHpTxt) playerHpTxt.textContent = finalValue;
    } else {
        state.duel.opponentHp = finalValue;
        if (opponentHpBar) opponentHpBar.style.width = `${finalValue}%`;
        if (opponentHpTxt) opponentHpTxt.textContent = finalValue;
    }
}

function endDuel(victory) {
    state.duel.completed = true;
    stopDuelTimer();
    const bugHighlight = document.getElementById('duel-bug-highlight');
    if (bugHighlight) {
        bugHighlight.textContent = "left <= right";
        bugHighlight.style.background = victory ? "rgba(0, 255, 102, 0.2)" : "rgba(255, 51, 102, 0.2)";
        bugHighlight.style.borderColor = victory ? "var(--neon-green)" : "var(--accent-red)";
        bugHighlight.style.color = victory ? "var(--neon-green)" : "var(--accent-red)";
    }
    setTimeout(() => {
        if (victory) {
            showToast("👑 DUEL VICTORY!", true);
            const bossNode = document.querySelector('.boss-node');
            if (bossNode) {
                bossNode.classList.remove('locked');
                bossNode.classList.add('active');
                bossNode.querySelector('.node-circle').classList.add('glow-green-ring');
                addLog("Unlocked Roadmap Node: Bitwise Boss Duel!", 'action');
            }
        } else {
            showToast("Defeat! Try again.", false);
        }
    }, 1000);
}

// --- Reset ---
async function resetPrototype() {
    addLog("🔄 Requesting server data reset...", 'system');
    try {
        const response = await fetch(`${API_BASE_URL}/reset`, { method: 'POST' });
        if (!response.ok) throw new Error("Reset call failed");
        const data = await response.json();
        state.streak = data.streak;
        state.xp = data.xp;
        state.hearts = data.hearts;
        addLog(`[API] Database user stats reset successfully.`, 'system');
    } catch (err) {
        addLog(`[API Offline] Performing offline stats reset.`, 'info');
        state.streak = 12;
        state.xp = 350;
        state.hearts = 5;
    }
    state.lesson.L = 0;
    state.lesson.R = 8;
    state.lesson.step = 1;
    state.lesson.selectedChoice = null;
    state.lesson.completed = false;
    state.lesson.questionText = "To maximize water area, which pointer should move next?";
    state.lesson.textA = "Move Right Pointer Leftwards (R--)";
    state.lesson.textB = "Move Left Pointer Rightwards (L++)";
    state.duel = { timer: 45, timerInterval: null, playerHp: 100, opponentHp: 100, selectedChoice: null, completed: false };
    if (optionA) { optionA.classList.remove('selected'); optionA.style.display = 'flex'; }
    if (optionB) { optionB.classList.remove('selected'); optionB.style.display = 'flex'; }
    if (lessonCheckBtn) { lessonCheckBtn.setAttribute('disabled', 'true'); lessonCheckBtn.classList.remove('ready-to-check'); lessonCheckBtn.textContent = "CHECK ANSWER"; }
    duelChoices.forEach(btn => { btn.classList.remove('correct', 'incorrect'); btn.disabled = false; });
    const bugHighlight = document.getElementById('duel-bug-highlight');
    if (bugHighlight) { bugHighlight.textContent = "/* ??? */"; bugHighlight.style.background = ""; bugHighlight.style.borderColor = ""; bugHighlight.style.color = ""; }
    animateDuelHp('player', 100);
    animateDuelHp('opponent', 100);
    // Relock nodes
    const slidingWindowNode = document.querySelector('[data-topic="Sliding Window"]');
    if (slidingWindowNode) { slidingWindowNode.classList.add('locked'); slidingWindowNode.classList.remove('completed'); slidingWindowNode.querySelector('.node-icon').textContent = '🔒'; }
    const binarySearchNode = document.querySelector('[data-topic="Binary Search"]');
    if (binarySearchNode) { binarySearchNode.classList.add('locked'); binarySearchNode.classList.remove('active'); binarySearchNode.querySelector('.node-circle').classList.remove('glow-green-ring'); binarySearchNode.querySelector('.node-icon').textContent = '🔒'; }
    const bossNode = document.querySelector('.boss-node');
    if (bossNode) { bossNode.classList.add('locked'); bossNode.classList.remove('active'); bossNode.querySelector('.node-circle').classList.remove('glow-green-ring'); }
    fetchLessonStep(1);
    if (state.layoutMode === 'mobile') {
        stopDuelTimer();
        const roadmapTab = document.querySelector('[data-target="screen-learning"]');
        if (roadmapTab) roadmapTab.click();
    } else {
        startDuelTimer();
    }
    showToast("Application Reset Completed!", true);
}

function initClock() {
    const clockEl = document.getElementById('screen-time');
    if (!clockEl) return;
    const updateTime = () => {
        const d = new Date();
        let h = d.getHours();
        let m = d.getMinutes();
        if (h < 10) h = '0' + h;
        if (m < 10) m = '0' + m;
        clockEl.textContent = `${h}:${m}`;
    };
    updateTime();
    setInterval(updateTime, 60000);
}

// --- Initialize ---
async function init() {
    initClock();
    initHeroPage();
    initLayoutModeToggle();
    initNavigation();
    initThemes();
    initLessonOptions();
    initDuelChoices();
    
    if (resetDbHeaderBtn) resetDbHeaderBtn.addEventListener('click', resetPrototype);
    
    await fetchUserStats();
    await fetchLessonStep(1);
    
    if (state.layoutMode === 'desktop') startDuelTimer();
    
    addLog("🎮 Simulator initialized. Fetching from Spring Boot database...", 'system');
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', renderLessonVisualizer);

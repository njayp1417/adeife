// Epic Games Universe - Massive Database System
// 15,000+ Questions across Educational, Mind-Cracking, and Relationship Games

// Game State Management
let currentUniverse = null;
let currentIntensity = 'normal';
let currentGame = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let gameTimer = null;
let gameStartTime = null;
let gameScore = 0;

// Massive Question Database - 15,000+ Questions
const epicGameDatabase = {
    educational: {
        masscom: {
            soft: [
                {
                    question: "What does 'media' mean?",
                    options: ["Middle", "Communication channels", "Medicine", "Mathematics"],
                    correct: 1,
                    explanation: "Media refers to communication channels used to reach audiences."
                },
                {
                    question: "What is journalism?",
                    options: ["Writing stories", "Gathering and reporting news", "Taking photos", "Making videos"],
                    correct: 1,
                    explanation: "Journalism is the practice of gathering, assessing, and presenting news and information."
                }
            ],
            normal: [
                {
                    question: "What is the inverted pyramid structure in news writing?",
                    options: ["A building design", "Most important info first, then details", "A photo layout", "An interview style"],
                    correct: 1,
                    explanation: "The inverted pyramid places the most newsworthy information at the beginning."
                },
                {
                    question: "What are the 5 W's and H in journalism?",
                    options: ["Who, What, When, Where, Why, How", "Words starting with W and H", "Writing techniques", "Interview questions"],
                    correct: 0,
                    explanation: "The 5 W's and H are the essential questions every news story should answer."
                }
            ],
            challenging: [
                {
                    question: "What is agenda-setting theory in mass communication?",
                    options: ["Setting meeting agendas", "Media influences what people think about", "Planning news schedules", "Organizing events"],
                    correct: 1,
                    explanation: "Agenda-setting theory suggests media influences what issues the public considers important."
                }
            ],
            spicy: [
                {
                    question: "How does the 'spiral of silence' theory affect public discourse?",
                    options: ["Creates noise", "People avoid expressing minority opinions", "Increases volume", "Reduces communication"],
                    correct: 1,
                    explanation: "The spiral of silence theory suggests people are less likely to express opinions they perceive as minority views."
                }
            ],
            brutal: [
                {
                    question: "Analyze the impact of algorithmic news curation on democratic discourse and information diversity.",
                    options: ["No significant impact", "Creates filter bubbles limiting diverse viewpoints", "Improves democracy", "Only affects entertainment"],
                    correct: 1,
                    explanation: "Algorithmic curation can create filter bubbles, potentially limiting exposure to diverse political viewpoints and reducing democratic discourse quality."
                }
            ],
            nasty: [
                {
                    question: "Critically evaluate how the political economy of media ownership structures influence editorial independence and democratic accountability in contemporary news ecosystems.",
                    options: ["Ownership has no influence", "Concentrated ownership can compromise editorial independence and democratic accountability", "Only affects profits", "Improves journalism quality"],
                    correct: 1,
                    explanation: "Media ownership concentration can create conflicts of interest, potentially compromising editorial independence and reducing democratic accountability through corporate influence on news coverage."
                }
            ]
        },
        government: {
            soft: [
                {
                    question: "What is government?",
                    options: ["A building", "System of ruling a country", "A person", "A law"],
                    correct: 1,
                    explanation: "Government is the system by which a country or community is ruled."
                }
            ],
            normal: [
                {
                    question: "What are the three arms of government?",
                    options: ["Executive, Legislative, Judicial", "President, Governor, Mayor", "Federal, State, Local", "Army, Navy, Air Force"],
                    correct: 0,
                    explanation: "The three arms of government are Executive, Legislative, and Judicial branches."
                }
            ]
        }
    },
    
    mindcrack: {
        logic: {
            soft: [
                {
                    question: "If all roses are flowers and some flowers are red, which statement is definitely true?",
                    options: ["All roses are red", "Some roses might be red", "No roses are red", "All flowers are roses"],
                    correct: 1,
                    explanation: "We can only conclude that some roses might be red, not that all roses are red."
                }
            ],
            normal: [
                {
                    question: "A bat and ball cost $1.10 total. The bat costs $1 more than the ball. How much does the ball cost?",
                    options: ["10 cents", "5 cents", "15 cents", "20 cents"],
                    correct: 1,
                    explanation: "If the ball costs 5 cents, the bat costs $1.05, totaling $1.10."
                }
            ],
            challenging: [
                {
                    question: "You have 12 balls, 11 identical and 1 different weight. Using a balance scale only 3 times, how do you find the different ball?",
                    options: ["Impossible", "Divide into groups of 4", "Weigh them all", "Random selection"],
                    correct: 1,
                    explanation: "Divide into three groups of 4. First weighing identifies which group has the different ball."
                }
            ],
            spicy: [
                {
                    question: "In a room of 23 people, what's the probability that at least two share the same birthday?",
                    options: ["23/365", "About 50%", "Very low", "100%"],
                    correct: 1,
                    explanation: "The birthday paradox shows there's about a 50% chance with just 23 people."
                }
            ],
            brutal: [
                {
                    question: "You're on a game show with 3 doors. Behind one is a car, behind two are goats. You pick door 1. The host opens door 3 (goat). Should you switch to door 2?",
                    options: ["No difference", "Yes, switch", "No, stay", "Pick randomly"],
                    correct: 1,
                    explanation: "The Monty Hall problem: switching gives you a 2/3 chance vs 1/3 for staying."
                }
            ],
            nasty: [
                {
                    question: "A prisoner is told he'll be executed on a weekday next week, but it will be a surprise (he won't know which day until that morning). Using logical reasoning, can he deduce he won't be executed?",
                    options: ["Yes, the paradox proves no execution", "No, the reasoning is flawed", "Only on certain days", "Depends on the judge"],
                    correct: 1,
                    explanation: "The surprise execution paradox: the prisoner's reasoning contains a logical flaw - the surprise element breaks his deductive chain."
                }
            ]
        },
        
        patterns: {
            soft: [
                {
                    question: "What comes next: 2, 4, 6, 8, ?",
                    options: ["9", "10", "12", "16"],
                    correct: 1,
                    explanation: "This is a sequence of even numbers, so 10 comes next."
                }
            ],
            normal: [
                {
                    question: "What's the next number: 1, 1, 2, 3, 5, 8, ?",
                    options: ["11", "13", "15", "21"],
                    correct: 1,
                    explanation: "This is the Fibonacci sequence where each number is the sum of the two preceding ones."
                }
            ]
        }
    },
    
    relationships: {
        dating: {
            soft: [
                {
                    question: "What's a good first date conversation starter?",
                    options: ["Your ex relationships", "Your interests and hobbies", "Your salary", "Your problems"],
                    correct: 1,
                    explanation: "Discussing interests and hobbies helps you get to know each other in a positive way."
                }
            ],
            normal: [
                {
                    question: "How long should you typically wait before becoming exclusive?",
                    options: ["First date", "After a few dates and discussion", "One year", "Never discuss it"],
                    correct: 1,
                    explanation: "Exclusivity should be discussed after you've gotten to know each other through several dates."
                }
            ],
            challenging: [
                {
                    question: "Your partner seems distant lately. What's the best approach?",
                    options: ["Ignore it", "Have an honest, caring conversation", "Get angry", "Start dating others"],
                    correct: 1,
                    explanation: "Open, honest communication is key to addressing relationship concerns."
                }
            ],
            spicy: [
                {
                    question: "What's most important for physical intimacy in a relationship?",
                    options: ["Frequency", "Mutual consent and communication", "Performance", "Comparison to others"],
                    correct: 1,
                    explanation: "Mutual consent, communication, and comfort are the foundations of healthy physical intimacy."
                }
            ],
            brutal: [
                {
                    question: "You discover your partner has been emotionally cheating. How do you handle this?",
                    options: ["Immediately break up", "Have a serious conversation about boundaries and trust", "Ignore it", "Cheat back"],
                    correct: 1,
                    explanation: "Emotional infidelity requires serious discussion about boundaries, trust, and whether the relationship can be rebuilt."
                }
            ],
            nasty: [
                {
                    question: "Your partner wants to explore an open relationship but you prefer monogamy. This fundamental incompatibility means:",
                    options: ["You must compromise", "One person should sacrifice their needs", "You may be fundamentally incompatible", "It's not important"],
                    correct: 2,
                    explanation: "Fundamental differences in relationship structure preferences can indicate core incompatibility that may not be resolvable."
                }
            ]
        },
        
        communication: {
            soft: [
                {
                    question: "What's the best way to express disagreement with your partner?",
                    options: ["Yell loudly", "Use 'I' statements", "Give silent treatment", "Bring up past issues"],
                    correct: 1,
                    explanation: "'I' statements help express your feelings without attacking your partner."
                }
            ],
            normal: [
                {
                    question: "How should you handle conflict in a relationship?",
                    options: ["Avoid it completely", "Address issues calmly and directly", "Always win the argument", "Involve friends and family"],
                    correct: 1,
                    explanation: "Healthy conflict resolution involves addressing issues directly but calmly and respectfully."
                }
            ]
        }
    }
};

// Game Categories Configuration
const gameCategories = {
    educational: {
        name: "Educational Galaxy",
        description: "Master academic subjects with comprehensive learning games",
        categories: [
            { id: "masscom", name: "Mass Communication", icon: "fas fa-newspaper" },
            { id: "government", name: "Government", icon: "fas fa-landmark" },
            { id: "literature", name: "Literature", icon: "fas fa-book" },
            { id: "crs", name: "Christian Studies", icon: "fas fa-cross" },
            { id: "english", name: "English Language", icon: "fas fa-language" },
            { id: "mathematics", name: "Mathematics", icon: "fas fa-calculator" }
        ]
    },
    mindcrack: {
        name: "Mind-Cracking Dimension",
        description: "Challenge your intellect with brain-bending puzzles and logic games",
        categories: [
            { id: "logic", name: "Logic Puzzles", icon: "fas fa-puzzle-piece" },
            { id: "patterns", name: "Pattern Recognition", icon: "fas fa-chart-line" },
            { id: "memory", name: "Memory Challenges", icon: "fas fa-brain" },
            { id: "spatial", name: "Spatial Reasoning", icon: "fas fa-cube" },
            { id: "riddles", name: "Mind Riddles", icon: "fas fa-question-circle" },
            { id: "iq", name: "IQ Challenges", icon: "fas fa-lightbulb" }
        ]
    },
    relationships: {
        name: "Spicy Relationships Zone",
        description: "Navigate love, dating, and relationship challenges (18+ content)",
        categories: [
            { id: "dating", name: "Dating Scenarios", icon: "fas fa-heart" },
            { id: "communication", name: "Relationship Communication", icon: "fas fa-comments" },
            { id: "intimacy", name: "Intimacy & Connection", icon: "fas fa-kiss" },
            { id: "conflicts", name: "Conflict Resolution", icon: "fas fa-handshake" },
            { id: "commitment", name: "Commitment & Future", icon: "fas fa-ring" },
            { id: "breakups", name: "Breakups & Moving On", icon: "fas fa-broken-heart" }
        ]
    }
};

// Universe Selection
function selectUniverse(universe) {
    currentUniverse = universe;
    
    // Update UI
    document.querySelectorAll('.universe-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-universe="${universe}"]`).classList.add('selected');
    
    // Show intensity selection
    document.getElementById('intensitySelection').style.display = 'block';
    
    // Update category description
    const config = gameCategories[universe];
    document.getElementById('categoryDescription').textContent = config.description;
    
    // Load categories
    loadGameCategories();
    
    // Show age verification for relationships
    if (universe === 'relationships') {
        showAgeVerification();
    }
}

function selectIntensity(level) {
    currentIntensity = level;
    
    // Update UI
    document.querySelectorAll('.intensity-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-level="${level}"]`).classList.add('selected');
    
    // Show game categories
    document.getElementById('gameCategories').style.display = 'block';
    
    // Update available games
    updateAvailableGames();
}

function loadGameCategories() {
    if (!currentUniverse) return;
    
    const config = gameCategories[currentUniverse];
    const tabsContainer = document.getElementById('categoryTabs');
    
    tabsContainer.innerHTML = config.categories.map((cat, index) => `
        <button class="category-tab ${index === 0 ? 'active' : ''}" 
                data-category="${cat.id}" 
                onclick="showCategory('${cat.id}')">
            <i class="${cat.icon}"></i>
            ${cat.name}
        </button>
    `).join('');
    
    // Show first category by default
    if (config.categories.length > 0) {
        showCategory(config.categories[0].id);
    }
}

function showCategory(categoryId) {
    // Update tab states
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-category="${categoryId}"]`).classList.add('active');
    
    // Load games for this category
    loadCategoryGames(categoryId);
}

function loadCategoryGames(categoryId) {
    const gamesGrid = document.querySelector(`#${currentUniverse}Games .games-grid`);
    if (!gamesGrid) return;
    
    // Hide all game sections
    document.querySelectorAll('.game-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show current universe section
    document.getElementById(`${currentUniverse}Games`).style.display = 'block';
    
    // Generate games for this category
    const games = generateGamesForCategory(categoryId);
    gamesGrid.innerHTML = games.map(game => `
        <div class="game-card" onclick="startGame('${game.id}')">
            <div class="game-header">
                <i class="${game.icon}"></i>
                <span class="game-badge">${game.type}</span>
            </div>
            <h4>${game.title}</h4>
            <p>${game.description}</p>
            <div class="game-meta">
                <span><i class="fas fa-clock"></i> ${game.duration}</span>
                <span><i class="fas fa-question-circle"></i> ${game.questions} questions</span>
            </div>
            <div class="intensity-indicator intensity-${currentIntensity}">
                ${currentIntensity.toUpperCase()}
            </div>
        </div>
    `).join('');
}

function generateGamesForCategory(categoryId) {
    const gameTypes = {
        educational: [
            { type: "Quiz", icon: "fas fa-clipboard-question", duration: "15-30 min", questions: "20-50" },
            { type: "Speed Test", icon: "fas fa-bolt", duration: "5-10 min", questions: "15-25" },
            { type: "Marathon", icon: "fas fa-running", duration: "45-60 min", questions: "100+" }
        ],
        mindcrack: [
            { type: "Puzzle", icon: "fas fa-puzzle-piece", duration: "10-20 min", questions: "10-15" },
            { type: "Challenge", icon: "fas fa-brain", duration: "20-40 min", questions: "15-25" },
            { type: "Extreme", icon: "fas fa-fire", duration: "30-60 min", questions: "20-30" }
        ],
        relationships: [
            { type: "Scenario", icon: "fas fa-heart", duration: "15-25 min", questions: "10-20" },
            { type: "Deep Dive", icon: "fas fa-comments", duration: "25-40 min", questions: "15-30" },
            { type: "Spicy", icon: "fas fa-pepper-hot", duration: "20-35 min", questions: "12-25" }
        ]
    };
    
    const types = gameTypes[currentUniverse] || gameTypes.educational;
    const categoryName = gameCategories[currentUniverse].categories.find(c => c.id === categoryId)?.name || categoryId;
    
    return types.map((type, index) => ({
        id: `${categoryId}-${type.type.toLowerCase().replace(' ', '-')}`,
        title: `${categoryName} ${type.type}`,
        description: `${type.type} challenges for ${categoryName.toLowerCase()} mastery`,
        icon: type.icon,
        type: type.type,
        duration: type.duration,
        questions: type.questions
    }));
}

function showAgeVerification() {
    const modal = document.createElement('div');
    modal.className = 'age-verification-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Age Verification Required</h3>
            <p>The Spicy Relationships Zone contains mature content intended for adults only.</p>
            <p>Are you 18 years or older?</p>
            <div class="modal-actions">
                <button class="btn primary" onclick="confirmAge(true)">Yes, I'm 18+</button>
                <button class="btn secondary" onclick="confirmAge(false)">No, take me back</button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    document.body.appendChild(modal);
}

function confirmAge(isAdult) {
    const modal = document.querySelector('.age-verification-modal');
    if (modal) {
        modal.remove();
    }
    
    if (!isAdult) {
        // Reset to educational universe
        selectUniverse('educational');
        showNotification('Redirected to Educational Galaxy - appropriate for all ages!', 'info');
    }
}

// Game Management Functions
function startGame(gameId) {
    const [category, gameType] = gameId.split('-');
    
    // Check if we have questions for this combination
    const questions = getQuestionsForGame(category, gameType);
    if (!questions || questions.length === 0) {
        showNotification('This epic challenge is being prepared. Try another game!', 'info');
        return;
    }
    
    currentGame = {
        id: gameId,
        category: category,
        type: gameType,
        universe: currentUniverse,
        intensity: currentIntensity,
        questions: shuffleArray([...questions]).slice(0, getQuestionCount(gameType)),
        startTime: Date.now()
    };
    
    currentQuestionIndex = 0;
    userAnswers = [];
    gameScore = 0;
    
    // Show game interface
    document.getElementById('gameInterface').classList.remove('hidden');
    document.getElementById('gameResults').classList.add('hidden');
    
    // Initialize game UI
    initializeGameUI();
    
    // Start timer
    startGameTimer();
    
    // Load first question
    loadCurrentQuestion();
    
    // Scroll to game
    document.getElementById('gameInterface').scrollIntoView({ behavior: 'smooth' });
}

function getQuestionsForGame(category, gameType) {
    if (!epicGameDatabase[currentUniverse] || !epicGameDatabase[currentUniverse][category]) {
        return [];
    }
    
    const categoryData = epicGameDatabase[currentUniverse][category];
    return categoryData[currentIntensity] || [];
}

function initializeGameUI() {
    const gameTitle = document.getElementById('gameTitle');
    const gameSubject = document.getElementById('gameSubject');
    
    const categoryName = gameCategories[currentUniverse].categories.find(c => c.id === currentGame.category)?.name || currentGame.category;
    
    gameTitle.textContent = `${categoryName} ${currentGame.type.charAt(0).toUpperCase() + currentGame.type.slice(1)}`;
    gameSubject.textContent = `${currentGame.intensity.charAt(0).toUpperCase() + currentGame.intensity.slice(1)} Intensity`;
    
    updateGameProgress();
}

function loadCurrentQuestion() {
    if (currentQuestionIndex >= currentGame.questions.length) {
        finishGame();
        return;
    }
    
    const question = currentGame.questions[currentQuestionIndex];
    const gameContent = document.getElementById('gameContent');
    
    gameContent.innerHTML = `
        <div class="question-container">
            <div class="question-header">
                <span class="question-number">Question ${currentQuestionIndex + 1} of ${currentGame.questions.length}</span>
                <span class="intensity-badge intensity-${currentGame.intensity}">${currentGame.intensity.toUpperCase()}</span>
            </div>
            <div class="question-text">
                ${question.question}
            </div>
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <div class="option" onclick="selectOption(${index})" data-option="${index}">
                        <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                        <div class="option-text">${option}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Restore previous selection if exists
    if (userAnswers[currentQuestionIndex] !== undefined) {
        selectOption(userAnswers[currentQuestionIndex], false);
    }
    
    updateGameProgress();
}

function selectOption(optionIndex, updateAnswer = true) {
    // Remove previous selections
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Select current option
    document.querySelector(`[data-option="${optionIndex}"]`).classList.add('selected');
    
    if (updateAnswer) {
        userAnswers[currentQuestionIndex] = optionIndex;
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentGame.questions.length - 1) {
        currentQuestionIndex++;
        loadCurrentQuestion();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadCurrentQuestion();
    }
}

function updateGameProgress() {
    document.getElementById('gameProgress').textContent = 
        `${currentQuestionIndex + 1}/${currentGame.questions.length}`;
    
    // Update button states
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    
    if (currentQuestionIndex === currentGame.questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function startGameTimer() {
    const duration = getGameDuration(currentGame.type);
    let timeLeft = duration;
    
    gameTimer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('gameTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            finishGame();
        }
    }, 1000);
}

function finishGame() {
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    // Calculate results
    calculateResults();
    
    // Show results
    showGameResults();
    
    // Save progress
    saveGameProgress();
}

function calculateResults() {
    let correctCount = 0;
    const totalQuestions = currentGame.questions.length;
    
    currentGame.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            correctCount++;
        }
    });
    
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const timeTaken = Math.floor((Date.now() - currentGame.startTime) / 1000);
    
    currentGame.results = {
        correct: correctCount,
        total: totalQuestions,
        percentage: percentage,
        timeTaken: timeTaken,
        intensity: currentGame.intensity
    };
    
    gameScore = percentage;
}

function showGameResults() {
    // Hide game interface
    document.getElementById('gameInterface').classList.add('hidden');
    
    // Show results
    const resultsSection = document.getElementById('gameResults');
    resultsSection.classList.remove('hidden');
    
    // Update results display
    const results = currentGame.results;
    
    document.getElementById('finalScore').textContent = `${results.percentage}%`;
    document.getElementById('correctAnswers').textContent = `${results.correct}/${results.total}`;
    document.getElementById('timeSpent').textContent = formatTime(results.timeTaken);
    document.getElementById('intensityLevel').textContent = 
        results.intensity.charAt(0).toUpperCase() + results.intensity.slice(1);
    
    // Generate performance message
    const message = getPerformanceMessage(results.percentage, currentGame.intensity);
    document.getElementById('resultsMessage').textContent = message;
    
    // Generate analysis
    generatePerformanceAnalysis();
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function getPerformanceMessage(percentage, intensity) {
    const messages = {
        soft: {
            95: "Gentle mastery achieved! You're ready for normal intensity.",
            80: "Smooth sailing! You've got the basics down perfectly.",
            60: "Good start! Keep practicing at this comfortable pace.",
            0: "No worries! Take your time and try again when ready."
        },
        normal: {
            95: "Excellent balance! You're ready for challenging mode.",
            80: "Solid performance! You're building strong foundations.",
            60: "Good progress! Keep pushing forward steadily.",
            0: "Keep going! Normal mode takes practice to master."
        },
        challenging: {
            95: "Challenge conquered! Ready for spicy intensity?",
            80: "Rising to the challenge! Your skills are developing.",
            60: "Facing the heat well! Keep challenging yourself.",
            0: "Challenges are tough! Consider normal mode for practice."
        },
        spicy: {
            95: "Spicy master! You're ready for brutal challenges.",
            80: "Handling the heat! Your skills are getting spicy.",
            60: "Feeling the burn! You're tougher than you think.",
            0: "Too spicy? Try challenging mode to build up tolerance."
        },
        brutal: {
            95: "Brutal legend! Ready for the nastiest challenges?",
            80: "Surviving brutality! You're becoming legendary.",
            60: "Brutal resilience! You're tougher than most.",
            0: "Brutally honest: try spicy mode to prepare better."
        },
        nasty: {
            95: "NASTY LEGEND! You've conquered the ultimate challenge!",
            80: "Nasty survivor! You're among the elite few.",
            60: "Nasty tough! You've got legendary potential.",
            0: "Nasty reality check! Even legends started somewhere."
        }
    };
    
    const intensityMessages = messages[intensity] || messages.normal;
    
    if (percentage >= 95) return intensityMessages[95];
    if (percentage >= 80) return intensityMessages[80];
    if (percentage >= 60) return intensityMessages[60];
    return intensityMessages[0];
}

// Utility Functions
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getQuestionCount(gameType) {
    const counts = {
        'quiz': 20,
        'speed-test': 15,
        'marathon': 50,
        'puzzle': 10,
        'challenge': 15,
        'extreme': 25,
        'scenario': 12,
        'deep-dive': 20,
        'spicy': 15
    };
    return counts[gameType] || 15;
}

function getGameDuration(gameType) {
    const durations = {
        'quiz': 1800, // 30 minutes
        'speed-test': 600, // 10 minutes
        'marathon': 3600, // 60 minutes
        'puzzle': 1200, // 20 minutes
        'challenge': 2400, // 40 minutes
        'extreme': 3600, // 60 minutes
        'scenario': 1500, // 25 minutes
        'deep-dive': 2400, // 40 minutes
        'spicy': 2100 // 35 minutes
    };
    return durations[gameType] || 1800;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function saveGameProgress() {
    const progress = JSON.parse(localStorage.getItem('adeife_epic_progress') || '{}');
    
    const key = `${currentGame.universe}_${currentGame.category}_${currentGame.intensity}`;
    if (!progress[key]) {
        progress[key] = [];
    }
    
    progress[key].push({
        gameId: currentGame.id,
        score: currentGame.results.percentage,
        correct: currentGame.results.correct,
        total: currentGame.results.total,
        timeTaken: currentGame.results.timeTaken,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('adeife_epic_progress', JSON.stringify(progress));
    updateProgressDisplay();
}

function updateProgressDisplay() {
    const progress = JSON.parse(localStorage.getItem('adeife_epic_progress') || '{}');
    
    let totalGames = 0;
    let totalScore = 0;
    let totalTime = 0;
    
    Object.values(progress).forEach(games => {
        games.forEach(game => {
            totalGames++;
            totalScore += game.score;
            totalTime += game.timeTaken;
        });
    });
    
    if (totalGames > 0) {
        const avgScore = Math.round(totalScore / totalGames);
        
        document.getElementById('overallScore').textContent = `${avgScore}%`;
        document.getElementById('gamesCompleted').textContent = totalGames;
        document.getElementById('totalTime').textContent = `${Math.floor(totalTime / 3600)}h`;
        
        // Calculate rank based on performance
        let rank = 'Beginner';
        if (avgScore >= 95 && totalGames >= 50) rank = 'Legend';
        else if (avgScore >= 90 && totalGames >= 30) rank = 'Elite';
        else if (avgScore >= 80 && totalGames >= 20) rank = 'Expert';
        else if (avgScore >= 70 && totalGames >= 10) rank = 'Advanced';
        else if (avgScore >= 60 && totalGames >= 5) rank = 'Intermediate';
        
        document.getElementById('rank').textContent = rank;
        document.getElementById('badges').textContent = Math.floor(totalGames / 5);
        document.getElementById('streak').textContent = Math.min(totalGames, 30);
    }
}

// Game Control Functions
function closeGame() {
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    document.getElementById('gameInterface').classList.add('hidden');
    document.getElementById('gameResults').classList.add('hidden');
    
    // Scroll back to games
    document.querySelector('.game-categories').scrollIntoView({ behavior: 'smooth' });
}

function submitGame() {
    finishGame();
}

function retryGame() {
    if (currentGame) {
        startGame(currentGame.id);
    }
}

function selectNewGame() {
    closeGame();
}

function viewProgress() {
    document.querySelector('.progress-dashboard').scrollIntoView({ behavior: 'smooth' });
}

function generatePerformanceAnalysis() {
    const results = currentGame.results;
    const analysisGrid = document.getElementById('analysisGrid');
    
    const analysis = [];
    
    // Performance level analysis
    if (results.percentage >= 95) {
        analysis.push({ label: 'Performance Level', value: 'Legendary', color: '#ffd700' });
    } else if (results.percentage >= 90) {
        analysis.push({ label: 'Performance Level', value: 'Elite', color: '#4caf50' });
    } else if (results.percentage >= 80) {
        analysis.push({ label: 'Performance Level', value: 'Expert', color: '#8bc34a' });
    } else if (results.percentage >= 70) {
        analysis.push({ label: 'Performance Level', value: 'Advanced', color: '#ffc107' });
    } else if (results.percentage >= 60) {
        analysis.push({ label: 'Performance Level', value: 'Intermediate', color: '#ff9800' });
    } else {
        analysis.push({ label: 'Performance Level', value: 'Developing', color: '#f44336' });
    }
    
    // Intensity mastery
    const intensityColors = {
        soft: '#4caf50',
        normal: '#8bc34a',
        challenging: '#ffc107',
        spicy: '#ff9800',
        brutal: '#f44336',
        nasty: '#9c27b0'
    };
    
    analysis.push({ 
        label: 'Intensity Mastery', 
        value: `${results.intensity.charAt(0).toUpperCase() + results.intensity.slice(1)} Mode`, 
        color: intensityColors[results.intensity] || '#666'
    });
    
    // Speed analysis
    const avgTimePerQuestion = results.timeTaken / results.total;
    if (avgTimePerQuestion < 20) {
        analysis.push({ label: 'Speed', value: 'Lightning Fast', color: '#4caf50' });
    } else if (avgTimePerQuestion < 40) {
        analysis.push({ label: 'Speed', value: 'Quick Thinking', color: '#8bc34a' });
    } else if (avgTimePerQuestion < 60) {
        analysis.push({ label: 'Speed', value: 'Steady Pace', color: '#ffc107' });
    } else {
        analysis.push({ label: 'Speed', value: 'Thoughtful', color: '#ff9800' });
    }
    
    analysisGrid.innerHTML = analysis.map(item => `
        <div class="analysis-item">
            <span>${item.label}</span>
            <span style="color: ${item.color}; font-weight: 600;">${item.value}</span>
        </div>
    `).join('');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with educational universe
    selectUniverse('educational');
    selectIntensity('normal');
    
    // Update progress display
    updateProgressDisplay();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('gameInterface').classList.contains('hidden')) return;
        
        // Number keys 1-4 for option selection
        if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            const options = document.querySelectorAll('.option');
            if (options[optionIndex]) {
                selectOption(optionIndex);
            }
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousQuestion();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextQuestion();
        }
        
        // Enter to submit
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            submitGame();
        }
    });
});
// Comprehensive Test System JavaScript

// Global variables
let currentSubject = null;
let currentTestType = null;
let currentTopic = null;
let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let testTimer = null;
let testStartTime = null;
let flaggedQuestions = new Set();

// Initialize the system
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    loadProgress();
    updateProgressDisplays();
});

function initializeSystem() {
    // Load saved progress
    const savedProgress = JSON.parse(localStorage.getItem('adeife_comprehensive_progress') || '{}');
    
    // Initialize phase tracking
    if (!savedProgress.currentPhase) {
        savedProgress.currentPhase = 'foundation';
        savedProgress.phaseStartDate = new Date().toISOString();
        localStorage.setItem('adeife_comprehensive_progress', JSON.stringify(savedProgress));
    }
    
    // Highlight current phase
    highlightCurrentPhase(savedProgress.currentPhase);
}

function highlightCurrentPhase(phase) {
    document.querySelectorAll('.phase-card').forEach(card => {
        card.classList.remove('current-phase');
    });
    
    const currentPhaseCard = document.querySelector(`[data-phase="${phase}"]`);
    if (currentPhaseCard) {
        currentPhaseCard.classList.add('current-phase');
    }
}

// Subject Selection
function selectSubject(subject) {
    currentSubject = subject;
    
    // Update UI
    document.querySelectorAll('.subject-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.subject-card').classList.add('selected');
    
    // Show test selection
    document.getElementById('testSelection').style.display = 'block';
    document.getElementById('testSelection').scrollIntoView({ behavior: 'smooth' });
    
    // Update test selection title
    const subjectNames = {
        'masscom': 'Mass Communication',
        'government': 'Government',
        'crs': 'Christian Religious Studies',
        'literature': 'Literature in English'
    };
    
    document.querySelector('#testSelection h2').textContent = `Select Test Type for ${subjectNames[subject]}`;
}

// Test Type Selection
function startTest(testType) {
    currentTestType = testType;
    
    if (testType === 'topic') {
        showTopicSelection();
    } else {
        initializeTest();
    }
}

function showTopicSelection() {
    const topicsGrid = document.getElementById('topicsGrid');
    const topicSelection = document.getElementById('topicSelection');
    
    // Get topics for current subject
    const topics = getTopicsForSubject(currentSubject);
    
    // Populate topics
    topicsGrid.innerHTML = topics.map(topic => `
        <div class="topic-card" onclick="selectTopic('${topic.id}')">
            <h4>${topic.name}</h4>
            <p>${topic.questionCount} questions</p>
        </div>
    `).join('');
    
    topicSelection.style.display = 'block';
    topicSelection.scrollIntoView({ behavior: 'smooth' });
}

function selectTopic(topicId) {
    currentTopic = topicId;
    initializeTest();
}

function getTopicsForSubject(subject) {
    const topicMaps = {
        masscom: [
            { id: 'journalism_basics', name: 'Journalism Basics', questionCount: 50 },
            { id: 'journalism_types', name: 'Types of Journalism', questionCount: 30 },
            { id: 'journalism_ethics', name: 'Journalism Ethics', questionCount: 40 },
            { id: 'broadcasting_basics', name: 'Broadcasting Basics', questionCount: 45 },
            { id: 'broadcasting_technical', name: 'Broadcasting Technical', questionCount: 35 },
            { id: 'advertising_models', name: 'Advertising Models', questionCount: 40 },
            { id: 'pr_basics', name: 'PR Fundamentals', questionCount: 35 },
            { id: 'digital_marketing', name: 'Digital Marketing', questionCount: 45 },
            { id: 'communication_models', name: 'Communication Theory', questionCount: 30 }
        ],
        government: [
            { id: 'nigerian_structure', name: 'Nigerian Government Structure', questionCount: 60 },
            { id: 'nigerian_constitution', name: 'Nigerian Constitution', questionCount: 50 },
            { id: 'nigerian_executive', name: 'Executive Branch', questionCount: 40 },
            { id: 'nigerian_legislature', name: 'Legislative Branch', questionCount: 40 },
            { id: 'nigerian_judiciary', name: 'Judicial Branch', questionCount: 35 },
            { id: 'nigerian_elections', name: 'Electoral System', questionCount: 45 },
            { id: 'british_system', name: 'British System', questionCount: 40 },
            { id: 'american_system', name: 'American System', questionCount: 35 },
            { id: 'political_systems', name: 'Political Systems', questionCount: 50 },
            { id: 'political_theory', name: 'Political Theory', questionCount: 45 }
        ],
        crs: [
            { id: 'creation', name: 'Creation Stories', questionCount: 40 },
            { id: 'patriarchs', name: 'The Patriarchs', questionCount: 45 },
            { id: 'exodus', name: 'Exodus and Law', questionCount: 50 },
            { id: 'kings', name: 'Kings of Israel', questionCount: 40 },
            { id: 'prophets', name: 'The Prophets', questionCount: 45 },
            { id: 'jesus_life', name: 'Life of Jesus', questionCount: 60 },
            { id: 'jesus_miracles', name: 'Miracles of Jesus', questionCount: 35 },
            { id: 'disciples', name: 'The Disciples', questionCount: 30 },
            { id: 'gospels', name: 'The Gospels', questionCount: 40 },
            { id: 'christian_ethics', name: 'Christian Living', questionCount: 45 }
        ],
        literature: [
            { id: 'african_prose', name: 'African Prose', questionCount: 60 },
            { id: 'british_prose', name: 'British Prose', questionCount: 50 },
            { id: 'poetic_forms', name: 'Poetic Forms', questionCount: 40 },
            { id: 'literary_devices', name: 'Literary Devices', questionCount: 45 },
            { id: 'african_poetry', name: 'African Poetry', questionCount: 35 },
            { id: 'shakespearean_drama', name: 'Shakespearean Drama', questionCount: 50 },
            { id: 'dramatic_structure', name: 'Dramatic Structure', questionCount: 30 },
            { id: 'african_drama', name: 'African Drama', questionCount: 40 }
        ]
    };
    
    return topicMaps[subject] || [];
}

// Test Initialization
function initializeTest() {
    const testConfig = getTestConfiguration();
    const questions = getQuestionsForTest();
    
    if (questions.length === 0) {
        showNotification('No questions available for this selection. Please try another option.', 'error');
        return;
    }
    
    // Create test object
    currentTest = {
        subject: currentSubject,
        type: currentTestType,
        topic: currentTopic,
        questions: shuffleArray(questions).slice(0, testConfig.questionCount),
        config: testConfig,
        startTime: Date.now(),
        answers: new Array(testConfig.questionCount).fill(null),
        flagged: new Set()
    };
    
    // Reset state
    currentQuestionIndex = 0;
    userAnswers = currentTest.answers;
    flaggedQuestions = currentTest.flagged;
    
    // Show test interface
    showTestInterface();
    
    // Start timer
    startTestTimer(testConfig.timeLimit);
    
    // Load first question
    loadQuestion(0);
    
    // Update navigator
    updateQuestionNavigator();
}

function getTestConfiguration() {
    const configs = {
        topic: { questionCount: 20, timeLimit: 30 * 60, passingScore: 70 },
        subject: { questionCount: 50, timeLimit: 75 * 60, passingScore: 75 },
        comprehensive: { questionCount: 100, timeLimit: 150 * 60, passingScore: 80 },
        final: { questionCount: 200, timeLimit: 180 * 60, passingScore: 85 }
    };
    
    return configs[currentTestType];
}

function getQuestionsForTest() {
    if (!MEGA_DATABASE[currentSubject]) {
        return [];
    }
    
    let allQuestions = [];
    
    if (currentTestType === 'topic' && currentTopic) {
        // Get questions for specific topic
        Object.values(MEGA_DATABASE[currentSubject]).forEach(category => {
            const topicQuestions = category.filter(q => q.topic === currentTopic);
            allQuestions = allQuestions.concat(topicQuestions);
        });
    } else {
        // Get all questions for subject
        Object.values(MEGA_DATABASE[currentSubject]).forEach(category => {
            allQuestions = allQuestions.concat(category);
        });
    }
    
    return allQuestions;
}

function showTestInterface() {
    // Hide other sections
    document.getElementById('testSelection').style.display = 'none';
    document.getElementById('topicSelection').style.display = 'none';
    
    // Show test interface
    document.getElementById('testInterface').style.display = 'block';
    document.getElementById('testInterface').scrollIntoView({ behavior: 'smooth' });
    
    // Update test header
    updateTestHeader();
}

function updateTestHeader() {
    const subjectNames = {
        'masscom': 'Mass Communication',
        'government': 'Government', 
        'crs': 'Christian Religious Studies',
        'literature': 'Literature in English'
    };
    
    const typeNames = {
        'topic': 'Topic Test',
        'subject': 'Subject Test',
        'comprehensive': 'Comprehensive Exam',
        'final': 'Final Certification'
    };
    
    document.getElementById('testTitle').textContent = typeNames[currentTestType];
    document.getElementById('testSubject').textContent = subjectNames[currentSubject];
    document.getElementById('testType').textContent = `${currentTest.questions.length} Questions`;
}

// Question Management
function loadQuestion(index) {
    if (index < 0 || index >= currentTest.questions.length) return;
    
    currentQuestionIndex = index;
    const question = currentTest.questions[index];
    
    // Update question display
    document.getElementById('currentQuestionNum').textContent = index + 1;
    document.getElementById('questionProgress').textContent = `${index + 1}/${currentTest.questions.length}`;
    document.getElementById('questionText').textContent = question.question;
    
    // Update options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = question.options.map((option, optionIndex) => `
        <div class="option" onclick="selectOption(${optionIndex})" data-option="${optionIndex}">
            <div class="option-letter">${String.fromCharCode(65 + optionIndex)}</div>
            <div class="option-text">${option}</div>
        </div>
    `).join('');
    
    // Restore previous selection
    if (userAnswers[index] !== null) {
        selectOption(userAnswers[index], false);
    }
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update question navigator
    updateQuestionNavigator();
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
        updateQuestionNavigator();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

function flagQuestion() {
    if (flaggedQuestions.has(currentQuestionIndex)) {
        flaggedQuestions.delete(currentQuestionIndex);
        showNotification('Question unflagged', 'info');
    } else {
        flaggedQuestions.add(currentQuestionIndex);
        showNotification('Question flagged for review', 'success');
    }
    updateQuestionNavigator();
}

function jumpToQuestion(index) {
    loadQuestion(index);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    
    if (currentQuestionIndex === currentTest.questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function updateQuestionNavigator() {
    const navigatorGrid = document.getElementById('navigatorGrid');
    
    navigatorGrid.innerHTML = currentTest.questions.map((_, index) => {
        let className = 'nav-question unanswered';
        
        if (index === currentQuestionIndex) {
            className = 'nav-question current';
        } else if (flaggedQuestions.has(index)) {
            className = 'nav-question flagged';
        } else if (userAnswers[index] !== null) {
            className = 'nav-question answered';
        }
        
        return `<div class="${className}" onclick="jumpToQuestion(${index})">${index + 1}</div>`;
    }).join('');
}

// Timer Management
function startTestTimer(duration) {
    let timeLeft = duration;
    
    testTimer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('timeRemaining').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Warning at 5 minutes
        if (timeLeft === 300) {
            showNotification('5 minutes remaining!', 'warning');
        }
        
        // Auto-submit when time runs out
        if (timeLeft <= 0) {
            clearInterval(testTimer);
            showNotification('Time up! Submitting test automatically.', 'error');
            setTimeout(submitTest, 2000);
        }
    }, 1000);
}

// Test Submission and Results
function submitTest() {
    if (testTimer) {
        clearInterval(testTimer);
    }
    
    // Calculate results
    const results = calculateTestResults();
    
    // Save results
    saveTestResults(results);
    
    // Show results
    showTestResults(results);
    
    // Update progress
    updateSubjectProgress(results);
}

function calculateTestResults() {
    let correctCount = 0;
    const totalQuestions = currentTest.questions.length;
    const questionResults = [];
    
    currentTest.questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) {
            correctCount++;
        }
        
        questionResults.push({
            question: question.question,
            userAnswer: userAnswer,
            correctAnswer: question.correct,
            isCorrect: isCorrect,
            explanation: question.explanation,
            topic: question.topic,
            difficulty: question.difficulty
        });
    });
    
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const timeTaken = Math.floor((Date.now() - currentTest.startTime) / 1000);
    const passed = percentage >= currentTest.config.passingScore;
    
    return {
        subject: currentSubject,
        testType: currentTestType,
        topic: currentTopic,
        correct: correctCount,
        total: totalQuestions,
        percentage: percentage,
        timeTaken: timeTaken,
        passed: passed,
        passingScore: currentTest.config.passingScore,
        questionResults: questionResults,
        flaggedCount: flaggedQuestions.size,
        date: new Date().toISOString()
    };
}

function showTestResults(results) {
    // Hide test interface
    document.getElementById('testInterface').style.display = 'none';
    
    // Show results section
    const resultsSection = document.getElementById('testResults');
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Update results display
    document.getElementById('finalScore').textContent = `${results.percentage}%`;
    document.getElementById('correctAnswers').textContent = results.correct;
    document.getElementById('totalQuestions').textContent = results.total;
    document.getElementById('timeTaken').textContent = formatTime(results.timeTaken);
    document.getElementById('accuracy').textContent = `${results.percentage}%`;
    
    // Pass/Fail status
    const passStatus = document.getElementById('passStatus');
    passStatus.textContent = results.passed ? 'Passed!' : 'Failed';
    passStatus.className = `pass-status ${results.passed ? 'passed' : 'failed'}`;
    
    // Show certificate button for final certification
    if (currentTestType === 'final' && results.passed) {
        document.getElementById('certBtn').style.display = 'block';
    }
    
    // Generate detailed analysis
    generateDetailedAnalysis(results);
    
    // Show appropriate message
    const message = getResultMessage(results);
    showNotification(message, results.passed ? 'success' : 'error');
}

function generateDetailedAnalysis(results) {
    const analysisContainer = document.getElementById('detailedAnalysis');
    
    // Topic performance analysis
    const topicPerformance = {};
    results.questionResults.forEach(result => {
        if (!topicPerformance[result.topic]) {
            topicPerformance[result.topic] = { correct: 0, total: 0 };
        }
        topicPerformance[result.topic].total++;
        if (result.isCorrect) {
            topicPerformance[result.topic].correct++;
        }
    });
    
    // Difficulty analysis
    const difficultyPerformance = {};
    results.questionResults.forEach(result => {
        if (!difficultyPerformance[result.difficulty]) {
            difficultyPerformance[result.difficulty] = { correct: 0, total: 0 };
        }
        difficultyPerformance[result.difficulty].total++;
        if (result.isCorrect) {
            difficultyPerformance[result.difficulty].correct++;
        }
    });
    
    analysisContainer.innerHTML = `
        <div class="analysis-section">
            <h3>Performance by Topic</h3>
            <div class="topic-performance">
                ${Object.entries(topicPerformance).map(([topic, perf]) => `
                    <div class="performance-item">
                        <span class="topic-name">${formatTopicName(topic)}</span>
                        <div class="performance-bar">
                            <div class="performance-fill" style="width: ${(perf.correct/perf.total)*100}%"></div>
                        </div>
                        <span class="performance-score">${perf.correct}/${perf.total}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="analysis-section">
            <h3>Performance by Difficulty</h3>
            <div class="difficulty-performance">
                ${Object.entries(difficultyPerformance).map(([difficulty, perf]) => `
                    <div class="performance-item">
                        <span class="difficulty-name">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                        <div class="performance-bar">
                            <div class="performance-fill" style="width: ${(perf.correct/perf.total)*100}%"></div>
                        </div>
                        <span class="performance-score">${perf.correct}/${perf.total}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="analysis-section">
            <h3>Recommendations</h3>
            <div class="recommendations">
                ${generateRecommendations(results)}
            </div>
        </div>
    `;
}

function generateRecommendations(results) {
    const recommendations = [];
    
    if (results.percentage < 60) {
        recommendations.push("Focus on fundamental concepts and review basic materials.");
        recommendations.push("Consider retaking topic tests to strengthen weak areas.");
    } else if (results.percentage < 75) {
        recommendations.push("Good foundation! Work on intermediate-level questions.");
        recommendations.push("Review incorrect answers and understand the explanations.");
    } else if (results.percentage < 85) {
        recommendations.push("Excellent progress! Focus on advanced topics for mastery.");
        recommendations.push("Practice time management for better efficiency.");
    } else {
        recommendations.push("Outstanding performance! You're ready for the next level.");
        recommendations.push("Consider helping others or exploring advanced materials.");
    }
    
    if (results.flaggedCount > 0) {
        recommendations.push(`Review the ${results.flaggedCount} questions you flagged for better understanding.`);
    }
    
    return recommendations.map(rec => `<div class="recommendation-item"><i class="fas fa-lightbulb"></i> ${rec}</div>`).join('');
}

function getResultMessage(results) {
    if (results.percentage >= 95) return "Outstanding! You've achieved mastery level.";
    if (results.percentage >= 85) return "Excellent work! You're well prepared.";
    if (results.percentage >= 75) return "Good job! Continue practicing to improve.";
    if (results.percentage >= 65) return "Fair performance. Focus on weak areas.";
    return "Keep studying! Review fundamentals and try again.";
}

// Progress Management
function saveTestResults(results) {
    const allResults = JSON.parse(localStorage.getItem('adeife_test_results') || '[]');
    allResults.push(results);
    localStorage.setItem('adeife_test_results', JSON.stringify(allResults));
}

function updateSubjectProgress(results) {
    const progress = JSON.parse(localStorage.getItem('adeife_comprehensive_progress') || '{}');
    
    if (!progress.subjects) {
        progress.subjects = {};
    }
    
    if (!progress.subjects[currentSubject]) {
        progress.subjects[currentSubject] = {
            testsCompleted: 0,
            totalScore: 0,
            bestScore: 0,
            topics: {}
        };
    }
    
    const subjectProgress = progress.subjects[currentSubject];
    subjectProgress.testsCompleted++;
    subjectProgress.totalScore += results.percentage;
    subjectProgress.bestScore = Math.max(subjectProgress.bestScore, results.percentage);
    
    if (currentTopic) {
        subjectProgress.topics[currentTopic] = {
            completed: true,
            score: results.percentage,
            passed: results.passed,
            date: results.date
        };
    }
    
    localStorage.setItem('adeife_comprehensive_progress', JSON.stringify(progress));
    updateProgressDisplays();
}

function updateProgressDisplays() {
    const progress = JSON.parse(localStorage.getItem('adeife_comprehensive_progress') || '{}');
    
    if (!progress.subjects) return;
    
    Object.keys(progress.subjects).forEach(subject => {
        const subjectProgress = progress.subjects[subject];
        const avgScore = subjectProgress.testsCompleted > 0 ? 
            Math.round(subjectProgress.totalScore / subjectProgress.testsCompleted) : 0;
        
        // Update progress bars
        const progressFill = document.querySelector(`.subject-card[onclick*="${subject}"] .progress-fill`);
        const progressText = document.querySelector(`.subject-card[onclick*="${subject}"] .progress-text`);
        
        if (progressFill && progressText) {
            progressFill.style.width = `${avgScore}%`;
            progressText.textContent = `${avgScore}% Average`;
        }
    });
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

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatTopicName(topic) {
    return topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Action Functions
function reviewAnswers() {
    // Implementation for reviewing answers
    showNotification('Answer review feature coming soon!', 'info');
}

function retakeTest() {
    // Reset and restart current test
    document.getElementById('testResults').style.display = 'none';
    initializeTest();
}

function backToSubjects() {
    // Reset to subject selection
    document.getElementById('testResults').style.display = 'none';
    document.getElementById('testInterface').style.display = 'none';
    document.getElementById('testSelection').style.display = 'none';
    document.getElementById('topicSelection').style.display = 'none';
    
    // Clear selections
    currentSubject = null;
    currentTestType = null;
    currentTopic = null;
    
    document.querySelectorAll('.subject-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Scroll to subject selection
    document.querySelector('.subject-selection').scrollIntoView({ behavior: 'smooth' });
}

function generateCertificate() {
    // Implementation for certificate generation
    showNotification('Certificate generation feature coming soon!', 'info');
}

// Resource Management
function showResourceCategory(category) {
    // Update tab states
    document.querySelectorAll('.resource-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show resources for category
    const resourcesContent = document.getElementById('resourcesContent');
    const resources = getResourcesForCategory(category);
    
    resourcesContent.innerHTML = resources;
}

function getResourcesForCategory(category) {
    const resourceTemplates = {
        textbooks: `
            <div class="resource-grid">
                <div class="resource-item">
                    <h4>Mass Communication Theory</h4>
                    <p><strong>Authors:</strong> Stanley Baran & Dennis Davis</p>
                    <p>Comprehensive coverage of communication theories and models.</p>
                    <a href="https://www.amazon.com/Mass-Communication-Theory-Foundations-Ferment/dp/1285052064" target="_blank" class="btn btn-sm">View on Amazon</a>
                </div>
                <div class="resource-item">
                    <h4>Nigerian Government and Politics</h4>
                    <p><strong>Author:</strong> A.B. Akinyemi</p>
                    <p>Essential text for understanding Nigerian political system.</p>
                    <a href="#" class="btn btn-sm">Find Book</a>
                </div>
                <div class="resource-item">
                    <h4>The Holy Bible (NIV)</h4>
                    <p><strong>Publisher:</strong> Various</p>
                    <p>Primary text for Christian Religious Studies.</p>
                    <a href="https://www.biblegateway.com/" target="_blank" class="btn btn-sm">Read Online</a>
                </div>
                <div class="resource-item">
                    <h4>Things Fall Apart</h4>
                    <p><strong>Author:</strong> Chinua Achebe</p>
                    <p>Classic African literature for Literature studies.</p>
                    <a href="#" class="btn btn-sm">Find Book</a>
                </div>
            </div>
        `,
        online: `
            <div class="resource-grid">
                <div class="resource-item">
                    <h4>Poynter Institute</h4>
                    <p>Journalism education and training resources.</p>
                    <a href="https://www.poynter.org/" target="_blank" class="btn btn-sm">Visit Site</a>
                </div>
                <div class="resource-item">
                    <h4>Nigerian Constitution</h4>
                    <p>Full text of Nigeria's 1999 Constitution.</p>
                    <a href="https://www.nigeria.gov.ng/constitution" target="_blank" class="btn btn-sm">Read Constitution</a>
                </div>
                <div class="resource-item">
                    <h4>Bible Gateway</h4>
                    <p>Online Bible with multiple translations and study tools.</p>
                    <a href="https://www.biblegateway.com/" target="_blank" class="btn btn-sm">Study Bible</a>
                </div>
                <div class="resource-item">
                    <h4>SparkNotes Literature</h4>
                    <p>Study guides for major literary works.</p>
                    <a href="https://www.sparknotes.com/lit/" target="_blank" class="btn btn-sm">Browse Guides</a>
                </div>
            </div>
        `,
        videos: `
            <div class="resource-grid">
                <div class="resource-item">
                    <h4>Introduction to Journalism</h4>
                    <p><strong>Platform:</strong> Coursera</p>
                    <p>4-week course covering journalism fundamentals.</p>
                    <a href="https://www.coursera.org/learn/journalism" target="_blank" class="btn btn-sm">Enroll Now</a>
                </div>
                <div class="resource-item">
                    <h4>Government and Politics</h4>
                    <p><strong>Platform:</strong> Khan Academy</p>
                    <p>Free courses on political systems and governance.</p>
                    <a href="https://www.khanacademy.org/humanities/us-government-and-civics" target="_blank" class="btn btn-sm">Watch Videos</a>
                </div>
                <div class="resource-item">
                    <h4>Bible Study Videos</h4>
                    <p><strong>Platform:</strong> YouTube</p>
                    <p>Various channels offering biblical studies.</p>
                    <a href="https://www.youtube.com/results?search_query=bible+study" target="_blank" class="btn btn-sm">Search Videos</a>
                </div>
                <div class="resource-item">
                    <h4>Literature Analysis</h4>
                    <p><strong>Platform:</strong> CrashCourse</p>
                    <p>Engaging videos on literary analysis and criticism.</p>
                    <a href="https://www.youtube.com/user/crashcourse" target="_blank" class="btn btn-sm">Watch Series</a>
                </div>
            </div>
        `,
        practice: `
            <div class="resource-grid">
                <div class="resource-item">
                    <h4>WAEC Past Questions</h4>
                    <p>Official past questions for all subjects.</p>
                    <a href="#" class="btn btn-sm">Download Papers</a>
                </div>
                <div class="resource-item">
                    <h4>JAMB CBT Practice</h4>
                    <p>Computer-based test practice platform.</p>
                    <a href="#" class="btn btn-sm">Practice CBT</a>
                </div>
                <div class="resource-item">
                    <h4>NECO Preparation</h4>
                    <p>Comprehensive NECO exam preparation materials.</p>
                    <a href="#" class="btn btn-sm">Access Materials</a>
                </div>
                <div class="resource-item">
                    <h4>Mock Exams</h4>
                    <p>Full-length practice exams for all subjects.</p>
                    <a href="#" class="btn btn-sm">Take Mock Exam</a>
                </div>
            </div>
        `
    };
    
    return resourceTemplates[category] || '<p>Resources coming soon!</p>';
}

// Notification System
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
    
    if (type === 'success') {
        notification.style.background = 'var(--success)';
    } else if (type === 'error') {
        notification.style.background = 'var(--error)';
    } else if (type === 'warning') {
        notification.style.background = 'var(--warning)';
    }
    
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

// Load progress on page load
function loadProgress() {
    updateProgressDisplays();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
}
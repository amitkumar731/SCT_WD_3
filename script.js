 // Quiz questions with different types
        const quizQuestions = [
            {
                type: "multiple",
                question: "What does HTML stand for?",
                options: [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language",
                    "Hyper Transfer Markup Language",
                    "Home Tool Markup Language"
                ],
                correctAnswer: 0
            },
            {
                type: "multiple",
                question: "Which of these are JavaScript frameworks?",
                options: [
                    "React",
                    "Django",
                    "Laravel",
                    "Ruby on Rails"
                ],
                correctAnswer: [0], // Can be array for multi-select in future
                isMulti: false
            },
            {
                type: "fillblank",
                question: "The CSS property for controlling the space between elements is called ______.",
                correctAnswer: "margin"
            },
            {
                type: "multiple",
                question: "Which of these are CSS preprocessors?",
                options: [
                    "Sass",
                    "Less",
                    "Stylus",
                    "PostCSS"
                ],
                correctAnswer: [0, 1, 2], // Multi-select
                isMulti: true
            },
            {
                type: "multiple",
                question: "Which protocol is used for secure communication over a computer network?",
                options: [
                    "HTTP",
                    "HTTPS",
                    "FTP",
                    "SMTP"
                ],
                correctAnswer: 1
            }
        ];

        // Initialize variables
        let currentQuestion = 0;
        let score = 0;
        let userAnswers = Array(quizQuestions.length).fill(null);

        // DOM elements
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const currentQuestionElement = document.getElementById('current-question');
        const totalQuestionsElement = document.getElementById('total-questions');
        const currentScoreElement = document.getElementById('current-score');
        const progressBar = document.getElementById('progress');
        const nextButton = document.getElementById('next-btn');
        const prevButton = document.getElementById('prev-btn');
        const submitButton = document.getElementById('submit-btn');
        const finalScoreElement = document.getElementById('final-score');
        const scoreMessageElement = document.getElementById('score-message');
        const reviewContainer = document.getElementById('review-container');
        const restartButton = document.getElementById('restart-btn');
        const qNumElement = document.getElementById('q-num');

        // Initialize quiz
        function initQuiz() {
            totalQuestionsElement.textContent = quizQuestions.length;
            showQuestion();
            updateProgressBar();
        }

        // Show current question
        function showQuestion() {
            const question = quizQuestions[currentQuestion];
            qNumElement.textContent = currentQuestion + 1;
            currentQuestionElement.textContent = currentQuestion + 1;
            questionText.textContent = question.question;
            optionsContainer.innerHTML = '';
            
            // Render options based on question type
            if (question.type === 'multiple') {
                renderMultipleChoice(question);
            } else if (question.type === 'fillblank') {
                renderFillInTheBlank(question);
            }
            
            // Update navigation buttons
            prevButton.style.display = currentQuestion === 0 ? 'none' : 'block';
            nextButton.style.display = currentQuestion === quizQuestions.length - 1 ? 'none' : 'block';
            submitButton.style.display = currentQuestion === quizQuestions.length - 1 ? 'block' : 'none';
            
            // Show previous answer if exists
            if (userAnswers[currentQuestion] !== null) {
                if (question.type === 'multiple') {
                    const options = optionsContainer.querySelectorAll('.option');
                    if (question.isMulti) {
                        // For multi-select questions
                        userAnswers[currentQuestion].forEach(index => {
                            options[index].classList.add('selected');
                        });
                    } else {
                        // For single-select questions
                        options[userAnswers[currentQuestion]].classList.add('selected');
                    }
                } else if (question.type === 'fillblank') {
                    const input = optionsContainer.querySelector('input');
                    input.value = userAnswers[currentQuestion];
                }
            }
        }

        // Render multiple choice question
        function renderMultipleChoice(question) {
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('option');
                optionElement.textContent = option;
                optionElement.dataset.index = index;
                
                optionElement.addEventListener('click', () => {
                    if (question.isMulti) {
                        // Toggle selection for multi-select
                        optionElement.classList.toggle('selected');
                        const selectedOptions = Array.from(optionsContainer.querySelectorAll('.option.selected'))
                            .map(opt => parseInt(opt.dataset.index));
                        userAnswers[currentQuestion] = selectedOptions;
                    } else {
                        // Single selection
                        optionsContainer.querySelectorAll('.option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        optionElement.classList.add('selected');
                        userAnswers[currentQuestion] = index;
                    }
                });
                
                optionsContainer.appendChild(optionElement);
            });
        }

        // Render fill in the blank question
        function renderFillInTheBlank(question) {
            const fillContainer = document.createElement('div');
            fillContainer.classList.add('fill-blank');
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Type your answer here';
            
            if (userAnswers[currentQuestion] !== null) {
                input.value = userAnswers[currentQuestion];
            }
            
            input.addEventListener('input', (e) => {
                userAnswers[currentQuestion] = e.target.value;
            });
            
            fillContainer.appendChild(input);
            optionsContainer.appendChild(fillContainer);
        }

        // Update progress bar
        function updateProgressBar() {
            const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
            progressBar.style.width = `${progress}%`;
            currentScoreElement.textContent = score;
        }

        // Navigate to next question
        nextButton.addEventListener('click', () => {
            if (currentQuestion < quizQuestions.length - 1) {
                currentQuestion++;
                showQuestion();
                updateProgressBar();
            }
        });

        // Navigate to previous question
        prevButton.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion();
                updateProgressBar();
            }
        });

        // Submit quiz
        submitButton.addEventListener('click', () => {
            calculateScore();
            showResults();
        });

        // Calculate final score
        function calculateScore() {
            score = 0;
            quizQuestions.forEach((question, index) => {
                if (userAnswers[index] === null) return;
                
                if (question.type === 'multiple') {
                    if (question.isMulti) {
                        // For multi-select questions, check if all correct answers are selected
                        const correctCount = question.correctAnswer.length;
                        const userSelected = userAnswers[index] || [];
                        
                        // Count how many correct answers the user selected
                        let correctSelected = 0;
                        userSelected.forEach(selectedIndex => {
                            if (question.correctAnswer.includes(selectedIndex)) {
                                correctSelected++;
                            }
                        });
                        
                        // Give partial credit for partially correct answers
                        if (correctSelected > 0) {
                            score += correctSelected / correctCount;
                        }
                    } else {
                        // For single-select questions
                        if (userAnswers[index] === question.correctAnswer) {
                            score++;
                        }
                    }
                } else if (question.type === 'fillblank') {
                    // Case-insensitive comparison for fill in the blank
                    if (userAnswers[index].toLowerCase().trim() === question.correctAnswer.toLowerCase()) {
                        score++;
                    }
                }
            });
            
            // Round to 2 decimal places for partial credit cases
            score = Math.round(score * 100) / 100;
        }

        // Show results
        function showResults() {
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            
            finalScoreElement.textContent = `${score}/${quizQuestions.length}`;
            
            // Set score message based on performance
            const percentage = (score / quizQuestions.length) * 100;
            if (percentage >= 80) {
                scoreMessageElement.textContent = "Excellent job! You're a quiz master!";
            } else if (percentage >= 60) {
                scoreMessageElement.textContent = "Good effort! Keep learning!";
            } else if (percentage >= 40) {
                scoreMessageElement.textContent = "Not bad, but there's room for improvement!";
            } else {
                scoreMessageElement.textContent = "Keep studying and try again!";
            }
            
            // Generate review content
            reviewContainer.innerHTML = '';
            quizQuestions.forEach((question, index) => {
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review-item');
                
                const reviewQuestion = document.createElement('div');
                reviewQuestion.classList.add('review-question');
                reviewQuestion.textContent = `Q${index + 1}: ${question.question}`;
                
                const reviewAnswer = document.createElement('div');
                reviewAnswer.classList.add('review-answer');
                
                if (userAnswers[index] === null) {
                    reviewAnswer.textContent = "You didn't answer this question.";
                    reviewAnswer.classList.add('incorrect');
                } else {
                    if (question.type === 'multiple') {
                        let userAnswerText;
                        if (question.isMulti) {
                            userAnswerText = userAnswers[index].map(i => question.options[i]).join(', ');
                        } else {
                            userAnswerText = question.options[userAnswers[index]];
                        }
                        
                        let correctAnswerText;
                        if (Array.isArray(question.correctAnswer)) {
                            correctAnswerText = question.correctAnswer.map(i => question.options[i]).join(', ');
                        } else {
                            correctAnswerText = question.options[question.correctAnswer];
                        }
                        
                        reviewAnswer.innerHTML = `
                            <div>Your answer: ${userAnswerText}</div>
                            <div>Correct answer: ${correctAnswerText}</div>
                        `;
                        
                        // Check if answer is correct
                        let isCorrect;
                        if (question.isMulti) {
                            // For multi-select, check if arrays are equal
                            const userSorted = [...userAnswers[index]].sort().join(',');
                            const correctSorted = [...question.correctAnswer].sort().join(',');
                            isCorrect = userSorted === correctSorted;
                        } else {
                            isCorrect = userAnswers[index] === question.correctAnswer;
                        }
                        
                        if (isCorrect) {
                            reviewAnswer.classList.add('correct');
                        } else {
                            reviewAnswer.classList.add('incorrect');
                        }
                    } else if (question.type === 'fillblank') {
                        const isCorrect = userAnswers[index].toLowerCase().trim() === question.correctAnswer.toLowerCase();
                        reviewAnswer.innerHTML = `
                            <div>Your answer: ${userAnswers[index]}</div>
                            <div>Correct answer: ${question.correctAnswer}</div>
                        `;
                        
                        if (isCorrect) {
                            reviewAnswer.classList.add('correct');
                        } else {
                            reviewAnswer.classList.add('incorrect');
                        }
                    }
                }
                
                reviewItem.appendChild(reviewQuestion);
                reviewItem.appendChild(reviewAnswer);
                reviewContainer.appendChild(reviewItem);
            });
        }

        // Restart quiz
        restartButton.addEventListener('click', () => {
            currentQuestion = 0;
            score = 0;
            userAnswers = Array(quizQuestions.length).fill(null);
            
            resultsContainer.style.display = 'none';
            quizContainer.style.display = 'block';
            
            showQuestion();
            updateProgressBar();
        });

        // Initialize the quiz when page loads
        initQuiz();
const questionText = document.getElementById('question');
const choices = document.querySelectorAll('.answer');
const questionsContainer = document.getElementById('questions-container');
const answerContainer = document.getElementById('answers-container');
const questionLinks = document.querySelectorAll('.question-bubble');

const quizScore = document.getElementById('quiz-score');
const playAgain = document.getElementById('play-again');

const quizResult = document.getElementById('quiz-result');
const mainQuiz = document.getElementById('quiz');

let score = 0;
let question_length = 10;
let answered_questions = 0;

const questions = [];

const fetchQuestions = async () => {
    try {
        const res = await fetch("https://opentdb.com/api.php?amount=10&category=22&difficulty=easy&type=multiple");
        let data = await res.json();
        data = data.results;
        setup(data);

        playAgain.addEventListener('click', async () => {
            const res = await fetch("https://opentdb.com/api.php?amount=10&category=22&difficulty=easy&type=multiple");
            let data = await res.json();
            data = data.results;
            setup(data);
        })
    } catch (err) {
        console.log(err);
    }
}

const setup = (data) => {
    mainQuiz.style.display = 'block';
    quizResult.style.display = 'none';
    questionLinks.forEach((link) => {
        link.classList.remove('answered');
    })
    initQuestions(data);
    let currentQuestion = 0;
    displayQuestion(currentQuestion); 
    questionsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if(target.classList.contains('question-bubble')) {
            currentQuestion = Number(target.id.replace('question-', '')) - 1;
            displayQuestion(currentQuestion);
        }
    })
    answerContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (!(questions[currentQuestion].isAnswered) && target.classList.contains('answer')) {
            answered_questions++;
            questionLinks.item(currentQuestion).classList.add('answered');
            target.classList.add('answered');
            if(target.innerText === questions[currentQuestion].correct_answer) {
                questions[currentQuestion].isAnswered = true;
                questions[currentQuestion]['user_isCorrect'] = true;
                displayIcon(target, true);
                score += 1;
            } else {
                questions[currentQuestion].isAnswered = true;
                questions[currentQuestion]['user_isCorrect'] = false;
                displayIcon(target, false);
                displayIcon(choices[(questions[currentQuestion].answerIndex)], true);
            }
            questions[currentQuestion]['user_answer'] = Number(target.id.replace('answer-', '')) - 1;
            if(answered_questions === 10) {
                mainQuiz.style.display = 'none';
                quizResult.style.display = 'flex';
                quizScore.innerText = score;
            }
        }
    })
}

const initQuestions = (data) => {
    for(let i = 0; i < question_length;i++) {
        let { correct_answer, incorrect_answers, question } = data[i];
        let answers = shuffle([correct_answer, incorrect_answers[0], incorrect_answers[1], incorrect_answers[2]]);
        let isAnswered = false;
        let answerIndex = answers.indexOf(correct_answer);
        // let answerIndex = answers.findIndex(correct_answer);
        let tempQuestion = {question, correct_answer, answers, isAnswered, answerIndex};
        questions[i] = tempQuestion;
    }
    // localStorage.setItem('question_data', JSON.stringify(questions));
}

const displayQuestion = (id) => {  
    questionText.innerText = questions[id]['question'].replaceAll('&quot;', '"');
    choices.forEach((element, index) => {
        element.classList.remove('answered');
        element.innerText = questions[id].answers[index];
    });
    if(questions[id].isAnswered) {
        choices[questions[id].user_answer].classList.add('answered');
        if(questions[id].user_isCorrect) {
            displayIcon(choices[questions[id].user_answer], true);
        } else {
            displayIcon(choices[questions[id].answerIndex], true);
            displayIcon(choices[questions[id].user_answer], false);
        }
    }
}

const displayIcon = (element, isCorrect) => {
    element.innerHTML += `<img src=${isCorrect ? 'Check_round_fill.svg' : 'Close_round_fill.svg'} class="answered-logo">`;
}

const shuffle = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
}

fetchQuestions();
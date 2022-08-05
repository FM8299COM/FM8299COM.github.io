const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _score = document.querySelector('.quiz-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');

let correctAnswer = "",
correctScore = askedCount = 0,
totalQuestion = 10;

 function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer)
    _playAgainBtn.addEventListener('click', restartQuiz)
 }

document.addEventListener('DOMContentLoaded', ()=>{
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
})

async function loadQuestion() {
    _checkBtn.disabled = false;
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=15&type=multiple';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0])
}

function showQuestion(data) {
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.lenght + 1)),
    0, correctAnswer);
    
    _question.innerHTML = `${data.question}`;

    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span> ${option} </span></li>
        `).join('')}`;
    
    selectOptions();
}

function selectOptions() {
    _options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

function checkAnswer() {
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')) {
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
            correctScore++;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class="fas fa-question"></i>Please select an option! </p>`;
        _checkBtn.disabled = false;
    }
}

function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount() {
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        _result.innerHTML = `<p> Congratulations, you answered ${correctScore}/${totalQuestion}<br />
        questions correctly.<br /><br />
        </p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
        _options.style.display = "none";
        _question.style.display = "none";
        _score.style.display = "none";

    } else {
        setTimeout(() => {loadQuestion();}, 100);
    }
}

function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartQuiz() {
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    _options.style.display = "flex";
    _question.style.display = "block";
    _score.style.display = "block";
    setCount();
    loadQuestion();
}
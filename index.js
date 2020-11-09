import { formFields } from './formFields.js'

const questionCount = Object.keys(formFields).length;
let currentQuestion;
let currentQuestionIndex = 0;
let answers = [];

display();
nextBtn.onclick = function() { next() };
backBtn.onclick = function() { back() };

function display() {
    displayNextBack();
    showProgress();
    displayText();
    styleOptions();
    displayField();
}

function getCurrentQuestion() {
    return formFields[currentQuestionIndex];
}

function displayText() {
    currentQuestion = getCurrentQuestion();
    if (currentQuestionIndex < questionCount) {
        formQuestion.innerHTML = currentQuestion['text'];
    }
}

function styleOptions() {
    currentQuestion = getCurrentQuestion();
    formOptions.classList.remove('form-options-long')
    formOptions.classList.remove('form-options')
    if ('options-long' in currentQuestion) {
        formOptions.classList.add('form-options-long');
    } else {
        formOptions.classList.add('form-options');
    }
}

function displayField() {
    currentQuestion = getCurrentQuestion();
    formOptions.innerHTML = '';

    if ('options' in currentQuestion) {
        let options = currentQuestion['options'];
        for (let i = 0; i < options.length; i++) {
            let text = options[i]['text'];
            let btn = document.createElement('button');
            btn.innerHTML = text;
            btn.type = 'button';
            btn.onclick = function() {
                next();
                answers.push(btn.innerHTML);
            };
            btn.classList.add('option')
            formOptions.appendChild(btn);
        }
    }
    if ('options-long' in currentQuestion) {
        let options = currentQuestion['options-long'];
        for (let i = 0; i < options.length; i++) {
            let text = options[i]['text'];
            let subtext = options[i]['subtext'];
            let btn = document.createElement('button');
            let btnText = document.createElement('div');
            let btnSubtext = document.createElement('div');
            btnText.innerHTML = text;
            btnSubtext.innerHTML = subtext;
            btn.type = 'button';
            btn.onclick = function() {
                next();

                // This doesn't work if you hit "Enter" or just click the next button
                answers.push(btn.innerHTML);
            };
            btn.classList.add('option-long');
            btn.appendChild(btnText);
            btn.appendChild(btnSubtext);
            formOptions.appendChild(btn);
        }
    }
    if ('textfield' in currentQuestion) {
        let label = document.createElement('label');
        let input = document.createElement('input');
        label.classList.add('input--wrapper');
        input.classList.add('input');
        input.type = 'text';
        label.appendChild(input);
        formOptions.appendChild(label);
    }
    if ('checkboxes' in currentQuestion) {
        let checkboxes = currentQuestion['checkboxes'];
        let checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('checkbox--wrapper');
        for (let i = 0; i < checkboxes.length; i++) {
            let text = checkboxes[i]['text'];
            let name = checkboxes[i]['name'];
            let box = document.createElement('input');
            let label = document.createElement('label');
            label.innerHTML = text;
            label.htmlFor = name;
            box.type = 'checkbox';
            box.id = name;
            label.appendChild(box);
            checkboxWrapper.appendChild(label);
        }
        formOptions.appendChild(checkboxWrapper);
    }
}

function handleMilitaryCase() {
    
}

function validate() {
    
}

function next() {
    if (currentQuestionIndex <= questionCount) {
        currentQuestionIndex++;
        display()
    }
}

function back() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        display()
    }
}

function present() {
    presentationPage.style.display = 'flex';
    formPage.style.display = 'none';
    nextBtn.style.display = 'none';
    backBtn.style.display = 'none';
}

function displayNextBack() {
    backBtn.style.display = 'block';
    nextBtn.style.display = 'block';
    nextBtn.innerHTML = 'Next';
    nextBtn.onclick = function() { next() };

    if (currentQuestionIndex <= 0) {
        backBtn.style.display = 'none';
    }
    if (currentQuestionIndex+1 >= questionCount) {
        nextBtn.innerHTML = 'Submit';
        nextBtn.onclick = function() { present() };

        // Add code that makes button trigger api req too
    }
}

function showProgress() {
    let x = questionCount;
    let n = currentQuestionIndex;
    let width = String((n / x) * 100) + "%";
    document.getElementById("progressBar").style.width = width;
}

function incrementOnKeypress(event) {
    if (event.which === 13) { //this now looks to see if you hit "enter"/"return"
        next();
    }
}

document.addEventListener("keypress", incrementOnKeypress);
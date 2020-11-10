import { formFields, militaryFields } from './formFields.js'

let questionCount = Object.keys(formFields).length;
let currentQuestion;
let currentQuestionIndex = 0;
let answers = {};
let militaryAdded = false;
let VAAdded = false;

display();
nextBtn.onclick = function() { next() };
backBtn.onclick = function() { back() };

function display() {
    displayNextBack();
    showProgress();
    displayText();
    styleOptions();
    displayFields();
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
    formOptions.classList.remove('form-options-long');
    formOptions.classList.remove('form-options');
    if ('options-long' in currentQuestion) {
        formOptions.classList.add('form-options-long');
    } else {
        formOptions.classList.add('form-options');
    }
}

function collectInput(question) {
    currentQuestion = getCurrentQuestion();
    getTextfieldInput(question);
    getCheckboxesInput(question);
}

function getTextfieldInput(question) {
    if (document.getElementById('currentInputField')) {
        let currentInputField = document.getElementById('currentInputField');
        let currentValue = currentInputField.value;
        let currentName = currentInputField.name;
        updateAnswers(currentName, currentValue);
    }
}

function getCheckboxesInput(question) {

}

function displayFields() {
    currentQuestion = getCurrentQuestion();
    formOptions.innerHTML = ''; // Clears previous question
    handleFields(currentQuestion);
}

function handleFields(question) {
    handleTypeOptions(question);
    handleTypeOptionsLong(question);
    handleTypeTextfield(question);
    handleTypeCheckboxes(question);
}

function updateAnswers(label, value) {
    answers[label] = value;
}

function handleTypeOptions(question) {
    let fields = question['fields'];
    if (question['type'] === 'options') {
        for (let i = 0; i < fields.length; i++) {
            let text = fields[i]['text'];
            let value = fields[i]['value'];
            let btn = document.createElement('button');
            let name = question['name'];
            btn.innerHTML = text;
            btn.value = value;
            btn.type = 'button';
            btn.onclick = function() {
                updateAnswers(name, value);
                next();
            };
            btn.classList.add('option');
            formOptions.appendChild(btn);
        }
    }
}

function handleTypeOptionsLong(question) {
    let fields = question['fields'];
    if (question['type'] === 'options-long') {
        for (let i = 0; i < fields.length; i++) {
            let text = fields[i]['text'];
            let subtext = fields[i]['subtext'];
            let value = fields[i]['value'];
            let name = question['name'];
            let btn = document.createElement('button');
            let btnText = document.createElement('div');
            let btnSubtext = document.createElement('div');
            btnText.innerHTML = text;
            btnSubtext.innerHTML = subtext;
            btn.type = 'button';
            btn.onclick = function () {
                updateAnswers(name, value);
                next();
            };
            btn.classList.add('option-long');
            btn.appendChild(btnText);
            btn.appendChild(btnSubtext);
            formOptions.appendChild(btn);
        }
    }
}

function handleTypeTextfield(question) {
    let fields = question['fields'];
    if (question['type'] === 'textfield') {
        let label = document.createElement('label');
        let input = document.createElement('input');
        let name = question['name'];
        label.classList.add('input--wrapper');
        input.classList.add('input');
        input.id = 'currentInputField';
        input.name = name;
        label.appendChild(input);
        formOptions.appendChild(label);
    }
}

function handleTypeCheckboxes(question) {
    let fields = question['fields'];
    if (question['type'] === 'checkboxes') {
        let checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('checkbox--wrapper');
        for (let i = 0; i < fields.length; i++) {
            let text = fields[i]['text'];
            let name = question['name'];
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

function handleInitialMilitaryCase() {
    if (answers['isMilitary'] && !(militaryAdded)) {
        console.log('testing');
        formFields.splice(4, 0, militaryFields[0]);
        formFields.splice(5, 0, militaryFields[2]);
        militaryAdded = true;
        questionCount = Object.keys(formFields).length;
    }
}

function handleVALoanCase() {
    if (answers['isVALoan'] !== undefined && !(answers['isVALoan']) && !(VAAdded)) {
        formFields.splice(5, 0, militaryFields[1]);
        VAAdded = true;
        questionCount = Object.keys(formFields).length;
    }
}

function validate(question) {
    
}

function next() {
    getTextfieldInput();
    handleInitialMilitaryCase(); // This only needs to run once
    handleVALoanCase();
    // Need to recalculate maxquestions

    // Insert something here to validate input

    if (currentQuestionIndex <= questionCount) {
        currentQuestionIndex++;
        display()
    }
}

function back() {
    getTextfieldInput();
    // Insert something here to validate input

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

        // Add code that makes button trigger api request
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

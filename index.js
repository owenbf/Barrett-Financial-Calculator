import { formFields, purchasePaymentField, refinancePaymentField, refinanceQuestions, militaryFields } from './formFields.js'

let questionCount = Object.keys(formFields).length;
let currentQuestion;
let currentQuestionIndex = 0;
let answers = {};
let militaryAdded = false;
let VAAdded = false;
let isPurchaseUpdated = false;

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
    if (currentQuestion['type'] === 'options-long') {
        formOptions.classList.add('form-options-long');
    } else {
        formOptions.classList.add('form-options');
    }
}

function getTextfieldInput() {
    if (document.getElementById('currentInputField')) {
        let currentInputField = document.getElementById('currentInputField');
        let currentValue = currentInputField.value;
        let currentName = currentInputField.name;
        updateAnswers(currentName, currentValue);
    }
}

function getCheckboxInput() {
    if (document.querySelector('.checkboxField:checked')) {
        let checkedValues = document.querySelectorAll('.checkboxField:checked');
        let name = 'loanTerms';
        let loanTerms = [];
        for (let item of checkedValues) {
            loanTerms.push(item.id);
        }
        updateAnswers(name, loanTerms);
    }
}

function displayFields() {
    currentQuestion = getCurrentQuestion();
    formOptions.innerHTML = ''; // Clears previous question
    handleFields(currentQuestion);
}

function handleFields(question) {
    handleTypeOptions(question);
    handleTypeOptionsLong(question);
    handleTypeNewPurchase(question);
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

// THIS IS A WIP
function handleTypeNewPurchase(question) {
    if (question['type'] === 'newPurchase') {
        let paymentWrapper = document.createElement('div');
        paymentWrapper.classList.add('payment--wrapper');

        let text1 = question['text1'];
        let text2 = question['text2'];

        let label1 = document.createElement('h3');
        let label2 = document.createElement('h3');
        label1.innerHTML = text1;
        label2.innerHTML = text2;

        let input1 = document.createElement('input');
        let input2 = document.createElement('input');
        let input3 = document.createElement('input');

        input1.classList.add('purchase-input');
        input2.classList.add('purchase-input');
        input3.classList.add('purchase-input');

        paymentWrapper.appendChild(label1);
        paymentWrapper.appendChild(input1);
        paymentWrapper.appendChild(label2);
        paymentWrapper.appendChild(input2);
        paymentWrapper.appendChild(input3);
        formOptions.appendChild(paymentWrapper);
    }
}

function handleTypeTextfield(question) {
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
            let name = fields[i]['name'];
            let box = document.createElement('input');
            let label = document.createElement('label');
            label.innerHTML = text;
            label.htmlFor = name;
            box.type = 'checkbox';
            box.id = name;
            box.classList.add('checkboxField');
            label.appendChild(box);
            checkboxWrapper.appendChild(label);
        }
        formOptions.appendChild(checkboxWrapper);
    }
}

function handlePurchaseCase() {
    if (answers['refinanceOrPurchase'] === 'purchase' && !(isPurchaseUpdated)) {
        formFields.splice(6, 0, purchasePaymentField);
        isPurchaseUpdated = true;
    }
    if (answers['refinanceOrPurchase'] === 'refinance' && !(isPurchaseUpdated)) {
        formFields.splice(6, 0, refinancePaymentField);
        for (let i = 0; i < refinanceQuestions.length; i++) {
            formFields.splice(7+i, 0, refinanceQuestions[i]);
        }
        isPurchaseUpdated = true;
    }
}

function handleMilitaryCase() {
    if (answers['isMilitary'] && !(militaryAdded)) {
        formFields.splice(4, 0, militaryFields[0]);
        formFields.splice(5, 0, militaryFields[2]);
        militaryAdded = true;
    }
}

function handleVALoanCase() {
    if (answers['isVALoan'] !== undefined && !(answers['isVALoan']) && !(VAAdded)) {
        formFields.splice(5, 0, militaryFields[1]);
        VAAdded = true;
    }
}

function validate(question) {
    
}

function next() {
    handlePurchaseCase();
    getTextfieldInput();
    handleMilitaryCase();
    handleVALoanCase();
    // Insert something here to validate input

    if (currentQuestionIndex <= questionCount) {
        currentQuestionIndex++;
        display()
    }
    questionCount = Object.keys(formFields).length;
}

function back() {
    getTextfieldInput();
    getCheckboxInput();
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
        nextBtn.onclick = function() {
            getCheckboxInput();
            present();
        };

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
    if (event.which === 13) { // checks for enter/return keypress
        next();
    }
}

document.addEventListener("keypress", incrementOnKeypress);

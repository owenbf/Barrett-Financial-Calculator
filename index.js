import { formFields, purchasePaymentField, refinancePaymentField, refinanceQuestions, militaryFields } from './formFields.js'

let questionCount = Object.keys(formFields).length;
let currentQuestion;
let currentQuestionIndex = 0;
let answers = {};
// Need to find a better solution for these boolean things

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

// For handling various question types
// and updating answers dictionary

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
            btn.classList.add('option');
            btn.onclick = function() {
                let buttons = document.getElementsByClassName('option');
                for (let button of buttons) {
                    button.classList.remove('selected');
                }
                updateAnswers(name, value);
                btn.classList.add('selected');
                //next();  THIS LINE MAY CHANGE
            };
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
                let buttons = document.getElementsByClassName('option-long');
                for (let button of buttons) {
                    button.classList.remove('selected');
                }
                updateAnswers(name, value);
                btn.classList.add('selected');
                //next();  THIS LINE MAY CHANGE
            };
            btn.classList.add('option-long');
            btn.appendChild(btnText);
            btn.appendChild(btnSubtext);
            formOptions.appendChild(btn);
        }
    }
}

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

        let span1 = document.createElement('span');
        let span2 = document.createElement('span');
        let span3 = document.createElement('span');

        span1.innerHTML = '$';
        span2.innerHTML = '$';
        span3.innerHTML = '%';

        addNumberFilterEventListener(input1);
        addNumberFilterEventListener(input2);
        addNumberFilterEventListener(input3);

        input1.id = 'purchasePrice';
        input2.id = 'downpaymentAbsolute';
        input3.id = 'downpaymentPercentage';

        input1.classList.add('purchase-input');
        input2.classList.add('purchase-input');
        input3.classList.add('purchase-input');

        input1.maxLength = 15;
        input2.maxLength = 15;
        input3.maxLength = 2;

        let spacer = document.createElement('div');

        paymentWrapper.appendChild(label1);
        paymentWrapper.appendChild(span1);
        paymentWrapper.appendChild(input1);
        paymentWrapper.appendChild(label2);
        paymentWrapper.appendChild(span2);
        paymentWrapper.appendChild(input2);
        paymentWrapper.appendChild(spacer);
        paymentWrapper.appendChild(span3);
        paymentWrapper.appendChild(input3);
        formOptions.appendChild(paymentWrapper);
    }
}

function addNumberFilterEventListener(input) {
    const ZIP_ALLOWED_CHARS_REGEXP = new RegExp('^[0-9]*$');
    input.addEventListener('keypress', event => {
        if (!ZIP_ALLOWED_CHARS_REGEXP.test(event.key)) {
            event.preventDefault();
        }
    });
}

function addCommaGenEventListener(input) {
    input.addEventListener('keyup', event => {
        //console.log('commad:', formatInteger(input.value));
        //console.log('comma free:', formatInteger(input.value).replace(/,/g, ''));
        let n = input.value.replace(/,/g, '');
        input.value = formatInteger(n);
    });
}

function formatInteger(n) {
    let comma = ',';
    n.replace(/,/g, '')
    let a = n.split('');
    a.reverse();
    for (let i = 3; i < a.length; i+=4) {
        if (a[i] !== comma) {
            a.splice(i, 0, comma);
        }
    }
    a.reverse();
    let t = a.join('');
    return t
}

function handleTypeTextfield(question) {
    if (question['type'] === 'textfield') {
        let label = document.createElement('label');
        let input = document.createElement('input');
        let name = question['name'];

        addNumberFilterEventListener(input);
        if (name === 'zip') {
            input.placeholder = '90210';
            input.maxLength = 5;
        } else {
            input.maxLength = 15;
            let span = document.createElement('span');
            span.innerHTML = '$';
            label.appendChild(span);
            addCommaGenEventListener(input);
        }

        label.classList.add('input--wrapper');
        input.classList.add('input');
        input.id = 'currentInputField';
        input.name = name;
        input.pattern = '[a-z]{1,15}';
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
            box.classList.add('checkbox-field');
            label.appendChild(box);
            checkboxWrapper.appendChild(label);
        }
        formOptions.appendChild(checkboxWrapper);
        limitCheckboxCount(3);
    }
}

function limitCheckboxCount(limit) {
    let checkboxes = document.getElementsByClassName('checkbox-field');         
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].onclick = function() {
            let checkedcount = 0;
            for (let i = 0; i < checkboxes.length; i++) {
                checkedcount += (checkboxes[i].checked) ? 1 : 0;
            }
            if (checkedcount >= limit) {
                for (let checkbox of checkboxes) {
                    if (!(checkbox.checked)) {
                        checkbox.disabled = true;
                    }
                }
            } else {
                for (let checkbox of checkboxes) {
                    checkbox.disabled = false;
                }
            }
        }
    }
}

// For the mortgage/downpayment auto-update field feature
// WHERE I AM CURRENTLY WORKING
// WILL NEED TO ATTACH THIS TO BUTTON CLICK EVENT LISTENER

// I can add a keypress event listener to all inputs for this slide. All this function needs to do
// is update every field based on info. Maybe tho i need a different listener for each button?
function downpaymentAutogenFeature() {
    let purchasePrice = getPurchasePrice();
    let downpaymentAbsolute = getDownpaymentAbsolute();
    let downpaymentPercentage = getDownpaymentPercentage();


}

function updateDownpaymentAbsoluteField() {

}

function updateDownpaymentPercentageField() {

}

function getPurchasePrice() {
    return document.getElementById('purchasePrice').value;
}

function getDownpaymentAbsolute() {
    return document.getElementById('downpaymentAbsolute').value;
}

function getDownpaymentPercentage() {
    return document.getElementById('downpaymentPercentage').value;
}


// For handling conditionals

function handleConditionals() {
    handlePurchaseCase();
    handleMilitaryCase();
    handleVALoanCase();
}

function getKeyArray() {
    let array = [];
    for (let item of formFields) {
        array.push(item['name']);
    }
    return array
}

function handlePurchaseCase() {
    let keys = getKeyArray();
    let indexOfCreditScore = keys.indexOf('creditScore');
    let mortgageQuestionExists = keys.includes('remainingMortgageBalance');

    if (answers['refinanceOrPurchase'] === 'purchase' && !(mortgageQuestionExists)) {
        formFields.splice(indexOfCreditScore, 0, purchasePaymentField);
    }
    if (answers['refinanceOrPurchase'] === 'refinance' && !(mortgageQuestionExists) && !(formFields.includes(refinancePaymentField))) {
        formFields.splice(indexOfCreditScore, 0, refinancePaymentField);
        for (let i = 0; i < refinanceQuestions.length; i++) {
            formFields.splice(indexOfCreditScore+1+i, 0, refinanceQuestions[i]);
        }
    }
}

function handleMilitaryCase() {
    let keys = getKeyArray();
    let indexOfMilitary = keys.indexOf('isMilitary');
    let militaryQuestionsExist = keys.includes('isVALoan') || keys.includes('isVAFirstTime') || keys.includes('isVAFundingFeeExempt');
    if (answers['isMilitary'] && !(militaryQuestionsExist)) {
        formFields.splice(indexOfMilitary+1, 0, militaryFields[0]);
        formFields.splice(indexOfMilitary+2, 0, militaryFields[2]);
    }
}

function reverseMilitaryCase() {
    let keys = getKeyArray();
    let indexOfMilitary = keys.indexOf('isMilitary');
    let militaryQuestionsExist = keys.includes('isVALoan') || keys.includes('isVAFirstTime') || keys.includes('isVAFundingFeeExempt');
    if (!(answers['isMilitary']) && militaryQuestionsExist) {
        let newMilitaryFields = formFields.filter(field => field['from'] === 'militaryFields');
        let l = newMilitaryFields.length;
        formFields.splice(indexOfMilitary+1, l);
    }
}

function handleVALoanCase() {
    let keys = getKeyArray();
    let indexOfisVALoan = keys.indexOf('isVALoan');
    let firstTimeExists = keys.includes('isVAFirstTime');
    let isVALoanInAnswers = 'isVALoan' in answers;

    if (isVALoanInAnswers && !(answers['isVALoan']) && !(firstTimeExists) && indexOfisVALoan > 0) {
        formFields.splice(indexOfisVALoan+1, 0, militaryFields[1]);
    }

    if (isVALoanInAnswers && answers['isVALoan'] && firstTimeExists) {
        let firstTimeIndex = keys.indexOf('isVAFirstTime');
        formFields.splice(firstTimeIndex, 1);
    }
}

// For removing things when they get changed

function updateFields() {
    replaceRefinanceFields();
    replacePurchaseField();
    reverseMilitaryCase();
}

function replaceRefinanceFields() {
    let keys = getKeyArray();
    let values = Object.values(answers);
    if (keys.includes('propertyValue') && values.includes('purchase')) {
        let indexOfPropertyValueField = keys.indexOf('propertyValue');
        formFields.splice(indexOfPropertyValueField, 3, purchasePaymentField);
    }
}

function replacePurchaseField() {
    let keys = getKeyArray();
    let values = Object.values(answers);

    if (keys.includes('remainingMortgageBalance') && values.includes('refinance')) {
        let indexOfMortgageBalanceField = keys.indexOf('remainingMortgageBalance');

        if (!(refinanceQuestions.includes(refinancePaymentField)) && !(formFields.includes(refinancePaymentField))) {
            refinanceQuestions.unshift(refinancePaymentField);
        }

        if (!(keys.includes('propertyValue'))) {
            formFields.splice(indexOfMortgageBalanceField, 1);
            for (let i = 0; i < refinanceQuestions.length; i++) {
                formFields.splice(indexOfMortgageBalanceField+i, 0, refinanceQuestions[i]);
            }    
        }
        
        if (refinanceQuestions.includes(refinancePaymentField)) {
            refinanceQuestions.splice(0, 1);
        }
    }
}

// For validating input

function validate(question) {
    isValidated = false;

    // add something here sometime

    return isValidated
}

function validatePropertyValue() {
    if ('propertyValue' in answers) {
        propertyValue = answers['propertyValue'];
        if (propertyValue) {

        }
    }
}

// For handling next/back functionality

function next() {
    handleConditionals();
    updateFields();
    getTextfieldInput();
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

function present() {
    presentationPage.style.display = 'flex';
    formPage.style.display = 'none';
    nextBtn.style.display = 'none';
    backBtn.style.display = 'none';
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

'use strict';
import { formFields, purchasePaymentField, refinancePaymentField, refinanceQuestions, militaryFields } from './formFields.js';
import { counties } from './counties.js';

let questionCount = Object.keys(formFields).length;
let currentQuestion;
let currentQuestionIndex = 0;
let answers = {};
let inputGiven = false;
let warningPresent = false;

display();
nextBtn.onclick = function() { next() };
backBtn.onclick = function() { back() };

function display() {
    displayNextBack();
    updateNextBack();
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

function getInput() {
    getTextfieldInput();
    getNewPurchaseInput();
    getCheckboxInput();
}

function filterCommaNumber(n) {
    let p = parseInt(n.replace(/,/g, ''))
    return (p === NaN ? 0 : p);
}

function getTextfieldInput() {
    if (document.getElementById('currentInputField')) {
        let currentInputField = document.getElementById('currentInputField');
        let currentName = currentInputField.name;
        if (currentName !== 'county') {
            let currentValue = filterCommaNumber(currentInputField.value);
            updateAnswers(currentName, currentValue);    
        } else {
            let currentValue = currentInputField.value;
            updateAnswers(currentName, currentValue);    
        }
    }
}

function getNewPurchaseInput() {
    if (document.getElementById('purchasePrice')) {
        let purchasePriceInput = document.getElementById('purchasePrice');
        let downpaymentAbsoluteInput = document.getElementById('downpaymentAbsolute');
        let downpaymentPercentageInput = document.getElementById('downpaymentPercentage');

        updateAnswers('purchasePrice', purchasePriceInput.value);
        updateAnswers('downpaymentAbsolute', downpaymentAbsoluteInput.value);
        updateAnswers('downpaymentPercentage', downpaymentPercentageInput.value);
    }
}

function getCheckboxInput() {
    if (document.querySelector('.checkbox:checked')) {
        let checkedValues = document.querySelectorAll('.checkbox:checked');
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

// For handling various question types and updating answers dictionary

function handleFields(question) {
    handleTypeOptions(question);
    handleTypeOptionsLong(question);
    handleTypeNewPurchase(question);
    handleTypeTextfield(question);
    handleTypeCheckboxes(question);
    handleRemainingMortgageWarning(question)
}

function updateAnswers(l, v) {
    answers[l] = v;
}

function allowNextTypeOptions(q) {
    return q['name'] in answers ? inputGiven = true : inputGiven = false;
}

function addOptionsEventListener(btn, name, value) {
    btn.onclick = function() {
        let buttons = document.querySelectorAll('#formOptions > button');
        for (let button of buttons) {
            button.classList.remove('selected');
        }
        updateAnswers(name, value);
        btn.classList.add('selected');
        inputGiven = true;
        updateNextBack();
    };
}

function handleTypeOptions(question) {
    let fields = question['fields'];
    if (question['type'] === 'options') {
        allowNextTypeOptions(question);
        
        for (let i = 0; i < fields.length; i++) {
            let text = fields[i]['text'];
            let value = fields[i]['value'];
            let btn = document.createElement('button');
            let name = question['name'];
            let label = document.createElement('div');
            label.innerHTML = text;
            buildTypeOptionsButton(btn, name, value);

            if ('icon' in fields[i]) {
                let icon = document.createElement('img');
                icon.src = 'icons/' + fields[i]['icon'];
                icon.classList.add('icon');
                btn.appendChild(icon);
            }
            btn.appendChild(label);

            if (answers[name] === btn.value) {
                btn.classList.add('selected');
            }

            if (typeof answers[name] === 'boolean') {
                if (answers[name].toString() === btn.value.toString()) {
                    btn.classList.add('selected');
                }
            }

            addOptionsEventListener(btn, name, value);
            formOptions.appendChild(btn);
        }
    }
}

function buildTypeOptionsButton(btn, name, value) {
    btn.value = value;
    btn.type = 'button';
    btn.classList.add(name);
    btn.classList.add('option');
}

function handleTypeOptionsLong(question) {
    let fields = question['fields'];
    if (question['type'] === 'options-long') {
        allowNextTypeOptions(question);

        for (let i = 0; i < fields.length; i++) {
            let text = fields[i]['text'];
            let value = fields[i]['value'];
            let name = question['name'];
            let btn = document.createElement('button');
            let btnText = document.createElement('div');
            btnText.innerHTML = text;
            btnText.classList.add('option-long-text');
            btn.type = 'button';
            btn.value = value;
            btn.classList.add('option-long');
            btn.appendChild(btnText);

            if (fields[i]['subtext']) {
                let subtext = fields[i]['subtext'];
                let btnSubtext = document.createElement('div');
                btnSubtext.innerHTML = subtext;
                btnSubtext.classList.add('option-long-subtext');
                btn.appendChild(btnSubtext);
            }

            let keys = getFormFieldKeyArray();
            if (keys.includes(name) && answers[name] === btn.value) {
                btn.classList.add('selected');
            }

            addOptionsEventListener(btn, name, value);
            formOptions.appendChild(btn);
        }
    }
}

function handleTypeNewPurchase(question) {
    if (question['type'] === 'newPurchase') {
        let paymentWrapper = document.createElement('div');
        paymentWrapper.classList.add('payment-wrapper');

        let [text1, text2] = [question['text1'], question['text2']];
        let label1 = document.createElement('h3');
        let label2 = document.createElement('h3');
        label1.innerHTML = text1;
        label2.innerHTML = text2;

        let input1 = document.createElement('input');
        let input2 = document.createElement('input');
        let input3 = document.createElement('input');
        configureTypeNewPurchaseInputs(input1, input2, input3);

        let span1 = document.createElement('span');
        let span2 = document.createElement('span');
        let span3 = document.createElement('span');

        let spacer = document.createElement('div');
        let warning = document.createElement('div');
        warning.id = 'newPurchaseWarning';
        warning.classList.add('warning');

        span1.innerHTML, span2.innerHTML = '$';
        span3.innerHTML = '%';

        let elements = [label1, span1, input1, label2, span2, input2, spacer, span3, input3, warning];
        elements.forEach(e => paymentWrapper.appendChild(e));
        formOptions.appendChild(paymentWrapper);

        handleTypeNewPurchaseFunctionality();
    }
}

function configureTypeNewPurchaseInputs(input1, input2, input3) {
    input1.id = 'purchasePrice';
    input2.id = 'downpaymentAbsolute';
    input3.id = 'downpaymentPercentage';

    [input1, input2, input3].forEach(e => e.classList.add('purchase-input'));

    input1.maxLength = 15;
    input2.maxLength = 15;
    input3.maxLength = 2;

    let autoInput1;
    let autoInput2;
    autoInput1 = new AutoNumeric(input1, 'integerPos');
    autoInput2 = new AutoNumeric(input2, 'integerPos');
    autoInput1.options.modifyValueOnWheel(false);
    autoInput2.options.modifyValueOnWheel(false);
}

function handleTypeNewPurchaseFunctionality() {
    handleTypeNewPurchaseInteraction();
    handleTypeNewPurchaseSaveState();
    handleTypeNewPurchaseWarning();
}

function handleTypeNewPurchaseInteraction() {
    let purchasePriceInput = document.getElementById('purchasePrice');
    let downpaymentAbsoluteInput = document.getElementById('downpaymentAbsolute');
    let downpaymentPercentageInput = document.getElementById('downpaymentPercentage');

    purchasePriceInput.addEventListener('keyup', event => {
        inputGivenNewPayment();
        if (downpaymentAbsoluteInput.value) {
            downpaymentPercentageInput.value = getNewDownpaymentPercentageInputValue();
        }
    });
    downpaymentAbsoluteInput.addEventListener('keyup', event => {
        inputGivenNewPayment();
        if (purchasePriceInput.value) {
            downpaymentPercentageInput.value = getNewDownpaymentPercentageInputValue();
        }
    });
    downpaymentPercentageInput.addEventListener('keyup', event => {
        inputGivenNewPayment();
        if (purchasePriceInput.value) {
            downpaymentAbsoluteInput.value = getNewDownpaymentAbsoluteInputValue();
        }
    });

    function inputGivenNewPayment() {
        if (purchasePriceInput.value && downpaymentAbsoluteInput.value && downpaymentPercentageInput.value) {
            inputGiven = true;
            updateNextBack();
        }
    }

    function getNewDownpaymentPercentageInputValue() {
        let newValue = parseInt((filterCommaNumber(downpaymentAbsoluteInput.value) / filterCommaNumber(purchasePriceInput.value)) * 100);
        return (newValue === NaN ? 0 : newValue);
    }

    function getNewDownpaymentAbsoluteInputValue() {
        let newValue =  parseInt((filterCommaNumber(downpaymentPercentageInput.value) / 100) * filterCommaNumber(purchasePriceInput.value));
        return (newValue === NaN ? 0 : newValue);
    }
}

function handleTypeNewPurchaseWarning() {
    let purchasePriceInput = document.getElementById('purchasePrice');
    let downpaymentAbsoluteInput = document.getElementById('downpaymentAbsolute');
    let downpaymentPercentageInput = document.getElementById('downpaymentPercentage');
    let inputs = [purchasePriceInput, downpaymentAbsoluteInput, downpaymentPercentageInput];

    let warning = document.getElementById('newPurchaseWarning');

    let tooLittleWarningText = 'Down payment should be greater than or equal to 3% of purchase price.';
    let tooMuchWarningText = 'Down payment must be less than purchase price.';

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keyup', event => {
            if (downpaymentPercentageInput.value < 3 && downpaymentAbsoluteInput.value) {
                warning.innerHTML = tooLittleWarningText;
                warningPresent = true;
                updateNextBack();
            } else if (downpaymentPercentageInput.value > 99 && downpaymentAbsoluteInput.value) {
                warning.innerHTML = tooMuchWarningText;
                warningPresent = true;
                updateNextBack();
            } else {
                warning.innerHTML = '';
                warningPresent = false;
                updateNextBack();
            }
        });
    }
}

function handleTypeNewPurchaseSaveState() {
    let purchasePriceInput = document.getElementById('purchasePrice');
    let downpaymentAbsoluteInput = document.getElementById('downpaymentAbsolute');
    let downpaymentPercentageInput = document.getElementById('downpaymentPercentage');

    if ('purchasePrice' in answers) {
        purchasePriceInput.value = answers['purchasePrice'];
    }

    if ('downpaymentAbsolute' in answers) {
        downpaymentAbsoluteInput.value = answers['downpaymentAbsolute'];
    }

    if ('downpaymentPercentage' in answers) {
        downpaymentPercentageInput.value = answers['downpaymentPercentage'];
    }
}

function addZipFilterEventListener(input) {
    const ZIP_ALLOWED_CHARS_REGEXP = new RegExp('^[0-9]*$');
    input.addEventListener('keypress', event => {
        if (!ZIP_ALLOWED_CHARS_REGEXP.test(event.key)) {
            event.preventDefault();
        }
    });
}

function addZipValidationEventListener(input) {
    input.addEventListener('keyup', event => {
        let state = getState(input.value);
    
        if (state === answers['state']) {
            inputGiven = true;
            warningPresent = false;
            updateNextBack();
        } else {
            inputGiven = false;
            warningPresent = true;
            updateNextBack();
        }
    });
}

function addZipWarningEventListener(input) {
    let warningText = 'Please enter a zip code belonging to the state provided.';

    input.addEventListener('keyup', event => {
        let warning = document.getElementById('textfieldWarning');

        if (warningPresent) {
            warning.innerHTML = warningText;
        } else {
            warning.innerHTML = '';
        }
    });
}

function getState(zipcode) {
    // Ensure you don't parse codes that start with 0 as octal values
    zipcode = parseInt(zipcode,10);

    // Code blocks alphabetized by state
    let states = [{min: 35000, max:36999, code: 'AL', long: "Alabama"},
    {min: 99500, max:99999, code: 'AK', long: "Alaska"},
    {min: 85000, max:86999, code: 'AZ', long: "Arizona"},
    {min: 71600, max:72999, code: 'AR', long: "Arkansas"},
    {min: 90000, max:96699, code: 'CA', long: "California"},
    {min: 80000, max:81999, code: 'CO', long: "Colorado"},
    {min: 6000,  max:6999,  code: 'CT', long: "Connecticut"},
    {min: 19700, max:19999, code: 'DE', long: "Deleware"},
    {min: 32000, max:34999, code: 'FL', long: "Florida"},
    {min: 30000, max:31999, code: 'GA', long: "Georgia"},
    {min: 96700, max:96999, code: 'HI', long: "Hawaii"},
    {min: 83200, max:83999, code: 'ID', long: "Idaho"},
    {min: 60000, max:62999, code: 'IL', long: "Illinois"},
    {min: 46000, max:47999, code: 'IN', long: "Indiana"},
    {min: 50000, max:52999, code: 'IA', long: "Iowa"},
    {min: 66000, max:67999, code: 'KS', long: "Kansas"},
    {min: 40000, max:42999, code: 'KY', long: "Kentucky"},
    {min: 70000, max:71599, code: 'LA', long: "Louisiana"},
    {min: 3900,  max:4999,  code: 'ME', long: "Maine"},
    {min: 20600, max:21999, code: 'MD', long: "Maryland"},
    {min: 1000,  max:2799,  code: 'MA', long: "Massachusetts"},
    {min: 48000, max:49999, code: 'MI', long: "Michigan"},
    {min: 55000, max:56999, code: 'MN', long: "Minnesota"},
    {min: 38600, max:39999, code: 'MS', long: "Mississippi"},
    {min: 63000, max:65999, code: 'MO', long: "Missouri"},
    {min: 59000, max:59999, code: 'MT', long: "Montana"},
    {min: 27000, max:28999, code: 'NC', long: "North Carolina"},
    {min: 58000, max:58999, code: 'ND', long: "North Dakota"},
    {min: 68000, max:69999, code: 'NE', long: "Nebraska"},
    {min: 88900, max:89999, code: 'NV', long: "Nevada"},
    {min: 3000, max:3899, code: 'NH', long: "New Hampshire"},
    {min: 7000, max:8999, code: 'NJ', long: "New Jersey"},
    {min: 87000, max:88499, code: 'NM', long: "New Mexico"},
    {min: 10000, max:14999, code: 'NY', long: "New York"},
    {min: 43000, max:45999, code: 'OH', long: "Ohio"},
    {min: 73000, max:74999, code: 'OK', long: "Oklahoma"},
    {min: 97000, max:97999, code: 'OR', long: "Oregon"},
    {min: 15000, max:19699, code: 'PA', long: "Pennsylvania"},
    {min: 300, max:999, code: 'PR', long: "Puerto Rico"},
    {min: 2800, max:2999, code: 'RI', long: "Rhode Island"},
    {min: 29000, max:29999, code: 'SC', long: "South Carolina"},
    {min: 57000, max:57999, code: 'SD', long: "South Dakota"},
    {min: 37000, max:38599, code: 'TN', long: "Tennessee"},
    {min: 75000, max:79999, code: 'TX', long: "Texas"},
    {min: 88500, max:88599, code: 'TX', long: "Texas"},
    {min: 84000, max:84999, code: 'UT', long: "Utah"},
    {min: 5000, max:5999, code: 'VT', long: "Vermont"},
    {min: 22000, max:24699, code: 'VA', long: "Virgina"},
    {min: 20000, max:20599, code: 'DC', long: "Washington DC"},
    {min: 98000, max:99499, code: 'WA', long: "Washington"},
    {min: 24700, max:26999, code: 'WV', long: "West Virginia"},
    {min: 53000, max:54999, code: 'WI', long: "Wisconsin"},
    {min: 82000, max:83199, code: 'WY', long: "Wyoming"}];

    let state = states.filter(function(s) {
        return s.min <= zipcode && s.max >= zipcode;        
    });

    if (state.length === 0){
        return false;
    } else if (state.length > 1) {
        console.error("Found two states");
    }
    return state[0].long.toLowerCase();
}

function addMoneyValidationEventListener(input) {
    input.addEventListener('keyup', event => {
        if (input.value.length > 0) {
            inputGiven = true;
            updateNextBack();
        } else {
            inputGiven = false;
            updateNextBack();
        }
    });
}

function handleTypeTextfield(question) {
    if (question['type'] === 'textfield') {
        let label = document.createElement('label');
        let input = document.createElement('input');
        let warning = document.createElement('div');
        let name = question['name'];

        warning.classList.add('warning');
        warning.id = 'textfieldWarning';
        warning.innerHTML = '';

        if (name === 'zip') {
            handleTypeZip(input);
        } else if (question['fields'][0]['textType'] === 'money') {
            handleTypeMoney(input, label);
        } else {
            handleTypeCounty(input);
        }

        buildTypeTextfieldDisplay(input, label, name);
        formOptions.appendChild(label);
        formOptions.appendChild(warning);

        // State management
        if (name in answers) {
            input.value = answers[name];
            inputGiven = true;
        }
    }
}

// These might screw up state management
function buildTypeTextfieldDisplay(input, label, name) {
    label.classList.add('input-wrapper');
    input.classList.add('input');
    input.id = 'currentInputField';
    input.name = name;
    label.appendChild(input);
}

function handleTypeZip(input) {
    addZipFilterEventListener(input);
    addZipValidationEventListener(input);
    addZipWarningEventListener(input);
    input.placeholder = '85233';
    input.maxLength = 5;
    input.pattern = '[a-z]{1,15}';
}

function handleTypeMoney(input, label) {
    addMoneyValidationEventListener(input);
    input.maxLength = 15;
    let span = document.createElement('span');
    span.innerHTML = '$';
    label.appendChild(span);
    input.pattern = '[a-z]{1,15}';

    let autoInput;
    autoInput = new AutoNumeric(input, 'integerPos');
    autoInput.options.modifyValueOnWheel(false);
}

function handleTypeCounty(input) {
    addCountyValidationEventListener(input);
    addCountyWarningEventListener(input);
    addTitleCaseEventListener(input);
    input.placeholder = 'Maricopa';
}

function addCountyValidationEventListener(input) {
    input.addEventListener('keyup', event => {
        let state = answers['state'];

        if (!(counties[state].includes(input.value))) {
            inputGiven = false;
            warningPresent = true;
        } else {
            inputGiven = true;
            warningPresent = false;
        }
    });
}

function addCountyWarningEventListener(input) {
    let warningText = 'Please enter a county belonging to the state provided.';

    input.addEventListener('keyup', event => {
        let warning = document.getElementById('textfieldWarning');

        if (warningPresent) {
            warning.innerHTML = warningText;
        } else {
            warning.innerHTML = '';
        }
    });
}

function addTitleCaseEventListener(input) {
    input.addEventListener('keyup', event => {
        input.value = toTitleCase(input.value);
    });
}

function toTitleCase(str) {
   return str.split(/\s+/).map(s => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase()).join(' ');
}

function handleRemainingMortgageWarning(question) {
    if (question['type'] === 'textfield' && question['name'] === 'remainingMortgageBalance') {
        let formOptions = document.getElementById('formOptions');
        let input = document.getElementById('currentInputField');
        let warning = document.createElement('div');
        let warningText = 'Looks like you may owe more than your home is worth. Please lower the amount you owe on this page, or increase your home value on the previous page.';
        let value;
        warning.classList.add('warning');
        warning.id = 'remainingMortgageWarning';
        formOptions.appendChild(warning);

        displayWarning();
        input.addEventListener('keyup', event => { displayWarning(); });

        function displayWarning() {
            if ('propertyValue' in answers && input.value) {
                value = filterCommaNumber(input.value);

                if (value > answers['propertyValue']) {
                    warning.innerHTML = warningText;
                    warningPresent = true;
                    updateNextBack();
                } else {
                    warning.innerHTML = '';
                    warningPresent = false;
                    updateNextBack();
                }
            }
        }
    }
}

function handleTypeCheckboxes(question) {
    let fields = question['fields'];
    if (question['type'] === 'checkboxes') {
        allowNextTypeOptions(question);

        let checkboxContainer = document.createElement('div');
        checkboxContainer.classList.add('checkboxes-container');
        let answerName = question['name']
        for (let i = 0; i < fields.length; i++) {
            let text = fields[i]['text'];
            let name = fields[i]['name'];

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = name;
            checkbox.classList.add('checkbox');

            let innerLabel = document.createElement('span');
            innerLabel.innerHTML = text;

            let displayCheckbox = document.createElement('span');
            displayCheckbox.classList.add('checkbox-display');

            let label = document.createElement('label');
            label.htmlFor = name;
            label.appendChild(innerLabel);
            label.appendChild(displayCheckbox);

            let checkboxWrapper = document.createElement('div');
            checkboxWrapper.classList.add('checkbox-wrapper');
            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);

            checkboxContainer.appendChild(checkboxWrapper);

            label.onclick = function() {
                let checked = document.querySelectorAll('.checkbox:checked');
                if (checked.length === 0) {
                    inputGiven = false;
                    updateNextBack();
                } else {
                    inputGiven = true;
                    updateNextBack();
                }
            };

            if (answerName in answers && answers[answerName].includes(name)) {
                checkbox.checked = true;
            } else if (answerName in answers && answers[answerName].length === 3) {
                checkbox.disabled = true;
            }
        }
        formOptions.appendChild(checkboxContainer);
        limitCheckboxCount(3);
    }
}

function limitCheckboxCount(limit) {
    let checkboxes = document.getElementsByClassName('checkbox');         
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

// For handling conditionals

function handleConditionals() {
    handlePurchaseCase();
    handleMilitaryCase();
    handleVALoanCase();
}

function getFormFieldKeyArray() {
    return formFields.map(x => x['name']);
}

function handlePurchaseCase() {
    let keys = getFormFieldKeyArray();
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
    let keys = getFormFieldKeyArray();
    let indexOfMilitary = keys.indexOf('isMilitary');
    let militaryQuestionsExist = keys.includes('isVALoan') || keys.includes('isVAFirstTime') || keys.includes('isVAFundingFeeExempt');
    if (answers['isMilitary'] && !(militaryQuestionsExist)) {
        formFields.splice(indexOfMilitary+1, 0, militaryFields[0]);
        formFields.splice(indexOfMilitary+2, 0, militaryFields[2]);
    }
}

function reverseMilitaryCase() {
    let keys = getFormFieldKeyArray();
    let indexOfMilitary = keys.indexOf('isMilitary');
    let militaryQuestionsExist = keys.includes('isVALoan') || keys.includes('isVAFirstTime') || keys.includes('isVAFundingFeeExempt');
    if (!(answers['isMilitary']) && militaryQuestionsExist) {
        let newMilitaryFields = formFields.filter(field => field['from'] === 'militaryFields');
        let l = newMilitaryFields.length;
        formFields.splice(indexOfMilitary+1, l);
    }
}

function handleVALoanCase() {
    let keys = getFormFieldKeyArray();
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

// For removing questions when conditionals get updated

function updateFields() {
    replaceRefinanceFields();
    replacePurchaseField();
    reverseMilitaryCase();
}

function replaceRefinanceFields() {
    let keys = getFormFieldKeyArray();
    let values = Object.values(answers);
    if (keys.includes('propertyValue') && values.includes('purchase')) {
        let indexOfPropertyValueField = keys.indexOf('propertyValue');
        formFields.splice(indexOfPropertyValueField, 3, purchasePaymentField);
    }
}

function replacePurchaseField() {
    let keys = getFormFieldKeyArray();
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

// For handling next/back functionality

function next() {
    if (inputGiven && !(warningPresent)) {
        inputGiven = false;
        questionCount = Object.keys(formFields).length;

        updateNextBack();
        handleConditionals();
        updateFields();
        getInput();

        if (currentQuestionIndex <= questionCount) {
            currentQuestionIndex++;
            display();
        }

        console.log(answers);
    }
}

function back() {
    getInput();

    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        display();
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
            if (inputGiven && !(warningPresent)) {
                submit();
            }
        };

        // Add code that makes button trigger api request
    }
}

function updateNextBack() {
    if (!(inputGiven) || warningPresent) {
        nextBtn.style.backgroundColor = 'tomato';
        nextBtn.style.color = 'black';
    } else {
        nextBtn.style.backgroundColor = '#0e508b';
        nextBtn.style.color = 'white';
    }
}

function submit() {
    getInput();
    present();
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
    if (event.which === 13) { // Enter/return was pressed
        if (currentQuestionIndex+1 >= questionCount) {
            submit();
        } else {
            next();
        }
    }
}

document.addEventListener("keydown", incrementOnKeypress);

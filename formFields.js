export let formFields = [
    {
        "text": "I want to...",
        "type": "options",
        "name": "refinanceOrPurchase",
        "fields": [
            {
                "text": "Refinance",
                "icon": "mortgage.svg",
                "value": "refinance"
            },
            {
                "text": "Purchase",
                "icon": "home.svg",
                "value": "purchase"
            }
        ]
    },
    {
        "text": "This will be my...",
        "type": "options",
        "name": "loanPurpose",
        "fields": [
            {
                "text": "Primary Residence",
                "icon": "home.svg",
                "value": "primaryResidence"
            },
            {
                "text": "Second Home",
                "icon": "houses.svg",
                "value": "secondHome"
            },
            {
                "text": "Investment",
                "icon": "value.svg",
                "value": "investment"
            }
        ]
    },
    {
        "text": "This property is a...",
        "type": "options",
        "name": "residenceType",
        "fields": [
            {
                "text": "Single Family",
                "icon": "home.svg",
                "value": "singleFamily"
            },
            {
                "text": "Townhouse",
                "icon": "townhouse.svg",
                "value": "townhouse"
            },
            {
                "text": "2-4 Unit Duplex",
                "icon": "duplex.svg",
                "value": "duplex"
            },
            {
                "text": "Condominium",
                "icon": "condominium.svg",
                "value": "condominium"
            }
        ]
    },
    {
        "text": "Have you or your spouse ever served in the military?",
        "type": "options",
        "name": "isMilitary",
        "fields": [
            {
                "text": "Yes",
                "value": true
            },
            {
                "text": "No",
                "value": false
            }
        ]
    },
    {
        "text": "Select from states we serve...",
        "type": "options-long",
        "name": "state",
        "fields": [
            {
                "text": "Arizona",
                "value": "arizona"
            },
            {
                "text": "California",
                "value": "california"
            },
            {
                "text": "Colorado",
                "value": "colorado"
            },
            {
                "text": "Washington",
                "value": "washington"
            },
            {
                "text": "Utah",
                "value": "utah"
            },
            {
                "text": "Texas",
                "value": "texas"
            },
            {
                "text": "Nevada",
                "value": "nevada"
            },
            {
                "text": "Florida",
                "value": "florida"
            },
            {
                "text": "Oregon",
                "value": "oregon"
            },
            {
                "text": "Michigan",
                "value": "michigan"
            }
        ]
    },
    {
        "text": "The county is...",
        "type": "textfield",
        "name": "county",
        "fields": [
            {
                "textType": "text"
            }
        ]
    },
    {
        "text": "The zip code is...",
        "type": "textfield",
        "name": "zip",
        "fields": [
            {
                "textType": "zip"
            }
        ]
    },
    {
        "text": "What is your estimated credit score?",
        "type": "options-long",
        "name": "creditScore",
        "fields": [
            {
                "text": "Excellent+",
                "subtext": "760+",
                "value": "excellent+"
            },
            {
                "text": "Excellent",
                "subtext": "740-759",
                "value": "excellent"
            },
            {
                "text": "Very Good+",
                "subtext": "720-739",
                "value": "verygood+"
            },
            {
                "text": "Very Good",
                "subtext": "700-719",
                "value": "verygood"
            },
            {
                "text": "Good+",
                "subtext": "680-699",
                "value": "good+"
            },
            {
                "text": "Good",
                "subtext": "660-679",
                "value": "good"
            },
            {
                "text": "Decent+",
                "subtext": "640-659",
                "value": "decent+"
            },
            {
                "text": "Decent",
                "subtext": "620-639",
                "value": "decent"
            },
            {
                "text": "Fair+",
                "subtext": "600-619",
                "value": "fair+"
            },
            {
                "text": "Fair",
                "subtext": "599 & below",
                "value": "fair"
            }
        ]
    },
    {
        "text": "Check up to three loan terms you would like to see",
        "max": 3,
        "type": "checkboxes",
        "name": "loanTerms",
        "fields": [
            {
                "text": "30 Yr Fixed",
                "name": "30yrfixed"
            },
            {
                "text": "25 Yr Fixed",
                "name": "25yrfixed"
            },
            {
                "text": "20 Yr Fixed",
                "name": "20yrfixed"
            },
            {
                "text": "15 Yr Fixed",
                "name": "15yrfixed"
            },
            {
                "text": "10 Yr Fixed",
                "name": "10yrfixed"
            },
            {
                "text": "10 Yr ARM",
                "name": "10yrarm"
            },
            {
                "text": "7 Yr ARM",
                "name": "7yrarm"
            },
            {
                "text": "5 Yr ARM",
                "name": "5yrarm"
            },
            {
                "text": "3 Yr ARM",
                "name": "3yrarm"
            }
        ]
    }
];

export let purchasePaymentField = {
    "text": "",
    "text1": "Purchase price:",
    "text2": "Down payment:",
    "type": "newPurchase",
    "name": "remainingMortgageBalance",
    "fields": [
        {
            "textType": "money"
        },
        {
            "textType": "money"
        },
        {
            "textType": "percentage"
        }
    ]
}

export let refinancePaymentField = {
    "text": "What is the estimated property value?",
    "type": "textfield",
    "name": "propertyValue",
    "fields": [
        {
            "textType": "money"
        }
    ]
}

export let refinanceQuestions = [
    {
        "text": "What is the remaining balance of your mortgage?",
        "type": "textfield",
        "name": "remainingMortgageBalance",
        "fields": [
            {
                "textType": "money"
            }
        ]
    },
    {
        "text": "Would you like to borrow cash? How much?",
        "type": "textfield",
        "name": "borrowAmount",
        "fields": [
            {
                "textType": "money"
            }
        ]
    }
]

export let militaryFields = [
    {
        "text": "Thank you for your service! Is the loan you're refinancing a VA Loan?",
        "type": "options",
        "name": "isVALoan",
        "from": "militaryFields",
        "fields": [
            {
                "text": "Yes",
                "value": true
            },
            {
                "text": "No",
                "value": false
            }
        ]
    },
    {
        "text": "Is this 1st time use?",
        "type": "options",
        "name": "isVAFirstTime",
        "from": "militaryFields",
        "fields": [
            {
                "text": "Yes",
                "value": true
            },
            {
                "text": "No",
                "value": false
            }
        ]
    },
    {
        "text": "Are you VA funding fee exempt?",
        "type": "options",
        "name": "isVAFundingFeeExempt",
        "from": "militaryFields",
        "fields": [
            {
                "text": "Yes",
                "value": true
            },
            {
                "text": "No",
                "value": false
            }
        ]
    }
]
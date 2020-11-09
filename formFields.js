export let formFields = [
    {
        "text": "I want to...",
        "options": [
            {
                "text": "Refinance",
                "icon": "house.jpg"
            },
            {
                "text": "Purchase",
                "icon": "test.png"
            }
        ]
    },
    {
        "text": "This will be my...",
        "options": [
            {
                "text": "Primary Residence",
                "icon": "house.jpg"
            },
            {
                "text": "Second Home",
                "icon": "house.jpg"
            },
            {
                "text": "Investment",
                "icon": "house.jpg"
            }
        ]
    },
    {
        "text": "This property is a...",
        "options": [
            {
                "text": "Single Family",
                "icon": "house.jpg"
            },
            {
                "text": "Townhouse",
                "icon": "house.jpg"
            },
            {
                "text": "2-4 Unit Duplex",
                "icon": "house.jpg"
            },
            {
                "text": "Condominium",
                "icon": "house.jpg"
            }
        ]
    },
    {
        "text": "Have you or your spouse ever served in the military?",
        "options": [
            {
                "text": "Yes"
            },
            {
                "text": "No"
            }
        ]
    },
    {
        "text": "The zip code is...",
        "textfield": [
            {
                "placeholder": "90210",
                "name": "zip"
            }
        ]
    },
    {
        "text": "What is the estimated property value?",
        "textfield": [
            {
                "placeholder": "$",
                "name": "propertyValue"
            }
        ]
    },
    {
        "text": "What is the remaining balance of your mortgage?",
        "textfield": [
            {
                "placeholder": "$",
                "name": "remainingMortgageBalance"
            }
        ]
    },
    {
        "text": "Would you like to borrow cash? How much?",
        "textfield": [
            {
                "placeholder": "$",
                "name": "borrowAmount"
            }
        ]
    },
    {
        "text": "What is your estimated credit score?",
        "options-long": [
            {
                "text": "Excellent+",
                "subtext": "760+"
            },
            {
                "text": "Excellent",
                "subtext": "740-759"
            },
            {
                "text": "Very Good+",
                "subtext": "720-739"
            },
            {
                "text": "Very Good",
                "subtext": "700-719"
            },
            {
                "text": "Good+",
                "subtext": "680-699"
            },
            {
                "text": "Good",
                "subtext": "660-679"
            },
            {
                "text": "Decent+",
                "subtext": "640-659"
            },
            {
                "text": "Decent",
                "subtext": "620-639"
            },
            {
                "text": "Fair+",
                "subtext": "600-619"
            },
            {
                "text": "Fair",
                "subtext": "599 & below"
            }
        ]
    },
    {
        "text": "Check up to three loan terms you would like to see",
        "max": 3,
        "checkboxes": [
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

export let militaryFields = [
    {
        "text": "Thank you for your service! Is the loan you're refinancing a VA Loan?",
        "options": [
            {
                "text": "Yes"
            },
            {
                "text": "No"
            }
        ]
    },
    {
        "text": "Is this 1st time use?",
        "options": [
            {
                "text": "Yes"
            },
            {
                "text": "No"
            }
        ]
    },
    {
        "text": "Are you VA funding fee exempt?",
        "options": [
            {
                "text": "Yes"
            },
            {
                "text": "No"
            }
        ]
    }
]
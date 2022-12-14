/*
    Author: devCodeCamp
    Description: Most Wanted Starter Code
*/
//////////////////////////////////////////* Beginning Of Starter Code *//////////////////////////////////////////

"use strict";
//? Utilize the hotkey to hide block level comment documentation
////* Mac: Press "CMD"+"K" and then "CMD"+"/"
////* PC: Press "CTRL"+"K" and then "CTRL"+"/"

/**
 * This is the main logic function being called in index.html.
 * It operates as the entry point for our entire application and allows
 * our user to decide whether to search by name or by traits.
 * @param {Array} people        A collection of person objects.
 */
function app(people) {
    // promptFor() is a custom function defined below that helps us prompt and validate input more easily
    // Note that we are chaining the .toLowerCase() immediately after the promptFor returns its value
    let searchType = promptFor(
        "Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo)
    let searchResults;
    // Routes our application based on the user's input
    switch (searchType) {
        case "yes":
            searchResults = searchByName(people);
            break;
        case "no":
            //! TODO #4: Declare a searchByTraits (multiple traits) function //////////////////////////////////////////
                //! TODO #4a: Provide option to search for single or multiple //////////////////////////////////////////
            let getSearchResults = searchByTrait(people) // Get initial trait search result
            if (getSearchResults.length === 0){ // break if empty
                searchResults = []
                break;
            }
          do {      // Loop until user input in searchPrompt is inside initial trait search result
            let searchPrompt = prompt('Your trait search found:\n'+getSearchResults.map(function(person){
                return `\t${person.firstName} ${person.lastName}`
            }).join('\n') + '\nPlease select a name from above')
            searchResults = getSearchResults.filter(function(person){
                let personToSearch = person.firstName + ' ' + person.lastName
                if (searchPrompt.toLowerCase().trim() == personToSearch.toLowerCase().trim()){
                    return person
                }
            })
        }   while (getSearchResults.includes(searchResults[0]) === false)
            break;
        default:
            // Re-initializes the app() if neither case was hit above. This is an instance of recursion.
            app(people);
            break;
    }
    // Calls the mainMenu() only AFTER we find the SINGLE PERSON
    mainMenu(searchResults, people);
}
// End of app()

/**
 * After finding a single person, we pass in the entire person-object that we found,
 * as well as the entire original dataset of people. We need people in order to find
 * descendants and other information that the user may want.
 * @param {Object[]} person     A singular object inside of an array.
 * @param {Array} people        A collection of person objects.
 * @returns {String}            The valid string input retrieved from the user.
 */
function mainMenu(person, people) {
    // A check to verify a person was found via searchByName() or searchByTrait()
    if (!person[0]) {
        alert("Could not find that individual.");
        // Restarts app() from the very beginning
        return app(people);
    }
    let displayOption = prompt(
        `Found ${person[0].firstName} ${person[0].lastName}. Do you want to know their 'info', 'family', or 'descendants'?\nType the option you want or type 'restart' or 'quit'.`
    );
    // Routes our application based on the user's input
    switch (displayOption) {
        case "info":
            //! TODO #1: Utilize the displayPerson function //////////////////////////////////////////
            // HINT: Look for a person-object stringifier utility function to help
            let personInfo = displayPerson(person[0], people);
            break;
        case "family":
            //! TODO #2: Declare a findPersonFamily function //////////////////////////////////////////
            // HINT: Look for a people-collection stringifier utility function to help
            let personFamily = findPersonFamily(person[0], people);
            break;
        case "descendants":
            //! TODO #3: Declare a findPersonDescendants function //////////////////////////////////////////
            // HINT: Review recursion lecture + demo for bonus user story
            let personDescendants = findPersonDescendants(person[0], people);
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        default:
            // Prompt user again. Another instance of recursion
            return mainMenu(person, people);
    }
}
// End of mainMenu()

/**
 * This function is used when searching the people collection by
 * a person-object's firstName and lastName properties.
 * @param {Array} people        A collection of person objects.
 * @returns {Array}             An array containing the person-object (or empty array if no match)
 */
function searchByName(people) {
    let firstName = promptFor("What is the person's first name?", chars);
    let lastName = promptFor("What is the person's last name?", chars);

    // The foundPerson value will be of type Array. Recall that .filter() ALWAYS returns an array.
    let foundPerson = people.filter(function (person) {
        if (person.firstName.toLowerCase() === firstName.toLowerCase() && person.lastName.toLowerCase() === lastName.toLowerCase()) {
            return true;
        }
    });
    return foundPerson;
}
// End of searchByName()

/**
 * This function will be useful for STRINGIFYING a collection of person-objects
 * first and last name properties in order to easily send the information
 * to the user in the form of an alert().
 * @param {Array} people        A collection of person objects.
 */
function displayPeople(people) {
    alert(
        people
            .map(function (person) {
                return `${person.firstName} ${person.lastName}`;
            })
            .join("\n")
    );
}
// End of displayPeople()


/**
 * This function will be useful for STRINGIFYING a person-object's properties
 * in order to easily send the information to the user in the form of an alert().
 * @param {Object} person       A singular object.
 */
function displayPerson(person, people) {

                // Identify {person} parents
    let personParents = people.filter(function(parent){
        if (parent.id === person.parents[0] || parent.id === person.parents[1]){
            return true
        }
    })
                // Identify {person} spouse
    let personSpouse = people.filter(function (spouse){
        if (person.currentSpouse === spouse.id){
            return true;
        }
    })

                // Get person.parent names
    let parents = personParents.map(function (parent){
        return `${parent.firstName} ${parent.lastName}`
    }).join(', ')

                // Get person.spouse name
    let spouse = personSpouse.map(function (spouse){
        return `${spouse.firstName} ${spouse.lastName}`
    })
    let personInfo = `First Name: ${person.firstName}\n`;
    personInfo += `Last Name: ${person.lastName}\n`;
    personInfo += `Gender: ${person.gender}\n`;
    personInfo += `Date of Birth: ${person.dob}\n`;
    personInfo += `Height: ${person.height}\n`
    personInfo += `Weight: ${person.weight}\n`
    personInfo += `Eye Color: ${person.eyeColor}\n`
    personInfo += `Occupation: ${person.occupation}\n`
    personInfo += `Parents: ${parents}\n`
    personInfo += `Current Spouse: ${spouse}\n`
    //! TODO #1a: finish getting the rest of the information to display //////////////////////////////////////////
    alert(personInfo);
}
// End of displayPerson()

/**
 * This function's purpose is twofold:
 * First, to generate a prompt with the value passed in to the question parameter.
 * Second, to ensure the user input response has been validated.
 * @param {String} question     A string that will be passed into prompt().
 * @param {Function} valid      A callback function used to validate basic user input.
 * @returns {String}            The valid string input retrieved from the user.
 */
function promptFor(question, valid, param = null) {
    do {
        var response = prompt(question).trim();
    } while (!response || !valid(response, param));

                    // Return 'yes' if 'y' or 'no' if 'n'
    if (response === 'y'){
        response = 'yes'
    }
    else if (response === 'n'){
        response = 'no'
    } 

                    // Remove potential 0s for date of birth
    if (response.includes('/')){
        let responseArray = response.split('/')
        let mm = parseInt(responseArray[0])
        let dd = parseInt(responseArray[1])
        let yyyy = parseInt(responseArray[2])
        response = (mm+'/'+dd+'/'+yyyy)
    }
    return response;
}
// End of promptFor()

/**
 * This helper function checks to see if the value passed into input is a "yes" or "no."
 * @param {String} input        A string that will be normalized via .toLowerCase().
 * @returns {Boolean}           The result of our condition evaluation.
 */
function yesNo(input) {
    if (input.toLowerCase() === 'y'){
        input = 'yes'
    }
    else if (input.toLowerCase() === 'n'){
        input = 'no'
    }
    return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}
// End of yesNo()

/**
 * This helper function operates as a default callback for promptFor's validation.
 * Feel free to modify this to suit your needs.
 * @param {String} input        A string.
 * @returns {Boolean}           Default validation -- no logic yet.
 */
function chars(input) {
    return true; // Default validation only
}
// End of chars()

//////////////////////////////////////////* End Of Starter Code *//////////////////////////////////////////
// Any additional functions can be written below this line ????. Happy Coding! ????



/**
 * This function recursively searches through the people parameter to find 
 * the person parameter's descendants. 
 * @param {String} person       The person to find descendants for.
 * @param {Array} people        The array of people to search through.
 * @param {Array} kids          The array to alert once all descendants are found. (default = [])
 * @param {Index} i             The incrementing index to search through the 'people' array with. (default = 0)
 */

function findPersonDescendants(person, people, kids = [], i = 0){
    let didFindKid;

                    // base
    if (i >= people.length){
        alert('Descendants:\n'+kids.map(function (descendant){
            return `\t${descendant.firstName} ${descendant.lastName}`
        }).join(`\n`))
        return;
    }
    if (person.id === people[i].parents[0] || person.id === people[i].parents[1]){
        didFindKid = true
    }
                    // recurse
    if (didFindKid){
        kids.push(people[i])
        findPersonDescendants(person, people, kids, ++i)
    }
    else if (i < people.length){
        findPersonDescendants(person, people, kids, ++i)
    }

}


function findPersonFamily(person, people){

                // Get parents
    let personParents = people.filter(function(parent){
        if (parent.id === person.parents[0] || parent.id === person.parents[1]){
            return true
        }
    })
                // Get siblings
    let personSiblings = people.filter(function(sibling){
        if (person.parents.length === 0){
            return false;
        }   
                // Ignore self
        if (person.parents[0] === sibling.parents[0] || person.parents[0] === sibling.parents[1]){
            if (person === sibling){
                return false;
            }
            return true;
        }
    })

                // Get spouse
    let personSpouse = people.filter(function (spouse){
        if (person.currentSpouse === spouse.id){
            return true;
        }
    })

    alert(
        'Parents: \n'+
        personParents.map(function (parent) {
            return `\t${parent.firstName} ${parent.lastName}`;
        }).join("\n")+
        '\nSpouse: \n'+
        personSpouse.map(function (spouse){
            return `\t${spouse.firstName} ${spouse.lastName}`;
        }).join('\n')+
        '\nSiblings: \n'+
        personSiblings.map(function(sibling){
            return `\t${sibling.firstName} ${sibling.lastName}`
        }).join('\n')
    );

}

function searchByTrait(people){
    let traitArray = []         // Array of user input traits, formatted to work with data.js
    let checkTraitArray = []    // Array of user input traits
    let inTraitArray = []       // Array of user input trait types
    let foundPersonByTrait;
    let searchByAnother;
    let traitPrompt;
    let traitToSearchBy;
    let searchLength = 0;
    while (searchByAnother != 'no' && searchLength < 5){        // Search for up to 5 trait types
        do {        // Check if user input trait type has already been searched
            traitToSearchBy = promptFor('Please enter a trait to search by:\n"gender", "date of birth", "height", "weight", "eye color", or "occupation"', checkIfTrait)
            traitPrompt = changeTraitType(traitToSearchBy)
            if (checkTraitArray.includes(traitToSearchBy)){
                alert (`You've already entered a(n) ${traitPrompt}!`)
            }
        } while (checkTraitArray.includes(traitToSearchBy))
        checkTraitArray.push(traitToSearchBy)
        let traitToSearch = promptFor(`Please enter a(n) ${traitPrompt}.`, checkTraitType, traitToSearchBy)
        traitToSearchBy = checkTraitToSearchBy(traitToSearchBy)
        traitArray.push(traitToSearch)
        inTraitArray.push(traitToSearchBy)
        searchLength = traitArray.length
        searchByAnother = promptFor(`Would you like to search for an additional trait? (y/n) (Search: ${searchLength}/5)`,yesNo)
    }
    switch (searchLength){

        case 1:
            foundPersonByTrait = people.filter(function(person){
                if (person[inTraitArray[0]] == traitArray[0]){
                    return true;
                }})
            return foundPersonByTrait

        case 2:
            foundPersonByTrait = people.filter(function(person){
                if (person[inTraitArray[0]] == traitArray[0] && person[inTraitArray[1]] == traitArray[1]){
                    return true;
                }})
            return foundPersonByTrait

        case 3: 
        foundPersonByTrait = people.filter(function(person){
            if (person[inTraitArray[0]] == traitArray[0] && person[inTraitArray[1]] == traitArray[1] &&
                person[inTraitArray[2]] == traitArray[2]){
                return true;
            }})
        return foundPersonByTrait

        case 4:
            foundPersonByTrait = people.filter(function(person){
                if (person[inTraitArray[0]] == traitArray[0] && person[inTraitArray[1]] == traitArray[1]
                && person[inTraitArray[2]] == traitArray[2] && person[inTraitArray[3]] == traitArray[3]){
                    return true;
                }})
            return foundPersonByTrait

        case 5:
            foundPersonByTrait = people.filter(function(person){
                if (person[inTraitArray[0]] == traitArray[0] && person[inTraitArray[1]] == traitArray[1] 
                && person[inTraitArray[2]] == traitArray[2] && person[inTraitArray[3]] == traitArray[3] &&
                    person[inTraitArray[4]] == traitArray[4]){
                    return true;
                }})
            return foundPersonByTrait

    }


}

function checkIfTrait(input){           // (helper)     Checks to validate user input for trait type
    let validInput = ["gender", "date of birth", "height", "weight", "eye color", "occupation"]
    if (validInput.includes(input.toLowerCase())){
        return true;
    }
    else {
        alert ("I'm sorry, that's not a valid input, please try again!")
        return false;
    }
}

function changeTraitType(input){            // (helper)    Changes user input trait type to return trait type with requested format
    if (input === 'date of birth'){
        input = 'date of birth (mm/dd/yyyy)'
        return input
    }
    else if (input === 'height'){
        input = 'height (in inches)'
        return input
    }
    else if (input === 'weight'){
        input = 'weight (in pounds)'
        return input
    }
    else return input
}

function checkTraitToSearchBy(input){           // (helper)     Changes user input to properly work with data.js
    if (input === 'eye color'){
        input = 'eyeColor'
        return input
    }
    else if (input === 'date of birth'){
        input = 'dob'
        return input
    }
    else return input
}
function checkTraitType (input, inputType){             // (helper)     Checks user input trait to validate based on user input trait type
    switch (inputType){
        case 'gender':
            return (input.toLowerCase() === 'male' || input.toLowerCase() === 'female')
        case 'date of birth':
            // Pulled this function from a google search to return false if there's not 2 "/".
            function countSlashes(str) {
                let count = 0;
            
                // looping through the items
                for (let i = 0; i < str.length; i++) {
            
                    // check if the character is at that position
                    if (str.charAt(i) == '/') {
                        count++;
                    }
                }
                return count;
            }
            let numberOfSlashes = countSlashes(input)
            if (numberOfSlashes !== 2){
                return false
            }
            let inputArray = input.split('/')
            let month = parseInt(inputArray[0])
                if (month > 12){
                    alert ('There aren\'t that many months in a year!')
                    return false
                }
            let day = parseInt(inputArray[1])
                if (day > 31){
                    alert ('There can\'t be that many days in a month!')
                    return false
                }
            let year = parseInt(inputArray[2])
            if (!isNaN(month) && !isNaN(day) && !isNaN(year)){
                return true
            }

            return true    
        case 'height':
            if (isNaN(input)){
                return false
            }
            else return true
        case 'weight':
            if (isNaN(input)){
                return false
            }
            else return true
        case 'eye color':
            if (input === 'brown' || input === 'blue' || input === 'green' || input === 'hazel' || input === 'black'){
                return true
            }
            else return false
        case 'occupation':
            if (isNaN(input)){
                return true
            }
    }
}

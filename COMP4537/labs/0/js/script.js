// Id names and classnames
const btnId = "btn_";
const buttonsClassName = "buttons";
const labelId = "label_"
const labelString = "label";

// Element names
const createButtonElement = "button";
const createPElement = "p";

// Attributes
const padWithPX = "px";
const fullOpacity = "100%";
const emptyString = "";
const padWithZero = "0";
const hexCodeHashtag = "#";

// Display attributes
const displayNone = "none";
const displayFlex = "flex";
const absolutePosition = "absolute";

// Names of elements in document
const grabWrap = "wrap";
const grabGameWrap = "gameWrap";
const grabPrompt = "prompt";
const grabQuestion = "question";
const grabSubmitButton = "submitButton";
const grabGameForm = "gameForm";
const grabNumOfButtons = "numOfButtons";

// Event names
const clickEvent = "click";
const submitEvent = "submit";
const domContentLoadedEvent = "DOMContentLoaded";

class ButtonLabel {
    constructor(id, label) {
        this.id = id;
        this.label = label;
    }

    /**
     * Creating a p element and setting its text content as the label.
     * @returns 
     */
    createLabel() {
        const pElement = document.createElement(createPElement);
        pElement.id = labelId + this.id;
        pElement.classList.add(btnId + labelString);
        pElement.textContent = this.label
        return pElement;
    }

    /**
     * Hiding the label by setting its opacity to 0.
     */
    hideLabel() {
        const me = document.getElementById(labelId + this.id);
        me.style.opacity = 0;
    }

    /**
     * Displaying the label by setting its opacity to 100.
     */
    displayLabel() {
        const me = document.getElementById(labelId + this.id);
        me.style.opacity = fullOpacity;
    }

}

class Button {
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.number = new ButtonLabel(id, id);
    }

    /**
     * Creates a new button element with its attributes, returns the newly made button element.
     */
    createButton() {
        const button = document.createElement(createButtonElement);
        button.id = btnId + this.id;
        button.style.backgroundColor = this.color;
        button.classList.add(buttonsClassName);
        const label = this.number.createLabel(); // creating label and appending it to button
        button.append(label);  
        return button;
    }

    /**
     * Sets new location attribute values. 
     */
    setLocationAttribute(top, left) {
        this.top = top;
        this.left = left;
    }

    /**
     * Sets new location of this button on screen.
     */
    setLocation(top, left) {
        this.setLocationAttribute(top, left);
        const me = document.getElementById(btnId + this.id);
        me.style.position = absolutePosition;
        me.style.top = this.top + padWithPX;
        me.style.left = this.left + padWithPX;
    }

    /**
     * Generating a random coordinate that does not exceed the maximum range.
     */
    generateRandomCoord(max) {
        return Math.floor(Math.random() * max);
    }

    /**
     * Moves this button in a random position.
     */
    moveRandomly() {
        const me = document.getElementById(btnId + this.id);

        // Calculating the maximum left range by doing width of browser - width of button so that it doesn't go out of screen
        const maxWidth = document.getElementById(grabWrap).clientWidth - me.clientWidth;
        // Same logic as maxWidth, but for the maximum top range
        const maxHeight = window.innerHeight - me.clientHeight;

        // Setting location with the random coordinates.
        this.setLocation(
            this.generateRandomCoord(maxHeight),
            this.generateRandomCoord(maxWidth)
        );
    }
}

class Game {
    constructor() {
        this.resetAttributes();
    }

    /**
     * Resets all the attributes related to game play.
     */
    resetAttributes() {
        this.buttons = [];
        this.userSequence = [];
        this.numberOfButtons = 0;
    }

    /**
     * Resets game board (removes user input form from screen, removes everything in game board)
     */
    resetGame() {
        this.resetAttributes();
        document.getElementById(grabPrompt).style.display = displayNone;
        document.getElementById(grabGameWrap).innerHTML = emptyString;
    }

    /**
     * Resets game to allow users to replay (displays user input again, removes everything in game board)
     */
    endGame() {
        this.resetAttributes();
        document.getElementById(grabPrompt).style.display = displayFlex;
        document.getElementById(grabGameWrap).innerHTML = emptyString;
    }

    /**
     * I asked chatGPT to give me a short code that generates a random hex color code.
     * 
     * Generates a random hex color code.
     * 1. Generates a random number between 0 and 0xFFFFFF (maximum value for hex color).
     * 2. Converting the random number into an integer, not a float.
     * 3. Convert the number into a hexadecimal string.
     * 4. Pad with leading zeros if necessary to make sure it's 6 characters long.
     */
    generateRandomColor() {
        return hexCodeHashtag + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, padWithZero);
    }

    /**
     * Creates n numbers of buttons, and adds them to the list of buttons.
     */
    createButtons(n) {
        for (let i = 0; i < n; i++) {
            const color = this.generateRandomColor();
            this.buttons.push(new Button(i + 1, color));
        }
    }

    /**
     * Creating the button elements inside the game area.
     */
    displayButtons() {
        const gameArea = document.getElementById(grabGameWrap);
        this.buttons.forEach((btn) => {
            gameArea.appendChild(btn.createButton());
        });
    } 

    /**
     * Hides the number of all buttons.
     */
    hideAllNumbers() {
        this.buttons.forEach((btn) => {
            btn.number.hideLabel();
        });
    }

    /**
     * Displays the number of all buttons.
     */
    displayAllNumbers() {
        this.buttons.forEach((btn) => {
            btn.number.displayLabel();
        });
    }

    /**
     * Starts the random movement of the buttons.
     */
    startRandomMovement() {
        this.buttons.forEach((btn) => {
            btn.moveRandomly();
        });
    }
    
    /**
     * Repeats the random movement n times in 2 second interval.
     */
    repeatRandomMovement(n) {
        let count = 0;
        let interval = setInterval(() => {
            count += 1;
            // when counter reaches n, hide button labels, make buttons clickable, escape out of interval
            if (count >= n) { 
                this.hideAllNumbers();
                this.makeButtonsClickable();
                clearInterval(interval);
            }
            // If counter didn't reach n yet, keep moving the buttons around
            this.startRandomMovement();
        }, 2000);
    }

    /**
     * Making all buttons clickable.
     */
    makeButtonsClickable() {
        this.buttons.forEach((btn) => {
            const buttonElement = document.getElementById(btnId + btn.id);
            buttonElement.addEventListener(clickEvent, () => this.handleButtonClick(btn));
        });
    }

    /**
     * Removes clickability of a specific button.
     */
    removeClickability(button) {
        const buttonElement = document.getElementById(btnId + button.id);
        buttonElement.disabled = true; // Disable the button
    }

    /**
     * Click event of a button.
     */
    handleButtonClick(button) {
        // Add the current button to the list of user sequence
        this.userSequence.push(button);
        // Grabbing the length of userSequence
        let currentIndex = this.userSequence.length;
        
        // Displaying, and disabling clickability of the label of the clicked button
        button.number.displayLabel();
        this.removeClickability(button);

        // If currentIndex equals the number of buttons we have, the user got the sequence correct.
        if (currentIndex === this.numberOfButtons) { 
            // Using setTimeout for half a second to give browser time to display the button clicked last.
            setTimeout(() => {
                this.displayWinMessage();
                this.endGame();
            }, 500);
        }else if (currentIndex != button.id) {
            // If currentIndex doesn't equal the id number of the clicked button, the user clicked the wrong button.
            this.displayAllNumbers();
            // Using setTimeout for half a second to give browser time to display each button's number
            setTimeout(() => {
                this.displayWrongMessage();
                this.endGame();
            }, 500);
        }
    }

    /**
     * Displays when the user clicks the wrong button.
     */
    displayWrongMessage() {
        alert(messages.wrongMessage); 
    }

    /**
     * Displays when the user gets all sequence correct.
     */
    displayWinMessage() {
        alert(messages.winMessage);
    }

    /**
     * Starts game.
     */
    startGame(n) {
        this.resetGame();
        this.createButtons(n);
        this.numberOfButtons = this.buttons.length;
        this.displayButtons();
        // Wait n seconds before moving buttons around
        setTimeout(() => {
            this.repeatRandomMovement(n);
        }, (n-2) * 1000);
    }
}

class UI {
    constructor() {
        this.game = new Game();
        this.init();
    }

    /**
     * Initializes UI
     */
    init() {
        // Display prompt ("How many buttons to create?")
        document.getElementById(grabQuestion).innerHTML = messages.inputPrompt; 
        // Display game start button ("Go!")
        document.getElementById(grabSubmitButton).innerHTML = messages.gameStartBtn;
        // Add submit event to form
        document.getElementById(grabGameForm).addEventListener(submitEvent, (e) => this.handleFormSubmit(e)); 
    }

    /**
     * Input validation to make sure only 3 - 7 buttons are generated.
     */
    validateInput(n) {
        if (n >= 3 && n <= 7) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Start game if input is valid, alert user if invalid.
     * @param {*} e 
     */
    handleFormSubmit(e) {
        e.preventDefault(); // preventing default submit behavior
        const input = document.getElementById(grabNumOfButtons);
        const n = parseInt(input.value);
        if (this.validateInput(n)) {
            this.game.startGame(n); // start game if input is valid
        } else {
            alert(messages.promptError); // alert user for valid input
        }
    }   
}
  
// Initialize the UI
document.addEventListener(domContentLoadedEvent, () => {
    new UI();
});
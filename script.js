//^^^^^^^        /^^^^           /^       /^^^^^^^    /^^   /^^  
//^^    /^^    /^^    /^^       /^ ^^     /^^    /^^  /^^  /^^   
//^^    /^^  /^^        /^^    /^  /^^    /^^    /^^  /^^ /^^    
//^ /^^      /^^        /^^   /^^   /^^   /^ /^^      /^ /^      
//^^  /^^    /^^        /^^  /^^^^^^ /^^  /^^  /^^    /^^  /^^   
//^^    /^^    /^^     /^^  /^^       /^^ /^^    /^^  /^^   /^^  
//^^      /^^    /^^^^     /^^         /^^/^^      /^^/^^     /^^

// A project by Simon Freund with code by Marcello Curto

// Default setup
let cardsSelected = '6'
let modeSelected = 'single'
let deckSelected = 'p'
let deckName = 'portfolio'

// Check for different configuration
const newString = location.pathname.replace('/', '').split('-')
cardsSelected = newString[0] ? newString[0] : cardsSelected
modeSelected = newString[1] ? newString[1] : modeSelected
deckSelected = newString[2] ? newString[2] : deckSelected

const imageSizes = [480, 640]
const suffixImage = '.jpg'

const pathFrontCard = './images/cards/front/simon_freund_pairs'
const altTextFrontCard = 'pairs - verdeckt'
let pathBackCard = './images/cards/portfolio/simon_freund_pairs_portfolio_'
const altTextBackCard = 'pairs - aufgedeckt'

let cardsASuffix = ''
let cardsBSuffix = ''
let maxNumbersOfRows = 8
let maxNumbersOfMotifs = 37

if (deckSelected === 'p') {
    pathBackCard = './images/cards/portfolio/simon_freund_pairs_portfolio_'
    maxNumbersOfRows = 8
    maxNumbersOfMotifs = 37
    cardsASuffix = ''
    cardsBSuffix = ''
    deckName = 'portfolio'
}
if (deckSelected === 'a') {
    pathBackCard = './images/cards/allipossess/simon_freund_pairs_allipossess_'
    maxNumbersOfRows = 24
    maxNumbersOfMotifs = 329
    cardsASuffix = ''
    cardsBSuffix = ''
    deckName = 'allipossess.com'
}
if (deckSelected === 'm') {
    pathBackCard = './images/cards/mitoderohne/simon_freund_mit_oder_ohne_'
    maxNumbersOfRows = 8
    maxNumbersOfMotifs = 32
    cardsASuffix = '_A'
    cardsBSuffix = '_B'
    deckName = 'mit oder ohne'
}

// Build scoreboard based on mode
const scoreboardElement = document.getElementById('scoreboard')
if (modeSelected === 'duel') {
    // Player 1 Elements
    const player1ScoreWrapper = document.createElement('div')
    player1ScoreWrapper.id = 'player-1'
    player1ScoreWrapper.classList.add('active-player')

    const player1Name = document.createElement('div')
    player1Name.id = 'scoreboard-player-1'
    player1Name.contentEditable = true
    player1Name.innerText = 'PLAYER A'

    const player1ScoreOri = document.createElement('div')
    player1ScoreOri.id = 'scoreboard-player-1-score'
    player1ScoreOri.innerText = '0'

    player1ScoreWrapper.appendChild(player1Name)
    player1ScoreWrapper.appendChild(player1ScoreOri)

    // Player 2 Elements
    const player2ScoreWrapper = document.createElement('div')
    player2ScoreWrapper.id = 'player-2'

    const player2Name = document.createElement('div')
    player2Name.id = 'scoreboard-player-2'
    player2Name.contentEditable = true
    player2Name.innerText = 'PLAYER B'

    const player2ScoreOri = document.createElement('div')
    player2ScoreOri.id = 'scoreboard-player-2-score'
    player2ScoreOri.innerText = '0'

    player2ScoreWrapper.appendChild(player2Name)
    player2ScoreWrapper.appendChild(player2ScoreOri)

    // Add players to scoreboard
    scoreboardElement.appendChild(player1ScoreWrapper)
    scoreboardElement.appendChild(player2ScoreWrapper)

} else {
    // Single player mode
    const singleModePlayerScore = document.createElement('div')
    singleModePlayerScore.id = 'scoreboard-score'
    singleModePlayerScore.innerText = '0'

    const singleModePlayerTimer = document.createElement('div')
    singleModePlayerTimer.id = 'scoreboard-timer'
    singleModePlayerTimer.innerText = '00:00'

    scoreboardElement.appendChild(singleModePlayerScore)
    scoreboardElement.appendChild(singleModePlayerTimer)
}

// Set up board
const boardgameElement = document.getElementById('boardgame')
const numberOfRowsSelected = parseInt(cardsSelected, 10)
const numberOfRows = numberOfRowsSelected > maxNumbersOfRows ? maxNumbersOfRows : numberOfRowsSelected
const evenNumberOnly = numberOfRows % 2 === 0 ? numberOfRows : numberOfRows + 1
const numberOfMotifs = (evenNumberOnly * evenNumberOnly) / 2

boardgameElement.style.gridTemplateColumns = `repeat(${evenNumberOnly}, 1fr)`

const randomNumbers = new Array(maxNumbersOfMotifs).fill().map((a, i) => a = i + 1).sort(() => Math.random() - 0.5)

for (let indexImages = 1; indexImages <= numberOfMotifs; indexImages++) {
    // Create Card Element 1
    const cardElement1 = document.createElement('div')
    cardElement1.classList.add('card')
    cardElement1.dataset.img = 'img-' + indexImages

    // Create Card Element 2
    const cardElement2 = document.createElement('div')
    cardElement2.classList.add('card')
    cardElement2.dataset.img = 'img-' + indexImages

    // Create Card Front Element 1
    const cardFrontElement1 = document.createElement('img')
    cardFrontElement1.classList.add('card-front')
    cardFrontElement1.alt = altTextFrontCard
    cardFrontElement1.src = pathFrontCard + suffixImage
    cardFrontElement1.srcset = pathFrontCard + '_' + imageSizes[0] + suffixImage + ' ' + imageSizes[0] + 'w, ' + pathFrontCard + '_' + imageSizes[1] + suffixImage + ' ' + imageSizes[1] + 'w'

    // Create Card Front Element 2
    const cardFrontElement2 = document.createElement('img')
    cardFrontElement2.classList.add('card-front')
    cardFrontElement2.alt = altTextFrontCard
    cardFrontElement2.src = `${pathFrontCard}.jpg`
    cardFrontElement2.srcset = pathFrontCard + '_' + imageSizes[0] + suffixImage + ' ' + imageSizes[0] + 'w, ' + pathFrontCard + '_' + imageSizes[1] + suffixImage + ' ' + imageSizes[1] + 'w'

    // Create Card Back Element 1
    const cardBackElement1 = document.createElement('img')
    cardBackElement1.classList.add('card-back')
    cardBackElement1.alt = altTextBackCard
    cardBackElement1.src = pathBackCard + randomNumbers[indexImages] + cardsASuffix + suffixImage
    cardBackElement1.srcset = pathBackCard + randomNumbers[indexImages] + cardsASuffix + '_' + imageSizes[0] + suffixImage + ' ' + imageSizes[0] + 'w, ' + pathBackCard + randomNumbers[indexImages] + cardsASuffix + '_' + imageSizes[1] + suffixImage + ' ' + imageSizes[1] + 'w'

    // Create Card Back Element 2
    const cardBackElement2 = document.createElement('img')
    cardBackElement2.classList.add('card-back')
    cardBackElement2.alt = altTextBackCard
    cardBackElement2.src = pathBackCard + randomNumbers[indexImages] + cardsBSuffix + suffixImage
    cardBackElement2.srcset = pathBackCard + randomNumbers[indexImages] + cardsBSuffix + '_' + imageSizes[0] + suffixImage + ' ' + imageSizes[0] + 'w, ' + pathBackCard + randomNumbers[indexImages] + cardsBSuffix + '_' + imageSizes[1] + suffixImage + ' ' + imageSizes[1] + 'w'

    // Add elements to board
    cardElement1.appendChild(cardFrontElement1)
    cardElement1.appendChild(cardBackElement1)
    cardElement2.appendChild(cardFrontElement2)
    cardElement2.appendChild(cardBackElement2)

    boardgameElement.appendChild(cardElement1)
    boardgameElement.appendChild(cardElement2)

}

// Get all the card elements and put them into an array
const cards = [...document.getElementsByClassName("card")]
const duelMode = document.getElementById('player-2')

// Find out how long the cards array is
const numberOfElements = cards.length
const numberOfUniqueCards = numberOfElements / 2

const singlePlayerScoreElement = document.getElementById('scoreboard-score')
const timerCounter = document.getElementById('scoreboard-timer')

// Define variables and set them to a default value
let singlePlayerScore = 0
let successEvents = 0

const player1Element = document.getElementById('player-1')
const player1ScoreElement = document.getElementById('scoreboard-player-1-score')

const player2Element = document.getElementById('player-2')
const player2ScoreElement = document.getElementById('scoreboard-player-2-score')

let player1Score = 0
let player2Score = 0

let player1Active = true
let player2Active = false

let timerID = 0
let timerRunning = false

let hasFlippedCard = false
let lockBoard = false
let firstCard = false
let firstCardBuffer = false
let secondCard = false
let secondCardBuffer = false

// Generate random number for each card to randomly order the cards
cards.forEach(card => {
    let randomNumber = Math.floor(Math.random() * numberOfElements)
    card.style.order = randomNumber
})

function flipCard() {
    if (!timerRunning && timerCounter) { timerID = startTimer(); timerRunning = true }
    if (lockBoard) return
    if (this === firstCard) return
    this.classList.add('flip')
    if (!hasFlippedCard) { hasFlippedCard = true; firstCard = this; return }
    secondCard = this
    checkForMatch()
}

function checkForMatch() {
    if (!duelMode) { updateSinglePlayerScore() }
    if (firstCard.dataset.img === secondCard.dataset.img) { disableCards() }
    else { unflipCards() }
}

// Disable cards after successful match has been found
function disableCards() {
    lockBoard = true
    firstCard.removeEventListener('click', flipCard)
    secondCard.removeEventListener('click', flipCard)

    if (duelMode) { updatePlayerScores() }

    // Hide the pair of cards from the board
    setTimeout(() => {
        firstCard.classList.add('done')
        secondCard.classList.add('done')
        resetBoard()
    }, 1000)
    if (!duelMode) {

        successEvents++

        // If all cards have been turned, end the game
        if (successEvents === numberOfUniqueCards) {
            clearInterval(timerID)
            emojiRain()
            removeBoard()
            addPlaque()
            return
        }
    }
    if (duelMode) {
        if ((player1Score + player2Score) === numberOfElements / 2) {
            emojiRain()
            removeBoard()
            addPlaque()
            return
        }
    }
}

// Unflip cards if not a matching pair
function unflipCards() {
    lockBoard = true
    firstCardBuffer = firstCard
    secondCardBuffer = secondCard
    setTimeout(() => { resetBoard() }, 500)
    setTimeout(() => {
        firstCardBuffer.classList.remove('flip')
        secondCardBuffer.classList.remove('flip')
    }, 1000)
    if (duelMode) {
        if (player1Active === true) {
            player1Active = false
            player2Active = true
            player1Element.classList.toggle('active-player')
            player2Element.classList.toggle('active-player')

        } else {
            player1Active = true
            player2Active = false
            player1Element.classList.toggle('active-player')
            player2Element.classList.toggle('active-player')
        }
    }
}

// Reset variables to default state
function resetBoard() {
    hasFlippedCard = false
    lockBoard = false
    firstCard = false
    secondCard = false
}

function updateSinglePlayerScore() {
    singlePlayerScore++
    singlePlayerScoreElement.innerText = singlePlayerScore
}

function updatePlayerScores() {
    if (player1Active === true) {
        player1Score++
        player1ScoreElement.innerText = player1Score
    }
    if (player2Active === true) {
        player2Score++
        player2ScoreElement.innerText = player2Score
    }
}

// Set starting variables for stopwatch
let minutes = 0
let seconds = 0
let secondsAsString = '00'
let minutesAsString = '00'

// Starts the stopwatch
let startTimer = () => setInterval(timerLogic, 1000)

// Logic behind the stopwatch
let timerLogic = () => {
    if (seconds === 59) { minutes++; seconds = 0 } else { seconds++ }
    seconds < 10 ? secondsAsString = '0' + seconds.toString() : secondsAsString = seconds.toString()
    minutes < 10 ? minutesAsString = '0' + minutes.toString() : minutesAsString = minutes.toString()
    timerCounter.textContent = minutesAsString + ":" + secondsAsString
}

// Clear the scoreboard to make place for the gallery
const removeBoard = () => {
    setTimeout(() => { boardgameElement.remove() }, 1000)
}

// Add plaque after ending the game
const addPlaque = () => {
    // Wrapper Element
    const plaqueWrapperElement = document.createElement('div')
    plaqueWrapperElement.id = 'plaque-wrapper'

    // Emoji Element
    const plaqueEmoji = document.createElement('p')
    plaqueEmoji.id = 'plaque-emoji'
    plaqueEmoji.innerText = '👻'

    // Text Element
    const plaqueText = document.createElement('p')
    plaqueText.id = 'plaque-text'
    plaqueText.innerText = `Congratulations. You've finished the deck ${deckName} with ${evenNumberOnly * evenNumberOnly} cards.`

    plaqueWrapperElement.appendChild(plaqueEmoji)
    plaqueWrapperElement.appendChild(plaqueText)

    document.body.appendChild(plaqueWrapperElement)
}

// Listen for clicks on card and then execute flipCard function
cards.forEach(cardClicked => cardClicked.addEventListener('click', flipCard))

// Open and close the menu
const overlayMenu = document.getElementById('overlay-menu')
function openMenu() { overlayMenu.style.display = 'flex' }
function closeMenu() { overlayMenu.style.display = 'none' }

const playGame = document.getElementById('scoreboard-sub-menu-play')
if (playGame) {
    // Select number of cards
    const select64 = document.getElementById('select-64')
    const select36 = document.getElementById('select-36')
    const select16 = document.getElementById('select-16')

    const arraySelectCards = [select64, select36, select16]

    arraySelectCards.forEach(selection => {
        if (selection.dataset.cards === cardsSelected) { selection.style.color = 'black' }
        selection.addEventListener('click', () => {
            cardsSelected = selection.dataset.cards
            selection.style.color = 'black'
            arraySelectCards.forEach(element => {
                if (selection != element) { element.style.color = 'blue' }
            })
        })
    })

    // Select game mode
    const selectSingleMode = document.getElementById('select-single')
    const selectDuelMode = document.getElementById('select-duel')

    const arraySelectMode = [selectSingleMode, selectDuelMode]

    arraySelectMode.forEach(selection => {
        if (selection.dataset.mode === modeSelected) { selection.style.color = 'black' }
        selection.addEventListener('click', () => {
            modeSelected = selection.dataset.mode
            selection.style.color = 'black'
            arraySelectMode.forEach(element => {
                if (selection != element) { element.style.color = 'blue' }
            })
        })
    })

    // Select deck
    const selectMit = document.getElementById('select-m')
    const selectAll = document.getElementById('select-a')
    const selectPort = document.getElementById('select-p')
    const arrayDeck = [selectMit, selectAll, selectPort]

    arrayDeck.forEach(selection => {
        if (selection.dataset.deck === deckSelected) { selection.style.color = 'black' }
        selection.addEventListener('click', () => {
            deckSelected = selection.dataset.deck
            selection.style.color = 'black'
            arrayDeck.forEach(element => {
                if (selection != element) { element.style.color = 'blue' }
            })
        })
    })

    // Start game
    const playButton = document.getElementById('scoreboard-sub-menu-play')
    playButton.addEventListener('click', () => {
        playButton.href = `/${cardsSelected}-${modeSelected}-${deckSelected}`
    })
}

function emojiRain() {
    // Original code by Robert Heiser & Rachel Smith. Modified by Marcello Curto.
    const animateWrapper = document.createElement('div')
    animateWrapper.id = 'animate-wrapper'
    document.body.appendChild(animateWrapper)

    const animateCanvas = document.createElement('div')
    animateCanvas.id = 'animate-canvas'
    animateWrapper.appendChild(animateCanvas)

    const animateObject = document.createElement('div')
    animateObject.id = 'animate-object'
    animateCanvas.appendChild(animateObject)

    const emoji = ['👻'];
    let circles = [];

    for (let i = 0; i < 15; i++) {
        addCircle(i * 150, [10 + 0, 300], emoji[Math.floor(Math.random() * emoji.length)])
        addCircle(i * 150, [10 + 0, -300], emoji[Math.floor(Math.random() * emoji.length)])
        addCircle(i * 150, [10 - 200, -300], emoji[Math.floor(Math.random() * emoji.length)])
        addCircle(i * 150, [10 + 200, 300], emoji[Math.floor(Math.random() * emoji.length)])
        addCircle(i * 150, [10 - 400, -300], emoji[Math.floor(Math.random() * emoji.length)])
        addCircle(i * 150, [10 + 400, 300], emoji[Math.floor(Math.random() * emoji.length)])
        addCircle(i * 150, [10 - 600, -300], emoji[Math.floor(Math.random() * emoji.length)])
        addCircle(i * 150, [10 + 600, 300], emoji[Math.floor(Math.random() * emoji.length)])
    }

    function addCircle(delay, range, color) {
        setTimeout(function () {
            let c = new Circle(range[0] + Math.random() * range[1], 80 + Math.random() * 4, color, {
                x: -0.15 + Math.random() * 0.3,
                y: 1 + Math.random() * 1
            }, range)
            circles.push(c)
        }, delay)
    }

    function Circle(x, y, c, v, range) {
        let _this = this
        this.x = x
        this.y = y
        this.color = c
        this.v = v
        this.range = range
        this.element = document.createElement('span')
        this.element.style.opacity = 0
        this.element.style.position = 'absolute'
        this.element.style.fontSize = '26px'
        this.element.style.color = 'hsl(' + (Math.random() * 360 | 0) + ',80%,50%)'
        this.element.innerHTML = c
        animateObject.appendChild(this.element)

        this.update = function () {
            _this.y += _this.v.y
            _this.x += _this.v.x
            this.element.style.opacity = 1
            this.element.style.transform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)'
            this.element.style.webkitTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)'
            this.element.style.mozTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)'
        }
    }

    function animate() {
        for (let i in circles) {
            circles[i].update()
        }
        requestAnimationFrame(animate)
    }

    animate()
}
//^^^^^^^        /^^^^           /^       /^^^^^^^    /^^   /^^  
//^^    /^^    /^^    /^^       /^ ^^     /^^    /^^  /^^  /^^   
//^^    /^^  /^^        /^^    /^  /^^    /^^    /^^  /^^ /^^    
//^ /^^      /^^        /^^   /^^   /^^   /^ /^^      /^ /^      
//^^  /^^    /^^        /^^  /^^^^^^ /^^  /^^  /^^    /^^  /^^   
//^^    /^^    /^^     /^^  /^^       /^^ /^^    /^^  /^^   /^^  
//^^      /^^    /^^^^     /^^         /^^/^^      /^^/^^     /^^

// A project by Simon Freund with code by Marcello Curto

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

let galleryIntervalID = 0
let galleryRunning = false

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
            removeBoard()
            addGallery()
            return
        }
    }
    if (duelMode) {
        if ((player1Score + player2Score) === numberOfElements / 2) {
            removeBoard()
            addGallery()
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

let galleryImageOrder = -1
let galleryImageType = 'A'

// Array with URLs of the gallery
let galleryImageURLs = []

// Create URLs to use in the gallery
function createGalleryImageURLs() {
    for (let index = 1; index < 33; index++) {
        let imageNumber = 1
        if (index > 9) { imageNumber = index }
        else { imageNumber = '0' + index.toString() }
        const imageASrc = './images/gallery/simon_freund_mit_oder_ohne_Polaroid_' + imageNumber + '_A_640.jpg'
        const imageBSrc = './images/gallery/simon_freund_mit_oder_ohne_Polaroid_' + imageNumber + '_B_640.jpg'
        galleryImageURLs.push(imageASrc)
        galleryImageURLs.push(imageBSrc)
    }
}

createGalleryImageURLs()

function waitForImagesToLoadClick() {
    document.getElementById('img-gallery').onload = () => {
        nextImage()
    }
}

function waitForImagesToLoadAutomatic() {
    document.getElementById('img-gallery').onload = () => {
        nextImageAutomatic()
    }
}

function nextImage() {
    console.log('next start', galleryImageOrder);
    galleryImageOrder++
    if (galleryRunning) { galleryRunning = false; clearInterval(galleryIntervalID) }
    if (galleryImageOrder > 63) { galleryImageOrder = 0 }
    document.getElementById('img-gallery').src = galleryImageURLs[galleryImageOrder]
    console.log('before plus', galleryImageOrder);

    console.log('after plus', galleryImageOrder);
}

function prevImage() {
    console.log('prev start', galleryImageOrder);
    galleryImageOrder--
    if (galleryRunning) { galleryRunning = false; clearInterval(galleryIntervalID) }
    if (galleryImageOrder > 63) { galleryImageOrder = 0 }
    if (galleryImageOrder < 0) { galleryImageOrder = 63 }
    document.getElementById('img-gallery').src = galleryImageURLs[galleryImageOrder]
    console.log('before minus', galleryImageOrder);

    console.log('after minus', galleryImageOrder);

}

function nextImageAutomatic() {
    if (galleryImageOrder > 63) { galleryImageOrder = 0 }
    galleryImageOrder++
    document.getElementById('img-gallery').src = galleryImageURLs[galleryImageOrder]

}

// Clear the scoreboard to make place for the gallery
const removeBoard = () => {
    const boardgameElement = document.getElementById('boardgame')
    const descriptionElement = document.getElementById('description')
    setTimeout(() => { boardgameElement.remove() }, 1000)
    setTimeout(() => { descriptionElement.remove() }, 2000)
}

function addGallery() {
    // Create Gallery Wrapper 
    const newGalleryWrapper = document.createElement('div')
    newGalleryWrapper.classList.add('gallery-wrapper')
    newGalleryWrapper.style.display = 'none'

    // Create Image Wrapper
    const newImageWrapper = document.createElement('div')
    newImageWrapper.classList.add('image-wrapper')

    // Create Gallery Navigation Elements
    const newGalleryNavLeft = document.createElement('div')
    newGalleryNavLeft.classList.add('gallery-navigation-left')

    const newGalleryNavRight = document.createElement('div')
    newGalleryNavRight.classList.add('gallery-navigation-right')


    // Create Image Element
    const newGalleryImage = document.createElement('img')
    newGalleryImage.classList.add('gallery-image')
    newGalleryImage.id = 'img-gallery'
    newGalleryImage.src = galleryImageURLs[galleryImageOrder]

    document.body.appendChild(newGalleryWrapper)
    newGalleryWrapper.appendChild(newImageWrapper)
    newGalleryWrapper.appendChild(newGalleryNavLeft)
    newGalleryWrapper.appendChild(newGalleryNavRight)
    newImageWrapper.appendChild(newGalleryImage)

    galleryIntervalID = startGalleryInterval()
    galleryRunning = true

    setTimeout(() => { newGalleryWrapper.style.display = 'flex' }, 3000)

    newGalleryNavRight.addEventListener('click', nextImage)
    newGalleryNavLeft.addEventListener('click', prevImage)
}

let startGalleryInterval = () => setInterval(nextImageAutomatic, 1000)

// Listen for clicks on card and then execute flipCard function
cards.forEach(cardClicked => cardClicked.addEventListener('click', flipCard))








// Create HTML elements that make up the cards
function elementsHTML() {
    let html = ''
    let imageNumber = 0
    const sizes = [
        { width: 320, quality: 64, suffix: "_320" },
        { width: 480, quality: 64, suffix: "_480" },
        { width: 640, quality: 64, suffix: "_640" },
    ]

    for (let i = 1; i < 33; i++) {
        if (i > 9) {
            imageNumber = i
        } else {
            imageNumber = '0' + i.toString()
        }
        html += '<div class="card" data-img="img-' + imageNumber + '">'

        html += '<img class="card-front" src="./images/cards/simon_freund_mit_oder_ohne_ravensburger.jpg" alt="mit oder ohne - verdeckt" '
        html += 'srcset="'
        sizes.forEach(size => {
            html += './images/cards/simon_freund_mit_oder_ohne_ravensburger_' + size.width + '.jpg ' + size.width + 'w,'
        })
        html += '">'

        html += '<img class="card-back" alt="mit oder ohne - aufgedeckt" src="./images/cards/simon_freund_mit_oder_ohne_' + imageNumber + '_A.jpg" '
        html += 'srcset="'
        sizes.forEach(size => {
            html += './images/cards/simon_freund_mit_oder_ohne_' + imageNumber + '_A_' + size.width + '.jpg ' + size.width + 'w,'
        })
        html += '"></div>'

        html += '<div class="card" data-img="img-' + imageNumber + '">'

        html += '<img class="card-front" src="./images/cards/simon_freund_mit_oder_ohne_ravensburger.jpg" alt="mit oder ohne - verdeckt" '
        html += 'srcset="'
        sizes.forEach(size => {
            html += './images/cards/simon_freund_mit_oder_ohne_ravensburger_' + size.width + '.jpg ' + size.width + 'w,'
        })
        html += '">'

        html += '<img class="card-back" alt="mit oder ohne - aufgedeckt" src="./images/cards/simon_freund_mit_oder_ohne_' + imageNumber + '_B.jpg" '
        html += 'srcset="'
        sizes.forEach(size => {
            html += './images/cards/simon_freund_mit_oder_ohne_' + imageNumber + '_B_' + size.width + '.jpg ' + size.width + 'w,'
        })
        html += '"></div>'


    }
    console.log(html);
}

// elementsHTML()

// Open and close the menu

const overlayMenu = document.getElementById('overlay-menu')
function openMenu() { overlayMenu.style.display = 'flex' }
function closeMenu() { overlayMenu.style.display = 'none' }

// Select the game to be played

let cardsSelected = '36'
let modeSelected = 'single'

const playGame = document.getElementById('scoreboard-sub-menu-play')
if (playGame) {
    // Select number of cards
    const select64 = document.getElementById('select-64')
    const select36 = document.getElementById('select-36')
    const select16 = document.getElementById('select-16')

    const arraySelectCards = [select64, select36, select16]

    arraySelectCards.forEach(selection => {
        if (selection.dataset.cards === cardsSelected) {
            selection.style.color = 'blue'
        }
        selection.addEventListener('click', () => {
            cardsSelected = selection.dataset.cards
            selection.style.color = 'blue'
            arraySelectCards.forEach(element => {
                if (selection != element) {
                    element.style.color = 'black'
                }
            })
        })
    })

    // Select game mode
    const selectSingleMode = document.getElementById('select-single')
    const selectDuelMode = document.getElementById('select-duel')

    const arraySelectMode = [selectSingleMode, selectDuelMode]

    arraySelectMode.forEach(selection => {
        if (selection.dataset.mode === modeSelected) {
            selection.style.color = 'blue'
        }
        selection.addEventListener('click', () => {
            modeSelected = selection.dataset.mode
            selection.style.color = 'blue'
            arraySelectMode.forEach(element => {
                if (selection != element) {
                    element.style.color = 'black'
                }
            })
        })
    })

    // Start game
    const playButton = document.getElementById('scoreboard-sub-menu-play')
    playButton.addEventListener('click', () => {
        if (modeSelected === 'single') {
            if (cardsSelected != '36') {
                playButton.href = `/${cardsSelected}`
            }
        }
        if (modeSelected === 'duel') {
            playButton.href = `/${modeSelected}-${cardsSelected}`
        }
    })

}

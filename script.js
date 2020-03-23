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
            succesScorebooard()
            emojiRain()
            removeBoard()
            addGallery()
            return
        }
    }
    if (duelMode) {
        if ((player1Score + player2Score) === numberOfElements / 2) {
            succesScorebooard()
            emojiRain()
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

// Change scoreboard elements after successful game
const succesScorebooard = () => {
    const scoreboard = document.getElementById('scoreboard')
    const newScoreItem = document.createElement('a')
    newScoreItem.href = '/'
    newScoreItem.classList.add('margin-right-normal')
    newScoreItem.appendChild(document.createTextNode('/'))
    scoreboard.insertBefore(newScoreItem, scoreboard.childNodes[0])
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
    galleryImageOrder++
    if (galleryRunning) { galleryRunning = false; clearInterval(galleryIntervalID) }
    if (galleryImageOrder > 63) { galleryImageOrder = 0 }
    document.getElementById('img-gallery').src = galleryImageURLs[galleryImageOrder]
}

function prevImage() {
    galleryImageOrder--
    if (galleryRunning) { galleryRunning = false; clearInterval(galleryIntervalID) }
    if (galleryImageOrder > 63) { galleryImageOrder = 0 }
    if (galleryImageOrder < 0) { galleryImageOrder = 63 }
    document.getElementById('img-gallery').src = galleryImageURLs[galleryImageOrder]
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

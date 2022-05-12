window.onload = function() {
    moveEnd();
    // setInterval(moveEnd, 1000)
    setInterval(update, 15)
}

let gameStarted = false;
let gameLost = false;

let handleRotation = 0;
let handleForward = true;
let handleSpeed = 1;

let endRotation = 0;

let maxDistance = 150;
let minDistance = 25;

let points = 0;

$('#pointsText').hide();

UpdateHighScoreText();

function moveEnd() {
    endRotation = Math.floor(Math.random()*(maxDistance-minDistance))+minDistance;
    endRotation += handleRotation;
    if(!handleForward) {
        endRotation = endRotation-180;
    }
    
    $('.endPos').parent().css({transform: 'translate(-50%, -50%) rotate(' +endRotation+'deg)'});
}

function update() {
    if(!gameStarted || gameLost) return;
    
    $('.handle-child').parent().css({transform: 'translate(-50%, -50%) rotate(' +handleRotation+'deg)'});
    handleRotation += handleForward ? handleSpeed : -handleSpeed;
    handleRotation = handleRotation % 360;
    
    if(handleForward) {
        if(handleRotation >= endRotation && GetDiff() > 7) {
            Lose();
        }
    }
    else {
        if (handleRotation <= endRotation && GetDiff() > 7) {
            Lose();
        }
    }
}


document.onkeydown = function(e) {
    var key = e.key;
    if (key === ' ') {
        HasClicked()
    }
}

window.onclick = function(e) {
    HasClicked()
}

function HasClicked() {
    // Reset to start if we just lost
    if(gameLost) {
        gameLost = false;
        gameStarted = false;

        $('.material-symbols-outlined').show();
        let startText = $('.startText');
        startText.show();
        startText.text('Press space or click to start');
        $('#pointsText').hide();
        points = 0;
        $('#pointsText').text(points);
        handleSpeed = 1;
        handleForward = true;
        $('.handle-child').css({animation: 'none'})
        
        return;
    }
    
    // Start the game if it hasn't started yet
    if (!gameStarted) {
        gameStarted = true;
        $('.material-symbols-outlined').hide();
        $('.startText').hide();
        $('#pointsText').show();

        handleRotation = 0;
        $('.handle-child').parent().css({transform: 'translate(-50%, -50%) rotate(0deg)'});
        moveEnd();

        return;
    }
    
    let diff = GetDiff()
    if(diff < 7) {
        points++;
        $('#pointsText').text(points);

        handleSpeed+= 0.03;
        handleForward = !handleForward;

        moveEnd();
    } else {
       Lose();
    }

}

function Lose() {
    console.log('You lose!');
    gameLost = true;
    let startText = $('.startText');
    startText.show();
    startText.text('You lose! Click to restart.');
    $('.handle-child').css({animation: 'red-blink 0.5s infinite'})

    const savedScores = localStorage.getItem('highscore') || '[]'
    const scores = JSON.parse(savedScores)
    scores.push(points)
    localStorage.setItem('highscore', JSON.stringify(scores))

    UpdateHighScoreText()
}

function UpdateHighScoreText() {
    const savedScores = localStorage.getItem('highscore') || '[]'
    const scores = JSON.parse(savedScores) // add the result
        .sort((a, b) => b- a) // sort descending
        .slice(0, 5) // take highest 5
    
    const highScoreList = $('#highScoreList')
    highScoreList.empty()
    
    scores.forEach(score => {
        highScoreList.append(`<li>- ${score}</li>`)
    });
}

function GetDiff() {
    endRotation %= 360;
    handleRotation %= 360;

    return Math.abs(endRotation - handleRotation);
}


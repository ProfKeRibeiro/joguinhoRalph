const state = {
    view: {
        squares: document.querySelectorAll('.square'),
        enemy: document.querySelector('.enemy'),
        timeLeft: document.querySelector('#time-left'),
        score: document.querySelector('#score'),
        lives: document.querySelector('#lives'), // Adiciona o elemento para exibir as vidas
    },
    values: {
        timerId: null,
        gameVelocity: 1000,
        countDownTimerId: setInterval(countDown, 1000),
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3, // Adiciona o número inicial de vidas
    }
};
// Função para contar o tempo restante
// Atualiza o tempo restante na interface
// Verifica se o tempo chegou a zero
// Se o tempo chegou a zero, encerra o jogo
function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;
    if (state.values.currentTime === 0) {
        clearInterval(state.values.countDownTimerId);
        clearInterval(state.values.timerId);
        alert('GAME OVER! Sua pontuação final ' + state.values.result);
    }
}

// Função para reduzir a vida do jogador
function decreaseLife() {
    state.values.lives--;
    state.view.lives.textContent = `x${state.values.lives}`;
    if (state.values.lives === 0) {
        clearInterval(state.values.timerId);
        clearInterval(state.values.countDownTimerId);
        alert('GAME OVER! Você perdeu todas as vidas. Pontuação final: ' + state.values.result);
        resetGame(); // Reinicia o jogo após o Game Over
    }
}

function resetGame() {
    // Reinicia os valores do estado
    state.values.lives = 3;
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.gameVelocity = 1000;

    // Atualiza a interface
    state.view.lives.textContent = `x${state.values.lives}`;
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;

    // Reinicia o jogo
    moveEnemy();
    state.values.countDownTimerId = setInterval(countDown, 1000);
}

function increaseGameVelocity() {
    if (state.values.result % 5 === 0 && state.values.result !== 0) {
        state.values.gameVelocity -= 100;
        clearInterval(state.values.timerId);
        moveEnemy();
    }
}

function playSound(audioname) {
    let audio = new Audio(`./src/audios/${audioname}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function ramdomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove('enemy');
    });
    let randomSquare = Math.floor(Math.random() * 9);
    let square = state.view.squares[randomSquare];
    square.classList.add('enemy');
    state.values.hitPosition = square.id;
}

function moveEnemy() {
    state.values.timerId = setInterval(ramdomSquare, state.values.gameVelocity);
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener('mousedown', () => {
            if (square.id === state.values.hitPosition) {
                // Jogador acertou o inimigo
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound('hit');
            } else {
                // Jogador clicou em um quadrado errado
                decreaseLife();
                playSound('miss');
            }
        });
    });
}

function init() {
    state.view.lives.textContent = `x${state.values.lives}`; // Inicializa o contador de vidas na interface
    moveEnemy();
    addListenerHitBox();
    countDown();
    setInterval(increaseGameVelocity, 1000);
}
init();
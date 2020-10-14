document.addEventListener('DOMContentLoaded', (e) => {
    const grid = document.querySelector('.grid');
    // Tous les div enfant de .grid dans un tableau
    let squares = Array.from(document.querySelectorAll('.grid div')); // squares : Array(200) = [div*200]
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];

    // Les 4 positions dans le damier du L (Équerre)
    const lTretomino = [
        [1, 2, width + 1, width * 2 + 1], // grid.div[1] grid.div[2] grid.div[11] grid.div[21]
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];
    // Les 4 positions dans le damier du Z (Escalier)
    const zTretomino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
    ];
    // Les 4 positions dans le damier du T (un T quoi)
    const tTretomino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1],
    ];
    // Les 4 positions dans le damier du CARRE
    const oTretomino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ];
    // Les 4 positions dans le damier de la BARRE
    const iTretomino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
    ]
    const theTretominos = [lTretomino, zTretomino, tTretomino, oTretomino, iTretomino];

    let currentPosition = 4; // Position au centre vertical du damier
    let currentRotation = 0;

    let random = Math.floor(Math.random() * theTretominos.length); // Nbre aléatoire entre 0 et la longueur de notre tableau theTretominos
    let current = theTretominos[random][currentRotation];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        })
    }

    // effacer le tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }

    // Assigner une fonction aux code de touches
    function control(e) {
        if (e.key === "ArrowLeft") {
            moveLeft();
        }else if (e.key === 'ArrowUp') {
            rotate();
        } else if (e.key === "ArrowRight") {
            moveRight();
        } else if (e.key === "ArrowDown") {
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze()
    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('bloque'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('bloque'));
            // Afficher le tetromino suivant
            random = nextRandom
            // faire tomber un nouveau Tetromino (on s'occupe plus du précédent alors il s'arrête)
            nextRandom = Math.floor(Math.random() * theTretominos.length);
            current = theTretominos[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // Déplacer le tetromino sur la gauche jusqu'au bord
    function moveLeft() {
        undraw();
        // current position vaudra (en allant à gauche) 4 3 2 1 0 (mur)
        // index vaudra pour le carré par exemple : 0 1 10 11
        // width vaut toujours 10
        // (4 + 0(ou 1 ou 10 ou 11) % 10 = 4(ou 5 ou 14 ou 15) (combien de fois entre 10 dans 4(ou 5 ou 14 ou 15) ? ZERO (ou une fois) mais il reste 4 (ou 5) : Ko
        // (3 + 0(ou 1 ou 10 ou 11) % 10 = 3(ou 4 ou 13 ou 14) (combien de fois entre 10 dans 3(ou 4 ou 13 ou 14) ? ZERO (ou une fois) mais il reste 3 (ou 4) : Ko
        // (2 + 0(ou 1 ou 10 ou 11) % 10 = 2(ou 3 ou 12 ou 13) (combien de fois entre 10 dans 2(ou 3 ou 12 ou 13) ? ZERO (ou une fois) mais il reste 2 (ou 3) : Ko
        // (1 + 0(ou 1 ou 10 ou 11) % 10 = 1(ou 2 ou 11 ou 12) (combien de fois entre 10 dans 1(ou 2 ou 11 ou 12) ? ZERO (ou une fois) mais il reste 3 (ou 1 ou 2) : Ko
        // (0 + 0(ou 1 ou 10 ou 11) % 10 = 0(ou 1 ou 10 ou 11) (combien de fois entre 10 dans 0(ou 1 ou 10 ou 11) ? Dans ce cas 2 solutions sont OK :
        // premièrement 0 + 0 % 10 = 0 car division par zéro = 0 donc on est OK
        // deuxièmement 0 + 10 % 10 = 1 et il reste 0 donc on est OK aussi
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if(current.some(index => squares[currentPosition + index].classList.contains('bloque'))) {
            currentPosition += 1;
        }
        draw();
    }
    // Déplacer le tetromino sur la gauche jusqu'au bord
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('bloque'))) {
            currentPosition -= 1;
        }
        draw();
    }

    // Faire tourner le tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTretominos[random][currentRotation]
        draw();
    }

    // aperçu du Tetromino suivant
    const displayNextSquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    // tetromino suivant sans rotation
    const upNextTetrominos = [
        [1, displayWidth+1, displayWidth*2+1, 2], // L
        [0, displayWidth, displayWidth+1, displayWidth*2+1], // Escalier
        [1, displayWidth, displayWidth+1, displayWidth+2], // T
        [0, 1, displayWidth, displayWidth+1], // Carré
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], // Barre
    ];

    // afficher le tetromino suivant
    function displayShape() {
        // enlever toute trace du tetromino de la grille entière
        displayNextSquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominos[nextRandom].forEach(index => {
            displayNextSquares[displayIndex + index].classList.add('tetromino');
            displayNextSquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }

    // Ajouter les fonctionnalités au bouton (start/pause)
    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000)
            // modifie le tetromino suivant (anti casu)
            nextRandom = Math.floor(Math.random()*theTretominos.length);
            displayShape();
        }
    })

    // ajouter le score
    function addScore() {
        for (let i = 0; i < 199; i+=width) {
            // ligne du jeu
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            // Si on fait une ligne complète
            if (row.every(index => squares[index].classList.contains('bloque'))) {
                // ajoute 10 pts au score
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('bloque')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // GameOver
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('bloque'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
            setTimeout(() => {
                for (let x = 0, ln = squares.length; x < ln; x++) {
                    setTimeout(function() {
                        if (!squares[x].classList.contains('bottom')) {
                            squares[x].style.backgroundColor = 'black';
                        }
                    }, x * 10, x);
                }
            }, 500);
        }
    }

});

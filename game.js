const crypto = require('crypto');

class HMACGenerator {
    constructor() {
        this.key = crypto.randomBytes(32).toString('hex');
    }

    generateHMAC(message) {
        const hmac = crypto.createHmac('sha256', this.key);
        hmac.update(message);
        return hmac.digest('hex');
    }
}

class GameRules {
    constructor(moves) {
        this.moves = moves;
        this.numMoves = moves.length;
    }

    determineWinner(playerMove, computerMove) {
        const playerIndex = this.moves.indexOf(playerMove);
        const computerIndex = this.moves.indexOf(computerMove);
        const half = Math.floor(this.numMoves / 2);

        if (playerIndex === computerIndex) {
            return "Draw";
        } else if ((computerIndex - playerIndex + this.numMoves) % this.numMoves <= half) {
            return "Lose";
        } else {
            return "Win";
        }
    }
}

class GameTable {
    constructor(moves) {
        this.moves = moves;
        this.numMoves = moves.length;
    }

    displayTable() {
        console.log(' '.repeat(10) + this.moves.join('   '));
        for (let i = 0; i < this.numMoves; i++) {
            const row = [this.moves[i]];
            for (let j = 0; j < this.numMoves; j++) {
                if (i === j) {
                    row.push('Draw');
                } else if ((j - i + this.numMoves) % this.numMoves <= Math.floor(this.numMoves / 2)) {
                    row.push('Lose');
                } else {
                    row.push('Win');
                }
            }
            
        }
    }
}

class Game {
    constructor(moves) {
        if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
            throw new Error('Invalid input. Please provide an odd number (≥ 3) of non-repeating moves.');
        }
        this.moves = moves;
        this.hmacGenerator = new HMACGenerator();
        this.rules = new GameRules(moves);
        this.table = new GameTable(moves);
    }

    play() {
        const computerMove = this.moves[Math.floor(Math.random() * this.moves.length)];
        const hmac = this.hmacGenerator.generateHMAC(computerMove);
        console.log(HMAC: ${hmac});

        while (true) {
            console.log('Available moves:');
            this.moves.forEach((move, index) => console.log(${index + 1} - ${move}));
            console.log('0 - Exit');
            console.log('? - Help');

            const userInput = require('readline-sync').question('Enter your move: ').trim();

            if (userInput === '?') {
                this.table.displayTable();
                continue;
            }

            if (userInput === '0') {
                console.log('Goodbye!');
                break;
            }

            const userMoveIndex = parseInt(userInput, 10) - 1;

            if (isNaN(userMoveIndex) || userMoveIndex < 0 || userMoveIndex >= this.moves.length) {
                console.log('Invalid input. Please try again.');
                continue;
            }

            const playerMove = this.moves[userMoveIndex];
            console.log(Your move: ${playerMove});
            console.log(Computer's move: ${computerMove});
            console.log(Result: You ${this.rules.determineWinner(playerMove, computerMove)});
            console.log(Key: ${this.hmacGenerator.key});
            break;
        }
    }
}

if (process.argv.length < 3) {
    console.log('Usage: node game.js <move1> <move2> ... <moveN>');
} else {
    try {
        const game = new Game(process.argv.slice(2));
        game.play();
    } catch (e) {
        console.error(e.message);
    }
}
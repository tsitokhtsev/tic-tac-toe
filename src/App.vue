<script setup lang="ts">
import { ref } from 'vue';
import Spot from './components/Spot.vue';
import { areEqual, isPlayerX } from './utils';

const board = ref([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
]);

const winner = ref<string | null>(null);

const currentPlayer = ref('X');

const scores: Record<string, number> = { X: 1, O: -1, tie: 0 };

const playerX = 'X';
const playerY = 'O';

async function handleStart(i: number, j: number) {
    if (!areAllSpotsAvailable()) {
        return;
    }

    board.value[i][j] = playerX;

    while (!winner.value) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        currentPlayer.value = isPlayerX(currentPlayer.value)
            ? playerY
            : playerX;
        nextMove();
        winner.value = checkWinner();
    }
}

function nextMove() {
    let bestScore = isPlayerX(currentPlayer.value) ? -Infinity : Infinity;
    let move;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board.value[i][j] === '') {
                board.value[i][j] = currentPlayer.value;
                let score = minimax(!isPlayerX(currentPlayer.value));
                board.value[i][j] = '';

                if (
                    (isPlayerX(currentPlayer.value) && score > bestScore) ||
                    (!isPlayerX(currentPlayer.value) && score < bestScore)
                ) {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }

    if (move) {
        board.value[move.i][move.j] = currentPlayer.value;
    }
}

function minimax(isMaximizer: boolean) {
    const result = checkWinner();

    if (result) {
        return scores[result];
    }

    let bestScore = isMaximizer ? -Infinity : Infinity;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board.value[i][j] === '') {
                board.value[i][j] = isMaximizer ? playerX : playerY;
                let score = minimax(!isMaximizer);
                board.value[i][j] = '';
                bestScore = isMaximizer
                    ? Math.max(score, bestScore)
                    : Math.min(score, bestScore);
            }
        }
    }

    return bestScore;
}

function checkWinner() {
    for (let i = 0; i < 3; i++) {
        if (areEqual(board.value[i][0], board.value[i][1], board.value[i][2])) {
            return board.value[i][0];
        }
    }

    for (let i = 0; i < 3; i++) {
        if (areEqual(board.value[0][i], board.value[1][i], board.value[2][i])) {
            return board.value[0][i];
        }
    }

    if (areEqual(board.value[0][0], board.value[1][1], board.value[2][2])) {
        return board.value[0][0];
    }

    if (areEqual(board.value[0][2], board.value[1][1], board.value[2][0])) {
        return board.value[0][2];
    }

    if (!areSpotsAvailable()) {
        return 'tie';
    }

    return null;
}

function areSpotsAvailable() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board.value[i][j] === '') {
                return true;
            }
        }
    }

    return false;
}

function areAllSpotsAvailable() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board.value[i][j] !== '') {
                return false;
            }
        }
    }

    return true;
}

function reset() {
    board.value = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];
    winner.value = null;
    currentPlayer.value = playerX;
}
</script>

<template>
    <div class="wrapper">
        <h1>Tic Tac Toe</h1>

        <table>
            <tr v-for="(row, i) in board" :key="i">
                <td v-for="(cell, j) in row" :key="j">
                    <Spot :spot="cell" @click="handleStart(i, j)" />
                </td>
            </tr>
        </table>

        <h2 v-if="winner">
            {{ winner === 'tie' ? 'It is a tie!' : `${winner} is a winner!` }}
        </h2>

        <button @click="reset">Reset</button>
    </div>
</template>

<style>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    button {
        padding: 10px 20px;
        font-size: 16px;
    }
}
</style>

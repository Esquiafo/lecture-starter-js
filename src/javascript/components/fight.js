import controls from '../../constants/controls';
import showWinnerModal from './modal/winner';

export function getHitPower(fighter) {
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    const power = parseInt(randomNumber * fighter.attack, 10);
    return power;
}

export function getBlockPower(fighter) {
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    const power = parseInt(randomNumber * fighter.defense, 10);
    return power;
}

export function getDamage(attacker, defender) {
    const setDefense = defender.defensivePosition
        ? parseInt(getBlockPower(defender), 10)
        : parseInt(defender.defense, 10);
    const setDamage = getHitPower(attacker);
    const calculateDefense = setDefense;
    const calculateAttack = setDamage;
    const power = calculateDefense >= calculateAttack ? 1 : parseInt(calculateAttack - calculateDefense, 10);
    defender.health -= power;
    return power;
}

export function getSpecialAttack(attacker, defender) {
    const power = attacker.attack * 2;
    defender.health -= power;
    return power;
}

export async function fight(firstFighter, secondFighter) {
    const playerOne = { ...firstFighter };
    const playerTwo = { ...secondFighter };
    playerOne.player = 'Player 1';
    playerTwo.player = 'Player 2';
    playerOne.specialMove = true;
    playerTwo.specialMove = true;
    playerOne.defensivePosition = false;
    playerTwo.defensivePosition = false;
    const maxHealthplayerOne = firstFighter.health;
    const maxHealthplayerTwo = secondFighter.health;
    const updateHealthBar = () => {
        const playerOnePercantajeHealth = (playerOne.health * 100) / maxHealthplayerOne;
        const playerTwoPercantajeHealth = (playerTwo.health * 100) / maxHealthplayerTwo;
        document.getElementById('left-fighter-indicator').style.width = `${
            playerOnePercantajeHealth <= 0 ? 0 : playerOnePercantajeHealth
        }%`;
        document.getElementById('right-fighter-indicator').style.width = `${
            playerTwoPercantajeHealth <= 0 ? 0 : playerTwoPercantajeHealth
        }%`;
    };
    return new Promise(resolve => {
        const pressedKeys = {};
        function getSpecialMoves(attacker, defender, specialCombination) {
            if (attacker.specialMove && specialCombination.every(key => pressedKeys[key])) {
                getSpecialAttack(attacker, defender);
                attacker.specialMove = false;
                setTimeout(() => {
                    attacker.specialMove = true;
                }, 10000);
            }
        }
        document.addEventListener('keypress', event => {
            pressedKeys[event.code] = true;
            if (playerOne.health <= 0 || playerTwo.health <= 0) {
                updateHealthBar();
                playerOne.health <= 0 ? resolve(playerTwo) : resolve(playerOne);
            } else {
                Object.keys(pressedKeys).forEach(() => {
                    updateHealthBar();
                    // Player 1 Controls
                    if (!pressedKeys[controls.PlayerOneBlock]) {
                        getSpecialMoves(playerOne, playerTwo, controls.PlayerOneCriticalHitCombination);
                        if (pressedKeys[controls.PlayerOneAttack]) {
                            getDamage(playerOne, playerTwo);
                            updateHealthBar();
                        }
                    } else {
                        playerOne.defensivePosition = true;
                        updateHealthBar();
                    }

                    // Player 2 Controls
                    if (!pressedKeys[controls.PlayerTwoBlock]) {
                        getSpecialMoves(playerTwo, playerOne, controls.PlayerTwoCriticalHitCombination);
                        if (pressedKeys[controls.PlayerTwoAttack]) {
                            getDamage(playerTwo, playerOne);
                            updateHealthBar();
                        }
                    } else {
                        playerTwo.defensivePosition = true;
                        updateHealthBar();
                    }
                });
            }
        });

        document.addEventListener('keyup', event => {
            Object.keys(pressedKeys).forEach(() => {
                if (pressedKeys[controls.PlayerOneBlock]) {
                    playerTwo.defensivePosition = false;
                    updateHealthBar();
                }

                if (pressedKeys[controls.PlayerTwoBlock]) {
                    playerTwo.defensivePosition = false;
                    updateHealthBar();
                }
            });
            delete pressedKeys[event.code];
            updateHealthBar();
        });
    }).then(winner => {
        return showWinnerModal(winner);
    });
}

import controls from '../../constants/controls';
import showWinnerModal from './modal/winner';

export function getHitPower(fighter) {
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    const power = randomNumber * fighter.attack;
    return power;
}

export function getBlockPower(fighter) {
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    const power = randomNumber * fighter.defense;
    return power;
}

export function getDamage(attacker, defender) {
    const defenderCopy = { ...defender };
    const damage = Math.max(1, parseInt(getHitPower(attacker), 10) - parseInt(getBlockPower(defenderCopy), 10));
    defender.health -= damage;
    return damage;
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
    const maxHealthplayerOne = firstFighter.health;
    const maxHealthplayerTwo = secondFighter.health;

    return new Promise(resolve => {
        const pressedKeys = {};

        function getSpecialMoves(attacker, defender, specialCombination) {
            if (attacker.specialMove && specialCombination.every(key => pressedKeys[key])) {
                getSpecialAttack(attacker, defender);
                attacker.specialMove = false;
                setTimeout(() => {
                    attacker.specialMove = true;
                    resolve({ attacker, defender });
                }, 10000);
            }
        }
        const updateFighterIndicators = () => {
            document.getElementById('left-fighter-indicator').style.width = `${
                (playerOne.health * 100) / maxHealthplayerOne
            }%`;
            document.getElementById('right-fighter-indicator').style.width = `${
                (playerTwo.health * 100) / maxHealthplayerTwo
            }%`;
        };
        document.addEventListener('keypress', event => {
            if (pressedKeys) updateFighterIndicators();
            if (playerOne.health <= 0 || playerTwo.health <= 0) {
                updateFighterIndicators();
                playerOne.health <= 0 ? showWinnerModal(playerTwo) : showWinnerModal(playerOne);
                resolve(null);
            } else {
                pressedKeys[event.code] = true;

                Object.keys(pressedKeys).forEach(() => {
                    if (!pressedKeys[controls.PlayerOneBlock] && !pressedKeys[controls.PlayerTwoBlock]) {
                        if (pressedKeys[controls.PlayerOneAttack]) {
                            getDamage(playerOne, playerTwo);
                            getSpecialMoves(playerOne, playerTwo, controls.PlayerOneCriticalHitCombination);
                        }
                        if (pressedKeys[controls.PlayerTwoAttack]) {
                            getDamage(playerTwo, playerOne);
                            getSpecialMoves(playerTwo, playerOne, controls.PlayerTwoCriticalHitCombination);
                        }
                    }
                });
            }
        });

        document.addEventListener('keyup', event => {
            delete pressedKeys[event.code];
        });
    });
}

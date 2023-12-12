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
    defenderCopy.health = Math.max(0, defenderCopy.health - damage);
    Object.assign(defender, { health: defenderCopy.health });
    return damage;
}

export function specialAttack(fighter) {
    const power = fighter.attack * 2;
    return power;
}

export async function fight(firstFighter, secondFighter) {
    const playerOne = { ...firstFighter };
    const playerTwo = { ...secondFighter };
    playerOne.player = 'Player 1';
    playerTwo.player = 'Player 2';
    const maxHealthplayerOne = firstFighter.health;
    const maxHealthplayerTwo = secondFighter.health;

    return new Promise(resolve => {
        const pressedKeys = {};

        document.addEventListener('keypress', event => {
            if (playerOne.health <= 0 || playerTwo.health <= 0) {
                playerOne.health <= 0 ? showWinnerModal(playerTwo) : showWinnerModal(playerOne);
                resolve(null);
            } else {
                document.getElementById('left-fighter-indicator').style.width = `${
                    (playerOne.health * 100) / maxHealthplayerOne
                }%`;
                document.getElementById('right-fighter-indicator').style.width = `${
                    (playerTwo.health * 100) / maxHealthplayerTwo
                }%`;
                pressedKeys[event.code] = true;
                // eslint-enable no-unused-expressions
                Object.keys(pressedKeys).forEach(() => {
                    if (!pressedKeys[controls.PlayerOneBlock] && !pressedKeys[controls.PlayerTwoBlock]) {
                        if (pressedKeys[controls.PlayerOneAttack]) {
                            getDamage(playerOne, playerTwo);
                        }
                        if (pressedKeys[controls.PlayerTwoAttack]) {
                            getDamage(playerTwo, playerOne);
                        }
                    }
                });
                // eslint-enable no-unused-expressions
            }
        });

        document.addEventListener('keyup', event => {
            delete pressedKeys[event.code];
        });
    });
}

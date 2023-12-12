import controls from '../../constants/controls';
import showWinnerModal from './modal/winner';

export async function fight(firstFighter, secondFighter) {
    const p1 = { ...firstFighter };
    const p2 = { ...secondFighter };
    p1.player = 'P1';
    p2.player = 'P2';

    const maxHealthP1 = firstFighter.health;
    const maxHealthP2 = secondFighter.health;

    return new Promise(resolve => {
        const pressedKeys = {};

        document.addEventListener('keypress', event => {
            if (firstFighter.health <= 0 || secondFighter.health <= 0) {
                showWinnerModal(firstFighter.health <= 0 ? secondFighter : firstFighter);
                resolve();
            } else {
                document.getElementById('left-fighter-indicator').style.width = `${
                    (firstFighter.health * 100) / maxHealthP1
                }%`;
                document.getElementById('right-fighter-indicator').style.width = `${
                    (secondFighter.health * 100) / maxHealthP2
                }%`;
                pressedKeys[event.code] = true;
                Object.keys(pressedKeys).forEach(() => {
                    if (!pressedKeys[controls.PlayerOneBlock] && !pressedKeys[controls.PlayerTwoBlock]) {
                        if (pressedKeys[controls.PlayerOneAttack]) {
                            this.getDamage(firstFighter, secondFighter);
                        }
                        if (pressedKeys[controls.PlayerTwoAttack]) {
                            this.getDamage(secondFighter, firstFighter);
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

export function getDamage(attacker, defender) {
    const damage = Math.max(0, parseInt(this.getHitPower(attacker), 10) - parseInt(this.getBlockPower(defender), 10));
    const newHealth = defender.health - damage;
    const updatedDefender = { ...defender, health: newHealth };
    return updatedDefender;
}

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

export function specialAttack(fighter) {
    const power = fighter.attack * 2;
    return power;
}

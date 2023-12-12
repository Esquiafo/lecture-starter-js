import showModal from './modal';

export default function showWinnerModal(fighter) {
    return showModal({ title: `${fighter.name} wins!`, bodyElement: `${fighter.player} has won` });
}

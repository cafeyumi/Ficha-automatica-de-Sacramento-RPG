"use strict";

const init = () => {
	updateStats(`combat`, 1);
	updateStats(`movement`, 1);
	updateStats(`life`, 6);
	updateStats(`pain`, 6);
	updateStats(`defense`, 5);
	updateStats(`physical`, 0);
	updateStats(`speed`, 0);
	updateStats(`intellect`, 0);
	updateStats(`courage`, 0);

	profile();
	trackerSystem();
	sinaButtons();
	diceSystem();
};

const ANTECEDENTS_TYPES = [
	`attention`,
	`medicine`,
	`mount`,
	`business`,
	`theft`,
	`sweat`,
	`tradition`,
	`violence`,
];
const MAIN_TYPES = [`life`, `pain`, `combat`, `movement`];
const ATTRIBUTES_TYPES = [`physical`, `speed`, `intellect`, `courage`];
const allTrackers = [...document.querySelectorAll(`.tracker`)]; // Coloca todos os Trackers em um Array

const stats = {
	baseStats: {
		life: 6,
		pain: 6,
		defense: 5,
		combat: 1,
		movement: 1,
	},

	currentStats: {
		life: 0,
		pain: 0,
		defense: 0,
		combat: 0,
		movement: 0,
	},

	bonusStats: {
		life: 0,
		pain: 0,
		defense: 0,
		combat: 0,
		movement: 0,
	},

	extraStats: {
		life: 0,
		pain: 0,
		defense: 0,
		combat: 0,
		movement: 0,
	},

	attributes: {
		physical: 0,
		speed: 0,
		intellect: 0,
		courage: 0,
	},

	experience: {
		level: 1,
		xp: 0,
	},

	antecedents: {
		attention: 0,
		medicine: 0,
		mount: 0,
		business: 0,
		theft: 0,
		sweat: 0,
		tradition: 0,
		violence: 0,
	},

	miscellany: {
		bounty: 0,
		sina: 0,
		money: 200,
	},
};

function diceSystem() {
	const diceSound = new Audio(`/src/assets/audios/dice.mp3`);
	const dices = [...document.querySelectorAll(`.dice`)];
	const getTemplate = document.querySelector(`#rollTemplate`);
	const rollsPosition = document.querySelector(`#rolls`);

	dices.forEach((dice) => {
		dice.addEventListener(`click`, (event) => {
			diceSound.currentTime = 0;
			diceSound.play();

			const diceResult = Math.floor(Math.random() * (7 - 1) + 1);
			const type = event.target.dataset.type;
			const antecedentBonus = stats.antecedents[type];
			const rollName = event.target.dataset.name;
			const rollResult = diceResult + antecedentBonus;

			const template = getTemplate.content.cloneNode(true);

			const nameInput = template.querySelector(`.rolls__title`);
			nameInput.innerHTML = rollName;

			const diceInput = template.querySelector(`.rolls__value-dice`);
			diceInput.innerHTML = diceResult;

			const bonusInput = template.querySelector(`.rolls__value-bonus`);
			bonusInput.innerHTML = antecedentBonus;

			const barrel = template.querySelector(`.barrel`);
			barrel.src = `/src/assets/images/barrel/barrel${diceResult}.png`;

			const resultInput = template.querySelector(`.rolls__value-result`);
			if (diceResult === 6) {
				resultInput.classList.add(`rolls__value--crit`);
			} else if (rollResult === 1) {
				resultInput.classList.add(`rolls__value--fail`);
			}
			resultInput.innerHTML = rollResult;

			const exit = template.querySelector(`.exit`);

			exit.addEventListener(`click`, (event) => {
				const element = event.target.parentElement.parentElement;
				element.remove();
			});

			rollsPosition.appendChild(template);

			// console.log(diceInput);

			// console.log(rollsPosition);
			// console.log(template);

			// console.log(diceResult);
			// console.log(stats.antecedents[type]);
		});
	});
	console.log(dices);
}

// ========== Função que atualiza a foto do personagem ==========
function profile() {
	const profileInput = document.querySelector(`#profileInput`);
	const profileImage = document.querySelector(`#profileImage`);
	profileInput.addEventListener(`change`, (e) => {
		profileImage.src = URL.createObjectURL(e.target.files[0]);
	});
}

// ========== Função que mecaniza os trackers via DOM e recebe seus valores ==========
function trackerSystem() {
	// Passa por todos os Trackers do Array
	allTrackers.forEach((tracker) => {
		// Coloca todos os Pips do Tracker em um Array
		const allPips = [...tracker.children];

		// ========== INICIALIZAÇÃO DO DOM DOS VALORES <- ocorre somente uma vez ==========

		const type = tracker.dataset.type; // Tipo do Tracker

		// Identificando e Inicilizando os stats principais

		if (MAIN_TYPES.includes(type)) {
			const initalStats = stats.currentStats[type];
			for (const index in allPips) {
				if (index <= initalStats - 1) {
					allPips[index].classList.add(`marked`);
				} else {
					allPips[index].classList.remove(`marked`);
				}
			}
		}

		// Identificando e Inicilizando os atributos

		if (ATTRIBUTES_TYPES.includes(type)) {
			const attributes = stats.attributes[type];
			for (const index in allPips) {
				if (index <= attributes - 1) {
					allPips[index].classList.add(`marked`);
				} else {
					allPips[index].classList.remove(`marked`);
				}
			}
		}

		// Passa por todos os Pips do Array
		allPips.forEach((pip) => {
			// Adiciona um evento de click por todos os Pips
			pip.addEventListener(`click`, (event) => {
				let i = 0; // Variavel que armazenara a posição do index que disparou o evento

				// Procura quem disparou o evento e armazena seu index
				for (const pip of allPips) {
					if (event.target === pip) break;
					i++;
				}

				// Adicina a função de marcação a todas as pips
				markSystem(allPips, i);

				// Valor total de Pips ativados
				const value = allPips.filter((pip) =>
					pip.classList.contains(`marked`),
				).length;

				// ========== ENVIO DE VALORES ==========

				updateStats(type, value); // Entrega o novo valor dado pelo usuario

				// age por cima do valor dado pelo usuario
				if (ATTRIBUTES_TYPES.includes(type)) {
					const attributeType = type;

					switch (attributeType) {
						case `physical`: {
							const lifePips = [...document.querySelector(`#life`).children];
							markSystem(lifePips, stats.currentStats.physical - 1);
							break;
						}
						case `speed`: {
							const speedPips = [
								...document.querySelector(`#movement`).children,
							];
							markSystem(speedPips, stats.currentStats.movement - 1);
							break;
						}
						case `intellect`: {
							break;
						}
						case `courage`: {
							const combatPips = [
								...document.querySelector(`#combat`).children,
							];
							markSystem(combatPips, stats.currentStats.combat - 1);
							break;
						}
					}
				}
				updateStats(type, value);

				const extras = [...document.querySelectorAll(`.extra`)];
				extras.forEach((extra) => {
					const extraType = extra.dataset.for;
					extra.attributes.value.value = stats.extraStats[extraType];
				});
			});
		});
	});
}

// ========== Função que mecaniza os botões de Sina via DOM e recebe seus valores ==========
function sinaButtons() {
	const sinaBtns = [...document.querySelectorAll(`.sina-cards__button`)];
	const minusBtn = document.querySelector(`#minus`);

	if (stats.miscellany.sina === 0) {
		minusBtn.classList.add(`sina-cards__button--blocked`);
	}

	sinaBtns.forEach((button) => {
		button.addEventListener(`click`, (event) => {
			if (event.target.id === `plus`) {
				stats.miscellany.sina += 1;
			} else {
				if (stats.miscellany.sina > 0) {
					stats.miscellany.sina -= 1;
				}
			}
			if (stats.miscellany.sina <= 0) {
				minusBtn.classList.add(`sina-cards__button--blocked`);
			} else {
				minusBtn.classList.remove(`sina-cards__button--blocked`);
			}

			updateStats();
		});
	});
}

// ========== Função que controla o sistema dos Trackers ==========
function markSystem(allPips, value) {
	for (let index in allPips) {
		index = Number(index); // o index por padrão vem como string, aqui forço ele a virar um Number
		if (index < value) {
			allPips[index].classList.add(`marked`);
		} else if (index === value) {
			if (index !== 0) {
				if (index !== allPips.length - 1) {
					if ([...allPips[value + 1].classList].includes(`marked`)) {
						allPips[index].classList.add(`marked`);
					} else {
						allPips[index].classList.toggle(`marked`);
					}
				} else {
					allPips[index].classList.toggle(`marked`);
				}
			} else {
				if ([...[...allPips][value + 1].classList].includes(`marked`)) {
					allPips[index].classList.add(`marked`);
				} else {
					allPips[index].classList.toggle(`marked`);
				}
			}
		} else if (index > value) {
			allPips[index].classList.remove(`marked`);
		}
	}
}

// ========== Função que controla a atualização dos stats e as contas ==========
function updateStats(type, value) {
	// ========== ATUALIZA O VALOR DAS CARTAS DE SINA ==========

	const sinaNumber = document.querySelector(`#sina`);
	sinaNumber.innerHTML = stats.miscellany.sina;

	if (!type) return;

	// ========== CALCULO E ATUALIZAÇÃO DOS ANTECEDENTES ==========

	if (ANTECEDENTS_TYPES.includes(type)) {
		ANTECEDENTS_TYPES.forEach(() => {
			stats.antecedents[type] = value;
		});
	}

	// ========== CALCULO E ATUALIZAÇÃO DOS ATRIBUTOS ==========

	if (ATTRIBUTES_TYPES.includes(type)) {
		switch (type) {
			case `physical`: {
				stats.attributes.physical = value;
				break;
			}
			case `speed`: {
				stats.attributes.speed = value;
				break;
			}
			case `intellect`: {
				stats.attributes.intellect = value;
				break;
			}
			case `courage`: {
				stats.attributes.courage = value;
				break;
			}
		}
	}

	// ========== CALCULO E ATUALIZAÇÃO DOS STATS PRINCIPAIS ==========

	stats.bonusStats.life = stats.attributes.physical;
	stats.bonusStats.movement = stats.attributes.speed;
	stats.bonusStats.combat = stats.attributes.courage;

	stats.currentStats.pain = stats.baseStats.pain + stats.bonusStats.pain;
	stats.currentStats.life = stats.baseStats.life + stats.bonusStats.life;
	stats.currentStats.movement =
		stats.baseStats.movement + stats.bonusStats.movement;
	stats.currentStats.combat = stats.baseStats.combat + stats.bonusStats.combat;

	// Força o valor do stat vida, dor, defesa, combate e movimento a ser sobescrevido pelo valor do input do usuario
	if (MAIN_TYPES.includes(type)) {
		stats.currentStats[type] = value;
		stats.baseStats[type] = stats.currentStats[type] - stats.bonusStats[type];
	}

	MAIN_TYPES.forEach((stat) => {
		if (stats.currentStats[stat] - 6 > 0) {
			stats.extraStats[stat] = stats.currentStats[stat] - 6;
		} else {
			stats.extraStats[stat] = 0;
		}
	});
}

// INICIALIZAÇÃO
init();

// lembrete: o valor base parece estar com problema, por mais que o codigo pareça estar funcional, vale dar uma olhada afundo depois

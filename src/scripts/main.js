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
	updateStats(`level`, 1);

	profile();
	trackerSystem();
	sinaButtons();
	diceSystem();
	dropdownSystem();
	skillSystem();
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

const lifeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="24 16 208 216"><title>Circulo de Vida</title><path d="M128,16C70.65,16,24,60.86,24,116c0,34.1,18.27,66,48,84.28V216a16,16,0,0,0,16,16h8a4,4,0,0,0,4-4V200.27a8.17,8.17,0,0,1,7.47-8.25,8,8,0,0,1,8.53,8v28a4,4,0,0,0,4,4h16a4,4,0,0,0,4-4V200.27a8.17,8.17,0,0,1,7.47-8.25,8,8,0,0,1,8.53,8v28a4,4,0,0,0,4,4h8a16,16,0,0,0,16-16V200.28C213.73,182,232,150.1,232,116,232,60.86,185.35,16,128,16ZM92,152a20,20,0,1,1,20-20A20,20,0,0,1,92,152Zm72,0a20,20,0,1,1,20-20A20,20,0,0,1,164,152Z"></path></svg>`;
const painSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="24 32 208 200"><title>Circulo de Dor</title><path d="M232,120v8A104,104,0,0,1,127.63,232c-54-.19-98-42.06-103.12-94.78a4,4,0,0,1,5.56-4A35.94,35.94,0,0,0,72,122.59a35.92,35.92,0,0,0,53.94,2.33,40.36,40.36,0,0,0,12.87,13A47.94,47.94,0,0,0,120,176a8,8,0,0,0,8.67,8,8.21,8.21,0,0,0,7.33-8.26A32,32,0,0,1,168,144a8,8,0,0,0,8-8.53,8.18,8.18,0,0,0-8.25-7.47H160a24,24,0,0,1-24-24V88h64A32,32,0,0,1,232,120ZM44.73,120C55.57,119.6,64,110.37,64,99.52v-23C64,65.63,55.57,56.4,44.73,56A20,20,0,0,0,24,76v24A20,20,0,0,0,44.73,120Zm56,0c10.84-.39,19.27-9.62,19.27-20.47v-47c0-10.85-8.43-20.08-19.27-20.47A20,20,0,0,0,80,52v48A20,20,0,0,0,100.73,120ZM176,52a20,20,0,0,0-20.73-20C144.43,32.4,136,41.63,136,52.48V72h36a4,4,0,0,0,4-4Z"></path></svg>`;

const resposta = await fetch("/src/data/skills.json");
const skills = await resposta.json();

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

const currentSkills = [];

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

			if (rollsPosition.children.length - 1 === 6) {
				[...rollsPosition.children][0].remove();
			}
		});
	});
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
	const trackerSound = new Audio(`/src/assets/audios/tracker.mp3`);

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
				trackerSound.currentTime = 0;
				trackerSound.play();

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
							const physicalPips = [
								...document.querySelector(`#life`).children,
							];
							markSystem(physicalPips, stats.currentStats.life - 1, `life`);
							break;
						}
						case `speed`: {
							const speedPips = [
								...document.querySelector(`#movement`).children,
							];
							markSystem(
								speedPips,
								stats.currentStats.movement - 1,
								`movement`,
							);
							break;
						}
						case `intellect`: {
							break;
						}
						case `courage`: {
							const combatPips = [
								...document.querySelector(`#combat`).children,
							];
							markSystem(combatPips, stats.currentStats.combat - 1, `combat`);
							break;
						}
					}
				}
				updateStats(type, value);
			});
		});
	});
}

// ========== Função que mecaniza os botões de Sina via DOM e recebe seus valores ==========
function sinaButtons() {
	const sinaSound = new Audio(`/src/assets/audios/sina.mp3`);
	const sinaBtns = [...document.querySelectorAll(`.sina-cards__button`)];
	const sinaValue = document.querySelector(`#sina`);
	const minusBtn = document.querySelector(`#minus`);
	const plusBtn = document.querySelector(`#plus`);

	if (stats.miscellany.sina === 0) {
		minusBtn.classList.add(`sina-cards__button--blocked`);
	}

	sinaBtns.forEach((button) => {
		button.addEventListener(`click`, (event) => {
			if (event.target.id === `plus`) {
				if (stats.miscellany.sina < 99) {
					stats.miscellany.sina += 1;
					sinaSound.currentTime = 0;
					sinaSound.play();
				}
			} else {
				if (stats.miscellany.sina > 0) {
					stats.miscellany.sina -= 1;
					sinaSound.currentTime = 0;
					sinaSound.play();
				}
			}

			if (stats.miscellany.sina <= 0) {
				minusBtn.classList.add(`sina-cards__button--blocked`);
			} else {
				minusBtn.classList.remove(`sina-cards__button--blocked`);
			}

			if (stats.miscellany.sina === 99) {
				plusBtn.classList.add(`sina-cards__button--blocked`);
			} else {
				plusBtn.classList.remove(`sina-cards__button--blocked`);
			}

			sinaValue.innerHTML = stats.miscellany.sina;
		});
	});
}

// ========== Função que controla o sistema dos Trackers ==========
function markSystem(allPips, value, type) {
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
					if (stats.extraStats[type] >= 0) {
						allPips[index].classList.add(`marked`);
					} else {
						allPips[index].classList.toggle(`marked`);
					}
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
	const extras = [...document.querySelectorAll(`.extra`)];

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

	stats.bonusStats.life = stats.attributes.physical;
	stats.bonusStats.movement = stats.attributes.speed;
	stats.bonusStats.combat = stats.attributes.courage;

	// ========== VERIFICAR O VALOR DO LEVEL ATUAL ==========

	if (type === `level`) {
		stats.experience.level = Number(value);
	}

	if (stats.experience.level === 2) {
		stats.bonusStats.life *= 2;
	} else if (stats.experience.level === 3) {
		stats.bonusStats.life *= 2;
	} else if (stats.experience.level === 4) {
		stats.bonusStats.life *= 3;
	} else if (stats.experience.level === 5) {
		stats.bonusStats.life *= 4;
	} else if (stats.experience.level === 6) {
		stats.bonusStats.life *= 4;
		stats.bonusStats.life += 3;
	}

	// ========== CALCULO E ATUALIZAÇÃO DOS STATS PRINCIPAIS ==========

	stats.currentStats.pain = stats.baseStats.pain + stats.bonusStats.pain;
	stats.currentStats.life = stats.baseStats.life + stats.bonusStats.life;
	stats.currentStats.movement =
		stats.baseStats.movement + stats.bonusStats.movement;
	stats.currentStats.combat = stats.baseStats.combat + stats.bonusStats.combat;

	// Força o valor do stat vida, dor, defesa, combate e movimento a ser sobescrevido pelo valor do input do usuario
	if (MAIN_TYPES.includes(type)) {
		stats.currentStats[type] = value;
		stats.baseStats[type] = value;
	}

	MAIN_TYPES.forEach((stat) => {
		if (stats.currentStats[stat] - 6 > 0) {
			stats.extraStats[stat] = stats.currentStats[stat] - 6;
		} else {
			stats.extraStats[stat] = 0;
		}
	});

	extras.forEach((extra) => {
		const extraType = extra.dataset.for;
		extra.value = stats.extraStats[extraType];
	});
}

function dropdownSystem() {
	const allDropdowns = [...document.querySelectorAll(`.dropdown`)];

	allDropdowns.forEach((dropdown) => {
		const dropBtn = dropdown.querySelector(`.dropdown__btn`);
		const btnValue = dropBtn.querySelector(`span`);
		const dropType = dropBtn.id;
		const dropOptions = dropdown.querySelector(`.dropdown__options`);

		dropBtn.addEventListener(`click`, () => {
			dropOptions.classList.toggle(`dropdown__options--hide`);
		});

		const dropOption = [...dropOptions.children];

		dropOption.forEach((option) => {
			option.addEventListener(`click`, (event) => {
				dropOptions.classList.toggle(`dropdown__options--hide`);

				const selectedValue = event.target.dataset.value;
				btnValue.innerHTML = selectedValue;

				updateStats(dropType, selectedValue);
			});
		});
	});
}

function skillSystem() {
	const template = document.querySelector("#skillTemplate");
	const informations = document.querySelector("#informations");
	const selectedSkills = document.querySelector("#selectedSkills");
	const combatSkills = document.querySelector("#combatSkills");
	const professionSkills = document.querySelector("#professionSkills");
	const skillsMenu = document.querySelector("#skillsMenu");

	// ========== selected menu ========

	informations.addEventListener("click", (event) => {
		const target = event.target;

		buttonHeader(target);
		collapseButton(target);
		skillAddButton(target, template, combatSkills, professionSkills);
	});

	// ========== skills menu ==========

	skillsMenu.addEventListener("click", (event) => {
		const target = event.target;

		buttonHeader(target);
		collapseButton(target);
		skillSelectButton(target, template, selectedSkills);
	});
}

function buttonHeader(target) {
	if (target.closest(".header-button")) {
		[...target.closest(".buttons-header").children].forEach((buttons) => {
			[...buttons.children].forEach((button) => {
				button.classList.remove("header-button--selected");
			});
		});
		target.closest(".header-button").classList.add("header-button--selected");

		[...target.closest(".menu").querySelectorAll(".menu__container")].forEach(
			(container) => {
				container.classList.add("menu__container--closed");
			},
		);

		const selectedContainer = target.closest(".header-button").dataset.for;

		[
			...target.closest(".menu").querySelectorAll(`#${selectedContainer}`),
		].forEach((a) => {
			a.classList.remove("menu__container--closed");
		});
	}
}

// ========== Função do botão colapsar ==========

function collapseButton(target) {
	if (target.closest(".collapse-button")) {
		target
			.closest(".collapse-button")
			.classList.toggle("collapse-button--open");

		const skill = target.closest(".skill");
		skill.querySelector(".collapse").classList.toggle("collapse--open");
	}
}

function skillSelectButton(target, template, selectedSkills) {
	if (target.closest(".skill-select-button")) {
		selectedSkills.innerHTML = "";

		const skill = target.closest(".skill");
		const skillName = skill.querySelector(".skill__name").innerHTML;

		Object.entries(skills).forEach(([type, skills]) => {
			skills.forEach((skill, index) => {
				if (skill.name === skillName) {
					currentSkills.push(...skills.splice(index, 1));
				}
			});

			currentSkills.sort((a, b) => a.name.localeCompare(b.name));
		});

		currentSkills.forEach((skill) => {
			const clone = template.content.cloneNode(true); // Clono a template para criar um novo elemento
			const nameInput = clone.querySelector(".skill__name"); // Pego a posição do nome da Habilidade no DOM
			const typeInput = clone.querySelector(".skill__type"); // Pego a posição do tipo da Habilidade no DOM
			const descriptionInput = clone.querySelector(".skill__description"); // Pego a posição da descrição no DOM
			const selectButton = clone.querySelector(".select-button");

			nameInput.innerHTML = skill.name; // Insiro o nome do objeto no elemento DOM

			typeInput.innerHTML = skill.type;

			descriptionInput.innerHTML = skill.description
				.replace(/\{life\}/g, lifeSvg)
				.replace(/\{pain\}/g, painSvg); // Substituo os placeholders do objeto pelos icones

			selectButton.classList.add("select-button--selected");
			selectedSkills.appendChild(clone);
		});

		skillsMenu.hidePopover();
	}
}

function skillAddButton(target, template, combatSkills, professionSkills) {
	if (target.closest("#skillAddBtn")) {
		professionSkills.innerHTML = "";
		combatSkills.innerHTML = "";

		Object.entries(skills).forEach(([type, skills]) => {
			skills.sort((a, b) => a.name.localeCompare(b.name)); // Sortindo o array para ordem alfabetica

			skills.forEach((skill) => {
				const clone = template.content.cloneNode(true); // Clono a template para criar um novo elemento
				const nameInput = clone.querySelector(".skill__name"); // Pego a posição do nome da Habilidade no DOM
				const typeInput = clone.querySelector(".skill__type"); // Pego a posição do tipo da Habilidade no DOM
				const descriptionInput = clone.querySelector(".skill__description"); // Pego a posição da descrição no DOM

				nameInput.innerHTML = skill.name; // Insiro o nome do objeto no elemento DOM

				typeInput.innerHTML = skill.type; // Insiro o tipo do objeto no elemento DOM

				descriptionInput.innerHTML = skill.description; // Insiro a descrição do objeto no elemento DOM
				descriptionInput.innerHTML = skill.description
					.replace(/\{life\}/g, lifeSvg)
					.replace(/\{pain\}/g, painSvg); // Substituo os placeholders do objeto pelos icones

				// Insiro o tipo da Habilidade no DOM, dependendo do valor da chave no objeto e renderizo para seu container respectivo

				if (type === "combat") {
					typeInput.innerHTML = "Combate";
					combatSkills.appendChild(clone);
				} else if (type === "profession") {
					typeInput.innerHTML = "Profissão";
					professionSkills.appendChild(clone);
				}
			});
		});
	}
}
// INICIALIZAÇÃO
init();

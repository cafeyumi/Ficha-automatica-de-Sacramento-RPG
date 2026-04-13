let skills;
let currentSkills;

if (localStorage.getItem("savedSkills") !== null) {
	skills = JSON.parse(localStorage.getItem("savedSkills"));
	currentSkills = JSON.parse(localStorage.getItem("savedCurrentSkills"));
} else {
	const skillsList = await fetch("/src/data/skills.json");
	skills = await skillsList.json();
	currentSkills = [];
}

const init = () => {
	// Define os valores iniciais caso seja a primeira vez do usuario
	if (localStorage.getItem("savedStats") !== null) {
		const actualStats = JSON.parse(localStorage.getItem("savedStats"));

		Object.keys(actualStats).forEach((category) => {
			Object.assign(stats[category], actualStats[category]);
			console.log(stats[category]);
		});
	}

	levelSystem(); // ultima vez revisado: 12/04, avaliação: otima
	renderLevel(); // ultima vez revisado: 13/04, avaliação: otima

	sinaSystem(); // ultima vez revisado: 12/04, avaliação: otima
	renderSina(); // ultima vez revisado: 13/04, avaliação: otima

	profilePictureSystem(); // ultima vez revisado: 13/04, avaliação: otima
	renderProfilePicture(); // ultima vez revisado: 13/04, avaliação: otima

	trackersSystem(); // ultima vez revisado: 13/04, avaliação: boom
	renderTrackers(); // ultima vez revisado: 13/04, avaliação: bom

	renderExtras();

	diceSystem();

	inputsSystem(); // ultima vez revisado: 13/04, avaliação: otima
	renderInputs(); // ultima vez revisado: 13/04, avaliação: otima

	skillSystem(); // ultima vez revisado: 13/04, avaliação: meh
	renderSkills("select", currentSkills); // ultima vez revisado: 13/04, avaliação: duvidosa

	resize();
	menuSystem(); // ultima vez revisado: 12/04, avaliação: bom
};

const stats = {
	baseStats: {
		life: 6,
		pain: 6,
		defense: 5,
		combat: 1,
		movement: 1,
	},

	currentStats: {
		life: 6,
		pain: 6,
		defense: 5,
		combat: 1,
		movement: 1,
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

	limit: {
		skills: 2,
	},
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
// ========== DOM =========

// pega a lista de skills adicionadas no DOM // Pega o botão de adicionar skills do DOM

const lifeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="24 16 208 216"><title>Circulo de Vida</title><path d="M128,16C70.65,16,24,60.86,24,116c0,34.1,18.27,66,48,84.28V216a16,16,0,0,0,16,16h8a4,4,0,0,0,4-4V200.27a8.17,8.17,0,0,1,7.47-8.25,8,8,0,0,1,8.53,8v28a4,4,0,0,0,4,4h16a4,4,0,0,0,4-4V200.27a8.17,8.17,0,0,1,7.47-8.25,8,8,0,0,1,8.53,8v28a4,4,0,0,0,4,4h8a16,16,0,0,0,16-16V200.28C213.73,182,232,150.1,232,116,232,60.86,185.35,16,128,16ZM92,152a20,20,0,1,1,20-20A20,20,0,0,1,92,152Zm72,0a20,20,0,1,1,20-20A20,20,0,0,1,164,152Z"></path></svg>`;
const painSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="24 32 208 200"><title>Circulo de Dor</title><path d="M232,120v8A104,104,0,0,1,127.63,232c-54-.19-98-42.06-103.12-94.78a4,4,0,0,1,5.56-4A35.94,35.94,0,0,0,72,122.59a35.92,35.92,0,0,0,53.94,2.33,40.36,40.36,0,0,0,12.87,13A47.94,47.94,0,0,0,120,176a8,8,0,0,0,8.67,8,8.21,8.21,0,0,0,7.33-8.26A32,32,0,0,1,168,144a8,8,0,0,0,8-8.53,8.18,8.18,0,0,0-8.25-7.47H160a24,24,0,0,1-24-24V88h64A32,32,0,0,1,232,120ZM44.73,120C55.57,119.6,64,110.37,64,99.52v-23C64,65.63,55.57,56.4,44.73,56A20,20,0,0,0,24,76v24A20,20,0,0,0,44.73,120Zm56,0c10.84-.39,19.27-9.62,19.27-20.47v-47c0-10.85-8.43-20.08-19.27-20.47A20,20,0,0,0,80,52v48A20,20,0,0,0,100.73,120ZM176,52a20,20,0,0,0-20.73-20C144.43,32.4,136,41.63,136,52.48V72h36a4,4,0,0,0,4-4Z"></path></svg>`;

let multipleHabId = 0;

// #region ========== LEVEL SYSTEM ===================
function levelSystem() {
	const dropdown = document.querySelector(".dropdown");
	const dropdownOptions = dropdown.querySelector(".dropdown__options");

	dropdown.addEventListener("click", (e) => {
		const target = e.target;

		if (target.matches(".dropdown__btn")) {
			dropdownOptions.classList.toggle("dropdown__options--hide");
		}

		if (target.matches(".dropdown__option")) {
			const selectedValue = Number(target.dataset.value);

			updateStats("level", selectedValue);
			renderLevel();

			dropdownOptions.classList.toggle("dropdown__options--hide");
		}
	});
}

function renderLevel() {
	const addSkillButton = document.querySelector("#skillAddBtn");
	const currentSkillsList = document.querySelector("#selectedSkills");

	const dropdownValue = document.querySelector(".dropdown__value");
	dropdownValue.innerHTML = stats.experience.level;

	if (currentSkills.length === 0) {
		currentSkillsList.classList.remove(
			"informations-skills__selected-skills--show",
		);
	} else {
		currentSkillsList.classList.add(
			"informations-skills__selected-skills--show",
		);
	}

	if (currentSkills.length >= stats.limit.skills) {
		addSkillButton.classList.add(
			"informations-skills__add-skill-button--limit",
		);
	} else {
		addSkillButton.classList.remove(
			"informations-skills__add-skill-button--limit",
		);
	}
}

function updateLevel() {
	const level = stats.experience.level;

	switch (level) {
		case 1: {
			stats.limit.skills = 2;
			break;
		}
		case 2: {
			stats.limit.skills = 3;
			stats.bonusStats.life *= 2;
			break;
		}
		case 3: {
			stats.limit.skills = 4;
			stats.bonusStats.life *= 2;
			break;
		}
		case 4: {
			stats.limit.skills = 5;
			stats.bonusStats.life *= 3;
			break;
		}
		case 5: {
			stats.limit.skills = 5;
			stats.bonusStats.life *= 4;
			break;
		}
		case 6: {
			stats.limit.skills = 6;
			stats.bonusStats.life *= 4;
			stats.bonusStats.life += 3;
			break;
		}
	}
}
// #endregion ======= LEVEL SYSTEM ===================

// #region ========== SINA SYSTEM ====================
function sinaSystem() {
	const sinaSound = new Audio("/src/assets/audios/sina.mp3");
	const sina = document.querySelector(".sina-cards__container");

	sina.addEventListener("click", (e) => {
		const target = e.target;
		if (target.matches("#plus")) {
			if (stats.miscellany.sina < 99) {
				stats.miscellany.sina++;
				playSound(sinaSound);
				saveLocal("savedStats", stats);
				renderSina();
			}
		}
		if (target.matches("#minus")) {
			if (stats.miscellany.sina > 0) {
				stats.miscellany.sina--;
				playSound(sinaSound);
				saveLocal("savedStats", stats);
				renderSina();
			}
		}
	});
}

function renderSina() {
	const minusButton = document.querySelector("#minus");
	const plusButton = document.querySelector("#plus");
	const sinaValue = document.querySelector("#sina");
	const actualSina = stats.miscellany.sina;

	if (actualSina <= 0) {
		minusButton.classList.add("sina-cards__button--blocked");
	} else {
		minusButton.classList.remove("sina-cards__button--blocked");
	}

	if (actualSina === 99) {
		plusButton.classList.add("sina-cards__button--blocked");
	} else {
		plusButton.classList.remove("sina-cards__button--blocked");
	}

	sinaValue.innerHTML = actualSina;
}
// #endregion ======= SINA SYSTEM ====================

// #region ========== PROFILEPICTURE SYSTEM ==========
function profilePictureSystem() {
	const profileInput = document.querySelector("#profileInput");

	profileInput.addEventListener("change", (file) => {
		const reader = new FileReader();

		reader.readAsDataURL(file.target.files[0]);

		// o evento onload é disparado quando o reader é completamente carregado
		reader.onload = () => {
			// quando o reader é carregado, seu resultado é armazenado no localStorage ( é esperado a transformação do aquivo blob: em um arquivo do tipo data:)
			localStorage.setItem("profilePicture", reader.result);
			renderProfilePicture();
		};
	});
}

function renderProfilePicture() {
	const profileImage = document.querySelector("#profileImage");

	if (localStorage.getItem("profilePicture") === null) {
		profileImage.src = "/src/assets/images/placeholder.jpg";
	} else {
		profileImage.src = localStorage.getItem("profilePicture");
	}
}
// #endregion ======= PROFILEPICTURE SYSTEM ==========

// #region ========== TRACKER SYSTEM =================
function trackersSystem() {
	const allTrackers = [...document.querySelectorAll(".tracker")]; // Pega todos os Trackers do DOM
	const trackerSound = new Audio("/src/assets/audios/tracker.mp3");

	allTrackers.forEach((tracker) => {
		const type = tracker.dataset.type;
		const allPips = [...tracker.children];

		tracker.addEventListener("click", (e) => {
			const target = e.target;

			if (target.matches(".pip")) {
				playSound(trackerSound);

				const i = allPips.indexOf(target);
				console.log(i);

				const selectedValue = markSystem(allPips, i);

				updateStats(type, selectedValue);
				renderTrackers();
			}
		});
	});
}

function renderTrackers() {
	const allTrackers = [...document.querySelectorAll(".tracker")];

	allTrackers.forEach((tracker) => {
		const category = tracker.dataset.subtype;
		const type = tracker.dataset.type;
		const allPips = [...tracker.children];

		for (const index in allPips) {
			const actualValue = stats[category][type];

			if ([index] < actualValue) {
				allPips[index].classList.add("marked");
			} else {
				allPips[index].classList.remove("marked");
			}
		}
	});
}

function markSystem(allPips, value) {
	for (let index in allPips) {
		index = Number(index); // o index por padrão vem como string, aqui forço ele a virar um Number
		if (index < value) {
			allPips[index].classList.add("marked");
		} else if (index === value) {
			if (index !== 0) {
				if (index !== allPips.length - 1) {
					if ([...allPips[value + 1].classList].includes("marked")) {
						allPips[index].classList.add("marked");
					} else {
						allPips[index].classList.toggle("marked");
					}
				} else {
					allPips[index].classList.toggle("marked");
				}
			} else {
				if ([...[...allPips][value + 1].classList].includes("marked")) {
					allPips[index].classList.add("marked");
				} else {
					allPips[index].classList.toggle("marked");
				}
			}
		} else if (index > value) {
			allPips[index].classList.remove("marked");
		}
	}

	const selectedPips = allPips.filter((pip) =>
		pip.classList.contains(`marked`),
	).length;
	return selectedPips;
}
// #endregion ======= TRACKER SYSTEM =================

// #region ========== INPUTS SYSTEM ==================
function inputsSystem() {
	const allInputs = [...document.querySelectorAll(".save-input")];

	allInputs.forEach((input) => {
		input.addEventListener("change", (e) => {
			const target = e.target;
			localStorage.setItem(target.id, target.value);
		});
	});
}

function renderInputs() {
	const allInputs = [...document.querySelectorAll(".save-input")];

	allInputs.forEach((input) => {
		if (localStorage.getItem(input.id) !== null) {
			input.value = localStorage.getItem(input.id);
		}
	});
}
// #endregion ======= INPUTS SYSTEM ==================

// #region ========== COMPONENTS =====================
function menuSystem() {
	const allMenus = document.querySelectorAll(".menu");

	allMenus.forEach((menu) => {
		menu.addEventListener("click", (event) => {
			const target = event.target;

			if (target.matches(".header-button")) {
				[...target.closest(".buttons-header").children].forEach((buttons) => {
					[...buttons.children].forEach((button) => {
						button.classList.remove("header-button--selected");
					});
				});
				target
					.closest(".header-button")
					.classList.add("header-button--selected");

				[
					...target.closest(".menu").querySelectorAll(".menu__container"),
				].forEach((container) => {
					container.classList.add("menu__container--closed");
				});

				const selectedContainer = target.dataset.for;

				[
					...target.closest(".menu").querySelectorAll(`#${selectedContainer}`),
				].forEach((a) => {
					a.classList.remove("menu__container--closed");
				});
			}
		});
	});
}

function collapseButton(button) {
	button.closest(".collapse-button").classList.toggle("collapse-button--open");
	const skill = button.closest(".skill");
	skill.querySelector(".collapse").classList.toggle("collapse--open");
}
// #endregion ======= COMPONENTS =====================

// #region ========== SKILL SYSTEM ===================
function skillSystem() {
	const currentSkillsList = document.querySelector("#selectedSkills");
	const informations = document.querySelector("#informations");
	const skillsMenu = document.querySelector("#skillsMenu");
	const combatSkills = document.querySelector("#combatSkills");
	const professionSkills = document.querySelector("#professionSkills");

	// ========== selected menu ========

	informations.addEventListener("click", (event) => {
		const target = event.target;

		if (target.matches(".collapse-button")) return collapseButton(target);
		if (target.matches(".remove-button"))
			return skillRemoveButton(target, currentSkillsList);
		if (target.matches("#skillAddBtn"))
			return skillAddButton(combatSkills, professionSkills);
	});

	// ========== skills menu ==========

	skillsMenu.addEventListener("click", (event) => {
		const target = event.target;
		if (target.matches(".collapse-button")) return collapseButton(target);
		if (target.matches(".select-button"))
			return skillSelectButton(target, currentSkillsList);
	});
}

function skillSelectButton(button, currentSkillsList) {
	currentSkillsList.innerHTML = "";

	const selectedSkill = button.closest(".skill");
	const skillName = selectedSkill.querySelector(".skill__name").innerHTML;

	Object.entries(skills).forEach(([, skills]) => {
		skills.forEach((skill, index) => {
			if (skill.name === skillName) {
				if (skill.repeatable === true) {
					skills[index].id = multipleHabId;
					currentSkills.push({ ...skills[index] });
					++multipleHabId;
					console.log(currentSkills);
				} else {
					currentSkills.push(...skills.splice(index, 1));
				}
			}
		});
	});

	currentSkills.sort((a, b) => a.name.localeCompare(b.name));

	renderSkills("select", currentSkills);
	renderLevel();
	saveLocal("savedCurrentSkills", currentSkills);
	saveLocal("savedSkills", skills);

	skillsMenu.hidePopover();
}

function skillAddButton(combatSkills, professionSkills) {
	professionSkills.innerHTML = "";
	combatSkills.innerHTML = "";

	Object.entries(skills).forEach(([, skills]) => {
		renderSkills("add", skills);
	});

	skillsMenu.showPopover();
}

function skillRemoveButton(button, currentSkillsList) {
	const selectedSkill = button.closest(".skill");
	const skillName = selectedSkill.querySelector(".skill__name").innerHTML;

	currentSkills.forEach((skill, index) => {
		if (skill.name === skillName) {
			if (skill.type === "Combate") {
				if (skill.repeatable === true) {
					if (Number(selectedSkill.dataset.id) === skill.id) {
						currentSkills.splice(index, 1);
					}
				} else {
					skills.combat.push(...currentSkills.splice(index, 1));
				}
			} else if (skill.type === "Profissão") {
				if (skill.repeatable === true) {
					currentSkills.splice(index, 1);
				} else {
					skills.profession.push(...currentSkills.splice(index, 1));
				}
			}
		}
	});

	currentSkillsList.innerHTML = "";

	renderSkills("remove", currentSkills);
	updateLevel();
	renderLevel();
	saveLocal("savedCurrentSkills", currentSkills);
	saveLocal("savedSkills", skills);
}

function renderSkills(type, array) {
	let container0;
	let container1;

	if (type === "select" || type === "remove") {
		container0 = document.querySelector("#selectedSkills");
	} else if (type === "add") {
		container0 = document.querySelector("#combatSkills");
		container1 = document.querySelector("#professionSkills");
	}

	array.sort((a, b) => a.name.localeCompare(b.name)); // Sortindo o array para ordem alfabetica

	array.forEach((skill) => {
		const clone = document
			.querySelector("#skillTemplate")
			.content.cloneNode(true); // Clono a template para criar um novo elemento
		const nameInput = clone.querySelector(".skill__name"); // Pego a posição do nome da Habilidade no DOM
		const typeInput = clone.querySelector(".skill__type"); // Pego a posição do tipo da Habilidade no DOM
		const repeatableInput = clone.querySelector(".skill__repeatable"); // Pego a posição do tipo de comportamento no DOM
		const descriptionInput = clone.querySelector(".skill__description"); // Pego a posição da descrição no DOM
		const removeButton = clone.querySelector(".remove-button");
		const selectButton = clone.querySelector(".select-button");
		const skillId = clone.querySelector(".skill");

		if (type === "add") removeButton.classList.add("remove-button--none");
		if (type === "select" || type === "remove")
			selectButton.classList.add("select-button--selected");

		if (skill.id !== undefined) {
			skillId.dataset.id = skill.id;
		}
		nameInput.innerHTML = skill.name; // Insiro o nome do objeto no elemento DOM

		typeInput.innerHTML = `#${skill.type}`;
		if (skill.repeatable) {
			repeatableInput.innerHTML = "#Acumulável";
		} else {
			repeatableInput.innerHTML = "#Única";
		}

		descriptionInput.innerHTML = skill.description
			.replace(/\{life\}/g, lifeSvg)
			.replace(/\{pain\}/g, painSvg); // Substituo os placeholders do objeto pelos icones

		if (type === "add") {
			if (skill.type === "Combate") {
				container0.appendChild(clone);
			} else if (skill.type === "Profissão") {
				container1.appendChild(clone);
			}
		} else {
			container0.appendChild(clone);
		}
	});

	if (type === "select") {
		if (container0.length === 0) {
			container0.classList.remove("informations-skills__selected-skills--show");
		} else if (container0.length > 0) {
			container0.classList.add("informations-skills__selected-skills--show");
		}
	}
}
// #endregion ======= SKILL SYSTEM ===================

// #region ========== FUNÇÕES AUXILIARES =============
function resize() {
	const input = document.querySelector("#pathTitle");
	const resizer = document.querySelector(".textResizer");
	input.addEventListener("input", () => {
		resizer.textContent = input.value || input.placeholder;
		input.style.width = resizer.offsetWidth + 10 + "px";
	});
}

function saveLocal(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function playSound(sound) {
	sound.currentTime = 0;
	sound.play();
}
// #endregion ======= FUNÇÕES AUXILIARES =============

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

function renderExtras() {
	const extras = [...document.querySelectorAll(`.extra`)];

	extras.forEach((extra) => {
		const type = extra.dataset.for;
		extra.value = stats.extraStats[type];
	});
}

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

	// ========== INPUT DO USUARIO É ADICIONADO AO LEVEL ==========

	if (type === "level") {
		stats.experience.level = value;
	}

	updateLevel();

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

	saveLocal("savedStats", stats);
}

init();

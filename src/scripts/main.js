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

const tooltipsJSON = await fetch("/src/data/tooltip.json");
const tooltipsContent = await tooltipsJSON.json();

const redemptionJSON = await fetch("/src/data/redemption.json");
const redemptionContent = await redemptionJSON.json();

const currentRedemption = {
	current: {},
};

const selectSound = new Audio("src/assets/audios/select.mp3");
const clickSound = new Audio("src/assets/audios/click.mp3");
const dropdownSound = new Audio("src/assets/audios/dropdown.mp3");

const init = () => {
	// Define os valores iniciais caso seja a primeira vez do usuario
	if (localStorage.getItem("savedStats") !== null) {
		const actualStats = JSON.parse(localStorage.getItem("savedStats"));

		Object.keys(actualStats).forEach((category) => {
			Object.assign(stats[category], actualStats[category]);
		});
	}

	sinaSystem(); // ultima vez revisado: 12/04, avaliação: otima
	renderSina(); // ultima vez revisado: 13/04, avaliação: otima

	profilePictureSystem(); // ultima vez revisado: 13/04, avaliação: otima
	renderProfilePicture(); // ultima vez revisado: 13/04, avaliação: otima

	trackersSystem(); // ultima vez revisado: 13/04, avaliação: boom
	renderTrackers(); // ultima vez revisado: 13/04, avaliação: bom

	inputsSystem(); // ultima vez revisado: 13/04, avaliação: otima
	renderInputs(); // ultima vez revisado: 13/04, avaliação: otima

	skillSystem(); // ultima vez revisado: 13/04, avaliação: meh
	renderSkills("select", currentSkills); // ultima vez revisado: 13/04, avaliação: duvidosa

	menuSystem(); // ultima vez revisado: 12/04, avaliação: bom
	tooltipSystem(); // ultima vez revisado: 15/04, avaliação: bom
	dropdownComponent(); // ultima vez revisado: 12/04, avaliação: otima
	renderDropdown(); // ultima vez revisado: 13/04, avaliação: otima

	redemptionSystem(); // ultima vez revisado: 13/04, avaliação: nao sei
	renderRedemption(); // ultima vez revisado: 13/04, avaliação: nao sei

	renderExtras();
	diceSystem();

	inventorySystem();
};

const stats = {
	baseStats: {
		life: 6,
		pain: 6,
		defense: 5,
		combat: 1,
		movement: 1,

		mountPain: 6,
		mountLife: 6,
	},

	currentStats: {
		life: 6,
		pain: 6,
		defense: 5,
		combat: 1,
		movement: 1,

		mountPain: 6,
		mountLife: 6,
	},

	bonusStats: {
		life: 0,
		pain: 0,
		defense: 0,
		combat: 0,
		movement: 0,

		mountPain: 0,
		mountLife: 0,
	},

	extraStats: {
		life: 0,
		pain: 0,
		defense: 0,
		combat: 0,
		movement: 0,
		mountPain: 0,
		mountLife: 0,
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
		loyalty: 0,
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

	mount: {
		potency: 0,
		endurance: 0,
	},

	miscellany: {
		bounty: 0,
		sina: 0,
	},

	limit: {
		skills: 2,
	},

	path: {
		steps: 0,
	},

	id: {
		multiHab: 0,
		inventoryId: 0,
	},
};

const ANTECEDENTS_TYPES = [
	"attention",
	"medicine",
	"mount",
	"business",
	"theft",
	"sweat",
	"tradition",
	"violence",
];
const MAIN_TYPES = [
	"life",
	"pain",
	"combat",
	"movement",
	"mountLife",
	"mountPain",
];
const ATTRIBUTES_TYPES = ["physical", "speed", "intellect", "courage"];

const lifeSvg =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="24 16 208 216"><title>Circulo de Vida</title><path d="M128,16C70.65,16,24,60.86,24,116c0,34.1,18.27,66,48,84.28V216a16,16,0,0,0,16,16h8a4,4,0,0,0,4-4V200.27a8.17,8.17,0,0,1,7.47-8.25,8,8,0,0,1,8.53,8v28a4,4,0,0,0,4,4h16a4,4,0,0,0,4-4V200.27a8.17,8.17,0,0,1,7.47-8.25,8,8,0,0,1,8.53,8v28a4,4,0,0,0,4,4h8a16,16,0,0,0,16-16V200.28C213.73,182,232,150.1,232,116,232,60.86,185.35,16,128,16ZM92,152a20,20,0,1,1,20-20A20,20,0,0,1,92,152Zm72,0a20,20,0,1,1,20-20A20,20,0,0,1,164,152Z"></path></svg>';
const painSvg =
	'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="24 32 208 200"><title>Circulo de Dor</title><path d="M232,120v8A104,104,0,0,1,127.63,232c-54-.19-98-42.06-103.12-94.78a4,4,0,0,1,5.56-4A35.94,35.94,0,0,0,72,122.59a35.92,35.92,0,0,0,53.94,2.33,40.36,40.36,0,0,0,12.87,13A47.94,47.94,0,0,0,120,176a8,8,0,0,0,8.67,8,8.21,8.21,0,0,0,7.33-8.26A32,32,0,0,1,168,144a8,8,0,0,0,8-8.53,8.18,8.18,0,0,0-8.25-7.47H160a24,24,0,0,1-24-24V88h64A32,32,0,0,1,232,120ZM44.73,120C55.57,119.6,64,110.37,64,99.52v-23C64,65.63,55.57,56.4,44.73,56A20,20,0,0,0,24,76v24A20,20,0,0,0,44.73,120Zm56,0c10.84-.39,19.27-9.62,19.27-20.47v-47c0-10.85-8.43-20.08-19.27-20.47A20,20,0,0,0,80,52v48A20,20,0,0,0,100.73,120ZM176,52a20,20,0,0,0-20.73-20C144.43,32.4,136,41.63,136,52.48V72h36a4,4,0,0,0,4-4Z"></path></svg>';

// #region ========== LEVEL SYSTEM ===================

function dropdownComponent() {
	const dropdowns = [...document.querySelectorAll(".dropdown")];

	dropdowns.forEach((dropdown) => {
		const options = dropdown.querySelector(".dropdown__options");
		dropdown.addEventListener("click", (e) => {
			const target = e.target;

			if (target.matches(".dropdown__btn")) {
				options.classList.toggle("dropdown__options--hide");
				target.classList.toggle("dropdown__btn--open");
			}

			if (target.matches(".dropdown__option")) {
				const selectedValue = Number(target.dataset.value);
				const btn = dropdown.querySelector(".dropdown__btn");

				btn.classList.toggle("dropdown__btn--open");
				options.classList.toggle("dropdown__options--hide");

				if (dropdown.dataset.type === "level") {
					updateStats("level", selectedValue);
					renderDropdown();
				} else if (dropdown.dataset.type === "loyalty") {
					updateStats("loyalty", selectedValue);
					renderDropdown();
				}
			}
		});
	});
}

function renderDropdown() {
	const addSkillButton = document.querySelector("#skillAddBtn");
	const currentSkillsList = document.querySelector("#selectedSkills");

	const dropdownValue = [...document.querySelectorAll(".dropdown__value")];

	dropdownValue.forEach((dropdown) => {
		if (dropdown.dataset.for === "level") {
			dropdown.innerHTML = stats.experience.level;
		} else if (dropdown.dataset.for === "loyalty") {
			dropdown.innerHTML = stats.experience.loyalty;
		}
	});

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

	if (stats.path.steps >= 6) {
		stats.bonusStats.life += 2;
		stats.limit.skills++;
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
		input.addEventListener("input", (e) => {
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
	const menuSound = new Audio("src/assets/audios/switch.mp3");

	allMenus.forEach((menu) => {
		menu.addEventListener("click", (event) => {
			const target = event.target;

			if (target.matches(".header-button")) {
				if (![...target.classList].includes("header-button--selected"))
					playSound(menuSound);

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
					container.classList.add("hide");
				});

				const selectedContainer = target.dataset.for;

				[
					...target.closest(".menu").querySelectorAll(`#${selectedContainer}`),
				].forEach((container) => {
					container.classList.remove("hide");
				});
			}
		});
	});
}

function collapseButton(button) {
	button.closest(".collapse-button").classList.toggle("collapse-button--open");
	let colap = null;

	if (button.dataset.dropdown === "inventory") {
		colap = button.closest(".inventory-option");
	} else if (button.dataset.dropdown === "skill") {
		colap = button.closest(".skill");
	} else {
		colap = button.closest(".item");
	}

	playSound(dropdownSound);
	colap.querySelector(".collapse").classList.toggle("collapse--open");
}

function tooltipSystem() {
	const allTooltips = [...document.querySelectorAll(".has-tooltip")];
	const tooltipMenu = document.querySelector("#tooltip");
	const tooltipName = tooltipMenu.querySelector("#tooltipName");
	const tooltipDescription = tooltipMenu.querySelector("#tooltipDescription");

	allTooltips.forEach((tooltip) => {
		tooltip.addEventListener("click", (e) => {
			const target = e.target;
			const identifier = target.dataset.for;

			const contentCheck = Object.entries(tooltipsContent).find(
				([type]) => identifier === type,
			);

			const [, content] = contentCheck;

			const name = content.name;
			const description = content.description
				.replace(/\{life\}/g, lifeSvg)
				.replace(/\{pain\}/g, painSvg);

			tooltipName.innerHTML = name;
			tooltipDescription.innerHTML = description;

			playSound(clickSound);

			tooltipMenu.showPopover();
		});
	});
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
					skills[index].id = stats.id.multiHab;
					currentSkills.push({ ...skills[index] });
					stats.id.multiHab++;
				} else {
					currentSkills.push(...skills.splice(index, 1));
				}
			}
		});
	});

	currentSkills.sort((a, b) => a.name.localeCompare(b.name));

	renderSkills("select", currentSkills);
	renderDropdown();
	saveLocal("savedStats", stats);
	saveLocal("savedCurrentSkills", currentSkills);
	saveLocal("savedSkills", skills);

	playSound(selectSound);

	skillsMenu.hidePopover();
}

function skillAddButton(combatSkills, professionSkills) {
	professionSkills.innerHTML = "";
	combatSkills.innerHTML = "";

	Object.entries(skills).forEach(([, skills]) => {
		renderSkills("add", skills);
	});

	playSound(clickSound);

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

	playSound(clickSound);

	renderSkills("remove", currentSkills);
	updateLevel();
	renderDropdown();
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

function saveLocal(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function playSound(sound) {
	sound.currentTime = 0;
	sound.play();
}

async function loadInventoryTypes() {
	const response = await fetch("/src/data/inventory.json");
	const data = await response.json();
	return data;
}

async function loadCatalog() {
	const response = await fetch("/src/data/catalog.json");
	const data = await response.json();
	return data;
}

// #endregion ======= FUNÇÕES AUXILIARES =============

// #region ========== INVENTORY & ITEM SYSTEM ===============

async function inventorySystem() {
	const inventoryTemplate = document.querySelector("#InventoryCategory");
	const inventoryOptionTemplate = document.querySelector("#inventoryOption");
	const itemTemplate = document.querySelector("#itemTemplate");
	const inventoryEquippedItems = document.querySelector("#equipmentCombat");
	const inventoryContainer = document.querySelector("#inventoryContainer");
	const inventoryOptions = document.querySelector(
		"#inventory-selection-options",
	);
	const inventorySelectionMenu = document.querySelector(
		"#inventorySelectionMenu",
	);
	const catalogMenu = document.querySelector("#catalog");
	const tagTemplate = document.querySelector("#tag");
	let selectedCategoryId;
	let itemId;

	// #region inicialização do estado do inventario
	const inventoryTypes = Object.values(await loadInventoryTypes());
	const catalog = Object.entries(await loadCatalog());

	let currentInventory = null;
	let inventoryId = null;
	let selectedItems = null;

	if (localStorage.getItem("selectedItems") === null) {
		selectedItems = [];
	} else {
		selectedItems = JSON.parse(localStorage.getItem("selectedItems"));
	}

	if (localStorage.getItem("currentInventory") === null) {
		currentInventory = [];
	} else {
		currentInventory = JSON.parse(localStorage.getItem("currentInventory"));
	}

	if (localStorage.getItem("inventoryId") === null) {
		inventoryId = 0;
	} else {
		inventoryId = JSON.parse(localStorage.getItem("inventoryId"));
	}

	renderCurrentInventory(
		inventoryContainer,
		currentInventory,
		inventoryTemplate,
		itemTemplate,
		tagTemplate,
	);
	// #endregion

	// #region Adicionar um novo inventario
	const addInventoryBtn = document.querySelector("#addInventory");

	addInventoryBtn.addEventListener("click", () => {
		playSound(clickSound);

		renderInventoryOptions(
			inventoryOptions,
			inventoryTypes,
			inventoryOptionTemplate,
		);
	});

	document.querySelector("#itemFilter").addEventListener("input", (e) => {
		const target = e.target;
		let filtered;

		if (target.value.length >= 3) {
			filtered = target.value;
		}

		renderCurrentInventory(
			inventoryContainer,
			currentInventory,
			inventoryTemplate,
			itemTemplate,
			tagTemplate,
			filtered,
		);
	});

	// #endregion

	// #region Menu de inventarios

	if (localStorage.getItem("inventoryId") === null) {
		inventoryId = 0;
	} else {
		inventoryId = JSON.parse(localStorage.getItem("inventoryId"));
	}

	inventoryOptions.addEventListener("click", (e) => {
		const target = e.target;

		if (target.matches(".select-button")) {
			const id = Number(target.closest(".inventory-option").dataset.id);
			const selectedOptionIndex = inventoryTypes.findIndex(
				(el) => el.id === id,
			);
			const selectedOption = structuredClone(
				inventoryTypes[selectedOptionIndex],
			);

			selectedOption.id = inventoryId;
			inventoryId++;
			saveLocal("inventoryId", inventoryId);

			currentInventory.push(selectedOption);

			renderCurrentInventory(
				inventoryContainer,
				currentInventory,
				inventoryTemplate,
				itemTemplate,
				tagTemplate,
			);

			inventorySelectionMenu.hidePopover();

			playSound(selectSound);

			saveLocal("currentInventory", currentInventory);
		}
		if (target.matches(".collapse-button")) return collapseButton(target);
	});

	// #endregion
	if (localStorage.getItem("itemId") === null) {
		itemId = 0;
	} else {
		itemId = JSON.parse(localStorage.getItem("itemId"));
	}

	inventoryContainer.addEventListener("click", (e) => {
		const target = e.target;

		if (target.matches(".inventory-category__remove-category")) {
			const id = Number(target.closest(".inventory-category").dataset.id);
			const InventoryIndex = currentInventory.findIndex((el) => el.id === id);
			currentInventory.splice(InventoryIndex, 1);

			renderCurrentInventory(
				inventoryContainer,
				currentInventory,
				inventoryTemplate,
				itemTemplate,
				tagTemplate,
			);

			playSound(clickSound);

			saveLocal("currentInventory", currentInventory);
		}

		if (target.matches(".inventory-category__add-item")) {
			selectedCategoryId = Number(
				target.closest(".inventory-category").dataset.id,
			);

			playSound(clickSound);

			renderCatalog(catalog, itemTemplate, tagTemplate, "add");
		}

		if (target.matches(".remove-button")) {
			const selectedItem = Number(target.closest(".item").dataset.id);

			currentInventory.forEach((inventory) => {
				const index = inventory.items.findIndex(
					(item) => item.id === selectedItem,
				);

				if (index !== -1) {
					inventory.items.splice(index, 1);
				}
			});

			renderCurrentInventory(
				inventoryContainer,
				currentInventory,
				inventoryTemplate,
				itemTemplate,
				tagTemplate,
			);

			playSound(clickSound);

			saveLocal("currentInventory", currentInventory);
		}

		if (target.matches(".use-button")) {
			const selectedId = Number(target.closest(".item").dataset.id);

			currentInventory.forEach((inventory) => {
				const selectedItem = inventory.items.find(
					(item) => item.id === selectedId,
				);

				if (selectedItem !== undefined) {
					if (selectedItem.selected === false) {
						selectedItem.selected = true;
						selectedItems.push(selectedItem);
					} else {
						selectedItem.selected = false;
					}
				}
			});

			playSound(clickSound);

			renderCurrentInventory(
				inventoryContainer,
				currentInventory,
				inventoryTemplate,
				itemTemplate,
				tagTemplate,
			);

			saveLocal("selectedItems", selectedItems);
			saveLocal("currentInventory", currentInventory);
		}

		if (target.matches(".collapse-button")) return collapseButton(target);
	});

	inventoryEquippedItems.addEventListener("click", (e) => {
		const target = e.target;

		if (target.matches(".collapse-button")) return collapseButton(target);

		if (target.matches(".remove-button")) {
			const selectedItem = Number(target.closest(".item").dataset.id);

			currentInventory.forEach((inventory) => {
				const index = inventory.items.findIndex(
					(item) => item.id === selectedItem,
				);

				if (index !== -1) {
					inventory.items.splice(index, 1);
				}
			});

			renderCurrentInventory(
				inventoryContainer,
				currentInventory,
				inventoryTemplate,
				itemTemplate,
				tagTemplate,
			);

			playSound(clickSound);

			saveLocal("currentInventory", currentInventory);
		}
	});

	catalogMenu.addEventListener("click", (e) => {
		const target = e.target;

		if (target.matches(".select-button")) {
			const itemDOM = target.closest(".item");
			const id = Number(itemDOM.dataset.id);

			let selectedItem;

			catalog.find(([, items]) => {
				selectedItem = items.find((item) => item.id === id);
				return selectedItem;
			});

			const selectedClone = { ...selectedItem };

			const selectedInventory = currentInventory.find(
				(category) => category.id === selectedCategoryId,
			);

			selectedClone.id = itemId;
			itemId++;
			saveLocal("itemId", itemId);

			selectedInventory.items.push(selectedClone);

			catalogMenu.hidePopover();

			renderCurrentInventory(
				inventoryContainer,
				currentInventory,
				inventoryTemplate,
				itemTemplate,
				tagTemplate,
			);

			playSound(selectSound);

			saveLocal("currentInventory", currentInventory);
		}

		if (target.matches(".collapse-button")) return collapseButton(target);
	});
}

function renderInventoryOptions(menu, list, template) {
	menu.replaceChildren();

	const arrayList = Object.values(list);
	arrayList.sort((a, b) => a.name.localeCompare(b.name));
	arrayList.forEach((option) => {
		const inventoryOption = template.content.cloneNode(true);
		inventoryOption.querySelector(".inventory-option").dataset.id = option.id;
		inventoryOption.querySelector(".inventory-option__name").innerHTML =
			option.name;
		inventoryOption.querySelector(".inventory-option__description").innerHTML =
			option.description;
		menu.appendChild(inventoryOption);
	});
}

function renderCurrentInventory(
	container,
	list,
	template,
	itemTemplate,
	tagTemplate,
	filterInput,
) {
	container.replaceChildren();
	document.querySelector("#inventorySelected").replaceChildren();
	let actualQuantity = null;
	let lastName = null;

	list.sort((a, b) => a.name.localeCompare(b.name));

	list.forEach((inventoryType) => {
		const inventory = template.content.cloneNode(true);
		const category = inventory.querySelector(".inventory-category");

		category.dataset.id = inventoryType.id;
		category.dataset.type = inventoryType.type;
		category.dataset.format = inventoryType.format;

		const quantity = list.filter((el) =>
			el.name.includes(inventoryType.name),
		).length;

		if (lastName !== inventoryType.name) {
			actualQuantity = 1;
			lastName = inventoryType.name;
		}

		if (quantity > 1) {
			if (actualQuantity === 1) {
				inventory.querySelector(".category-title").innerHTML =
					inventoryType.name;
			} else {
				inventory.querySelector(".category-title").innerHTML =
					`${inventoryType.name} ${actualQuantity}`;
			}
			actualQuantity++;
		} else {
			actualQuantity = 1;
			inventory.querySelector(".category-title").innerHTML = inventoryType.name;
		}

		if (inventoryType.type === "item") {
		} else {
			inventory.querySelector(".weapon-used").innerHTML =
				inventoryType.weapon_used;
			inventory.querySelector(".weapon-capacity").innerHTML =
				inventoryType.weapon_capacity;

			if (inventoryType.subtype === "ranged") {
				inventory.querySelector(".ammo-used").innerHTML =
					inventoryType.ammo_used;
				inventory.querySelector(".ammo-capacity").innerHTML =
					inventoryType.ammo_capacity;
			} else {
				inventory.querySelector(".ammo-inventory").classList.add("hide");
			}

			inventory.querySelector(".space-inventory").classList.add("hide");
		}

		if (filterInput !== undefined) {
			const filteredItems = inventoryType.items.filter((item) =>
				item.name
					.toLowerCase()
					.trim()
					.includes(filterInput.toLowerCase().trim()),
			);

			if (filteredItems.length === 0) {
				inventory.querySelector(".inventory-category__content").innerHTML =
					'<span class="no-items">Nenhum item foi encontrado</span>';
			} else
				inventory.querySelector(".inventory-category__content").innerHTML = "";

			renderItems(
				filteredItems,
				itemTemplate,
				tagTemplate,
				inventory.querySelector(".inventory-category__content"),

				inventoryType.type,
			);
		} else {
			if (inventoryType.items.length === 0) {
				inventory.querySelector(".inventory-category__content").innerHTML =
					'<span class="no-items">Este inventário está vazio</span>';
			} else
				inventory.querySelector(".inventory-category__content").innerHTML = "";

			renderItems(
				inventoryType.items,
				itemTemplate,
				tagTemplate,
				inventory.querySelector(".inventory-category__content"),

				inventoryType.type,
			);
		}

		let usedSpace = 0;
		let usedAmmo = 0;
		let usedWeapon = 0;

		inventoryType.items.forEach((item) => {
			if (item.selected !== true || item.type === "weapon") {
				usedSpace += item.space;
			}

			if (item.type === "weapon") {
				usedWeapon += 1;
			}

			if (item.type === "ammo") {
				usedAmmo += item.ammo_total;
			}
		});

		const ammoInv = inventory.querySelector(".ammo-inventory");
		const weaponInv = inventory.querySelector(".weapon-inventory");
		const spaceInv = inventory.querySelector(".space-inventory");

		if (inventoryType.type === "item") {
			const catUsed = inventory.querySelector(".category-used");
			const catCap = inventory.querySelector(".category-capacity");

			catUsed.innerHTML = usedSpace;
			inventoryType.used = usedSpace;
			catCap.innerHTML = inventoryType.capacity;

			if (inventoryType.used > inventoryType.capacity) {
				spaceInv.classList.add("over-capacity");
			}

			ammoInv.classList.add("hide");
			weaponInv.classList.add("hide");
		} else {
			const weaponUsed = inventory.querySelector(".weapon-used");
			const ammoUsed = inventory.querySelector(".ammo-used");
			const ammoCap = inventory.querySelector(".ammo-capacity");
			const weaponCap = inventory.querySelector(".weapon-capacity");

			weaponUsed.innerHTML = usedWeapon;
			inventoryType.weapon_used = usedWeapon;
			weaponCap.innerHTML = inventoryType.weapon_capacity;

			if (inventoryType.weapon_used > inventoryType.weapon_capacity) {
				weaponInv.classList.add("over-capacity");
			}

			if (inventoryType.subtype === "ranged") {
				ammoUsed.innerHTML = usedAmmo;
				inventoryType.ammo_used = usedAmmo;
				ammoCap.innerHTML = inventoryType.ammo_capacity;

				if (inventoryType.ammo_used > inventoryType.ammo_capacity) {
					ammoInv.classList.add("over-capacity");
				}
			} else {
				ammoInv.classList.add("hide");
			}

			spaceInv.classList.add("hide");
		}

		container.appendChild(inventory);
	});

	const allSelectedItems = list
		.flatMap((inventoryType) => inventoryType.items)
		.filter((item) => item.selected === true);

	if (allSelectedItems.length === 0) {
		document.querySelector("#inventorySelected").innerHTML =
			'<span class="no-items">Nenhum item está equipado no momento</span>';
	} else {
		renderItems(
			allSelectedItems,
			itemTemplate,
			tagTemplate,
			document.querySelector("#inventorySelected"),
			"using",
		);
	}
}

function renderCatalog(array, template, tagTemplate, type) {
	const weaponsContainer = document.querySelector("#weapons");
	const specialWeaponsContainer = document.querySelector("#specialWeapons");
	const generalItemsContainer = document.querySelector("#generalItems");
	const warehouseContainer = document.querySelector("#warehouse");
	const animalsContainer = document.querySelector("#animals");
	const ammunitionContainer = document.querySelector("#ammunition");
	const protectionContainer = document.querySelector("#protection");
	const medicineContainer = document.querySelector("#medicineHerbs");
	const fashionContainer = document.querySelector("#fashion");

	weaponsContainer.replaceChildren();
	specialWeaponsContainer.replaceChildren();
	generalItemsContainer.replaceChildren();
	warehouseContainer.replaceChildren();
	animalsContainer.replaceChildren();
	ammunitionContainer.replaceChildren();
	protectionContainer.replaceChildren();
	medicineContainer.replaceChildren();
	fashionContainer.replaceChildren();

	array.forEach(([category, items]) => {
		items.forEach((item) => {
			const itemTemplate = template.content.cloneNode(true);
			const tags = itemTemplate.querySelector(".item__tags");
			const itemDOM = itemTemplate.querySelector(".item");

			itemDOM.classList.add("catalog__item");

			itemDOM.dataset.id = item.id;

			itemTemplate.querySelector(".item__name").innerHTML = item.name;

			if (item.detail) {
				itemDOM.querySelector(".item__detail").innerHTML = `(${item.detail})`;
			} else {
				itemDOM.querySelector(".item__detail").classList.add("hide");
			}

			if (type === "add") {
				itemTemplate.querySelector(".use-button").classList.add("hide");
				itemTemplate
					.querySelector(".skill__button-remove-position")
					.classList.add("hide");
			}

			item.tags.forEach((tag) => {
				const tagTemp = tagTemplate.content.cloneNode(true);
				tagTemp.querySelector(".tag-content").innerHTML = tag;
				tags.appendChild(tagTemp);
			});

			if (item.type === "weapon") {
				itemDOM.querySelector(".reduction_container").classList.add("hide");
				itemDOM.querySelector(".damage-stat").innerHTML = item.damage
					.replace(/\{life\}/g, lifeSvg)
					.replace(/\{pain\}/g, painSvg);

				if (item.ammunition !== null) {
					itemDOM.querySelector(".ammo-stat").innerHTML = item.ammunition;
				} else {
					itemDOM.querySelector(".ammo_container").classList.add("hide");
				}
			} else if (item.type === "item") {
				itemDOM.querySelector(".damage_container").classList.add("hide");
				itemDOM.querySelector(".ammo_container").classList.add("hide");
				itemDOM.querySelector(".reduction_container").classList.add("hide");

				if (item.selectable) {
					// vou por coisa aqui depois provavelmente
				} else {
					itemDOM.querySelector(".use-button").classList.add("hide");
				}
			} else if (item.type === "ammo") {
				itemDOM.querySelector(".reduction_container").classList.add("hide");
				itemDOM.querySelector(".damage_container").classList.add("hide");
				itemDOM.querySelector(".ammo_container").classList.add("hide");
				itemDOM.querySelector(".use-button").classList.add("hide");
			} else {
				itemDOM.querySelector(".reduction-stat").innerHTML =
					item.reduction.replace(/\{life\}/g, lifeSvg);

				itemDOM.querySelector(".damage_container").classList.add("hide");
				itemDOM.querySelector(".ammo_container").classList.add("hide");
			}

			if (item.space !== null) {
				itemDOM.querySelector(".weight-stat").innerHTML = item.space;
			} else {
				itemDOM.querySelector(".weight_container").classList.add("hide");
			}

			if (item.description !== null) {
				itemDOM.querySelector(".item__description").innerHTML = item.description
					.replace(/\{life\}/g, lifeSvg)
					.replace(/\{pain\}/g, painSvg);
			} else {
				itemDOM.querySelector(".item__description").innerHTML =
					'<span class="no-desc">Este item não possui descrição no momento<span>';
			}

			if (category === "weapons") {
				weaponsContainer.appendChild(itemTemplate);
			} else if (category === "special weapons") {
				specialWeaponsContainer.appendChild(itemTemplate);
			} else if (category === "general") {
				generalItemsContainer.appendChild(itemTemplate);
			} else if (category === "warehouse") {
				warehouseContainer.appendChild(itemTemplate);
			} else if (category === "animals") {
				animalsContainer.appendChild(itemTemplate);
			} else if (category === "ammunition") {
				ammunitionContainer.appendChild(itemTemplate);
			} else if (category === "protection") {
				protectionContainer.appendChild(itemTemplate);
			} else if (category === "medicine") {
				medicineContainer.appendChild(itemTemplate);
			} else {
				fashionContainer.appendChild(itemTemplate);
			}
		});
	});
}

function renderItems(list, template, tagTemplate, container, type) {
	list.sort((a, b) => a.name.localeCompare(b.name));

	list.forEach((item) => {
		const itemDOM = template.content.cloneNode(true);
		const tags = itemDOM.querySelector(".item__tags");

		itemDOM.querySelector(".item__name").innerHTML = item.name;

		if (item.detail) {
			itemDOM.querySelector(".item__detail").innerHTML = `(${item.detail})`;
		} else {
			itemDOM.querySelector(".item__detail").classList.add("hide");
		}

		if (item.type === "weapon") {
			itemDOM.querySelector(".reduction_container").classList.add("hide");
			itemDOM.querySelector(".damage-stat").innerHTML = item.damage
				.replace(/\{life\}/g, lifeSvg)
				.replace(/\{pain\}/g, painSvg);

			if (item.ammunition !== null) {
				itemDOM.querySelector(".ammo-stat").innerHTML = item.ammunition;
			} else {
				itemDOM.querySelector(".ammo_container").classList.add("hide");
			}
		} else if (item.type === "item") {
			itemDOM.querySelector(".reduction_container").classList.add("hide");
			itemDOM.querySelector(".damage_container").classList.add("hide");
			itemDOM.querySelector(".ammo_container").classList.add("hide");

			if (item.selectable) {
				// vou por coisa aqui depois provavelmente
			} else {
				itemDOM.querySelector(".use-button").classList.add("hide");
			}
		} else if (item.type === "ammo") {
			itemDOM.querySelector(".reduction_container").classList.add("hide");
			itemDOM.querySelector(".damage_container").classList.add("hide");
			itemDOM.querySelector(".ammo_container").classList.add("hide");
			itemDOM.querySelector(".use-button").classList.add("hide");
		} else {
			itemDOM.querySelector(".reduction-stat").innerHTML =
				item.reduction.replace(/\{life\}/g, lifeSvg);

			itemDOM.querySelector(".damage_container").classList.add("hide");
			itemDOM.querySelector(".ammo_container").classList.add("hide");
		}

		itemDOM.querySelector(".item").dataset.id = item.id;

		item.tags.forEach((tag) => {
			const tagTemp = tagTemplate.content.cloneNode(true);
			tagTemp.querySelector(".tag-content").innerHTML = tag;
			tags.appendChild(tagTemp);
		});

		if (item.space !== null) {
			itemDOM.querySelector(".weight-stat").innerHTML = item.space;
		} else {
			itemDOM.querySelector(".weight_container").classList.add("hide");
		}

		if (item.description !== null) {
			itemDOM.querySelector(".item__description").innerHTML = item.description
				.replace(/\{life\}/g, lifeSvg)
				.replace(/\{pain\}/g, painSvg);
		} else {
			itemDOM.querySelector(".item__description").innerHTML =
				'<span class="no-desc">Este item não possui descrição no momento<span>';
		}

		itemDOM.querySelector(".select-button").classList.add("hide");

		if (item.selected === true) {
			itemDOM.querySelector(".use-button").classList.add("used-button");

			if (item.type !== "weapon")
				itemDOM.querySelector(".weight-stat").innerHTML = 0;
		}

		if (type === "using") {
			itemDOM.querySelector(".use-button").classList.add("hide");
		}

		container.appendChild(itemDOM);
	});
}
// #endregion ======= INVENTORY SYSTEM ===============

// #region ========== REDEMPTION SYSTEM ===============

function redemptionSystem() {
	const pathButtons = [...document.querySelectorAll(".redemptionBtn")];
	const stepRadios = [...document.querySelectorAll(".step")];
	const stepInputs = [...document.querySelectorAll(".step-input")];

	let position = 0; // armazena a posição atual

	if (localStorage.getItem("pathPosition") === null) {
		saveLocal("pathPosition", position);
	} else {
		position = JSON.parse(localStorage.getItem("pathPosition")); // adiciona a posição
	}

	stepRadios.forEach((radio) => {
		radio.addEventListener("click", (e) => {
			const target = e.target;

			target.classList.toggle("marked");

			const totalValue = stepRadios.filter((radio) =>
				[...radio.classList].includes("marked"),
			).length;

			stepRadios.forEach((radio) => {
				if ([...radio.classList].includes("marked")) {
					saveLocal(radio.id, true);
				} else {
					saveLocal(radio.id, false);
				}
			});

			playSound(clickSound);
			renderRedemption();
			updateStats("redemption", totalValue);
		});
	});

	pathButtons.forEach((button) => {
		button.addEventListener("click", (e) => {
			const target = e.target;

			if (target.matches("#next-path")) {
				position++;
			} else if (target.matches("#back-path")) {
				position--;
			}

			if (position > 5 || position < 0) {
				position = 0;
			}

			playSound(clickSound);
			saveLocal("pathPosition", position);
			renderRedemption(target.id);
		});
	});

	stepInputs.forEach((stepInput) => {
		stepInput.addEventListener("input", (e) => {
			const target = e.target;
			const type = target.dataset.for;

			currentRedemption.current[type] = target.value;

			saveLocal("savedCurrentRedemption", currentRedemption.current);
		});
	});
}

function renderRedemption(btnHasClicked) {
	if (
		btnHasClicked ||
		localStorage.getItem("savedCurrentRedemption") === null
	) {
		const cu =
			Object.values(redemptionContent)[
				JSON.parse(localStorage.getItem("pathPosition"))
			];
		currentRedemption.current = cu;
	} else {
		currentRedemption.current = JSON.parse(
			localStorage.getItem("savedCurrentRedemption"),
		);
	}

	const pathTitle = document.querySelector("#pathTitle");
	const pathDescription = document.querySelector("#pathDescription");

	for (let i = 1; i < 7; i++) {
		const radioChecked = JSON.parse(localStorage.getItem(`step${i}Radio`));
		const radio = document.querySelector(`#step${i}Radio`);
		const status = document.querySelector(`#step${i}Status`);
		const step = document.querySelector(`#step${i}`);

		step.value = currentRedemption.current[`step${i}`];

		if (radioChecked) {
			radio.classList.add("marked");
			status.innerHTML = "Completo";
			radio.setAttribute("aria-checked", "true");
		} else {
			radio.classList.remove("marked");
			status.innerHTML = "Incompleto";
			radio.setAttribute("aria-checked", "false");
		}
	}

	pathTitle.value = currentRedemption.current.name;
	pathDescription.value = currentRedemption.current.description;
}

// #endregion ======= REDEMPTION SYSTEM ==============

function diceSystem() {
	const diceSound = new Audio(`/src/assets/audios/dice.mp3`);
	const dices = [...document.querySelectorAll(`.dice`)];
	const getTemplate = document.querySelector(`#rollTemplate`);
	const rollsPosition = document.querySelector(`#rolls`);

	dices.forEach((dice) => {
		dice.addEventListener(`click`, (e) => {
			diceSound.currentTime = 0;
			diceSound.play();

			const diceResult = Math.floor(Math.random() * (7 - 1) + 1);
			const type = e.target.dataset.type;
			const rollName = e.target.dataset.name;

			const template = getTemplate.content.cloneNode(true);

			const nameInput = template.querySelector(`.rolls__title`);
			nameInput.innerHTML = rollName;

			const diceInput = template.querySelector(`.rolls__value-dice`);
			diceInput.innerHTML = diceResult;

			const bonusInput = template.querySelector(`.rolls__value-bonus`);

			let bonus;

			if (type === "potency") {
				const mountBonus = stats.antecedents.mount;
				const potencyBonus = stats.mount.potency;
				bonus = mountBonus + potencyBonus;
			} else {
				bonus = stats.antecedents[type];
			}

			bonusInput.innerHTML = bonus;

			const rollResult = diceResult + bonus;

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

function extrasSystem() {
	const extras = [...document.querySelectorAll(".extra")];

	extras.forEach((extra) => {
		extra.addEventListener("input", (e) => {
			const target = e.target;
			const value = target.value;
			const type = target.dataset.for;

			renderExtras(type, value);
		});
	});
}

extrasSystem();

function renderExtras(type, direct) {
	const extras = [...document.querySelectorAll(".extra")];

	if (direct) {
		stats.extraStats[type] = direct;
		saveLocal(`direct${type}`, direct);
	}

	extras.forEach((extra) => {
		if (localStorage.getItem(`direct${extra.dataset.for}`) !== null) {
			extra.value = JSON.parse(
				localStorage.getItem(`direct${extra.dataset.for}`),
			);
		} else {
			const type = extra.dataset.for;
			extra.value = stats.extraStats[type];
		}
	});
}

function updateStats(type, value) {
	// redenção

	if (type === "redemption") {
		stats.path.steps = value;
	}

	// mount

	if (type === "potency" || type === "endurance") {
		stats.mount[type] = value;
	}

	// ========== CALCULO E ATUALIZAÇÃO DOS ANTECEDENTES ==========

	if (ANTECEDENTS_TYPES.includes(type)) {
		ANTECEDENTS_TYPES.forEach(() => {
			stats.antecedents[type] = value;
		});
	}

	// ========== CALCULO E ATUALIZAÇÃO DOS ATRIBUTOS ==========

	if (ATTRIBUTES_TYPES.includes(type)) {
		switch (type) {
			case "physical": {
				stats.attributes.physical = value;
				break;
			}
			case "speed": {
				stats.attributes.speed = value;
				break;
			}
			case "intellect": {
				stats.attributes.intellect = value;
				break;
			}
			case "courage": {
				stats.attributes.courage = value;
				break;
			}
		}
	}

	const oldbBonusLife = stats.bonusStats.life;
	const oldbBonusMovement = stats.bonusStats.movement;
	const oldbBonusCombat = stats.bonusStats.combat;
	const oldBonusLifeMount = stats.bonusStats.mountLife;

	stats.bonusStats.mountLife = stats.mount.endurance;
	stats.bonusStats.life = stats.attributes.physical;
	stats.bonusStats.movement = stats.attributes.speed;
	stats.bonusStats.combat = stats.attributes.courage;

	// ========== INPUT DO USUARIO É ADICIONADO AO LEVEL ==========

	if (type === "level") {
		stats.experience.level = value;
	}

	updateLevel();
	renderDropdown();

	if (type === "loyalty") {
		stats.experience.loyalty = value;
	}

	// ========== CALCULO E ATUALIZAÇÃO DOS STATS PRINCIPAIS ==========

	stats.currentStats.pain = stats.baseStats.pain + stats.bonusStats.pain;
	stats.currentStats.life = stats.baseStats.life + stats.bonusStats.life;
	stats.currentStats.movement =
		stats.baseStats.movement + stats.bonusStats.movement;
	stats.currentStats.combat = stats.baseStats.combat + stats.bonusStats.combat;

	stats.currentStats.mountLife =
		stats.baseStats.mountLife + stats.bonusStats.mountLife;
	stats.currentStats.mountPain =
		stats.baseStats.mountPain + stats.bonusStats.mountPain;

	if (localStorage.getItem("directlife")) {
		const lifeChange =
			Number(JSON.parse(localStorage.getItem("directlife"))) +
			Number(stats.bonusStats.life - oldbBonusLife);

		if (lifeChange < 0) {
			saveLocal("directlife", 0);
		} else {
			saveLocal("directlife", lifeChange);
		}
	}
	if (localStorage.getItem("directmovement")) {
		const movementChange =
			Number(JSON.parse(localStorage.getItem("directmovement"))) +
			Number(stats.bonusStats.movement - oldbBonusMovement);

		if (movementChange < 0) {
			saveLocal("directmovement", 0);
		} else {
			saveLocal("directmovement", movementChange);
		}
	}
	if (localStorage.getItem("directcombat")) {
		const combatChange =
			Number(JSON.parse(localStorage.getItem("directcombat"))) +
			Number(stats.bonusStats.combat - oldbBonusCombat);

		if (combatChange < 0) {
			saveLocal("directcombat", 0);
		} else {
			saveLocal("directcombat", combatChange);
		}
	}
	if (localStorage.getItem("directmountLife")) {
		const mountLifeChange =
			Number(JSON.parse(localStorage.getItem("directmountLife"))) +
			Number(stats.bonusStats.mountLife - oldBonusLifeMount);

		if (mountLifeChange < 0) {
			saveLocal("directmountLife", 0);
		} else {
			saveLocal("directmountLife", mountLifeChange);
		}
	}

	MAIN_TYPES.forEach((stat) => {
		if (stats.currentStats[stat] - 6 > 0) {
			stats.extraStats[stat] = stats.currentStats[stat] - 6;
		} else {
			stats.extraStats[stat] = 0;
		}
	});

	// Força o valor do stat vida, dor, defesa, combate e movimento a ser sobescrevido pelo valor do input do usuario
	if (MAIN_TYPES.includes(type)) {
		if (localStorage.getItem(`direct${type}`)) {
			saveLocal(`direct${type}`, 0);
		}
		stats.currentStats[type] = value;
		stats.baseStats[type] = value;
	}

	renderExtras();
	saveLocal("savedStats", stats);

	console.log(stats);
}

init();

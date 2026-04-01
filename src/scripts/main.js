"use strict";

// Arrow function feita para atualizar a foto do personagem
const profileChange = () => {
  const profileInput = document.querySelector(`#profileInput`);
  const profileImage = document.querySelector(`#profileImage`);
  profileInput.addEventListener(`change`, (e) => {
    profileImage.src = URL.createObjectURL(e.target.files[0]);
  });
};

// Dado o livro de Sacramento, esse objeto representa todas
// as condições inicias para a criação de personagem

const stats = {
  life: 0,
  pain: 0,
  defense: 0,
  combat: 0,
  movement: 0,

  plain: {
    life: 6,
    pain: 6,
    defense: 5,
    combat: 1,
    movement: 1,
  },

  bonus: {
    life: 0,
    pain: 0,
    defense: 0,
    combat: 0,
    movement: 0,
  },

  extra: {
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

  miscellany: {
    bounty: 0,
    sina: 0,
    money: 200,
  },
};

const extraStats = {
  extralife: 0,
  extrapain: 0,
  extracombat: 0,
  extramovement: 0,
};

// Uma arrow function feita para inicializar
// as partes persistentes do sistema

function updateStats() {
  statsTracker(`life`, `plain`);
  statsTracker(`pain`, `plain`);
  statsTracker(`combat`, `plain`);
  statsTracker(`movement`, `plain`);
  statsTracker(`physical`, `attributes`);
  statsTracker(`speed`, `attributes`);
  statsTracker(`intellect`, `attributes`);
  statsTracker(`courage`, `attributes`);

  statsValues(`level`, `experience`);
  statsValues(`xp`, `experience`);
  statsValues(`defense`);
  statsValues(`bounty`, `miscellany`);

  extraValues()
}

// Função que faz a sincronização dos trackers com os valores
// do objeto stats

function statsTracker(type, subType) {

  const tracker = document.querySelector(`#${type}`);
  const pips = [...tracker.children];

    stats[type] = stats.plain[type] + stats.bonus[type]

    if ( (stats[type] - 6) > 0 ) {
      stats.extra[type] = stats[type] - 6
    }

  for (const index in pips) {
    let i = Number(index) + 1;

    if (i <= stats[type]) {
      pips[index].classList.add(`marked`);
    } else {
      break;
    }
  }
}

function extraValues() {

  const extra = [...document.querySelectorAll(`.extra`)]

    extra.forEach((element) => {
   
    element.addEventListener(`change`, (event) => {
      const type1 = (event.target.attributes.for.value)
      stats.extra[type1] = Number(event.target.value)
    }) 

    const type2 = (element.attributes.for.value)
    element.value = stats.extra[type2]
  })
}

function statsValues(type, subType) {
  const input = document.querySelector(`#${type}`);

  if (subType == undefined) {
    input.value = stats[type];
  } else {
    stats[type] = stats[subType][type];
    input.value = stats[subType][type];
  }
}

function sinaButtons() {

  const value = document.querySelector(`#sina`);
  const sinaBtns = [...document.querySelectorAll(`.sina-cards__button`)];
  const minusBtn = document.querySelector(`#minus`);

  if ( stats.miscellany.sina == 0 ) {
     minusBtn.classList.add(`sina-cards__button--blocked`)
  }
  
  sinaBtns.forEach((button) => {

    button.addEventListener(`click`, (a) => {

      if (a.target.id == `plus`) {

        stats.miscellany.sina += 1;

      } else {

        if (stats.miscellany.sina > 0) {

          stats.miscellany.sina -= 1;
        }
      }
      
      value.innerHTML = stats.miscellany.sina;

      if ( stats.miscellany.sina <= 0 ) {
        minusBtn.classList.add(`sina-cards__button--blocked`)
      } else {
        minusBtn.classList.remove(`sina-cards__button--blocked`)
      }
    });
  });
}

function statsMecanism() {
  const trackers = [...document.querySelectorAll(`.tracker`)];

  trackers.forEach((element) => {

    const pips = [...element.children];

    pips.forEach((child) => {

      child.addEventListener(`click`, (a) => {

        let i = 0; // Contador da posição do index que disparou o evento

        for (const items of [...element.children]) {
          if (a.target == items) {
            break;
          } else {
            i++;
          }
        }
        
        /* ========== Funcionalidade para adicionar as marcações */

        for (const index in [...element.children]) {
          if (index < i) {
            [...element.children][index].classList.add(`marked`);
          } else if (index == i) {
            if (index != 0) {
              if (index != [...element.children].length - 1) {
                if (
                  [...[...element.children][i + 1].classList].includes(`marked`)
                ) {
                  [...element.children][index].classList.add(`marked`);
                } else {
                  [...element.children][index].classList.toggle(`marked`);
                }
              } else {
                [...element.children][index].classList.toggle(`marked`);
              }
            } else {
              if (
                [...[...element.children][i + 1].classList].includes(`marked`)
              ) {
                [...element.children][index].classList.add(`marked`);
              } else {
                [...element.children][index].classList.toggle(`marked`);
              }
            }
          } else if (index > i) {
            [...element.children][index].classList.remove(`marked`);
          }
        }

        let ola = 0;
        pips.forEach((pipi) => {
          if ([...pipi.classList].includes(`marked`)) {
            ola++;
          }
        });

        
        const type = element.id;
        const tipo = element.attributes.type.value;

        
        if (tipo == `attributes`) {
          attributes(element.id, ola);
          stats.attributes[type] = ola;
        }

        
        
        updateStats();
        
        stats.plain[type] = ola;
        stats[type] = ola;
        
      });
    });
  });
}

function attributes(type, value) {
  if (type == `physical`) {
    stats.bonus.life = value;
  }

  if (type == `speed`) {
    stats.bonus.movement = value;
  }

  if (type == `courage`) {
    stats.bonus.combat = value;
  }
}

// INICIALIZAÇÃO
sinaButtons()
statsMecanism();
updateStats();
profileChange();

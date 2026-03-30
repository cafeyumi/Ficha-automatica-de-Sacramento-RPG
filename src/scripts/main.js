"use strict"

// Arrow function feita para atualizar a foto do personagem
const profileChange = () => {
    const profileInput = document.querySelector(`#profile-input`);
    const profileImage = document.querySelector(`#profile-image`);
    profileInput.addEventListener(`change`, (e) => {
        profileImage.src = URL.createObjectURL(e.target.files[0]);
    })
}

// Dado o livro de Sacramento, esse objeto representa todas
// as condições inicias para a criação de personagem

const stats = {
    life: 6,
    pain: 6,
    defense: 5,
    combat: 1,
    movement: 1,
    physical: 0,
    speed: 0,
    intellect: 0,
    courage: 0,
    level: 1,
    xp: 0
}

// Uma arrow function feita para inicializar
// as partes persistentes do sistema

function updateStats() {
    statsTracker(`life`);
    statsTracker(`pain`);
    statsTracker(`combat`);
    statsTracker(`movement`);
    statsTracker(`physical`);
    statsTracker(`speed`);
    statsTracker(`intellect`);
    statsTracker(`courage`);
    statsValue(`defense`)
    statsValue(`level`)
    statsValue(`xp`)
}



// Função que faz a sincronização dos trackers com os valores
// do objeto stats

function statsTracker(type) {

    // Transforma o parametro para formato de ID, e
    // rearranja os filhos do elemento para um Array.

    const tracker = document.querySelector(`#${type}`);
    const pips = [...tracker.children];

    for (const index in pips) {

        let i = (Number(index) + 1);

        if (i <= stats[type]) {
            pips[index].classList.add(`marked`);
        } else {
            break;
        }
    }
}

function statsValue(type) {
    let input = document.querySelector(`#${type}`);
    input.value = stats[type]
}

const trackers = [...document.querySelectorAll(`.rating-picker`)]

trackers.forEach((element) => {
    [...element.children].forEach((child) => {
        child.addEventListener(`click`, (a) => {
        let cu = 0;
            for (const items of [...element.children]) {

                if (a.target == items) {
                    break
                } else {
                    cu++
                }
            }

            for (const index in [...element.children]) {
                if (index < cu ) {
                    [...element.children][index].classList.add(`marked`)
                } else if (index == cu) {
                    [...element.children][index].classList.toggle(`marked`)
                } else if (index > cu) {
                    [...element.children][index].classList.remove(`marked`)
                }
            }
            console.log(cu)
        })
        
    })
})

updateStats()
profileChange()

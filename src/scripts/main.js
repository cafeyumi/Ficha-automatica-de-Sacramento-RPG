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
    initialcombat: 1,

    movement: 1,
    initialmovement: 1,
    
    sina: 0,
    
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
    sinaValue()
}



// Função que faz a sincronização dos trackers com os valores
// do objeto stats

function statsTracker(type) {

    // Transforma o parametro para formato de ID, e
    // rearranja os filhos do elemento para um Array.

    const tracker = document.querySelector(`#${type}`);
    const pips = [...tracker.children];

    pips.forEach((element) => {
        element.classList.remove(`marked`)
    })

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

function sinaValue() {
    let number = document.querySelector(`#sina`);
    number.innerHTML = stats.sina
    console.log(stats.sina)
}

function statsMecanism() {
const trackers = [...document.querySelectorAll(`.rating-picker`)]

trackers.forEach((element) => {
    const pips = [...element.children];
    pips.forEach((child) => {
        child.addEventListener(`click`, (a) => {
        let i = 0;
            for (const items of [...element.children]) {

                if (a.target == items) {
                    break
                } else {
                    i++
                }
            }

            for (const index in [...element.children]) {
                console.log(i)
                if (index < i ) {
                    [...element.children][index].classList.add(`marked`)
                } else if (index == i) {
                    [...element.children][index].classList.toggle(`marked`)
                } else if (index > i) {
                    [...element.children][index].classList.remove(`marked`)
                }
            }

            let ola = 0;
            pips.forEach((pipi) => {
                if ([...pipi.classList].includes(`marked`)) {
                    ola++
                }
            })

            const type = element.id
            stats[type] = ola
            console.log(stats)
            console.log(`${element.attributes.name.value} possui valor: ${ola}`)

            atributes(element.id, ola)
            console.log(element.id)
            })
        })
    })
}

function atributes(type, value) {
    console.log(type == `speed`)
    console.log(stats.initialmovement + value)
    if (type == `speed`) {
        stats.movement = stats.initialmovement + value
    }
    if (type == `courage`) {
        stats.combat = stats.initialcombat + value
    }
    updateStats()
}

const sinabtns = [...document.querySelectorAll(`.sina-btn`)];

sinabtns.forEach((btn) => {
    btn.addEventListener(`click`, (a) => {
        if (a.target.id == `plus`) {
            stats.sina += 1
            console.log(stats.sina)
            console.log(`adicionei`)
        } else {
            if (stats.sina != 0 ) {
                stats.sina -= 1
                
                console.log(stats.sina)
                console.log(`tirei`)
            } else {
                btn.classList.add(`nop`)
                console.log(btn.classList)
            } 
        }
        updateStats()
    })
})
console.log(sinabtns)

statsMecanism()
updateStats()
profileChange()

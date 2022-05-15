const body = document.querySelector('body');
const btn = document.querySelector('#revelar');
const msj = document.querySelector('#msj');
const score = document.querySelector('#results');
const card = document.getElementById('card');
const opciones = document.querySelector('#opciones');
let winSpan = document.querySelector("#wins");
let lossesSpan = document.querySelector("#losses");

let wins;
let losses;
let pokemones = [] /** el array de pokemon esta vacio */


/** LISTENERS ***************************************/

document.addEventListener('DOMContentLoaded', () => { //espero que cargue el DOM
    guardarScore()
    traerPokemones() //ejecuto la funcion que trae el objeto pokemon
})

btn.addEventListener('click', e => { // click en el boton revelar
    e.preventDefault()
    comparar() //comparo si la card y la eleccion son del mismo pokemon
})


/** FUNCIONES **************************************/

const traerPokemones = async () => {
    try {
        for (let i = 0; i < 3; i++) { // solo me va a traer 3/150 pokemones
            const pokeRandom = numeroRandom(1,251) //filtre solo 250 pokemones aleatorios (ver numeroRandom)
            
            let resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeRandom}`)
            let data = await resp.json()     

            let respColor = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeRandom}/`)
            let dataColor = await respColor.json()  

            const pokemon = { // creo el objeto pokemon, solo img y nombre
                img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${data.id}.svg`,
                name: data.name,
                color: dataColor.color.name
            }
            pokemones.push(pokemon) 
        }
        
        pintarCard(pokemones) //imprimo la imagen en la card
        pintarNombrePokemon() // imprimo las 3 opciones para seleccionar

    } catch(error) {
        console.log(error)
    }
}

const numeroRandom = (min, max) => { 
    return Math.floor(Math.random() * (max - min) + min)
}


const pintarNombrePokemon = () => {
    const form = document.createElement('form');
    form.id = 'form'
    
    opciones.appendChild(form)

    pokemones.forEach(pokemon => {
        let upperName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) // 1er letra Mayusc.
        form.innerHTML += `
        <input name="opcion" type="radio" id="poke_${pokemon.name}">
        <label class="opcion" for="poke_${pokemon.name}">${upperName}</label>
        `
    })

    // el id concat poke-(nombre) / lo separo con split / uso el valor en comparar()

    let labels = document.querySelectorAll('label')
    let arrayLabel = Array.from(labels)

    arrayLabel.forEach(label => { // recorro los labels para darle/quitar la clase css = seleccionado
        label.addEventListener('click', () => {
            label.classList.add('btnSelect') // le agrego class al label que clikee
            const opciones = arrayLabel.filter(opcion => opcion !== label) //recorro labels sin la class seleccionado
            opciones.forEach(op => op.classList.remove('btnSelect')) // elimino class a lo no click
        });
    })
}

const pintarCard = (pokemon) => {
    // imprimo la card con la info de uno de los 3 pokemones que pedi antes
    let indice = Math.round(Math.random()*2) 
    const imgContainer = document.createElement('figure');
    imgContainer.setAttribute('id', 'imgContainer')
    
    imgContainer.innerHTML = `
            <img class="hidden pokeImg" id="${pokemon[indice].name}" src=${pokemon[indice].img}>
            `
    card.appendChild(imgContainer)
}

const comparar = () => {
    const input = document.querySelectorAll('input');
    let inputArray = Array.from(input)
    
    let img = document.querySelector('.pokeImg');
    
    let respCorrecta = img.id
    let checked = inputArray.filter(i => i.checked == true)
    
    if(checked == ''){
        alert('debes elegir una opcion')
        console.log('tenes que elegir algo')//<------------- cambiar por un msj error
    }else{
        let respUsuario = checked[0].id.split('_').slice(1)[0]
        img.classList.toggle('hidden')
        compararRespuesta(respCorrecta, respUsuario)

        setTimeout(()=> {
            restablecer()
        },1200)
    }
}

const compararRespuesta = (respCorrecta, respUsuario) => {
    const mensaje = document.createElement('span')
    mensaje.id = 'mensaje'
    let respuesta = respCorrecta.charAt(0).toUpperCase() + respCorrecta.slice(1)

    respCorrecta == respUsuario ?
        (
            mensaje.textContent = `Ganaste!! es ${respuesta}`,
            mensaje.classList.add('sucess'),
            msj.appendChild(mensaje),
            wins++,
            winSpan.textContent = wins,
            traerDatos()

        ) : (

            mensaje.textContent = `Perdiste... es ${respuesta}`,
            mensaje.classList.add('warning'),
            msj.appendChild(mensaje),
            losses++,
            lossesSpan.textContent = losses,
            traerDatos()
        );
}

const traerDatos = () => {
    localStorage.setItem('wins',JSON.stringify(wins))
    localStorage.setItem('losses',JSON.stringify(losses))
}
/** Remuevo la imagen/ opciones que ya existen en el DOM y vuelvo a cargar otros */
const restablecer = () => {
    const imgContainer = document.querySelector('#imgContainer')
    const form = document.querySelector('#form')

    pokemones = [] /** vuelvo a declarar que esta vacio sino me suma 3 mas */
    imgContainer.remove()
    form.remove()
    msj.removeChild(mensaje)
    traerPokemones()
}

const guardarScore = () => {
    localStorage.length == 0 ?
        (   
            wins = 0, // Declaro mis variables de Ganadas y Perdidas en 0, para luego sumar++
            losses = 0,
            winSpan.textContent = wins,
            lossesSpan.textContent = losses
            
        ) : (
            wins = JSON.parse(localStorage.getItem('wins')),
            losses =JSON.parse(localStorage.getItem('losses')),
            winSpan.textContent = wins,
            lossesSpan.textContent = losses
        )
}

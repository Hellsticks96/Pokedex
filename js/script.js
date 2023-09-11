let allpokemon = [];
let currentPokemon;
let numberOfCurrentPokemon;
let typescount = 0;
let id;
let loadstart = 0;
let loadcount = 36;


//<----------------------------- load from server functions -------------------------------------------------->
async function getPokeInfo(){
    let url = `https://pokeapi.co/api/v2/pokemon?limit=2000`;
    let response = await fetch(url);
    let pokemon = await response.json();
    allpokemon = await pokemon['results'];
    showPokemon();
}

async function showPokemon(){
    let container = document.getElementById('pokedexcontent');
    let types = [];
    renderPokemonCard(container, types);
}

async function showPokeDetails(i){
    let detailscontainer = document.getElementById('detailedpokeinfo');
    let pokemon = `https://pokeapi.co/api/v2/pokemon/${i+1}/`;
    let pokedetails = await loadSinglePokeInfo(pokemon)
    renderDetails(pokedetails);
    id = pokedetails['id'];
    detailscontainer.classList.remove('hide');
    document.getElementById('detailedpokeinfo-background').classList.remove('hide');
}

async function loadSinglePokeInfo(pokemonurl){
    let loadedpokemon = await fetch(pokemonurl);
    let pokemononcard = await loadedpokemon.json();
    return pokemononcard;
}

function loadStats(pokedetails){
    let statscontainer = document.getElementById('statscontainer');
    statscontainer.innerHTML = '';
    let stats = pokedetails['stats'];

    for (let s = 0; s < stats.length; s++) {
        const stat = stats[s]['base_stat'];
        const statname = stats[s]['stat']['name'];

        statscontainer.innerHTML += generateStatsHTML(stat, statname, s);
        makeCapitalLetterForStat(statname, s);
    }
}

function loadTypes(pokedetails){
    let typescontainer = document.getElementById('individualpoketype');
    typescontainer.innerHTML = '';
    let types = pokedetails['types'];

    for (let t = 0; t < types.length; t++) {
        const individualtype = types[t]['type']['name'];
        
        typescontainer.innerHTML += /*html*/`
        <div class="margin-left-poketype poke-type" id="poketype${t}" >${individualtype}</div>
        `;
        makeCapitalLetterForTypeOnCard(individualtype, t);
        document.getElementById(`poketype${t}`).classList.add(`${individualtype}`);
        document.getElementById('poketype1').classList.add('no-margin-bottom')
    }
    fitBackgroundcolor(types);
}

function getAbilities(pokedetails){
    let abilitycontainer = document.getElementById('pokeabilities');
    abilitycontainer.innerHTML = '';
    let abilities = pokedetails['abilities'];
    for (let a = 0; a < abilities.length; a++) {
        const ability = abilities[a]['ability']['name'];
        
        abilitycontainer.innerHTML += generateAbilityHTML(ability);
    }
}

async function searchPokemon(){
    let searchedpokemon = document.getElementById('pokesearch').value;
    let searchword = removeCapitalLetter(searchedpokemon);
    result = await runSearch(searchword);
    showSearchDetails(result);
    document.getElementById('pokesearch').value = '';
}

async function runSearch(searchedpokemon){
    let url = `https://pokeapi.co/api/v2/pokemon/${searchedpokemon}`;
    let response = await fetch(url);
    let resultpokemon = await response.json();
    return resultpokemon;
}






//<------------------------------- render functions -------------------------------------------------->

async function renderPokemonCard(container, types){
    for (loadstart; loadstart < loadcount; loadstart++) {
        let pokemonurl = allpokemon[loadstart]['url'];
        let singlepokeinfo = await loadSinglePokeInfo(pokemonurl);
        types = singlepokeinfo['types'];
        const pokename = singlepokeinfo['name'];
        const pokepicture = singlepokeinfo['sprites']['other']['dream_world']['front_default'];
        container.innerHTML += generateAllPokemonHTML(pokename, pokepicture, loadstart, singlepokeinfo);
        
        makeCapitalLetterForCard(singlepokeinfo, loadstart);
        renderTypes(types);
        fitCardBackground(loadstart, types);
    }
}

function renderDetails(pokedetails){
    makeCapitalLetterForDetails(pokedetails);
    getPicAndId(pokedetails);
    loadTypes(pokedetails);
    loadStats(pokedetails);
    getAbilities(pokedetails)
}

function showSearchDetails(result){
    let detailscontainer = document.getElementById('detailedpokeinfo');
    renderDetails(result);
    id = result['id'];
    detailscontainer.classList.remove('hide');
    document.getElementById('detailedpokeinfo-background').classList.remove('hide');
}

function renderTypes(types){
    for (let t = 0; t < types.length; t++) {
        const type = types[t]['type']['name'];
        document.getElementById(`poketypecontainer${loadstart +1}`).innerHTML += /*html*/`
        <div class="poke-type" id="poketype${typescount}">${type}</div>
        `;
        makeCapitalLetterForTypeOnCard(type, typescount);
        document.getElementById(`poketype${typescount}`).classList.add(`${type}`);
        typescount++;
    }
}







//<-------------------------------------- help funtions ------------------------------------------------------>
function makeCapitalLetterForCard(item, i){
    let nameCapitalLetter = item['name'].charAt(0).toUpperCase();
    document.getElementById(`cardtitle${i}`).innerHTML = nameCapitalLetter + item['name'].slice(1);
}

function makeCapitalLetterForTypeOnCard(item, typescount){
    let capitalLetter = item.charAt(0).toUpperCase()
    document.getElementById(`poketype${typescount}`).innerHTML = capitalLetter + item.slice(1);
}

function makeCapitalLetterForDetails(item){
    let capitalLetter = item['name'].charAt(0).toUpperCase()
    document.getElementById('pokeName').innerHTML = capitalLetter + item['name'].slice(1);
}

function makeCapitalLetterForDetailsTypes(item){
    let capitalLetter = item['name'].charAt(0).toUpperCase()
    document.getElementById('pokeName').innerHTML = capitalLetter + item['name'].slice(1);
}

function makeCapitalLetterForStat(statname, s){
    let CapitalLetter = statname.charAt(0).toUpperCase();
    document.getElementById(`statname${s}`).innerHTML = CapitalLetter + statname.slice(1);
}

function removeCapitalLetter(item){
    let smallletter = item.charAt(0).toLowerCase();
    searchword = smallletter + item.slice(1);
    return searchword;
}

function getPicAndId(item){
    document.getElementById('pokeImage').src = item['sprites']['other']['dream_world']['front_default'];
    document.getElementById('pokenumber').innerHTML = 'Nr.: ' +item['id'];
}

function nextPokemon(){
    showPokeDetails(id);
}

function previousPokemon(){
    if(id == 1){

    }else{
        id = id -2;
        showPokeDetails(id);
    }
}

function closeDetails(){
    document.getElementById('detailedpokeinfo').classList.add('hide');
    document.getElementById('detailedpokeinfo-background').classList.add('hide');
}

function loadMorePokemon(){
    loadcount = loadcount + 36;
    showPokemon();
}

function fitCardBackground(loadstart, types){
    let background = document.getElementById(`cardimg${loadstart+1}`);
    let backgroundtype = types[0]['type']['name'];
    background.classList.add(`${backgroundtype}`);
}

function fitBackgroundcolor(types){
    let background = document.getElementById('pokeHeader');
    background.removeAttribute('class');
    let backgroundtype = types[0]['type']['name'];
    background.classList.add(`${backgroundtype}`);
}



function generateAllPokemonHTML(pokename, pokepicture, i, singlepokeinfo){
    return /*html*/`
    <div onclick="showPokeDetails(${i})" class="card" style="width: 18rem;">
        <div id="cardimg${i+1}" class="card-img">
            <img src='${pokepicture}' class="card-img-top" alt="No IMG available">
        </div>
        <div class="card-body">
         <h5 id="cardtitle${i}" class="card-title"></h5>
         <div class="card-info">
            <div id="poketypecontainer${i+1}"></div>
        </div>    
        </div>
    </div>
    `;
}

function generateStatsHTML(stat, statname, s){
    return /*html*/`
    <div id="statbox">
                <span id="statname${s}">${statname}</span>
                <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="150" aria-valuemin="0" aria-valuemax="150">
                    <div id="hpbar" class="progress-bar bg-danger" style="width: ${stat}%">${stat}</div>
                </div>
            </div>
    `;
}

function generateAbilityHTML(ability){
    return /*html*/`
    <span>${ability}</span>
    `;
}


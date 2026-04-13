const pokemonGrid = document.getElementById('pokemon-grid');
const searchBar = document.getElementById('search-bar');
const regionsContainer = document.querySelector('.regions');
const footerTxt = document.getElementById('footer-text');
const bttBtn = document.getElementById('back-to-top');

let currentPokemonList;
let currentRegionName = 'kanto';

const typeColours = {
  grass: '#78c850',
  fire: '#f08030',
  water: '#6890f0',
  bug: '#a8b820',
  normal: '#a8a878',
  poison: '#a040a0',
  electric: '#f8d030',
  ground: '#e0c068',
  fairy: '#ee99ac',
  fighting: '#c03028',
  psychic: '#f85888',
  rock: '#b8a038',
  ghost: '#705898',
  ice: '#98d8d8',
  dragon: '#7038f8'
};

const regions = [
  { name: 'kanto', start: 1, end: 151 },
  { name: 'johto', start: 152, end: 251 },
  { name: 'hoenn', start: 252, end: 386 },
  { name: 'sinnoh', start: 387, end: 493 },
  { name: 'unova', start: 494, end: 649 },
  { name: 'kalos', start: 650, end: 721 },
  { name: 'alola', start: 722, end: 809 },
  { name: 'galar', start: 810, end: 898 },
  { name: 'hisui', start: 899, end: 905 },
  { name: 'paldea', start: 906, end: 1025 }
];

const currentYear = new Date().getFullYear();
footerTxt.innerText += ` ${currentYear}`;

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    bttBtn.classList.add('show');
  } else {
    bttBtn.classList.remove('show');
  }
});

bttBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

searchBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});

searchBar.addEventListener('input', (e) => {
  if (!currentPokemonList) return;

  const searchString = e.target.value.toLowerCase();

  const filteredPokemon = currentPokemonList.filter((pokemon) => {
    const nameMatch = pokemon.name.toLowerCase().includes(searchString);
    const paddedId = pokemon.id.toString().padStart(3, '0');
    const idMatch = paddedId.includes(searchString);

    return nameMatch || idMatch;
  });

  renderPokemon(filteredPokemon);
});

regionsContainer.addEventListener('click', (e) => {
  const regionBtn = e.target.closest('.region');
  if (!regionBtn) return;

  document.querySelector('.active-filter').classList.remove('active-filter');
  regionBtn.classList.add('active-filter');

  const regionName = regionBtn.getAttribute('data-region');
  const selectedRegion = regions.find((r) => r.name === regionName);

  if (selectedRegion) {
    updateRegionUI(regionName);
    fetchPokemon(selectedRegion.start, selectedRegion.end);
  }
});

const fetchPokemon = async (start, end) => {
  const fetchStart = start || 1;
  const fetchEnd = end || 151;

  pokemonGrid.innerHTML = `
  <div class="loading">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="spinning-pokeball" />
    <p>Loading Region...</p>
  </div>
`;
  const pokemonPromises = [];

  for (let i = fetchStart; i <= fetchEnd; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    pokemonPromises.push(fetch(url).then((res) => res.json()));
  }

  try {
    const allPokemonData = await Promise.all(pokemonPromises);

    currentPokemonList = allPokemonData;
    renderPokemon(currentPokemonList);
  } catch (err) {
    console.log(`Gotcha catch 'em all... but we caught an error: ${err}`);
  }
};

const renderPokemon = (pokemonList) => {
  pokemonGrid.innerHTML = '';
  let filteredList = '';

  if (pokemonList.length === 0) {
    pokemonGrid.innerHTML = `
      <div class="no-results">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="spinning-pokeball" />
        <p>No Pokémon match your search...</p>
      </div>
    `;
    return;
  }
  const filteredString = pokemonList
    .map((pokemon) => {
      return createPokemonCard(pokemon);
    })
    .join('');

  pokemonGrid.innerHTML = filteredString;
};

const createPokemonCard = (pokemon) => {
  let rawName = pokemon.name;
  const suffixesToRemove = [
    '-m',
    '-male',
    '-f',
    '-female',
    '-shield',
    '-average',
    '-midday',
    '-baile',
    '-solo',
    '-disguised',
    '-incarnate',
    '-normal',
    '-aria',
    '-two-segment',
    '-curly',
    '-family-of-four',
    '-family-of-three',
    '-green-plumage',
    '-blue-plumage',
    '-yellow-plumage',
    '-white-plumage',
    '-zero',
    '-hero',
    '-full-belly',
    '-single-strike',
    '-amped',
    '-land',
    '-plant',
    '-standard',
    '-red-striped',
    '-ordinary',
    '-red-meteor'
  ];

  const keepHyphen = [
    'jangmo-o',
    'hakamo-o',
    'kommo-o',
    'ho-oh',
    'porygon-z',
    'wo-chien',
    'chi-yu',
    'chien-pao',
    'ting-lu'
  ];

  if (rawName === 'nidoran-m') rawName = 'nidoran ♂';
  if (rawName === 'nidoran-f') rawName = 'nidoran ♀';

  suffixesToRemove.forEach((suffix) => {
    if (rawName.endsWith(suffix)) {
      rawName = rawName.replace(suffix, '');
    }
  });

  let name = rawName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(keepHyphen.includes(rawName.toLowerCase()) ? '-' : ' ');

  if (name === 'Type Null') {
    name = 'Type: Null';
  }

  const id = pokemon.id.toString().padStart(3, '0');
  const type = pokemon.types[0].type.name;
  const colour = typeColours[type] || '#777';
  const img = pokemon.sprites.front_default;
  // const gif = pokemon.sprites['other'].showdown['front_default'];

  return `
    <div class="pokemon-card" style="--type-colour: ${colour}">
      <div class="card-header">
        <span class="number">#${id}</span>
      </div>
      <div class="img-container">
        <div class="img-gradient-bg"></div>
        <img src="${img}" alt="${name}" />
      </div>
      <div class="info">
        <h3 class="name">${name}</h3>
        <p class="type">Type: <span class="type-label" style="background-color: ${colour}">${type.toUpperCase()}</span></p>
      </div>
    </div>
  `;
};

const updateRegionUI = (regionName) => {
  currentRegionName = regionName;

  const formattedName =
    regionName.charAt(0).toUpperCase() + regionName.slice(1);
  searchBar.placeholder = `Search in ${formattedName}...`;

  searchBar.value = '';
};

updateRegionUI('kanto');
fetchPokemon();

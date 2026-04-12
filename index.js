const pokemonGrid = document.getElementById('pokemon-grid');
const searchBar = document.getElementById('search-bar');

let currentPokemonList;

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

searchBar.addEventListener('input', (e) => {
  const searchString = e.target.value.toLowerCase();

  const filteredPokemon = currentPokemonList.filter((pokemon) => {
    const nameMatch = pokemon.name.toLowerCase().includes(searchString);
    const paddedId = pokemon.id.toString().padStart(3, '0');
    const idMatch = paddedId.includes(searchString);

    return nameMatch || idMatch;
  });

  renderPokemon(filteredPokemon);
});

const fetchPokemon = async () => {
  const pokemonPromises = [];

  for (let i = 1; i <= 151; i++) {
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
  const htmlString = pokemonList
    .map((pokemon) => {
      filteredList += createPokemonCard(pokemon);
    })
    .join('');

  pokemonGrid.innerHTML = filteredList;
};

const createPokemonCard = (pokemon) => {
  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
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

fetchPokemon();

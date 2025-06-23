document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const pokemonInput = document.getElementById('pokemon-input');
    const pokemonDisplay = document.getElementById('pokemon-display');
    const errorMessage = document.getElementById('error-message');
    const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
    const searchPokemon = async () => {
        const pokemonIdentifier = pokemonInput.value.trim().toLowerCase();
        if (!pokemonIdentifier) {
            displayError('Please enter a Pokemon name or ID');
            return;
        }
        clearDisplay();
        pokemonDisplay.innerHTML = '<p class="text-muted">Searching...</p>';
        try {
            const response = await fetch(`${API_URL}${pokemonIdentifier}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Pokemon not found');
                } else {
                    throw new Error(`Idk why this is happening. status ${response.status} `);
                }
            }
            const data = await response.json();
            displayPokemon(data)
        } catch (error) {
            displayError(error.message);
        }
    };
    const displayPokemon = (pokemon) => {
        pokemonDisplay.innerHTML = '';
        const nameElement = document.createElement('h2')
        const imageElement = document.createElement('img');
        const typesContainer = document.createElement('div');
        nameElement.className = 'h3 fw-bold text-capitalize text-dark mb-2';
        nameElement.textContent = pokemon.name;
        imageElement.src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
        imageElement.alt = `Image of ${pokemon.name}`;
        imageElement.className = 'img-fluid mb-3';
        imageElement.style.maxHeaight = "150px";
        imageElement.onerror = () => {
            imageElement.src = 'https://placehold.co/150x150/f87171/ffffff?text=Image+Not+Found';
            imageElement.alt = 'Image not available';
        };
        typesContainer.className = 'd-flex justify-content-center gap-2 mt-2';
        pokemon.types.forEach(typeInfo => {
            const typeBadge = document.createElement('span');
            typeBadge.textContent = typeInfo.type.name;
            typeBadge.className = `type-badge type-${typeInfo.type.name}`;
            typesContainer.appendChild(typeBadge);
        });
        pokemonDisplay.appendChild(nameElement);
        pokemonDisplay.appendChild(imageElement);
        pokemonDisplay.appendChild(typesContainer);
    };
    const displayError = (message) => {
        pokemonDisplay.innerHTML = '';
        errorMessage.textContent = message;
    };
    const clearDisplay = () => {
        pokemonDisplay.innerHTML = '';
        errorMessage.innerHTML = '';
    };
    searchButton.addEventListener('click', searchPokemon);
    pokemonInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchPokemon();
        }
    });
});
   
    async function consultarApi(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
      console.error(`Falló la consulta a la api: ${error}`);
    }
  }

  const buttonSearch = document.querySelector(".buttonSearch");

  buttonSearch.addEventListener("click", async function() {
    const inputPokemon = document.getElementById("in1");
    const pokemonNameInput = inputPokemon.value.toLowerCase();
    const containerError = document.querySelector(".containerError");
    const containerInfo = document.querySelector(".containerInfo");

    infoPokemon(pokemonNameInput);

    async function infoPokemon(pokemonNameInput) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonNameInput}`;
    const pokemonData = await consultarApi(apiUrl);

    const containerEvolution = document.querySelector(".containerEvolution");
    containerEvolution.style.display = "none";


    if (pokemonData) {
        const pokemonName = document.querySelector(".pokemonName");
        pokemonName.textContent = pokemonData.name;

        const pokemonImg = document.querySelector(".pokemonImg");
        pokemonImg.src = pokemonData.sprites.front_default;

        const pokemonType = document.querySelector(".pokemonType");
        pokemonType.textContent = `${pokemonData.types[0].type.name}`;

        const pokemonDescription = document.querySelector(".pokemonDescrition");
        const speciesData = await axios.get(pokemonData.species.url);
        const pokemonDescriptionText = speciesData.data.flavor_text_entries.find(entry => entry.language.name === "es").flavor_text;
        pokemonDescription.textContent = pokemonDescriptionText;

        const abilities = [];
        for (let i = 0; i < pokemonData.abilities.length; i++) {
            abilities.push(pokemonData.abilities[i].ability.name);
        }
        const pokemonAbilities = document.querySelector(".pokemonAbilities");
        pokemonAbilities.textContent = `${abilities.join(", ")}`;


        containerInfo.style.display = "block";
        containerError.style.display = "none";

        const speciesUrl = pokemonData.species.url;
        const speciesResponse = await axios.get(speciesUrl);
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
        
        const evolutionChainResponse = await axios.get(evolutionChainUrl);
        const evolutionChainData = evolutionChainResponse.data;
        
        
        const hasEvolution = evolutionChainData.chain.evolves_to[0].evolves_to[0].species.name !== pokemonData.name;
        console.log(evolutionChainData.chain.evolves_to[0].evolves_to[0].species);
 
        const containerEvolution = document.querySelector(".containerEvolution");

        if (hasEvolution) {    
            containerEvolution.style.display="block";
            const evolutionButton = document.querySelector(".buttonEvolution");
            evolutionButton.addEventListener("click", () => {
                evolucionarPokemon();
            });
        } 
        else {
            containerEvolution.style.display="none";
        }

        async function evolucionarPokemon() {
            const nextEvolutionUrl = evolutionChainData.chain.evolves_to[0].evolves_to[0].species.url;
        
            try {
                const response = await axios.get(nextEvolutionUrl);
                const nextEvolutionData = response.data;

                console.log("Siguiente evolución del Pokémon:");
                console.log(nextEvolutionData.name);

                infoPokemon(nextEvolutionData.name);
            } 
            catch (error) {
                console.error("Error al consultar la siguiente evolución del Pokémon:", error);
            }
        }
    }
    else {
        containerError.style.display = "block";
        containerInfo.style.display = "none";
    }
}

});

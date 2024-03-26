import Pokedex from "pokedex-promise-v2";
import _ from "lodash";

const P = new Pokedex();

async function getSampleByGenerationAsync(generation = "generation-i") {
	const data = await P.getGenerationByName(generation);
	const sample = _.sampleSize(data.pokemon_species, 12);
	const pokemons = [];
	for (const x of sample) {
		const pokemonSpecieRequest = await fetch(x.url);
		const pokemonSpecie = await pokemonSpecieRequest.json();
		const pokemonVariety = _.sample(pokemonSpecie.varieties);
		const pokemonRequest = await fetch(pokemonVariety.pokemon.url);
		const pokemonData = await pokemonRequest.json();
		const pokemonName = pokemonData.name;
		const pokemonID = pokemonData.id;
		const pokemonImgDefault = pokemonData.sprites.front_default;
		const pokemonImgDreamworld =
			pokemonData.sprites.other?.dream_world?.front_default;
		const pokemonImgArtwork =
			pokemonData.sprites.other?.["official-artwork"]?.front_default;
		const pokemonSprite =
			pokemonImgArtwork || pokemonImgDreamworld || pokemonImgDefault;
		const pokemonObj = {
			id: pokemonID,
			name: pokemonName,
			sprite: pokemonSprite,
		};
		pokemons.push(pokemonObj);
	}
	return pokemons;
}

export { getSampleByGenerationAsync };

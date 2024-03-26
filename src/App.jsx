import _ from "lodash";
import { getSampleByGenerationAsync } from "./pokemon"
import './App.css'
import { useState, useEffect } from "react";

function App() {
  const [sample, setSample] = useState([])
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [pickedCards, setPickedCards] = useState([]);

  useEffect(() => {
    // Fetch from URL at app mount.
    const sample = getSampleByGenerationAsync("generation-i")
    sample.then((value) => setSample([...value]))

  }, [])

  function pickCard(pokemon) {
    const selectedCardId = pokemon.id;
    const IdsAreSame = (item) => item.id === selectedCardId
    const isPicked = !!pickedCards.find(IdsAreSame)
    if (isPicked) {
      restartScore()
      shuffleCards()
    } else {
      setScore(score + 1)
      if (score >= bestScore) {
        setBestScore(score + 1)
      }
      setPickedCards([...pickedCards, pokemon])
      shuffleCards()
    }
  }

  function shuffleCards() {
    const shuffledCards = _.shuffle(sample);
    setSample(shuffledCards);
  }

  function restartScore() {
    setScore(0);
    setPickedCards([]);
  }

  return (
    <>
      <div className="container">
        <h1>Pokemon Memory Game</h1>
        <p>Pick a card. Clicking on a previously selected card resets the game.</p>
        <h2>Score: {score}</h2>
        <p>Current best: {bestScore}</p>
        <p>Max score is <strong>12</strong></p>
        <Grid sample={sample} pickCard={pickCard} />
      </div>
    </>
  )
}

function Grid({ sample, pickCard }) {
  return (
    <div className="grid">
      {sample.map((item) =>
        <Card key={item?.id} pokemon={item} pickCard={pickCard} />
      )}
    </div>
  )
}
/**
  * @param {Object} pokemon A processed object whose data was fetched from the Pokemon.co API.
  */
function Card({ pokemon, pickCard }) {
  return (
    <div className="card" onClick={() => pickCard(pokemon)}>
      <h3 className="pokemon name">{pokemon.name}</h3>
      <div className="image container">
        <img src={pokemon.sprite} />
      </div>
    </div>
  )
}

export default App

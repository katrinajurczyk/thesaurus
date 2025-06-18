import { useState } from 'react';
import './App.css';

function App() {

  const Errors = {
    NETWORK_ERROR: "networkError",
    NO_RESULTS: "noResults",
  }

  const [error, setError] = useState();

  const [word, setWord] = useState("");
  const [synonyms, setSynonyms] = useState([]);

  const apiURL = "https://api.datamuse.com/words?rel_syn=";

  const fetchSynonyms = async (searchWord) => {
    try {
      const url = apiURL + searchWord;
      const response = (await fetch(url));
      const synonymData = await response.json();
      setSynonyms(synonymData);
      if (synonymData.length === 0) {
        setError(Errors.NO_RESULTS);
      } else {
        setError(undefined);
      }
    } catch (e) {
      setError(Errors.NETWORK_ERROR);
    }
  }

  const handleFetchSynonyms = async (e) => {
    e.preventDefault();
    await fetchSynonyms(word);
  }

  const handleSynonymClick = async (synonym) => {
    setWord(synonym);
    await fetchSynonyms(synonym);
  }

  return (
    <div className="App">
      <div className="search-header">
        <h2>Thesaurus</h2>
        <form onSubmit={handleFetchSynonyms}>
          <label htmlFor="word-input">Enter word: </label>
          <input
            id="word-input"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          ></input>
          <button>Search</button>
        </form>
      </div>
      { error === Errors.NETWORK_ERROR && 
        <p>We're experiencing a network issue. Please try again.</p>
      }
      { error === Errors.NO_RESULTS && 
        <p>We didn't find any synonyms for that word. Please try again with a different word.</p>
      }
      <ul>
        {synonyms.map(synonym => (
          <li key={synonym.word} onClick={() => handleSynonymClick(synonym.word)}>{synonym.word}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

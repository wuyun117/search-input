import React, { useState, useEffect } from "react";
import axios from 'axios';

import ResultsList, { Suggestion } from "./components/ResultsList/ResultsList";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";
import { useDebounce } from "./hooks";
import { countIndex } from "./util";

import "./App.scss";

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  // work with keyboard up and down to select search suggestions
  const [index, setIndex] = useState<number>(-1);
  const [suburbSuggestions, setSuburbSuggestions] = useState<Suggestion[]>([]);
  const initSuggestionOption: Suggestion = {
    name: '',
    state: {
      abbreviation: ''
    }
  }
  const [suggestionOption, setSugestionOption] = useState<Suggestion>(initSuggestionOption);
  const [recentSelection, setRecentSelection] = useState<string>('');
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  // custome hook: debouncing search input
  const inputDebounced = useDebounce<string>(input, 300);

  const handleTextInput = (value: string) => {
    setInput(value);
    setIsSelected(false);
    setSuburbSuggestions([]);
    setSugestionOption(initSuggestionOption);
    setIndex(-1);
    setError('');
  }

  // suggestion selection based on keyboard up and down
  const handleKeyUp = (key: string, code: number) => {
    switch (`${key}-${code}`) {
      case 'Enter-13':
        if (suggestionOption.name) {
          handleItemSelect(suggestionOption);
        }
        break;
      case 'ArrowUp-38': {
        const length = suburbSuggestions.length;
        const suggestionId = countIndex(index, length, 'up');
        const suggestionOption = { ...suburbSuggestions[suggestionId] }
        setIndex(suggestionId);
        setSugestionOption(suggestionOption);
      }
        break;
      case 'ArrowDown-40': {
        const length = suburbSuggestions.length;
        const suggestionId = countIndex(index, length, 'down');
        const suggestionOption = { ...suburbSuggestions[suggestionId] }
        setIndex(suggestionId);
        setSugestionOption(suggestionOption);
      }
        break;
    }
  }

  const handleItemSelect = (item: Suggestion) => {
    const { name, state } = item;
    const fullName = `${name}, ${state.abbreviation}`;
    setInput(fullName);
    setRecentSelection(fullName);
    setSuburbSuggestions([]);
    setSugestionOption(initSuggestionOption);
    setIsSelected(true);
    setError('');
  }

  const handleMouseHover = (item: Suggestion) => {
    const suggestionId = suburbSuggestions.findIndex(suggestion => JSON.stringify(suggestion) === JSON.stringify(item));
    setSugestionOption(item);
    setIndex(suggestionId);
  }

  const handleButtonClick = () => {
    if (recentSelection) alert(`You recently selected ${recentSelection}`)
    else alert('You have not selected yet!')
  }

  useEffect(() => {
    let suburbs: Array<Suggestion> = [];
    let [inputName, inputAbbr = ''] = inputDebounced.split(',');
    inputName = inputName.toLocaleLowerCase();
    inputAbbr = inputAbbr.trim().toLocaleLowerCase();
    const fetchData = (query: string) => {
      axios.get(`http://localhost:8010/proxy/suburbs.json?q=${query}`)
        .then(res => {
          const data: Suggestion[] = res.data;
          const max = inputName.length;
          for (const suburb of data) {
            const { name, state } = suburb;
            if (name.substring(0, max).toLowerCase() === inputName && (!inputAbbr || (!!inputAbbr && state.abbreviation?.toLocaleLowerCase().includes(inputAbbr)))) {
              suburbs.push(suburb);
            }
          }
          setSuburbSuggestions(suburbs)
        })
        .catch(err => {
          console.log(err);
          setError('network error, please try it again!');
        })
    }

    if (inputDebounced.trim()) {
      suburbs = [];
      fetchData(inputName);
    }

  }, [inputDebounced]);

  return (
    <section>
      <label id="searchLabel" className="search__title" htmlFor="searchInput">Suburb</label>
      <div className="search__body">
        <Input
          id="searchInput"
          value={input}
          placeholder="Search Input"
          aria-labelledby="searchLabel"
          aria-describedby="input suburb want to search"
          onChange={handleTextInput}
          onKeyUp={handleKeyUp}
        />
        <Button className="search__body--button" aria-label="Recent Selection" onClick={handleButtonClick} />
        {!!suburbSuggestions.length
          && !!input
          && !isSelected
          && <ResultsList
            items={suburbSuggestions}
            selectedIndex={index}
            className="search__body--suggestions"
            aria-labelledby="searchLabel"
            onSelect={handleItemSelect}
            onHover={handleMouseHover} />}
        {error && <span className="search__error" data-testid="error-alert">{error}</span>}
      </div>
    </section>
  );
}

export default App;

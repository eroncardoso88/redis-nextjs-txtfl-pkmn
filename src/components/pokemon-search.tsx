'use client';

import { usePokemonSearch, type PokemonSearchResult } from '@/hooks/use-pokemon-search';
import { useCombobox } from 'downshift';
import { Search } from 'lucide-react';
import { useState } from 'react';
import './pokemon-search.scss';

interface PokemonSearchProps {
  onSelect: (pokemon: PokemonSearchResult) => void;
}

export function PokemonSearch({ onSelect }: PokemonSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const { data: pokemonResults, isLoading } = usePokemonSearch(inputValue);
  const items = pokemonResults || [];

  const {
    isOpen,
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue || '');
    },
    itemToString: (item) => (item ? item.name : ''),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onSelect(selectedItem);
      }
    },
  });

  return (
    <div className="pokemon-search__container">
      <div className="pokemon-search__wrapper">
        <div className="pokemon-search__input-wrapper">
          <Search className="pokemon-search__icon" />
          <input
            className="pokemon-search__input"
            placeholder="Search for Pokémon..."
            {...getInputProps()}
          />
          {isLoading && (
            <div className="pokemon-search__spinner"></div>
          )}
        </div>
      </div>
      
      <ul 
        className={`pokemon-search__menu ${isOpen && items.length ? 'pokemon-search__menu--open' : ''}`}
        {...getMenuProps()}
      >
        {isOpen && items.length > 0 ? (
          items.map((item, index) => (
            <li
              className={`pokemon-search__item ${
                highlightedIndex === index ? 'pokemon-search__item--highlighted' : ''
              }`}
              key={`${item.id}-${index}`}
              {...getItemProps({ item, index })}
            >
              <span className="pokemon-search__item-id">#{String(item.id).padStart(3, '0')}</span>
              <span className="pokemon-search__item-name">{item.name}</span>
            </li>
          ))
        ) : isOpen && inputValue.length >= 3 && !isLoading ? (
          <li className="pokemon-search__no-results">No Pokémon found</li>
        ) : null}
      </ul>
    </div>
  );
}
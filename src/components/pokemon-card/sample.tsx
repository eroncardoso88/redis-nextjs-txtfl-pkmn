import pokemons from '@/constants/pokemons'
import PokemonCard from '.'
import './sample.scss'

export default function SamplePokemonCards() {
  return (
    <div className="pkmn-sample pkmn-sample__container">
      {pokemons.map(pkmn => (
        <PokemonCard key={pkmn.id} pokemon={pkmn} />
      ))}
    </div>
  )
}
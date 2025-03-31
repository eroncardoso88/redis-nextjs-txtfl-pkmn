"use client";

import type { PokemonDetails } from "@/types/pokemon-details";
import { useState } from "react";
import BasePokemonCard from "./base-card";
import { tabs } from "./constants/tabs";
import PokemonPictureCarousel from "./picture-carousel";
import PokemonType from "./pokemon-type";
import TabsContent from "./tabs";
import TabsTrigger from "./tabs/trigger";

export interface BasePokemonCard {
  pokemon: PokemonDetails;
}

const get = {
  customTitle(pokemon: PokemonDetails): string {
    return pokemon.name + " #" + String(pokemon.id).padStart(3, "0");
  },
};

export default function PokemonCard({ pokemon }: BasePokemonCard) {
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  return (
    <BasePokemonCard title={get.customTitle(pokemon)} primaryColor={"#ff5a5f"}>
      <PokemonPictureCarousel pokemon={pokemon} />

      {/* Pokemon Type */}
      <PokemonType pokemon={pokemon} />

      {/* Pokemon Tabs Trigger */}
      <TabsTrigger
        value={currentTab}
        onChange={(tab) => setCurrentTab(tab)}
      />

      {/* Pokemon Tabs Content */}
      <TabsContent
        pokemon={pokemon}
        activeTab={currentTab}
      />
    </BasePokemonCard>
  );
}
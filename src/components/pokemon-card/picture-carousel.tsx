
"use client";

import type { PokemonDetails } from "@/types/pokemon-details";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./picture-carousel.scss";


interface PokemonPictureCarouselProps {
  pokemon: PokemonDetails;
}

export default function PokemonPictureCarousel({ pokemon }: PokemonPictureCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sprites, setSprites] = useState<string[]>([]);

  useEffect(() => {

    const extractSprites = () => {
      const spritesList: string[] = [];

      if (pokemon.sprites) {

        if (pokemon.sprites.front_default) spritesList.push(pokemon.sprites.front_default);
        if (pokemon.sprites.back_default) spritesList.push(pokemon.sprites.back_default);
        if (pokemon.sprites.front_shiny) spritesList.push(pokemon.sprites.front_shiny);
        if (pokemon.sprites.back_shiny) spritesList.push(pokemon.sprites.back_shiny);
        if (pokemon.sprites.front_female) spritesList.push(pokemon.sprites.front_female);
        if (pokemon.sprites.back_female) spritesList.push(pokemon.sprites.back_female);
        if (pokemon.sprites.front_shiny_female) spritesList.push(pokemon.sprites.front_shiny_female);
        if (pokemon.sprites.back_shiny_female) spritesList.push(pokemon.sprites.back_shiny_female);


        if (pokemon.sprites.other?.['official-artwork']?.front_default) {
          spritesList.push(pokemon.sprites.other['official-artwork'].front_default);
        }
        if (pokemon.sprites.other?.['official-artwork']?.front_shiny) {
          spritesList.push(pokemon.sprites.other['official-artwork'].front_shiny);
        }


        if (pokemon.sprites.other?.dream_world?.front_default) {
          spritesList.push(pokemon.sprites.other.dream_world.front_default);
        }


        if (pokemon.sprites.other?.home?.front_default) {
          spritesList.push(pokemon.sprites.other.home.front_default);
        }
      }

      return spritesList.filter(Boolean);
    };

    setSprites(extractSprites());
  }, [pokemon]);

  const scrollToSprite = (index: number) => {
    if (!scrollContainerRef.current || sprites.length === 0) return;

    const newIndex = index < 0 ? sprites.length - 1 : index % sprites.length;
    setCurrentIndex(newIndex);


    const spriteElements = Array.from(scrollContainerRef.current.children);
    if (spriteElements.length <= newIndex) return;

    const targetElement = spriteElements[newIndex] as HTMLElement;


    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  const handleNext = () => {
    scrollToSprite(currentIndex + 1);
  };

  const handlePrev = () => {
    scrollToSprite(currentIndex - 1);
  };


  useEffect(() => {
    if (sprites.length <= 1) return;

    const interval = setInterval(() => {
      scrollToSprite(currentIndex + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, sprites.length]);


  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {

      const observer = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visibleEntries.length > 0) {
            const mostVisibleElement = visibleEntries[0].target;
            const indexOfMostVisible = Array.from(container.children).indexOf(mostVisibleElement);

            if (indexOfMostVisible !== -1 && indexOfMostVisible !== currentIndex) {
              setCurrentIndex(indexOfMostVisible);
            }
          }
        },
        {
          root: container,
          threshold: 0.7,
        }
      );


      Array.from(container.children).forEach(child => {
        observer.observe(child);
      });

      return () => {
        observer.disconnect();
      };
    };

    const observer = handleScroll();
    return () => {
      if (observer) observer();
    };
  }, [sprites.length, currentIndex]);

  if (sprites.length === 0) {
    return <div className="h-48 flex items-center justify-center">No sprites available</div>;
  }

  return (
    <div className="piccar__wrapper">
      <div className="piccar__navigation">
        <button
          onClick={handlePrev}
          className="piccar__button piccar__button--left"
          aria-label="Previous sprite"
        >
          <ChevronLeft />
        </button>

        <div className="piccar__container">
          <div className="piccar__scroll-container" ref={scrollContainerRef}>
            {sprites.map((spriteUrl, index) => (
              <div
                key={`${index}-${spriteUrl}`}
                className="piccar__sprite-wrapper"
              >
                <img
                  src={spriteUrl}
                  alt={`${pokemon.name} sprite ${index}`}
                  className="piccar__sprite-img"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="piccar__button piccar__button--right"
          aria-label="Next sprite"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
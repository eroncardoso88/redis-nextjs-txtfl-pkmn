"use client";

import type { PokemonDetails } from "@/types/pokemon-details";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Tab } from "../constants/tabs";
import AboutTab from "./about";
import MovesTab from "./moves";
import StatusTab from "./status";
import "./tabs.scss";

interface TabsContentProps {
  pokemon: PokemonDetails;
  activeTab: Tab;
}

export default function TabsContent({ pokemon, activeTab }: TabsContentProps) {
  const [height, setHeight] = useState<number | 'auto'>(200);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const content = useMemo(() => {
    switch (activeTab.id) {
      case "about":
        return <AboutTab pokemon={pokemon} />;
      case "status":
        return <StatusTab pokemon={pokemon} />;
      case "moves":
        return <MovesTab pokemon={pokemon} />;
      default:
        return <AboutTab pokemon={pokemon} />;
    }
  }, [activeTab.id, pokemon]);
  
  useLayoutEffect(() => {
    if (contentRef.current) {
      const newHeight = contentRef.current.getBoundingClientRect().height
      console.log(`contentRef.current.scrollHeight `, contentRef.current.getBoundingClientRect())
      setHeight(newHeight);
      
      const timer = setTimeout(() => {
        setHeight('auto');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [content, activeTab.id]);
  
  return (
    <div 
      className="pokemon-tabs-content" 
      ref={contentRef} 
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height,
        transition: 'height 0.3s ease-in-out'
      }}
    >
      {content}
    </div>
  );
}
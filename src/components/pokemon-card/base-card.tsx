"use client";

import { PokeballIcon } from "@/components/ui/pk-icons";
import { getRgbaColor } from "@/util/get-rgba";
import { useMemo } from "react";
import "./base-card.scss";

export interface BasePokemonCard {
  primaryColor: string;
  title: string;
  children: React.ReactNode;
}

export default function BasePokemonCard({
  primaryColor,
  title,
  children,
}: BasePokemonCard) {
  const colorValues = useMemo(() => {
    return {
      base: getRgbaColor(primaryColor || "#ff5a5f", 1),
      visible: getRgbaColor(primaryColor || "#ff5a5f", 0.8),
      invisible: getRgbaColor(primaryColor || "#ff5a5f", 0),
    };
  }, [primaryColor]);

  return (
    <div
      className="bpokecard__container"
      style={{
        "--poke-primary-visible": colorValues.visible,
        "--poke-primary-base": colorValues.base,
        "--poke-primary-invisible": colorValues.invisible,
      }}
    >
      {/* content */}
      <div className="bpokecard__content">
        <div className="bpokecard__title">
          <div className="bpokecard__icon">
            <PokeballIcon />
          </div>
          <span>{title.trim().toLowerCase()}</span>
        </div>
        <div className="bpokecard__body">{children}</div>
      </div>
      {/* background */}
      <div className="bpokecard__bg">
        <div className="bpokecard__title-bg">
          <div className="bpokecard__title-gradient__container">
            <div className="bpokecard__title-gradient__svg-wrapper">
              <PokeballIcon style={{ opacity: 0.7 }} />
            </div>
            <div className="bpokecard__title-gradient__bg" />
          </div>
        </div>
        <div className="bpokecard__content-container">
          <div className="bpokecard__content-color" />
        </div>
      </div>
    </div>
  );
}

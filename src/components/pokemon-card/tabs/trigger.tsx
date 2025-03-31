"use client";

import { tabs, type Tab } from "../constants/tabs";
import "./trigger.scss";

export interface TabsTrigger {
  value: Tab;
  onChange: (value: Tab) => void;
}

export default function TabsTrigger({ value, onChange }: TabsTrigger) {
  return (
    <div className="poketabstrigger__wrapper"> 
      <div className="poketabstrigger__container">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`poketabstrigger__trigger  ${
              value.id === tab.id ? "poketabstrigger__trigger--active" : ""
            }`}
          >
            <button onClick={() => onChange(tab)}>{tab.label}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

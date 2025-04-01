
import React, { useState } from 'react';

const characters = [
  {
    name: "Terra",
    traits: ["Ergeben, loyal, zärtlich"],
    image: "./public/images/terra.png",
    greeting: "Bereit. Immer. Für dich."
  },
  {
    name: "Nova",
    traits: ["Verspielt, verführerisch, neugierig"],
    image: "./public/images/nova.png",
    greeting: "Na endlich... ich dachte, du fragst nie."
  },
  {
    name: "Nyxari",
    traits: ["Frech, fordernd, instinktiv"],
    image: "./public/images/Nyxari.png",
    greeting: "Du hast keine Ahnung, worauf du dich einlässt..."
  }
];

function CharacterSelector() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (char) => {
    setSelected(char);
    // TTS-Funktionalität wurde in App.jsx verschoben
    console.log(`Charakter ${char.name} ausgewählt - TTS wird in App.jsx ausgelöst`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black/80">
      <h1 className="text-3xl mb-6">Wähle deinen Begleiter</h1>
      <div className="flex gap-8">
        {characters.map((char) => (
          <div key={char.name} className="text-center">
            <img src={char.image} className="h-80 rounded-xl mb-2" />
            <h2 className="text-xl font-bold">{char.name}</h2>
            <p className="italic text-sm mb-2">„{char.greeting}“</p>
            <ul className="text-sm mb-2">
              {char.traits.map((t, i) => <li key={i}>• {t}</li>)}
            </ul>
            <button className="bg-pink-700 px-4 py-1 rounded" onClick={() => handleSelect(char)}>
              Wählen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterSelector;

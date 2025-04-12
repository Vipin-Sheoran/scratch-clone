import React from "react";
import CatSprite from "./CatSprite";
import { useScratch, SPRITE_TYPES } from "../context/ScratchContext";
import { defaultSpriteSize } from "../constants";

export const BallSprite = ({ size = defaultSpriteSize }) => (
  <div className={`flex items-center justify-center`}>
    <div
      className={`rounded-full bg-gray-500 shadow-lg`}
      style={{
        width: `${size.x}px`,
        height: `${size.y}px`,
      }}
    />
  </div>
);

export const StickFigure = ({ size = defaultSpriteSize }) => (
  <div
    className="flex items-center justify-center"
    style={{
      width: `${size.x}px`,
      height: `${size.y}px`,
    }}
  >
    <svg width="32" height="48" viewBox="0 0 48 72">
      <circle cx="24" cy="12" r="8" fill="black" />
      <line x1="24" y1="20" x2="24" y2="48" stroke="black" strokeWidth="4" />
      <line x1="24" y1="48" x2="12" y2="64" stroke="black" strokeWidth="4" />
      <line x1="24" y1="48" x2="36" y2="64" stroke="black" strokeWidth="4" />
      <line x1="24" y1="32" x2="12" y2="24" stroke="black" strokeWidth="4" />
      <line x1="24" y1="32" x2="36" y2="24" stroke="black" strokeWidth="4" />
    </svg>
  </div>
);

const SpriteOption = ({ id, name, component: Component, onClick }) => (
  <div
    className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center cursor-pointer hover:bg-blue-50 transition-colors"
    onClick={() => onClick(id)}
  >
    <Component />
    <span className="mt-2 text-sm font-medium">{name}</span>
  </div>
);

const availableSprites = [
  { id: SPRITE_TYPES.CAT, name: "Cat", component: CatSprite },
  { id: SPRITE_TYPES.BALL, name: "Ball", component: BallSprite },
  { id: SPRITE_TYPES.STICK, name: "Stick Figure", component: StickFigure },
];

export default function SpriteSelector({ onClose }) {
  const { addSprite, setActiveSprite } = useScratch();

  const handleSpriteSelect = (spriteType) => {
    const spriteName =
      availableSprites.find((s) => s.id === spriteType)?.name || "Sprite";
    const newSpriteId = addSprite(
      `${spriteName} ${Math.floor(Math.random() * 1000)}`,
      spriteType
    );
    setActiveSprite(newSpriteId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Choose a Sprite</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {availableSprites.map((sprite) => (
              <SpriteOption
                key={sprite.id}
                id={sprite.id}
                name={sprite.name}
                component={sprite.component}
                onClick={handleSpriteSelect}
              />
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

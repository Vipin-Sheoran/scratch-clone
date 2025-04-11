import { SPRITE_TYPES } from "../context/ScratchContext";
import React from "react";
import CatSprite from "./CatSprite";
import { BallSprite, StickFigure } from "./SpriteSelector";
import { defaultSpriteSize } from "../constants";

// Sprite wrapper components
const BallSpriteWrapper = ({
  id,
  isSelected,
  onClick,
  size,
  position = { x: 0, y: 0 },
  rotation = 0,
  text,
  textType,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <div
      className="sprite-container"
      style={{
        transform: `rotate(${rotation}deg)`,
        touchAction: "none",
      }}
    >
      {text && (
        <div
          className={
            textType === "think" ? "speech-bubble-think" : "speech-bubble"
          }
        >
          {text}
        </div>
      )}
      <div className={`w-[${size.x}px] h-[${size.y}px]`} onClick={handleClick}>
        <BallSprite isSelected={isSelected} />
      </div>
    </div>
  );
};

const StickFigureWrapper = ({
  id,
  isSelected,
  onClick,
  size,
  position = { x: 0, y: 0 },
  rotation = 0,
  text,
  textType,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <div
      className="sprite-container"
      style={{
        transform: `rotate(${rotation}deg)`,
        touchAction: "none",
      }}
    >
      {text && (
        <div
          className={
            textType === "think" ? "speech-bubble-think" : "speech-bubble"
          }
        >
          {text}
        </div>
      )}
      <div className={`w-[${size.x}px] h-[${size.y}px]`} onClick={handleClick}>
        <StickFigure isSelected={isSelected} />
      </div>
    </div>
  );
};

const CatSpriteWrapper = ({
  id,
  isSelected,
  onClick,
  size,
  position = { x: 0, y: 0 },
  rotation = 0,
  text,
  textType,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <div
      className="sprite-container"
      style={{
        transform: `rotate(${rotation}deg)`,
        touchAction: "none",
      }}
    >
      {text && (
        <div
          className={
            textType === "think" ? "speech-bubble-think" : "speech-bubble"
          }
        >
          {text}
        </div>
      )}
      <div className={`w-[${size.x}px] h-[${size.y}px]`} onClick={handleClick}>
        <CatSprite isSelected={isSelected} />
      </div>
    </div>
  );
};

const Sprite = ({
  type,
  isSelected,
  onClick,
  size = defaultSpriteSize,
  id,
  position = { x: 0, y: 0 },
  rotation = 0,
  text,
  textType,
}) => {
  switch (type) {
    case SPRITE_TYPES.BALL:
      return (
        <BallSpriteWrapper
          id={id}
          isSelected={isSelected}
          onClick={onClick}
          size={size}
          position={position}
          rotation={rotation}
          text={text}
          textType={textType}
        />
      );
    case SPRITE_TYPES.STICK:
      return (
        <StickFigureWrapper
          id={id}
          isSelected={isSelected}
          onClick={onClick}
          size={size}
          position={position}
          rotation={rotation}
          text={text}
          textType={textType}
        />
      );
    case SPRITE_TYPES.CAT:
    default:
      return (
        <CatSpriteWrapper
          id={id}
          isSelected={isSelected}
          onClick={onClick}
          size={size}
          position={position}
          rotation={rotation}
          text={text}
          textType={textType}
        />
      );
  }
};

export default Sprite;

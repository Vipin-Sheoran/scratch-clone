import { SPRITE_TYPES } from "../context/ScratchContext";
import React from "react";
import CatSprite from "./CatSprite";
import { BallSprite, StickFigure } from "./SpriteSelector";
import { defaultSpriteSize } from "../constants";

const SpriteWrapper = ({
  id,
  isSelected,
  onClick,
  size,
  text,
  textType,
  children,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <div
      className="sprite-container relative"
      style={{
        touchAction: "none",
      }}
    >
      {text && (
        <div className="relative">
          <div
            className={`absolute -top-16 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg p-2 max-w-[150px] text-center text-sm z-10`}
          >
            {text}
          </div>

          {textType !== "think" && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-b-0 border-l-transparent border-r-transparent border-t-white z-10"></div>
          )}

          {textType === "think" && (
            <>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border border-gray-200 rounded-full z-10"></div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-gray-200 rounded-full z-10"></div>
            </>
          )}
        </div>
      )}
      <div
        className={`relative`}
        style={{ width: `${size.x}px`, height: `${size.y}px` }}
        onClick={handleClick}
      >
        {children}
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
  text,
  textType,
}) => {
  const getSpriteComponent = () => {
    switch (type) {
      case SPRITE_TYPES.BALL:
        return <BallSprite isSelected={isSelected} />;
      case SPRITE_TYPES.STICK:
        return <StickFigure isSelected={isSelected} />;
      case SPRITE_TYPES.CAT:
      default:
        return <CatSprite isSelected={isSelected} />;
    }
  };

  return (
    <SpriteWrapper
      id={id}
      isSelected={isSelected}
      onClick={onClick}
      size={size}
      text={text}
      textType={textType}
    >
      {getSpriteComponent()}
    </SpriteWrapper>
  );
};

export default Sprite;

import React, { useState, useEffect, useRef } from "react";
import Sprite from "./Sprite";
import SpriteSelector from "./SpriteSelector";
import { useScratch } from "../context/ScratchContext";

export default function PreviewArea() {
  const {
    sprites,
    activeSprite,
    setActiveSprite,
    deleteSprite,
    playAnimations,
    stopAnimations,
    isPlaying: contextIsPlaying,
    updateSpritePosition,
    resetState,
  } = useScratch();
  const [showSpriteSelector, setShowSpriteSelector] = useState(false);
  const stageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [spriteBeingDragged, setSpriteBeingDragged] = useState(null);
  const lastClickRef = useRef({ x: 0, y: 0, time: 0, id: null });
  const spriteRefs = useRef({});

  const handleSpriteClick = (id) => {
    if (!isDragging) {
      setActiveSprite(id);
    }
  };

  const handleRemoveSprite = (e, id) => {
    e.stopPropagation();
    deleteSprite(id);
  };

  const handlePlayClick = () => {
    if (contextIsPlaying) {
      stopAnimations();
    } else {
      playAnimations();
    }
  };

  const handleReset = () => {
    stopAnimations();
    resetState();
  };

  const getSpriteAtPosition = (x, y) => {
    if (!stageRef.current) return null;
    const orderedSprites = getSpritesInOrder().reverse();

    for (const sprite of orderedSprites) {
      if (!spriteRefs.current[sprite.id]) continue;

      const spriteElement = spriteRefs.current[sprite.id];
      const spriteRect = spriteElement.getBoundingClientRect();

      if (
        x >= spriteRect.left &&
        x <= spriteRect.right &&
        y >= spriteRect.top &&
        y <= spriteRect.bottom
      ) {
        return sprite.id;
      }
    }

    return null;
  };

  const handleSpriteMouseDown = (e, id) => {
    if (contextIsPlaying) return;

    e.stopPropagation();

    const now = Date.now();
    const isSameClick =
      now - lastClickRef.current.time < 300 &&
      Math.abs(e.clientX - lastClickRef.current.x) < 10 &&
      Math.abs(e.clientY - lastClickRef.current.y) < 10;

    if (isSameClick && lastClickRef.current.id === id) {
      return;
    }

    lastClickRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: now,
      id: id,
    };

    const spriteIdAtPosition = getSpriteAtPosition(e.clientX, e.clientY);

    const targetSpriteId = spriteIdAtPosition || id;

    const sprite = sprites[targetSpriteId];
    if (!sprite) return;

    setActiveSprite(targetSpriteId);

    const stageRect = stageRef.current.getBoundingClientRect();
    const stageCenterX = stageRect.width / 2;
    const stageCenterY = stageRect.height / 2;

    const spriteAbsoluteX = stageCenterX + sprite.position.x;
    const spriteAbsoluteY = stageCenterY + sprite.position.y;

    const offsetX = e.clientX - stageRect.left - spriteAbsoluteX;
    const offsetY = e.clientY - stageRect.top - spriteAbsoluteY;

    setDragOffset({ x: offsetX, y: offsetY });
    setSpriteBeingDragged(targetSpriteId);
    setIsDragging(true);
  };

  const registerSpriteRef = (id, element) => {
    if (element) {
      spriteRefs.current[id] = element;
    } else {
      delete spriteRefs.current[id];
    }
  };

  useEffect(() => {
    if (!isDragging || !spriteBeingDragged || contextIsPlaying) return;

    const handleMouseMove = (e) => {
      if (!stageRef.current) return;

      const stageRect = stageRef.current.getBoundingClientRect();
      const stageCenterX = stageRect.width / 2;
      const stageCenterY = stageRect.height / 2;
      const newX = e.clientX - stageRect.left - stageCenterX - dragOffset.x;
      const newY = e.clientY - stageRect.top - stageCenterY - dragOffset.y;

      const boundedX = Math.max(-200, Math.min(newX, 200));
      const boundedY = Math.max(-200, Math.min(newY, 200));

      updateSpritePosition(
        spriteBeingDragged,
        { x: boundedX, y: boundedY },
        true
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setSpriteBeingDragged(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    spriteBeingDragged,
    dragOffset,
    updateSpritePosition,
    contextIsPlaying,
  ]);

  useEffect(() => {
    if (!contextIsPlaying && stageRef.current) {
      Object.values(sprites).forEach((sprite) => {
        const { x, y } = sprite.position;
        if (Math.abs(x) > 200 || Math.abs(y) > 200) {
          updateSpritePosition(sprite.id, { x: 0, y: 0 });
        }
      });
    }
  }, [contextIsPlaying, sprites, updateSpritePosition]);

  const getSpritesInOrder = () => {
    return Object.values(sprites).sort((a, b) => {
      if (a.id === activeSprite) return 1;
      if (b.id === activeSprite) return -1;
      return 0;
    });
  };

  const spriteCount = Object.keys(sprites).length;

  return (
    <div className="flex-none h-full overflow-hidden flex flex-col w-full">
      <div className="p-3 flex justify-between border-b border-gray-200">
        <button
          onClick={handleReset}
          className={`px-4 py-1.5 rounded-md bg-gray-500 text-white font-medium text-sm`}
        >
          Reset
        </button>
        <button
          onClick={handlePlayClick}
          className={`px-4 py-1.5 rounded-md ${
            contextIsPlaying ? "bg-red-500" : "bg-green-500"
          } text-white font-medium text-sm`}
        >
          {contextIsPlaying ? "Stop" : "Play"}
        </button>
      </div>

      <div
        ref={stageRef}
        className="bg-white flex-1 relative overflow-hidden sprite-stage"
        style={{ position: "relative" }}
      >
        <div className="absolute inset-0 bg-white">
          <div className="w-full h-full bg-grid-pattern opacity-10"></div>
        </div>
        {getSpritesInOrder().map((sprite) => (
          <div
            key={sprite.id}
            ref={(el) => registerSpriteRef(sprite.id, el)}
            className={`absolute sprite-wrapper ${
              isDragging && spriteBeingDragged === sprite.id
                ? ""
                : "transition-all ease-in-out duration-300"
            }`}
            style={{
              left: `calc(50% + ${sprite.position.x}px)`,
              top: `calc(50% + ${sprite.position.y}px)`,
              transform: "translate(-50%, -50%)",
              zIndex: sprite.id === activeSprite ? 10 : 5,
              cursor: contextIsPlaying ? "default" : "move",
              transform: `rotate(${sprite.rotation}deg)`,
            }}
          >
            <div
              onMouseDown={(e) => handleSpriteMouseDown(e, sprite.id)}
              className={`${
                isDragging && spriteBeingDragged === sprite.id ? "dragging" : ""
              }`}
            >
              <Sprite
                id={sprite.id}
                type={sprite.type}
                isSelected={sprite.id === activeSprite}
                onClick={() => handleSpriteClick(sprite.id)}
                position={{ x: 0, y: 0 }}
                text={sprite.text}
                textType={sprite.textType}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-gray-50 border-t border-gray-200 h-[200px] overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Sprites</span>

          <button
            onClick={() => setShowSpriteSelector(true)}
            className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow hover:bg-blue-600 focus:outline-none"
            title="Add Sprite"
          >
            <span className="text-sm font-bold">+</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 pb-1 px-1">
          {Object.values(sprites).map((sprite) => (
            <div
              key={sprite.id}
              className={`relative rounded p-1 flex flex-col items-center justify-center ${
                sprite.id === activeSprite
                  ? "bg-blue-100 border border-blue-300"
                  : "hover:bg-gray-100 border-gray-200"
              }`}
              onClick={() => handleSpriteClick(sprite.id)}
            >
              <div className="w-12 h-12">
                <Sprite type={sprite.type} />
              </div>

              <div className="mt-1 text-xs text-center font-medium truncate w-12">
                {sprite.name.split(" ")[0]}
              </div>
              {spriteCount > 1 && (
                <button
                  onClick={(e) => handleRemoveSprite(e, sprite.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  title="Remove sprite"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {showSpriteSelector && (
        <SpriteSelector onClose={() => setShowSpriteSelector(false)} />
      )}
    </div>
  );
}

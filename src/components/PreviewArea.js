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
  } = useScratch();
  const [showSpriteSelector, setShowSpriteSelector] = useState(false);
  const stageRef = useRef(null);
  // Add new state for tracking drag operations
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [spriteBeingDragged, setSpriteBeingDragged] = useState(null);
  // Add a ref to track the last clicked position to prevent double handling
  const lastClickRef = useRef({ x: 0, y: 0, time: 0, id: null });
  // Refs to track sprite elements for hit testing
  const spriteRefs = useRef({});

  const handleSpriteClick = (id) => {
    // Only change active sprite if not dragging
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

  // Find the topmost sprite at a given position
  const getSpriteAtPosition = (x, y) => {
    // Get stage dimensions
    if (!stageRef.current) return null;

    const stageRect = stageRef.current.getBoundingClientRect();

    // Check each sprite in reverse order (top to bottom in z-index)
    const orderedSprites = getSpritesInOrder().reverse(); // Reversed to check top sprites first

    for (const sprite of orderedSprites) {
      // Skip if we don't have a ref for this sprite
      if (!spriteRefs.current[sprite.id]) continue;

      const spriteElement = spriteRefs.current[sprite.id];
      const spriteRect = spriteElement.getBoundingClientRect();

      // Check if the point is within the sprite's bounding rectangle
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

  // Add drag and drop handlers
  const handleSpriteMouseDown = (e, id) => {
    if (contextIsPlaying) return; // Prevent dragging during animation playback

    e.stopPropagation();

    // Prevent duplicate handling of the same click/touch
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

    // Perform hit testing to find the topmost sprite at the mouse position
    const spriteIdAtPosition = getSpriteAtPosition(e.clientX, e.clientY);

    // If we found a sprite and it's not the one we thought we clicked, use that one instead
    const targetSpriteId = spriteIdAtPosition || id;

    // Get the sprite position
    const sprite = sprites[targetSpriteId];
    if (!sprite) return;

    // Set the active sprite to the one being dragged
    setActiveSprite(targetSpriteId);

    // Calculate the offset from the mouse to the sprite's actual position
    const stageRect = stageRef.current.getBoundingClientRect();
    const stageCenterX = stageRect.width / 2;
    const stageCenterY = stageRect.height / 2;

    // Calculate the sprite's absolute position in the stage
    const spriteAbsoluteX = stageCenterX + sprite.position.x;
    const spriteAbsoluteY = stageCenterY + sprite.position.y;

    // Calculate the offset of the click from the sprite's center
    const offsetX = e.clientX - stageRect.left - spriteAbsoluteX;
    const offsetY = e.clientY - stageRect.top - spriteAbsoluteY;

    setDragOffset({ x: offsetX, y: offsetY });
    setSpriteBeingDragged(targetSpriteId);
    setIsDragging(true);
  };

  // Touch handler for mobile
  const handleSpriteTouchStart = (e, id) => {
    if (contextIsPlaying) return; // Prevent dragging during animation playback

    e.stopPropagation();

    // Get touch info
    const touch = e.touches[0];

    // Prevent duplicate handling of the same click/touch
    const now = Date.now();
    const isSameTouch =
      now - lastClickRef.current.time < 300 &&
      Math.abs(touch.clientX - lastClickRef.current.x) < 10 &&
      Math.abs(touch.clientY - lastClickRef.current.y) < 10;

    if (isSameTouch && lastClickRef.current.id === id) {
      return;
    }

    lastClickRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now,
      id: id,
    };

    // Perform hit testing to find the topmost sprite at the touch position
    const spriteIdAtPosition = getSpriteAtPosition(
      touch.clientX,
      touch.clientY
    );

    // If we found a sprite and it's not the one we thought we touched, use that one instead
    const targetSpriteId = spriteIdAtPosition || id;

    // Get the sprite position
    const sprite = sprites[targetSpriteId];
    if (!sprite) return;

    // Set the active sprite to the one being dragged
    setActiveSprite(targetSpriteId);

    // Calculate the offset from the touch to the sprite's actual position
    const stageRect = stageRef.current.getBoundingClientRect();
    const stageCenterX = stageRect.width / 2;
    const stageCenterY = stageRect.height / 2;

    // Calculate the sprite's absolute position in the stage
    const spriteAbsoluteX = stageCenterX + sprite.position.x;
    const spriteAbsoluteY = stageCenterY + sprite.position.y;

    // Calculate the offset of the touch from the sprite's position
    const offsetX = touch.clientX - stageRect.left - spriteAbsoluteX;
    const offsetY = touch.clientY - stageRect.top - spriteAbsoluteY;

    setDragOffset({ x: offsetX, y: offsetY });
    setSpriteBeingDragged(targetSpriteId);
    setIsDragging(true);
  };

  // Register a sprite ref
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

      // Calculate new position relative to stage center
      const newX = e.clientX - stageRect.left - stageCenterX - dragOffset.x;
      const newY = e.clientY - stageRect.top - stageCenterY - dragOffset.y;

      // Add boundaries to keep sprites in view
      const boundedX = Math.max(-200, Math.min(newX, 200));
      const boundedY = Math.max(-200, Math.min(newY, 200));

      updateSpritePosition(
        spriteBeingDragged,
        { x: boundedX, y: boundedY },
        true
      );
    };

    const handleTouchMove = (e) => {
      if (!stageRef.current) return;

      // Prevent scrolling while dragging
      e.preventDefault();

      const touch = e.touches[0];

      const stageRect = stageRef.current.getBoundingClientRect();
      const stageCenterX = stageRect.width / 2;
      const stageCenterY = stageRect.height / 2;

      // Calculate new position relative to stage center
      const newX = touch.clientX - stageRect.left - stageCenterX - dragOffset.x;
      const newY = touch.clientY - stageRect.top - stageCenterY - dragOffset.y;

      // Add boundaries to keep sprites in view
      const boundedX = Math.max(-200, Math.min(newX, 200));
      const boundedY = Math.max(-200, Math.min(newY, 200));

      updateSpritePosition(spriteBeingDragged, { x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setSpriteBeingDragged(null);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setSpriteBeingDragged(null);
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [
    isDragging,
    spriteBeingDragged,
    dragOffset,
    updateSpritePosition,
    contextIsPlaying,
  ]);

  // Effect to reset sprite positions when animations stop
  useEffect(() => {
    if (!contextIsPlaying && stageRef.current) {
      // Reset any sprites that might have gone off screen
      Object.values(sprites).forEach((sprite) => {
        const { x, y } = sprite.position;
        if (Math.abs(x) > 200 || Math.abs(y) > 200) {
          updateSpritePosition(sprite.id, { x: 0, y: 0 });
        }
      });
    }
  }, [contextIsPlaying, sprites, updateSpritePosition]);

  // Function to get sprites in z-order (for proper stacking and selection)
  const getSpritesInOrder = () => {
    // Convert to array and make activeSprite appear on top
    return Object.values(sprites).sort((a, b) => {
      if (a.id === activeSprite) return 1;
      if (b.id === activeSprite) return -1;
      return 0;
    });
  };

  // Get sprite count
  const spriteCount = Object.keys(sprites).length;

  return (
    <div className="flex-none h-full overflow-hidden flex flex-col w-full">
      <div className="p-3 flex justify-end border-b border-gray-200">
        <button
          onClick={handlePlayClick}
          className={`px-4 py-1.5 rounded-md ${
            contextIsPlaying ? "bg-red-500" : "bg-green-500"
          } text-white font-medium text-sm`}
        >
          {contextIsPlaying ? "Stop" : "Play"}
        </button>
      </div>

      {/* Sprite Stage Area */}
      <div
        ref={stageRef}
        className="bg-white flex-1 relative overflow-hidden sprite-stage"
        style={{ position: "relative" }}
      >
        {/* Stage background */}
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
              onTouchStart={(e) => handleSpriteTouchStart(e, sprite.id)}
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

      {/* Sprite Selection Area - Bottom */}
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

              {/* Only show remove button if there's more than one sprite */}
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

      {/* Sprite Selector Modal */}
      {showSpriteSelector && (
        <SpriteSelector onClose={() => setShowSpriteSelector(false)} />
      )}
    </div>
  );
}

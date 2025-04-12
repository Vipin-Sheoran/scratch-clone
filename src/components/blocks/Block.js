import React, { useState, useRef, useEffect } from "react";
import { useScratch, BLOCK_TYPES } from "../../context/ScratchContext";

const Block = ({
  id,
  type,
  params = {},
  position,
  children,
  className,
  isDraggable = true,
  isSnapZone = false,
  onSnap,
}) => {
  const { deleteBlock, isDragging, draggedBlock, startDragging, stopDragging } =
    useScratch();

  const [showSnapZone, setShowSnapZone] = useState(false);
  const blockRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDraggingToDelete, setIsDraggingToDelete] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const handleDragStart = (e) => {
    if (!isDraggable) return;

    const rect = blockRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    startDragging({ id, type, params });
    setHasMoved(false);
    e.stopPropagation();
    e.dataTransfer.setData("blockId", id);
  };

  const handleDragEnd = (e) => {
    if (!isDraggable) return;

    if (isDraggingToDelete) {
      console.log("Block dragend detected, deleting:", id);
      deleteBlock(id);
    }

    setIsDraggingToDelete(false);
    stopDragging();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (isDragging && isSnapZone) {
      setShowSnapZone(true);
    }
  };

  const handleDragLeave = () => {
    setShowSnapZone(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isDragging && isSnapZone && onSnap && draggedBlock) {
      onSnap(draggedBlock);
      stopDragging();
    }
    setShowSnapZone(false);
  };

  useEffect(() => {
    if (!isDraggable || !isDragging || !draggedBlock || draggedBlock.id !== id)
      return;

    const handleMouseMove = (e) => {
      setHasMoved(true);
      if (blockRef.current) {
        const midAreaElem = blockRef.current.closest(".flex-1.h-full");

        if (midAreaElem) {
          const midAreaRect = midAreaElem.getBoundingClientRect();

          if (e.clientX < midAreaRect.left + 100) {
            setIsDraggingToDelete(true);
          } else {
            setIsDraggingToDelete(false);
          }
        }
      }
    };

    const handleTouchMove = (e) => {
      setHasMoved(true);
      if (e.touches && e.touches[0] && blockRef.current) {
        const touch = e.touches[0];
        const midAreaElem = blockRef.current.closest(".flex-1.h-full");

        if (midAreaElem) {
          const midAreaRect = midAreaElem.getBoundingClientRect();

          if (touch.clientX < midAreaRect.left + 100) {
            setIsDraggingToDelete(true);
          } else {
            setIsDraggingToDelete(false);
          }
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDragging, draggedBlock, id, isDraggable]);

  const getBackgroundColor = () => {
    switch (type) {
      case BLOCK_TYPES.MOVE:
      case BLOCK_TYPES.TURN_LEFT:
      case BLOCK_TYPES.TURN_RIGHT:
      case BLOCK_TYPES.GOTO:
        return "bg-blue-500";
      case BLOCK_TYPES.SAY:
      case BLOCK_TYPES.THINK:
        return "bg-purple-500";
      case BLOCK_TYPES.REPEAT:
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      ref={blockRef}
      className={`
        flex items-center rounded-md px-3 py-2 my-2 text-white cursor-pointer relative
        ${getBackgroundColor()}
        ${className || ""}
        ${showSnapZone ? "border-2 border-yellow-300" : ""}
        ${
          isDragging && draggedBlock && draggedBlock.id === id
            ? "block-dragging"
            : ""
        }
        ${isDraggingToDelete ? "block-dragging-to-delete" : ""}
      `}
      style={
        position
          ? {
              position: "absolute",
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex:
                isDragging && draggedBlock && draggedBlock.id === id ? 1000 : 1,
            }
          : {}
      }
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      {showSnapZone && (
        <div className="absolute inset-0 border-2 border-yellow-300 rounded-md pointer-events-none" />
      )}
    </div>
  );
};

export default Block;

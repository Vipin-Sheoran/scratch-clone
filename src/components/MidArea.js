import React, { useRef, useEffect, useState } from "react";
import { useScratch } from "../context/ScratchContext";
import BlockFactory from "./blocks/BlockFactory";

export default function MidArea() {
  const {
    activeScripts,
    addBlock,
    deleteBlock,
    isDragging,
    draggedBlock,
    stopDragging,
  } = useScratch();

  const midAreaRef = useRef(null);
  const [isDraggingBlock, setIsDraggingBlock] = useState(false);
  const [blockBeingDragged, setBlockBeingDragged] = useState(null);
  const [isDraggedOutside, setIsDraggedOutside] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const blockType = e.dataTransfer.getData("blockType");
    const blockParams = JSON.parse(
      e.dataTransfer.getData("blockParams") || "{}"
    );

    if (blockType) {
      addBlock(blockType, blockParams, { x: 0, y: 0 });
    }
  };

  useEffect(() => {
    const handleGlobalDrop = (e) => {
      if (isDragging && draggedBlock && isDraggedOutside) {
        if (midAreaRef.current) {
          const rect = midAreaRef.current.getBoundingClientRect();
          if (e.clientX < rect.left) {
            console.log("Deleting block:", draggedBlock.id);
            deleteBlock(draggedBlock.id);
          }
        }
      }

      setIsDraggedOutside(false);
      setIsDraggingBlock(false);
      setBlockBeingDragged(null);
    };

    document.addEventListener("drop", handleGlobalDrop);

    return () => {
      document.removeEventListener("drop", handleGlobalDrop);
    };
  }, [isDragging, draggedBlock, isDraggedOutside, deleteBlock]);

  useEffect(() => {
    if (!isDragging || !draggedBlock) return;

    const handleMouseMove = (e) => {
      if (midAreaRef.current) {
        const rect = midAreaRef.current.getBoundingClientRect();
        const isOutside =
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom;

        if (isOutside && e.clientX < rect.left) {
          setIsDraggingBlock(true);
          setBlockBeingDragged(draggedBlock.id);
          setIsDraggedOutside(true);
        } else {
          if (isOutside) {
            setIsDraggedOutside(true);
          } else {
            setIsDraggedOutside(false);
          }
          setIsDraggingBlock(e.clientX < rect.left + 100);
        }
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();

      if (e.touches && e.touches[0] && midAreaRef.current) {
        const touch = e.touches[0];
        const rect = midAreaRef.current.getBoundingClientRect();

        const isOutside =
          touch.clientX < rect.left ||
          touch.clientX > rect.right ||
          touch.clientY < rect.top ||
          touch.clientY > rect.bottom;

        if (isOutside && touch.clientX < rect.left) {
          setIsDraggingBlock(true);
          setBlockBeingDragged(draggedBlock.id);
          setIsDraggedOutside(true);
        } else {
          if (isOutside) {
            setIsDraggedOutside(true);
          } else {
            setIsDraggedOutside(false);
          }
          setIsDraggingBlock(touch.clientX < rect.left + 100);
        }
      }
    };

    const handleMouseUp = (e) => {
      console.log(
        "Mouse up, isDraggingBlock:",
        isDraggingBlock,
        "blockBeingDragged:",
        blockBeingDragged
      );

      if (isDraggingBlock && blockBeingDragged) {
        if (midAreaRef.current) {
          const rect = midAreaRef.current.getBoundingClientRect();
          if (e.clientX < rect.left) {
            console.log("Delete detected at handleMouseUp");
            deleteBlock(blockBeingDragged);
          }
        }
      } else if (isDraggedOutside && draggedBlock) {
        if (midAreaRef.current) {
          const rect = midAreaRef.current.getBoundingClientRect();
          if (e.clientX < rect.left) {
            console.log("Delete detected at handleMouseUp - outside case");
            deleteBlock(draggedBlock.id);
          }
        }
      }

      setIsDraggingBlock(false);
      setBlockBeingDragged(null);
      setIsDraggedOutside(false);
      stopDragging();
    };

    const handleTouchEnd = (e) => {
      if (
        (isDraggingBlock && blockBeingDragged) ||
        (isDraggedOutside && draggedBlock)
      ) {
        if (midAreaRef.current) {
          if (isDraggingBlock && blockBeingDragged) {
            console.log("Delete detected at handleTouchEnd");
            deleteBlock(blockBeingDragged);
          } else if (isDraggedOutside && draggedBlock) {
            console.log("Delete detected at handleTouchEnd - outside case");
            deleteBlock(draggedBlock.id);
          }
        }
      }

      setIsDraggingBlock(false);
      setBlockBeingDragged(null);
      setIsDraggedOutside(false);
      stopDragging();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [
    isDragging,
    draggedBlock,
    deleteBlock,
    stopDragging,
    isDraggingBlock,
    blockBeingDragged,
    isDraggedOutside,
  ]);

  const handleDragEnd = (e) => {
    if (isDragging && draggedBlock && midAreaRef.current) {
      const rect = midAreaRef.current.getBoundingClientRect();

      if (e.clientX < rect.left) {
        console.log("Delete detected at handleDragEnd");
        deleteBlock(draggedBlock.id);
      }
    }
  };

  return (
    <div
      ref={midAreaRef}
      className="flex-1 h-full overflow-auto relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      {activeScripts.map((block) => (
        <BlockFactory key={block.id} block={block} />
      ))}
    </div>
  );
}

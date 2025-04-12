import React, { useRef, useEffect, useState } from "react";
import { useScratch } from "../context/ScratchContext";
import BlockFactory from "./blocks/BlockFactory";

export default function MidArea() {
  const {
    activeScripts,
    addBlock,
    moveBlock,
    deleteBlock,
    activeSprite,
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

    // Only allow dropping new blocks from the sidebar
    const blockType = e.dataTransfer.getData("blockType");
    const blockParams = JSON.parse(
      e.dataTransfer.getData("blockParams") || "{}"
    );

    if (blockType) {
      // Add the block at the calculated position (will be handled by the reducer)
      addBlock(blockType, blockParams, { x: 0, y: 0 });
    }
  };

  // Set up a global drop handler to catch drops outside the MidArea
  useEffect(() => {
    const handleGlobalDrop = (e) => {
      // If we have a block being dragged and we're outside MidArea
      if (isDragging && draggedBlock && isDraggedOutside) {
        // Check if the drop occurred to the left of MidArea (in sidebar area)
        if (midAreaRef.current) {
          const rect = midAreaRef.current.getBoundingClientRect();
          if (e.clientX < rect.left) {
            // Delete the block
            console.log("Deleting block:", draggedBlock.id);
            deleteBlock(draggedBlock.id);
          }
        }
      }

      // Reset drag state
      setIsDraggedOutside(false);
      setIsDraggingBlock(false);
      setBlockBeingDragged(null);
    };

    document.addEventListener("drop", handleGlobalDrop);

    return () => {
      document.removeEventListener("drop", handleGlobalDrop);
    };
  }, [isDragging, draggedBlock, isDraggedOutside, deleteBlock]);

  // Handle drag events for detecting when blocks are dragged to the sidebar
  useEffect(() => {
    if (!isDragging || !draggedBlock) return;

    const handleMouseMove = (e) => {
      // Check if mouse is outside the MidArea
      if (midAreaRef.current) {
        const rect = midAreaRef.current.getBoundingClientRect();
        const isOutside =
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom;

        // If outside and over the sidebar (left side), set as dragging to sidebar
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
      // Prevent scrolling while dragging
      e.preventDefault();

      if (e.touches && e.touches[0] && midAreaRef.current) {
        const touch = e.touches[0];
        const rect = midAreaRef.current.getBoundingClientRect();

        const isOutside =
          touch.clientX < rect.left ||
          touch.clientX > rect.right ||
          touch.clientY < rect.top ||
          touch.clientY > rect.bottom;

        // If outside and over the sidebar (left side), set as dragging to sidebar
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
        // Check if mouse was released over the sidebar (left side)
        if (midAreaRef.current) {
          const rect = midAreaRef.current.getBoundingClientRect();
          if (e.clientX < rect.left) {
            // Delete the block when dropped in the sidebar
            console.log("Delete detected at handleMouseUp");
            deleteBlock(blockBeingDragged);
          }
        }
      } else if (isDraggedOutside && draggedBlock) {
        // If we're outside but not in sidebar, check if we should delete
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
        // For touch events, we need to check the last known position
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

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    // Clean up
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

  // Add a direct handler for the dragend event on the MidArea
  const handleDragEnd = (e) => {
    if (isDragging && draggedBlock && midAreaRef.current) {
      const rect = midAreaRef.current.getBoundingClientRect();

      // Check if the drag ended outside or to the left of MidArea
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
      {/* Display the active sprite's scripts */}
      {activeScripts.map((block) => (
        <BlockFactory key={block.id} block={block} />
      ))}
    </div>
  );
}

import React, { useRef, useState } from "react";
import Icon from "./Icon";
import { BLOCK_TYPES, useScratch } from "../context/ScratchContext";
import MoveBlock from "./blocks/MoveBlock";
import { TurnLeftBlock, TurnRightBlock } from "./blocks/TurnBlock";
import GotoBlock from "./blocks/GotoBlock";
import { SayBlock, ThinkBlock } from "./blocks/TextBlocks";
import RepeatBlock from "./blocks/RepeatBlock";

export default function Sidebar() {
  const { addBlock, deleteBlock, isDragging, draggedBlock, stopDragging } =
    useScratch();
  const sidebarRef = useRef(null);

  // Add state to track custom values for blocks
  const [sayBlockParams, setSayBlockParams] = useState({
    text: "Hello!",
    duration: 2,
  });
  const [thinkBlockParams, setThinkBlockParams] = useState({
    text: "Hmm...",
    duration: 2,
  });
  const [moveBlockParams, setMoveBlockParams] = useState({ steps: 10 });
  const [turnLeftParams, setTurnLeftParams] = useState({ degrees: 15 });
  const [turnRightParams, setTurnRightParams] = useState({ degrees: 15 });
  const [gotoParams, setGotoParams] = useState({ x: 0, y: 0 });
  const [repeatParams, setRepeatParams] = useState({ count: 10 });

  const handleDragStart = (e, type, params) => {
    e.dataTransfer.setData("blockType", type);
    e.dataTransfer.setData("blockParams", JSON.stringify(params || {}));
    e.dataTransfer.effectAllowed = "copy";
  };

  // Handler for updating the say block parameters
  const handleSayBlockUpdate = (newParams) => {
    setSayBlockParams((prev) => ({ ...prev, ...newParams }));
  };

  // Handler for updating the think block parameters
  const handleThinkBlockUpdate = (newParams) => {
    setThinkBlockParams((prev) => ({ ...prev, ...newParams }));
  };

  // Handler for updating move block parameters
  const handleMoveBlockUpdate = (newParams) => {
    setMoveBlockParams((prev) => ({ ...prev, ...newParams }));
  };

  // Handler for updating turn left parameters
  const handleTurnLeftUpdate = (newParams) => {
    setTurnLeftParams((prev) => ({ ...prev, ...newParams }));
  };

  // Handler for updating turn right parameters
  const handleTurnRightUpdate = (newParams) => {
    setTurnRightParams((prev) => ({ ...prev, ...newParams }));
  };

  // Handler for updating goto parameters
  const handleGotoUpdate = (newParams) => {
    setGotoParams((prev) => ({ ...prev, ...newParams }));
  };

  // Handler for updating repeat parameters
  const handleRepeatUpdate = (newParams) => {
    setRepeatParams((prev) => ({ ...prev, ...newParams }));
  };

  // Handle drag over for the sidebar
  const handleDragOver = (e) => {
    // Only accept drag over if we have a dragged block from MidArea
    if (isDragging && draggedBlock) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }
  };

  // Handle drop for the sidebar
  const handleDrop = (e) => {
    e.preventDefault();

    // Check if we're dropping a block from the MidArea
    if (isDragging && draggedBlock) {
      console.log("Block dropped in sidebar, deleting:", draggedBlock.id);
      deleteBlock(draggedBlock.id);
      stopDragging();
    }
  };

  // Handle drag end event
  const handleDragEnd = (e) => {
    // Check if the drag ended over the sidebar element
    if (sidebarRef.current && isDragging && draggedBlock) {
      const rect = sidebarRef.current.getBoundingClientRect();

      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        console.log("Drag ended over sidebar, deleting:", draggedBlock.id);
        deleteBlock(draggedBlock.id);
      }

      stopDragging();
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="w-100 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      {/* Motion Blocks */}
      <div className="font-bold text-lg mb-2">Motion</div>

      <div
        draggable
        onDragStart={(e) =>
          handleDragStart(e, BLOCK_TYPES.MOVE, moveBlockParams)
        }
        className="w-full"
      >
        <MoveBlock
          id="sidebarMove"
          params={moveBlockParams}
          isDraggable={false}
          onParamChange={handleMoveBlockUpdate}
        />
      </div>

      <div
        draggable
        onDragStart={(e) =>
          handleDragStart(e, BLOCK_TYPES.TURN_LEFT, turnLeftParams)
        }
        className="w-full"
      >
        <TurnLeftBlock
          id="sidebarTurnLeft"
          params={turnLeftParams}
          isDraggable={false}
          onParamChange={handleTurnLeftUpdate}
        />
      </div>

      <div
        draggable
        onDragStart={(e) =>
          handleDragStart(e, BLOCK_TYPES.TURN_RIGHT, turnRightParams)
        }
        className="w-full"
      >
        <TurnRightBlock
          id="sidebarTurnRight"
          params={turnRightParams}
          isDraggable={false}
          onParamChange={handleTurnRightUpdate}
        />
      </div>

      <div
        draggable
        onDragStart={(e) => handleDragStart(e, BLOCK_TYPES.GOTO, gotoParams)}
        className="w-full"
      >
        <GotoBlock
          id="sidebarGoto"
          params={gotoParams}
          isDraggable={false}
          onParamChange={handleGotoUpdate}
        />
      </div>

      {/* Looks Blocks */}
      <div className="font-bold text-lg mb-2 mt-4">Looks</div>

      <div
        draggable
        onDragStart={(e) => handleDragStart(e, BLOCK_TYPES.SAY, sayBlockParams)}
        className="w-full"
      >
        <SayBlock
          id="sidebarSay"
          params={sayBlockParams}
          isDraggable={false}
          onParamChange={handleSayBlockUpdate}
        />
      </div>

      <div
        draggable
        onDragStart={(e) =>
          handleDragStart(e, BLOCK_TYPES.THINK, thinkBlockParams)
        }
        className="w-full"
      >
        <ThinkBlock
          id="sidebarThink"
          params={thinkBlockParams}
          isDraggable={false}
          onParamChange={handleThinkBlockUpdate}
        />
      </div>

      {/* Control Blocks */}
      <div className="font-bold text-lg mb-2 mt-4">Control</div>

      <div
        draggable
        onDragStart={(e) =>
          handleDragStart(e, BLOCK_TYPES.REPEAT, repeatParams)
        }
        className="w-full"
      >
        <RepeatBlock
          id="sidebarRepeat"
          params={repeatParams}
          isDraggable={false}
          onParamChange={handleRepeatUpdate}
        />
      </div>
    </div>
  );
}

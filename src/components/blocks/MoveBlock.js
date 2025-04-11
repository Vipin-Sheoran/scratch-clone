import React from "react";
import Block from "./Block";
import NumberInput from "./NumberInput";
import { BLOCK_TYPES, useScratch } from "../../context/ScratchContext";

const MoveBlock = ({ id, params, position, isDraggable, onParamChange }) => {
  const { updateBlock } = useScratch();

  const handleStepsChange = (steps) => {
    // Update context if it's a MidArea block
    if (id && id !== "sidebarMove") {
      updateBlock(id, { steps });
    }

    // Call the onParamChange callback if provided (for sidebar)
    if (onParamChange) {
      onParamChange({ steps });
    }
  };

  return (
    <Block
      id={id}
      type={BLOCK_TYPES.MOVE}
      params={params}
      position={position}
      isDraggable={isDraggable}
    >
      <span>Move</span>
      <NumberInput
        value={params.steps || 10}
        onChange={handleStepsChange}
        min={-1000}
        max={1000}
      />
      <span>steps</span>
    </Block>
  );
};

export default MoveBlock;

import React from "react";
import Block from "./Block";
import NumberInput from "./NumberInput";
import { BLOCK_TYPES, useScratch } from "../../context/ScratchContext";

const GotoBlock = ({ id, params, position, isDraggable, onParamChange }) => {
  const { updateBlock } = useScratch();

  const handleXChange = (x) => {
    if (id && id !== "sidebarGoto") {
      updateBlock(id, { x });
    }

    if (onParamChange) {
      onParamChange({ x });
    }
  };

  const handleYChange = (y) => {
    if (id && id !== "sidebarGoto") {
      updateBlock(id, { y });
    }
    if (onParamChange) {
      onParamChange({ y });
    }
  };

  return (
    <Block
      id={id}
      type={BLOCK_TYPES.GOTO}
      params={params}
      position={position}
      isDraggable={isDraggable}
    >
      <span>Go to x:</span>
      <NumberInput
        value={params.x || 0}
        onChange={handleXChange}
        min={-500}
        max={500}
        width="50px"
      />
      <span>y:</span>
      <NumberInput
        value={params.y || 0}
        onChange={handleYChange}
        min={-500}
        max={500}
        width="50px"
      />
    </Block>
  );
};

export default GotoBlock;

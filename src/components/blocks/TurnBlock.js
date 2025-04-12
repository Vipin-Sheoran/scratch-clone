import React from "react";
import Block from "./Block";
import NumberInput from "./NumberInput";
import Icon from "../Icon";
import { BLOCK_TYPES, useScratch } from "../../context/ScratchContext";

export const TurnLeftBlock = ({
  id,
  params,
  position,
  isDraggable,
  onParamChange,
}) => {
  const { updateBlock } = useScratch();

  const handleDegreesChange = (degrees) => {
    if (id && id !== "sidebarTurnLeft") {
      updateBlock(id, { degrees });
    }
    if (onParamChange) {
      onParamChange({ degrees });
    }
  };

  return (
    <Block
      id={id}
      type={BLOCK_TYPES.TURN_LEFT}
      params={params}
      position={position}
      isDraggable={isDraggable}
    >
      <span>Turn</span>
      <Icon name="undo" size={15} className="text-white mx-1" />
      <NumberInput
        value={params.degrees || 15}
        onChange={handleDegreesChange}
        min={-360}
        max={360}
      />
      <span>degrees</span>
    </Block>
  );
};

export const TurnRightBlock = ({
  id,
  params,
  position,
  isDraggable,
  onParamChange,
}) => {
  const { updateBlock } = useScratch();

  const handleDegreesChange = (degrees) => {
    if (id && id !== "sidebarTurnRight") {
      updateBlock(id, { degrees });
    }

    if (onParamChange) {
      onParamChange({ degrees });
    }
  };

  return (
    <Block
      id={id}
      type={BLOCK_TYPES.TURN_RIGHT}
      params={params}
      position={position}
      isDraggable={isDraggable}
    >
      <span>Turn</span>
      <Icon name="redo" size={15} className="text-white mx-1" />
      <NumberInput
        value={params.degrees || 15}
        onChange={handleDegreesChange}
        min={-360}
        max={360}
      />
      <span>degrees</span>
    </Block>
  );
};

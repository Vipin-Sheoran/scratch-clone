import React from "react";
import { BLOCK_TYPES } from "../../context/ScratchContext";
import MoveBlock from "./MoveBlock";
import { TurnLeftBlock, TurnRightBlock } from "./TurnBlock";
import GotoBlock from "./GotoBlock";
import { SayBlock, ThinkBlock } from "./TextBlocks";
import RepeatBlock from "./RepeatBlock";

const BlockFactory = ({ block, isDraggable = true }) => {
  const { id, type, params, position } = block;

  switch (type) {
    case BLOCK_TYPES.MOVE:
      return (
        <MoveBlock
          id={id}
          params={params}
          position={position}
          isDraggable={isDraggable}
        />
      );

    case BLOCK_TYPES.TURN_LEFT:
      return (
        <TurnLeftBlock
          id={id}
          params={params}
          position={position}
          isDraggable={isDraggable}
        />
      );

    case BLOCK_TYPES.TURN_RIGHT:
      return (
        <TurnRightBlock
          id={id}
          params={params}
          position={position}
          isDraggable={isDraggable}
        />
      );

    case BLOCK_TYPES.GOTO:
      return (
        <GotoBlock
          id={id}
          params={params}
          position={position}
          isDraggable={isDraggable}
        />
      );

    case BLOCK_TYPES.SAY:
      return (
        <SayBlock
          id={id}
          params={params}
          position={position}
          isDraggable={isDraggable}
        />
      );

    case BLOCK_TYPES.THINK:
      return (
        <ThinkBlock
          id={id}
          params={params}
          position={position}
          isDraggable={isDraggable}
        />
      );

    case BLOCK_TYPES.REPEAT:
      return (
        <RepeatBlock
          id={id}
          params={params}
          position={position}
          isDraggable={isDraggable}
        />
      );

    default:
      return null;
  }
};

export default BlockFactory;

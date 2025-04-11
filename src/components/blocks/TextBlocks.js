import React from "react";
import Block from "./Block";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import { BLOCK_TYPES, useScratch } from "../../context/ScratchContext";

export const SayBlock = ({
  id,
  params,
  position,
  isDraggable,
  onParamChange,
}) => {
  const { updateBlock } = useScratch();

  const handleTextChange = (text) => {
    // Update context if it's a MidArea block
    if (id && id !== "sidebarSay") {
      updateBlock(id, { text });
    }

    // Call the onParamChange callback if provided (for sidebar)
    if (onParamChange) {
      onParamChange({ text });
    }
  };

  const handleDurationChange = (duration) => {
    // Update context if it's a MidArea block
    if (id && id !== "sidebarSay") {
      updateBlock(id, { duration });
    }

    // Call the onParamChange callback if provided (for sidebar)
    if (onParamChange) {
      onParamChange({ duration });
    }
  };

  return (
    <Block
      id={id}
      type={BLOCK_TYPES.SAY}
      params={params}
      position={position}
      isDraggable={isDraggable}
    >
      <span>Say</span>
      <TextInput
        value={params.text || "Hello!"}
        onChange={handleTextChange}
        width="80px"
      />
      <span>for</span>
      <NumberInput
        value={params.duration || 2}
        onChange={handleDurationChange}
        min={0}
        max={60}
        step={0.1}
        width="50px"
      />
      <span>seconds</span>
    </Block>
  );
};

export const ThinkBlock = ({
  id,
  params,
  position,
  isDraggable,
  onParamChange,
}) => {
  const { updateBlock } = useScratch();

  const handleTextChange = (text) => {
    // Update context if it's a MidArea block
    if (id && id !== "sidebarThink") {
      updateBlock(id, { text });
    }

    // Call the onParamChange callback if provided (for sidebar)
    if (onParamChange) {
      onParamChange({ text });
    }
  };

  const handleDurationChange = (duration) => {
    // Update context if it's a MidArea block
    if (id && id !== "sidebarThink") {
      updateBlock(id, { duration });
    }

    // Call the onParamChange callback if provided (for sidebar)
    if (onParamChange) {
      onParamChange({ duration });
    }
  };

  return (
    <Block
      id={id}
      type={BLOCK_TYPES.THINK}
      params={params}
      position={position}
      isDraggable={isDraggable}
    >
      <span>Think</span>
      <TextInput
        value={params.text || "Hmm..."}
        onChange={handleTextChange}
        width="80px"
      />
      <span>for</span>
      <NumberInput
        value={params.duration || 2}
        onChange={handleDurationChange}
        min={0}
        max={60}
        step={0.1}
        width="50px"
      />
      <span>seconds</span>
    </Block>
  );
};

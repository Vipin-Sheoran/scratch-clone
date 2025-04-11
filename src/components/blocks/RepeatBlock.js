import React from "react";
import Block from "./Block";
import NumberInput from "./NumberInput";
import { BLOCK_TYPES, useScratch } from "../../context/ScratchContext";

const RepeatBlock = ({
  id,
  params,
  position,
  isDraggable,
  children,
  onParamChange,
}) => {
  const { updateBlock } = useScratch();

  const handleCountChange = (count) => {
    // Update context if it's a MidArea block
    if (id && id !== "sidebarRepeat") {
      updateBlock(id, { count });
    }

    // Call the onParamChange callback if provided (for sidebar)
    if (onParamChange) {
      onParamChange({ count });
    }
  };

  return (
    <div className="relative">
      <Block
        id={id}
        type={BLOCK_TYPES.REPEAT}
        params={params}
        position={position}
        isDraggable={isDraggable}
      >
        <span>Repeat</span>
        <NumberInput
          value={params.count || 10}
          onChange={handleCountChange}
          min={1}
          max={100}
          width="40px"
        />
        <span>times</span>
      </Block>

      {/* Container for blocks inside the repeat */}
      <div className="ml-8 border-l-2 border-yellow-600 pl-4 mt-1">
        {children}
      </div>
    </div>
  );
};

export default RepeatBlock;

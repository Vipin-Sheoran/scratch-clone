import React, { useState, useEffect, useRef } from "react";

const NumberInput = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  onBlur,
  width = "40px",
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    let newValue = parseFloat(inputValue);

    if (isNaN(newValue)) {
      newValue = value;
    }

    if (min !== undefined && newValue < min) {
      newValue = min;
    }

    if (max !== undefined && newValue > max) {
      newValue = max;
    }

    setInputValue(newValue.toString());
    onChange(newValue);

    if (onBlur) {
      onBlur();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      inputRef.current.blur();
    }
  };

  return (
    <input
      ref={inputRef}
      type="number"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
      style={{
        width,
        padding: "2px 4px",
        borderRadius: "4px",
      }}
      className={`text-black text-center mx-1 ${className}`}
      min={min}
      max={max}
      step={step}
    />
  );
};

export default NumberInput;

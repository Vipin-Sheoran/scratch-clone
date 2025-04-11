import React, { useState, useEffect, useRef } from "react";

const TextInput = ({
  value,
  onChange,
  onBlur,
  width = "80px",
  className = "",
  placeholder = "",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    onChange(inputValue);

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
      type="text"
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
      placeholder={placeholder}
      className={`text-black text-center mx-1 ${className}`}
    />
  );
};

export default TextInput;

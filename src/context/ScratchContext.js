import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";

const ScratchContext = createContext();

// Block types
export const BLOCK_TYPES = {
  MOVE: "MOVE",
  TURN_LEFT: "TURN_LEFT",
  TURN_RIGHT: "TURN_RIGHT",
  GOTO: "GOTO",
  SAY: "SAY",
  THINK: "THINK",
  REPEAT: "REPEAT",
};

// Sprite types
export const SPRITE_TYPES = {
  CAT: "cat",
  BALL: "ball",
  STICK: "stick",
};

// Action types
const ADD_BLOCK = "ADD_BLOCK";
const UPDATE_BLOCK = "UPDATE_BLOCK";
const MOVE_BLOCK = "MOVE_BLOCK";
const DELETE_BLOCK = "DELETE_BLOCK";
const SET_ACTIVE_SPRITE = "SET_ACTIVE_SPRITE";
const ADD_SPRITE = "ADD_SPRITE";
const DELETE_SPRITE = "DELETE_SPRITE";
const UPDATE_SPRITE_POSITION = "UPDATE_SPRITE_POSITION";
const UPDATE_SPRITE_ROTATION = "UPDATE_SPRITE_ROTATION";
const UPDATE_SPRITE_TEXT = "UPDATE_SPRITE_TEXT";
const CLEAR_SPRITE_TEXT = "CLEAR_SPRITE_TEXT";

// Generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial state
const initialState = {
  sprites: {
    sprite1: {
      id: "sprite1",
      name: "Cat Sprite",
      type: SPRITE_TYPES.CAT,
      scripts: [],
      position: { x: 0, y: 0 },
      rotation: 0,
      text: "",
      textType: "say", // "say" or "think"
    },
  },
  activeSprite: "sprite1",
  isDragging: false,
  draggedBlock: null,
};

// Reducer
function scratchReducer(state, action) {
  switch (action.type) {
    case ADD_BLOCK:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [state.activeSprite]: {
            ...state.sprites[state.activeSprite],
            scripts: [
              ...state.sprites[state.activeSprite].scripts,
              {
                id: generateId(),
                type: action.payload.type,
                params: action.payload.params,
                position: action.payload.position,
                next: null,
                prev: null,
              },
            ],
          },
        },
      };

    case UPDATE_BLOCK:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [state.activeSprite]: {
            ...state.sprites[state.activeSprite],
            scripts: state.sprites[state.activeSprite].scripts.map((block) =>
              block.id === action.payload.id
                ? {
                    ...block,
                    params: { ...block.params, ...action.payload.params },
                  }
                : block
            ),
          },
        },
      };

    case MOVE_BLOCK:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [state.activeSprite]: {
            ...state.sprites[state.activeSprite],
            scripts: state.sprites[state.activeSprite].scripts.map((block) =>
              block.id === action.payload.id
                ? { ...block, position: action.payload.position }
                : block
            ),
          },
        },
      };

    case DELETE_BLOCK:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [state.activeSprite]: {
            ...state.sprites[state.activeSprite],
            scripts: state.sprites[state.activeSprite].scripts.filter(
              (block) => block.id !== action.payload.id
            ),
          },
        },
      };

    case SET_ACTIVE_SPRITE:
      return {
        ...state,
        activeSprite: action.payload.id,
      };

    case ADD_SPRITE:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [action.payload.id]: {
            id: action.payload.id,
            name: action.payload.name,
            type: action.payload.spriteType,
            scripts: [],
            position: { x: 0, y: 0 },
            rotation: 0,
            text: "",
            textType: "say",
          },
        },
      };

    case DELETE_SPRITE:
      const { [action.payload.id]: deletedSprite, ...remainingSprites } =
        state.sprites;
      return {
        ...state,
        sprites: remainingSprites,
        activeSprite:
          state.activeSprite === action.payload.id
            ? Object.keys(remainingSprites)[0] || null
            : state.activeSprite,
      };

    case UPDATE_SPRITE_POSITION:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [action.payload.id]: {
            ...state.sprites[action.payload.id],
            position: action.payload.position,
          },
        },
      };

    case UPDATE_SPRITE_ROTATION:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [action.payload.id]: {
            ...state.sprites[action.payload.id],
            rotation: action.payload.rotation,
          },
        },
      };

    case UPDATE_SPRITE_TEXT:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [action.payload.id]: {
            ...state.sprites[action.payload.id],
            text: action.payload.text,
            textType: action.payload.textType || "say",
          },
        },
      };

    case CLEAR_SPRITE_TEXT:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [action.payload.id]: {
            ...state.sprites[action.payload.id],
            text: "",
          },
        },
      };

    default:
      return state;
  }
}

export const ScratchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(scratchReducer, initialState);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const maxLoopsRef = React.useRef(0);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    // Function to execute a script for a specific sprite
    const executeScript = (sprite, script) => {
      if (!script) return;

      switch (script.type) {
        case BLOCK_TYPES.MOVE: {
          const steps = script.params.steps || 10;
          const currentPosition = { ...sprite.position };
          const angleRad = (sprite.rotation * Math.PI) / 180;

          // Calculate new position
          let newX = currentPosition.x + steps * Math.cos(angleRad);
          let newY = currentPosition.y + steps * Math.sin(angleRad);

          // Add boundaries to keep sprites in view (prevent them from going offscreen)
          newX = Math.max(-200, Math.min(newX, 200));
          newY = Math.max(-200, Math.min(newY, 200));

          updateSpritePosition(sprite.id, { x: newX, y: newY });
          break;
        }
        case BLOCK_TYPES.TURN_LEFT: {
          const degrees = script.params.degrees || 15;
          const newRotation = sprite.rotation - degrees;
          updateSpriteRotation(sprite.id, newRotation);
          break;
        }
        case BLOCK_TYPES.TURN_RIGHT: {
          const degrees = script.params.degrees || 15;
          const newRotation = sprite.rotation + degrees;
          updateSpriteRotation(sprite.id, newRotation);
          break;
        }
        case BLOCK_TYPES.GOTO: {
          const x = script.params.x || 0;
          const y = script.params.y || 0;

          // Add boundaries to keep sprites in view
          const boundedX = Math.max(-200, Math.min(x, 200));
          const boundedY = Math.max(-200, Math.min(y, 200));

          updateSpritePosition(sprite.id, { x: boundedX, y: boundedY });
          break;
        }
        case BLOCK_TYPES.SAY: {
          const text = script.params.text || "Hello!";
          const duration = script.params.duration || 2;

          updateSpriteText(sprite.id, text, "say");

          // Clear text after duration
          setTimeout(() => {
            if (isPlaying) {
              clearSpriteText(sprite.id);
            }
          }, duration * 1000);

          break;
        }
        case BLOCK_TYPES.THINK: {
          const text = script.params.text || "Hmm...";
          const duration = script.params.duration || 2;

          updateSpriteText(sprite.id, text, "think");

          // Clear text after duration
          setTimeout(() => {
            if (isPlaying) {
              clearSpriteText(sprite.id);
            }
          }, duration * 1000);

          break;
        }
        case BLOCK_TYPES.REPEAT: {
          // Repeat is not implemented in this simple animation loop
          // Would require more complex state management
          break;
        }
      }
    };

    // Get a copy of the current sprites state for this animation cycle
    const currentSprites = { ...state.sprites };

    // Process animation for all sprites
    Object.values(currentSprites).forEach((sprite) => {
      if (!sprite.scripts || sprite.scripts.length === 0) return;

      // Sort scripts by their y position to determine execution order
      const sortedScripts = [...sprite.scripts].sort(
        (a, b) => (a.position?.y || 0) - (b.position?.y || 0)
      );

      if (animationStep < sortedScripts.length) {
        const currentScript = sortedScripts[animationStep];
        executeScript(sprite, currentScript);
      }
    });

    // Move to next animation step after a delay
    const timerId = setTimeout(() => {
      // Check if we've reached the end of animation for any sprite
      const maxScriptLength = Math.max(
        ...Object.values(currentSprites).map(
          (sprite) => sprite.scripts?.length || 0
        ),
        0 // Default value in case there are no scripts
      );

      // If there are no scripts at all, or we've reached the end, stop playing
      if (maxScriptLength === 0) {
        setIsPlaying(false);
        setAnimationStep(0);
        return;
      }

      if (animationStep >= maxScriptLength - 1) {
        // Reset animation step after all blocks have been executed
        setAnimationStep(0);

        // Set a maximum number of loops to prevent infinite running
        if (maxLoopsRef.current >= 10) {
          setIsPlaying(false);
          maxLoopsRef.current = 0;
        } else {
          maxLoopsRef.current += 1;
        }
      } else {
        setAnimationStep((prev) => prev + 1);
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [isPlaying, animationStep]);

  // Action creators
  const addBlock = (type, params, position) => {
    dispatch({
      type: ADD_BLOCK,
      payload: { type, params, position },
    });
  };

  const updateBlock = (id, params) => {
    dispatch({
      type: UPDATE_BLOCK,
      payload: { id, params },
    });
  };

  const moveBlock = (id, position) => {
    dispatch({
      type: MOVE_BLOCK,
      payload: { id, position },
    });
  };

  const deleteBlock = (id) => {
    dispatch({
      type: DELETE_BLOCK,
      payload: { id },
    });
  };

  const setActiveSprite = (id) => {
    dispatch({
      type: SET_ACTIVE_SPRITE,
      payload: { id },
    });
  };

  const addSprite = (name, spriteType = SPRITE_TYPES.CAT) => {
    const id = generateId();
    dispatch({
      type: ADD_SPRITE,
      payload: { id, name, spriteType },
    });
    return id;
  };

  const deleteSprite = (id) => {
    dispatch({
      type: DELETE_SPRITE,
      payload: { id },
    });
  };

  const updateSpritePosition = (id, position) => {
    dispatch({
      type: UPDATE_SPRITE_POSITION,
      payload: { id, position },
    });
  };

  const updateSpriteRotation = (id, rotation) => {
    dispatch({
      type: UPDATE_SPRITE_ROTATION,
      payload: { id, rotation },
    });
  };

  const updateSpriteText = (id, text, textType = "say") => {
    dispatch({
      type: UPDATE_SPRITE_TEXT,
      payload: { id, text, textType },
    });
  };

  const clearSpriteText = (id) => {
    dispatch({
      type: CLEAR_SPRITE_TEXT,
      payload: { id },
    });
  };

  const startDragging = (block) => {
    setIsDragging(true);
    setDraggedBlock(block);
  };

  const stopDragging = () => {
    setIsDragging(false);
    setDraggedBlock(null);
  };

  const playAnimations = () => {
    setAnimationStep(0);
    setIsPlaying(true);
  };

  const stopAnimations = () => {
    setIsPlaying(false);
    setAnimationStep(0);
  };

  return (
    <ScratchContext.Provider
      value={{
        sprites: state.sprites,
        activeSprite: state.activeSprite,
        activeScripts: state.sprites[state.activeSprite]?.scripts || [],
        addBlock,
        updateBlock,
        moveBlock,
        deleteBlock,
        setActiveSprite,
        addSprite,
        deleteSprite,
        updateSpritePosition,
        updateSpriteRotation,
        updateSpriteText,
        clearSpriteText,
        isDragging,
        draggedBlock,
        startDragging,
        stopDragging,
        isPlaying,
        playAnimations,
        stopAnimations,
      }}
    >
      {children}
    </ScratchContext.Provider>
  );
};

export const useScratch = () => useContext(ScratchContext);

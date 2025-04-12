import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";

const ScratchContext = createContext();

export const BLOCK_TYPES = {
  MOVE: "MOVE",
  TURN_LEFT: "TURN_LEFT",
  TURN_RIGHT: "TURN_RIGHT",
  GOTO: "GOTO",
  SAY: "SAY",
  THINK: "THINK",
  REPEAT: "REPEAT",
};

export const SPRITE_TYPES = {
  CAT: "cat",
  BALL: "ball",
  STICK: "stick",
};

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
const UPDATE_SPRITE_SCRIPTS = "UPDATE_SPRITE_SCRIPTS";

const generateId = () => Math.random().toString(36).substr(2, 9);

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
      textType: "say",
    },
  },
  activeSprite: "sprite1",
  isDragging: false,
  draggedBlock: null,
};

function scratchReducer(state, action) {
  switch (action.type) {
    case ADD_BLOCK:
      const currentScripts = state.sprites[state.activeSprite].scripts;
      // Calculate the new block's position - place it at the bottom of the list
      const lastBlock = currentScripts[currentScripts.length - 1];
      const newPosition = {
        x: 50, // Fixed x position for vertical list
        y: lastBlock ? lastBlock.position.y + 60 : 50, // 60px spacing between blocks
      };

      return {
        ...state,
        sprites: {
          ...state.sprites,
          [state.activeSprite]: {
            ...state.sprites[state.activeSprite],
            scripts: [
              ...currentScripts,
              {
                id: generateId(),
                type: action.payload.type,
                params: action.payload.params,
                position: newPosition,
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
      const spriteScripts = state.sprites[state.activeSprite].scripts;
      const deletedBlockIndex = spriteScripts.findIndex(
        (block) => block.id === action.payload.id
      );

      if (deletedBlockIndex === -1) return state;

      // Recalculate positions for blocks after the deleted one
      const updatedScripts = spriteScripts
        .filter((block) => block.id !== action.payload.id)
        .map((block, index) => ({
          ...block,
          position: {
            x: 50, // Fixed x position
            y: 50 + index * 60, // 60px spacing between blocks
          },
        }));

      return {
        ...state,
        sprites: {
          ...state.sprites,
          [state.activeSprite]: {
            ...state.sprites[state.activeSprite],
            scripts: updatedScripts,
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
            position: action.payload.exact
              ? action.payload.position
              : {
                  x: Math.max(
                    -200,
                    Math.min(
                      state.sprites[action.payload.id].position.x +
                        action.payload.position.x,
                      200
                    )
                  ),
                  y: Math.max(
                    -200,
                    Math.min(
                      state.sprites[action.payload.id].position.y +
                        action.payload.position.y,
                      200
                    )
                  ),
                },
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

    case UPDATE_SPRITE_SCRIPTS:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [action.payload.id]: {
            ...state.sprites[action.payload.id],
            scripts: action.payload.scripts,
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

  const executionLogic = async () => {
    if (!isPlaying) return;

    const checkCollision = (sprite1, sprite2) => {
      if (!sprite1 || !sprite2 || sprite1.id === sprite2.id) return false;

      const dx = sprite1.position.x - sprite2.position.x;
      const dy = sprite1.position.y - sprite2.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance < 40; // Collision threshold
    };
    let collisionOccurred = [];
    let collidedSprites = [];

    // Function to execute a script for a specific sprite
    const executeScript = async (sprite, script, sprites, noEffect = false) => {
      if (!script || (collisionOccurred.includes(sprite.id) && !noEffect))
        return;
      (sprites || []).forEach((otherSprite) => {
        if (checkCollision(sprite, otherSprite)) {
          collisionOccurred = [sprite.id, otherSprite.id];
          collidedSprites = [sprite, otherSprite];
          return;
        }
      });
      if (noEffect) {
        console.log(script, sprite, "no effect");
      }

      return new Promise((resolve) => {
        switch (script.type) {
          case BLOCK_TYPES.MOVE: {
            const steps = script.params.steps || 10;
            const angleRad = (sprite.rotation * Math.PI) / 180;

            // Calculate new position
            let newX = sprite.position.x + steps * Math.cos(angleRad);
            let newY = sprite.position.y + steps * Math.sin(angleRad);
            sprite.position.x = newX;
            sprite.position.y = newY;
            // Add boundaries to keep sprites in view (prevent them from going offscreen)
            updateSpritePosition(sprite.id, { x: newX, y: newY }, true);
            setTimeout(resolve, 0); // Short delay for animation
            break;
          }
          case BLOCK_TYPES.TURN_LEFT: {
            const degrees = sprite.rotation - (script.params.degrees || 15);
            sprite.rotation = degrees;
            updateSpriteRotation(sprite.id, degrees);
            setTimeout(resolve, 0); // Short delay for animation
            break;
          }
          case BLOCK_TYPES.TURN_RIGHT: {
            console.log("TURN_RIGHT", sprite.rotation);
            const degrees = sprite.rotation + (script.params.degrees || 15);
            sprite.rotation = degrees;
            updateSpriteRotation(sprite.id, degrees);
            setTimeout(resolve, 0); // Short delay for animation
            break;
          }
          case BLOCK_TYPES.GOTO: {
            const x = script.params.x || 0;
            const y = script.params.y || 0;

            // Add boundaries to keep sprites in view
            const boundedX = Math.max(-200, Math.min(x, 200));
            const boundedY = Math.max(-200, Math.min(y, 200));

            updateSpritePosition(sprite.id, { x: boundedX, y: boundedY }, true);
            setTimeout(resolve, 0); // Short delay for animation
            break;
          }
          case BLOCK_TYPES.SAY: {
            const text = script.params.text || "Hello!";
            const duration = script.params.duration || 2;

            updateSpriteText(sprite.id, text, "say");

            // Resolve the promise after the full duration
            setTimeout(() => {
              if (isPlaying) {
                clearSpriteText(sprite.id);
              }
              resolve(); // Only resolve after the full duration
            }, duration * 1000);

            break;
          }
          case BLOCK_TYPES.THINK: {
            const text = script.params.text || "Hmm...";
            const duration = script.params.duration || 2;

            updateSpriteText(sprite.id, text, "think");

            // Resolve the promise after the full duration
            setTimeout(() => {
              if (isPlaying) {
                clearSpriteText(sprite.id);
              }
              resolve(); // Only resolve after the full duration
            }, duration * 1000);

            break;
          }
          default:
            resolve(); // Immediately resolve for unknown script types
        }
      });
    };

    // Get a copy of the current sprites state for this animation cycle
    const currentSprites = { ...state.sprites };
    const runLoopForScriptExecution = async (
      sprite,
      sortedScripts,
      noEffect = false
    ) => {
      for (let index = 0; index < sortedScripts.length; index++) {
        if (collisionOccurred.includes(sprite.id) && !noEffect) break;
        const script = sortedScripts[index];
        if (
          sortedScripts[index + 1] &&
          sortedScripts[index + 1].type === BLOCK_TYPES.REPEAT
        ) {
          // Handle repeat blocks
          const repeatCount = sortedScripts[index + 1].params.count;
          for (let i = 0; i < repeatCount; i++) {
            await executeScript(
              sprite,
              script,
              Object.values(currentSprites),
              noEffect
            );
            if (collisionOccurred.includes(sprite.id) && !noEffect) break;
          }
          index++;
        } else {
          await executeScript(
            sprite,
            script,
            Object.values(currentSprites),
            noEffect
          );
        }
      }
    };
    // Process animation for all sprites
    const spritePromises = Object.values(currentSprites).map(async (sprite) => {
      if (!sprite.scripts || sprite.scripts.length === 0) return;

      // Sort scripts by their y position to determine execution order
      const sortedScripts = [...sprite.scripts].sort(
        (a, b) => (a.position?.y || 0) - (b.position?.y || 0)
      );
      await runLoopForScriptExecution(sprite, sortedScripts);
    });

    await Promise.all(spritePromises);
    if (collisionOccurred.length > 0 && collidedSprites.length === 2) {
      const [sprite1, sprite2] = collidedSprites;

      // Swap the scripts between the two sprites
      const tempScripts = sprite1.scripts;
      updateSpriteScripts(sprite1.id, sprite2.scripts);
      updateSpriteScripts(sprite2.id, tempScripts);
      collisionOccurred = [];
      setTimeout(async () => {
        await runLoopForScriptExecution(sprite1, sprite2.scripts, [], true);
        await runLoopForScriptExecution(sprite2, sprite1.scripts, [], true);
      }, 500);
    }
    setIsPlaying(false);
  };
  // Animation loop
  useEffect(() => {
    executionLogic();
    // Move to next animation step after a delay
    const timerId = setTimeout(() => {
      // Check if we've reached the end of animation for any sprite
      const maxScriptLength = Math.max(
        ...Object.values(state.sprites).map(
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
  }, [isPlaying]);

  useEffect(() => {
    console.log("state.sprites", state.sprites);
  }, [isPlaying, state.sprites]);
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

  const updateSpritePosition = (id, position, exact = false) => {
    dispatch({
      type: UPDATE_SPRITE_POSITION,
      payload: { id, position, exact },
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

  const updateSpriteScripts = (id, scripts) => {
    dispatch({
      type: UPDATE_SPRITE_SCRIPTS,
      payload: { id, scripts },
    });
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
        updateSpriteScripts,
      }}
    >
      {children}
    </ScratchContext.Provider>
  );
};

export const useScratch = () => useContext(ScratchContext);

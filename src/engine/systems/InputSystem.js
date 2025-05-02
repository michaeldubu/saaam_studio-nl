// /src/engine/systems/InputSystem.js

export const InputSystem = {
  keysDown: new Set(),
  keysPressed: new Set(),
  keysReleased: new Set(),

  initialize() {
    window.addEventListener('keydown', (e) => {
      if (!InputSystem.keysDown.has(e.key)) {
        InputSystem.keysPressed.add(e.key)
      }
      InputSystem.keysDown.add(e.key)
    })

    window.addEventListener('keyup', (e) => {
      InputSystem.keysDown.delete(e.key)
      InputSystem.keysReleased.add(e.key)
    })
  },

  resetFrameKeys() {
    InputSystem.keysPressed.clear()
    InputSystem.keysReleased.clear()
  },

  isDown(key) {
    return InputSystem.keysDown.has(key)
  },

  isPressed(key) {
    return InputSystem.keysPressed.has(key)
  },

  isReleased(key) {
    return InputSystem.keysReleased.has(key)
  }
}

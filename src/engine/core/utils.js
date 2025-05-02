// /src/engine/core/utils.js

export function vec2(x, y) {
  return { x, y }
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

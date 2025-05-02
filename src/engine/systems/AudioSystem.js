// /src/engine/systems/AudioSystem.js

export const AudioSystem = {
  sounds: {
    jump: new Audio('data:audio/wav;base64,...'),  // You can insert real sound data or paths
    collect: new Audio('data:audio/wav;base64,...'),
    hurt: new Audio('data:audio/wav;base64,...')
  },

  playSound(name) {
    const sound = AudioSystem.sounds[name]
    if (sound) {
      sound.currentTime = 0
      sound.play()
    }
  }
}

// Expose globally if needed
export function playSound(name) {
  AudioSystem.playSound(name)
}

import React, { useState, useEffect, useRef } from 'react'
import { SaaamCompiler } from './dsl/SaaamCompiler'
import { SaaamInterpreter } from './dsl/SaaamInterpreter'

const GameStudio = () => {
  const [dslCode, setDslCode] = useState(`// Try this SAAAM demo!
var player_health = 100;
const GRAVITY = 0.5;

function create() {
  this.position = vec2(100, 100);
  this.speed = 5;
}

function step(delta) {
  if (keyboard_check(vk.right)) {
    this.position.x += this.speed;
  }
  if (keyboard_check(vk.left)) {
    this.position.x -= this.speed;
  }
  if (keyboard_check(vk.up)) {
    this.position.y -= this.speed;
  }
  if (keyboard_check(vk.down)) {
    this.position.y += this.speed;
  }
}

function draw() {
  draw_sprite(0, 0, this.position.x, this.position.y);
}
`)
  const [messages, setMessages] = useState([])
  const canvasRef = useRef(null)
  const interpreterRef = useRef(null)

  const addMessage = (text, type = 'info') => {
    setMessages(prev => [...prev, { text, type }])
  }

  const runDslCode = () => {
    try {
      if (!interpreterRef.current) {
        interpreterRef.current = new SaaamInterpreter(window.SAAAM)
        interpreterRef.current.initialize()
      }

      const interpreter = interpreterRef.current
      const compiler = new SaaamCompiler()

      interpreter.clearFrameKeyStates()
      interpreter.scripts = []
      interpreter.createFunctions = []
      interpreter.stepFunctions = []
      interpreter.drawFunctions = []

      const scriptId = `user_script_${Date.now()}`
      interpreter.loadScript(dslCode, scriptId)
      interpreter.executeScript(scriptId)
      interpreter.startGame(canvasRef.current)

      addMessage('✅ SAAAM code executed successfully!', 'success')
    } catch (err) {
      console.error(err)
      addMessage(`❌ Error: ${err.message}`, 'error')
    }
  }

  return (
    <div className="p-4 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-2">SAAAM Studio</h1>

      <textarea
        className="w-full h-48 p-2 bg-gray-900 text-green-300 font-mono"
        value={dslCode}
        onChange={(e) => setDslCode(e.target.value)}
      />

      <button
        onClick={runDslCode}
        className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        ▶️ Run SAAAM Code
      </button>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="mt-4 border-2 border-green-500"
      />

      <div className="mt-4">
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm ${msg.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameStudio

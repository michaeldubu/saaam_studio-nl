import React, { useState, useEffect } from 'react';
import SaaamIDE from './SaaamIDE';
import GameStudio from './GameStudio';

const SaaamApp = () => {
  const [activeTab, setActiveTab] = useState('ide'); // 'ide' or 'studio'
  const [engineLoaded, setEngineLoaded] = useState(false);

  // Effect to load the game engine
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    // Define the game engine code as a string (simplified for demo)
    const engineCode = `
      // This would normally be loaded from an external file
      // For this demo, we're injecting a simplified version directly
      console.log('SAAAM Game Engine initializing...');
      
      // --- Constants ---
      const WORLD_WIDTH = 800;
      const WORLD_HEIGHT = 600;
      const GRAVITY = 9.8 * 60;
      const FRICTION = 0.9;
      const MAX_FALL_SPEED = 20;
      
      // --- Game Logic ---
      let gameObjects = [];
      let player = null;
      let keysPressed = {};
      let gameRunning = false;
      
      // --- Helper Functions ---
      function vec2(x, y) {
        return { x, y };
      }
      
      function generateId() {
        return Math.random().toString(36).substring(2, 15);
      }
      
      // --- Game Objects ---
      class GameObject {
        constructor(options = {}) {
          this.position = options.position || vec2(0, 0);
          this.size = options.size || vec2(32, 32);
          this.color = options.color || '#FFFFFF';
          this.tag = options.tag || 'default';
        }
        
        draw(ctx) {
          ctx.fillStyle = this.color;
          ctx.fillRect(
            this.position.x, 
            this.position.y, 
            this.size.x, 
            this.size.y
          );
        }
      }
      
      // --- Game Control Functions ---
      let canvas;
      let ctx;
      
      function startGame(canvasElement) {
        if (!canvasElement) {
          console.error('Canvas element not provided');
          return;
        }
        
        canvas = canvasElement;
        ctx = canvas.getContext('2d');
        
        // Create a simple player and platform
        player = new GameObject({
          position: vec2(50, 300),
          size: vec2(32, 48),
          color: '#00FFFF',
          tag: 'player'
        });
        
        const platform = new GameObject({
          position: vec2(0, 550),
          size: vec2(800, 50),
          color: '#888888',
          tag: 'platform'
        });
        
        gameObjects = [player, platform];
        
        // Set up input handling
        window.addEventListener('keydown', (e) => {
          keysPressed[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
          keysPressed[e.key] = false;
        });
        
        // Start the game loop
        gameRunning = true;
        requestAnimationFrame(gameLoop);
        
        console.log('Game started!');
      }
      
      function stopGame() {
        gameRunning = false;
        console.log('Game stopped!');
      }
      
      function gameLoop() {
        if (!gameRunning) return;
        
        // Clear canvas
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Basic player movement
        if (keysPressed['ArrowLeft'] || keysPressed['a']) {
          player.position.x -= 5;
        }
        if (keysPressed['ArrowRight'] || keysPressed['d']) {
          player.position.x += 5;
        }
        
        // Draw game objects
        for (const obj of gameObjects) {
          obj.draw(ctx);
        }
        
        // Continue game loop
        requestAnimationFrame(gameLoop);
      }
      
      function loadLevelFromJSON(json) {
        try {
          console.log('Loading level:', json);
          return true;
        } catch (e) {
          console.error('Error loading level:', e);
          return false;
        }
      }
      
      // --- Expose API ---
      window.SAAAM = {
        GameObject,
        startGame,
        stopGame,
        loadLevelFromJSON,
        gameObjects
      };
      
      console.log('SAAAM Game Engine initialized successfully!');
    `;
    
    // Set the script content
    script.textContent = engineCode;
    
    // Add to document and load
    document.body.appendChild(script);
    
    // Set a timeout to check if the engine loaded
    setTimeout(() => {
      if (window.SAAAM) {
        console.log('SAAAM engine detected and loaded.');
        setEngineLoaded(true);
      } else {
        console.error('Failed to load SAAAM engine.');
      }
    }, 100);
    
    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900">
      {/* Tab Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 flex">
        <button 
          className={`px-6 py-3 font-medium text-sm ${activeTab === 'ide' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          onClick={() => setActiveTab('ide')}
        >
          SAAAM IDE
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm ${activeTab === 'studio' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          onClick={() => setActiveTab('studio')}
        >
          Game Studio
        </button>
        <div className="ml-auto px-4 py-3 flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${engineLoaded ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-300">
            Engine: {engineLoaded ? 'Loaded' : 'Not Loaded'}
          </span>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'ide' ? (
          <SaaamIDE />
        ) : (
          <GameStudio />
        )}
      </div>
    </div>
  );
};

export default SaaamApp;

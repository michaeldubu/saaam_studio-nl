import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Save, Upload, Download, Edit, Plus, Trash2 } from 'lucide-react';

/**
 * SAAAM Game Studio component - main interface for the level editor and game testing
 */
const GameStudio = () => {
  // State for UI management
  const [activeTab, setActiveTab] = useState('editor');
  const [gameRunning, setGameRunning] = useState(false);
  const [selectedTool, setSelectedTool] = useState('platform');
  const [levelData, setLevelData] = useState(null);
  const [currentLevel, setCurrentLevel] = useState({
    name: 'My Level',
    player: { x: 50, y: 300 },
    platforms: [
      { x: 0, y: 550, width: 800, height: 50, color: '#888888' } // Ground
    ],
    enemies: [],
    collectibles: []
  });
  const [objectInDesign, setObjectInDesign] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [messages, setMessages] = useState([{
    text: 'Welcome to SAAAM Game Studio!',
    type: 'info'
  }]);

  // Refs
  const canvasRef = useRef(null);
  const editorCanvasRef = useRef(null);
  const gameInitialized = useRef(false);

  // Check if SAAAM engine is loaded
  const [engineLoaded, setEngineLoaded] = useState(false);
  
  useEffect(() => {
    // Check if SAAAM engine is loaded when component mounts
    const checkEngine = () => {
      if (typeof window.SAAAM !== 'undefined') {
        console.log('SAAAM engine detected in GameStudio');
        setEngineLoaded(true);
        addMessage('Game engine ready', 'success');
        return true;
      }
      return false;
    };
    
    // Check immediately
    if (!checkEngine()) {
      // If not loaded, check every 500ms
      const checkInterval = setInterval(() => {
        if (checkEngine()) {
          clearInterval(checkInterval);
        }
      }, 500);
      
      // Cleanup interval on unmount
      return () => clearInterval(checkInterval);
    }
  }, []);

  // Initialize the level editor canvas
  useEffect(() => {
    if (editorCanvasRef.current && activeTab === 'editor') {
      const canvas = editorCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Draw the grid
      drawEditorGrid(ctx);
      
      // Draw all the objects in the level
      drawLevelObjects(ctx);
    }
  }, [activeTab, currentLevel, selectedObject]);

  // Handle game initialization
  useEffect(() => {
    if (canvasRef.current && activeTab === 'game' && !gameInitialized.current) {
      if (typeof window.SAAAM !== 'undefined') {
        try {
          // Load the current level
          if (window.SAAAM.loadLevelFromJSON) {
            window.SAAAM.loadLevelFromJSON(JSON.stringify(currentLevel));
          } else if (window.SAAAM.loadLevel) {
            window.SAAAM.loadLevel(currentLevel);
          } else {
            throw new Error('No level loading function found in SAAAM engine');
          }
          
          // Start the game with the canvas
          window.SAAAM.startGame(canvasRef.current);
          
          // Update state
          gameInitialized.current = true;
          setGameRunning(true);
          addMessage('Game started successfully!', 'success');
        } catch (error) {
          addMessage(`Error starting game: ${error.message}`, 'error');
          console.error('Error starting game:', error);
        }
      } else {
        addMessage('Game engine not loaded! Please wait or refresh the page.', 'error');
        console.error('SAAAM engine not found on window object');
      }
    }
    
    return () => {
      if (gameInitialized.current && activeTab !== 'game' && window.SAAAM) {
        try {
          window.SAAAM.stopGame();
          gameInitialized.current = false;
          setGameRunning(false);
          addMessage('Game stopped', 'info');
        } catch (error) {
          console.error('Error stopping game:', error);
        }
      }
    };
  }, [activeTab, currentLevel]);

  // Draw the editor grid
  const drawEditorGrid = (ctx) => {
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw grid lines
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= 800; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= 600; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }
  };

  // Draw all level objects in the editor
  const drawLevelObjects = (ctx) => {
    // Draw player
    const player = currentLevel.player;
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(player.x, player.y, 32, 48);
    
    // Draw platforms
    for (const platform of currentLevel.platforms) {
      ctx.fillStyle = platform.color || '#888888';
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Highlight selected object
      if (selectedObject && selectedObject.type === 'platform' && 
          selectedObject.object === platform) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
      }
    }
    
    // Draw enemies
    if (currentLevel.enemies && currentLevel.enemies.length > 0) {
      for (const enemy of currentLevel.enemies) {
        ctx.fillStyle = enemy.color || '#FF0000';
        ctx.fillRect(enemy.x, enemy.y, enemy.width || 32, enemy.height || 32);
        
        // Highlight selected object
        if (selectedObject && selectedObject.type === 'enemy' && 
            selectedObject.object === enemy) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.strokeRect(enemy.x, enemy.y, enemy.width || 32, enemy.height || 32);
        }
      }
    }
    
    // Draw collectibles
    if (currentLevel.collectibles && currentLevel.collectibles.length > 0) {
      for (const collectible of currentLevel.collectibles) {
        ctx.fillStyle = collectible.color || '#FFFF00';
        ctx.fillRect(collectible.x, collectible.y, collectible.width || 20, collectible.height || 20);
        
        // Highlight selected object
        if (selectedObject && selectedObject.type === 'collectible' && 
            selectedObject.object === collectible) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.strokeRect(collectible.x, collectible.y, collectible.width || 20, collectible.height || 20);
        }
      }
    }
    
    // Draw object being created
    if (objectInDesign) {
      ctx.fillStyle = objectInDesign.color;
      ctx.fillRect(
        objectInDesign.x, 
        objectInDesign.y, 
        objectInDesign.width, 
        objectInDesign.height
      );
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        objectInDesign.x, 
        objectInDesign.y, 
        objectInDesign.width, 
        objectInDesign.height
      );
    }
  };

  // Add a message to the console
  const addMessage = (text, type = 'info') => {
    setMessages(prev => [...prev, { text, type, id: Date.now() }]);
  };

  // Handle mouse down in editor
  const handleEditorMouseDown = (e) => {
    const canvas = editorCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if we clicked on an existing object
    let clickedObject = null;
    
    // Check platforms
    for (const platform of currentLevel.platforms) {
      if (x >= platform.x && x <= platform.x + platform.width &&
          y >= platform.y && y <= platform.y + platform.height) {
        clickedObject = { type: 'platform', object: platform };
        break;
      }
    }
    
    // Check enemies
    if (!clickedObject && currentLevel.enemies && currentLevel.enemies.length > 0) {
      for (const enemy of currentLevel.enemies) {
        const width = enemy.width || 32;
        const height = enemy.height || 32;
        if (x >= enemy.x && x <= enemy.x + width &&
            y >= enemy.y && y <= enemy.y + height) {
          clickedObject = { type: 'enemy', object: enemy };
          break;
        }
      }
    }
    
    // Check collectibles
    if (!clickedObject && currentLevel.collectibles && currentLevel.collectibles.length > 0) {
      for (const collectible of currentLevel.collectibles) {
        const width = collectible.width || 20;
        const height = collectible.height || 20;
        if (x >= collectible.x && x <= collectible.x + width &&
            y >= collectible.y && y <= collectible.y + height) {
          clickedObject = { type: 'collectible', object: collectible };
          break;
        }
      }
    }
    
    if (clickedObject) {
      setSelectedObject(clickedObject);
    } else {
      setSelectedObject(null);
      
      // Start creating a new object
      if (selectedTool === 'platform') {
        setObjectInDesign({
          x,
          y,
          width: 0,
          height: 0,
          color: '#888888',
          startX: x,
          startY: y
        });
      } else if (selectedTool === 'enemy') {
        // Place enemy directly
        const newEnemy = {
          x: x - 16,
          y: y - 16,
          width: 32,
          height: 32,
          color: '#FF0000'
        };
        
        setCurrentLevel(prev => ({
          ...prev,
          enemies: [...(prev.enemies || []), newEnemy]
        }));
        
        addMessage('Enemy added', 'success');
      } else if (selectedTool === 'collectible') {
        // Place collectible directly
        const newCollectible = {
          x: x - 10,
          y: y - 10,
          width: 20,
          height: 20,
          color: '#FFFF00'
        };
        
        setCurrentLevel(prev => ({
          ...prev,
          collectibles: [...(prev.collectibles || []), newCollectible]
        }));
        
        addMessage('Collectible added', 'success');
      } else if (selectedTool === 'player') {
        // Move player
        setCurrentLevel(prev => ({
          ...prev,
          player: { x: x - 16, y: y - 24 }
        }));
        
        addMessage('Player position updated', 'success');
      }
    }
  };

  // Handle mouse move in editor
  const handleEditorMouseMove = (e) => {
    if (!objectInDesign) return;
    
    const canvas = editorCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update object dimensions
    setObjectInDesign(prev => ({
      ...prev,
      width: x - prev.startX,
      height: y - prev.startY
    }));
  };

  // Handle mouse up in editor
  const handleEditorMouseUp = () => {
    if (!objectInDesign) return;
    
    // Normalize dimensions (handle negative width/height)
    let { x, y, width, height, color, startX, startY } = objectInDesign;
    
    if (width < 0) {
      x = startX + width;
      width = Math.abs(width);
    }
    
    if (height < 0) {
      y = startY + height;
      height = Math.abs(height);
    }
    
    // Only add if it has some size
    if (width > 5 && height > 5) {
      if (selectedTool === 'platform') {
        const newPlatform = { x, y, width, height, color };
        
        setCurrentLevel(prev => ({
          ...prev,
          platforms: [...prev.platforms, newPlatform]
        }));
        
        addMessage('Platform added', 'success');
      }
    }
    
    setObjectInDesign(null);
  };

  // Delete the selected object
  const deleteSelectedObject = () => {
    if (!selectedObject) return;
    
    if (selectedObject.type === 'platform') {
      setCurrentLevel(prev => ({
        ...prev,
        platforms: prev.platforms.filter(p => p !== selectedObject.object)
      }));
    } else if (selectedObject.type === 'enemy') {
      setCurrentLevel(prev => ({
        ...prev,
        enemies: (prev.enemies || []).filter(e => e !== selectedObject.object)
      }));
    } else if (selectedObject.type === 'collectible') {
      setCurrentLevel(prev => ({
        ...prev,
        collectibles: (prev.collectibles || []).filter(c => c !== selectedObject.object)
      }));
    }
    
    setSelectedObject(null);
    addMessage(`${selectedObject.type} deleted`, 'success');
  };

  // Start game testing
  const startGameTest = () => {
    if (!engineLoaded) {
      addMessage('Cannot start game - engine not loaded', 'error');
      return;
    }
    setActiveTab('game');
  };

  // Stop game testing
  const stopGameTest = () => {
    if (window.SAAAM) {
      window.SAAAM.stopGame();
    }
    gameInitialized.current = false;
    setGameRunning(false);
    setActiveTab('editor');
  };

  // Save the current level
  const saveCurrentLevel = () => {
    try {
      const levelJson = JSON.stringify(currentLevel);
      localStorage.setItem('saaamLevel', levelJson);
      addMessage('Level saved to local storage', 'success');
    } catch (e) {
      addMessage('Error saving level: ' + e.message, 'error');
    }
  };

  // Load a level
  const loadLevel = () => {
    try {
      const levelJson = localStorage.getItem('saaamLevel');
      if (levelJson) {
        const level = JSON.parse(levelJson);
        setCurrentLevel(level);
        addMessage('Level loaded from local storage', 'success');
      } else {
        addMessage('No saved level found', 'warning');
      }
    } catch (e) {
      addMessage('Error loading level: ' + e.message, 'error');
    }
  };

  // Export level to JSON
  const exportLevel = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentLevel, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", currentLevel.name + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    addMessage('Level exported to JSON file', 'success');
  };

  // Engine status indicator
  const EngineStatus = () => (
    <div className={`px-2 py-1 rounded text-xs font-bold ${engineLoaded ? 'bg-green-600' : 'bg-red-600'}`}>
      Engine: {engineLoaded ? 'Ready' : 'Not Loaded'}
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-yellow-400">SAAAM Game Studio</span>
          <span className="px-2 py-1 text-xs bg-gray-700 rounded">v1.0</span>
          <EngineStatus />
        </div>
        <div className="flex space-x-2">
          {activeTab === 'editor' ? (
            <button 
              className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 flex items-center"
              onClick={startGameTest}
              disabled={!engineLoaded}
            >
              <Play className="w-4 h-4 mr-1" /> Test Game
            </button>
          ) : (
            <button 
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 flex items-center"
              onClick={stopGameTest}
            >
              <Square className="w-4 h-4 mr-1" /> Stop Testing
            </button>
          )}
          <button 
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 flex items-center"
            onClick={saveCurrentLevel}
          >
            <Save className="w-4 h-4 mr-1" /> Save
          </button>
          <button 
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 flex items-center"
            onClick={loadLevel}
          >
            <Upload className="w-4 h-4 mr-1" /> Load
          </button>
          <button 
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 flex items-center"
            onClick={exportLevel}
          >
            <Download className="w-4 h-4 mr-1" /> Export
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Tools */}
        {activeTab === 'editor' && (
          <div className="w-48 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-2 font-semibold text-sm text-gray-400">LEVEL EDITOR TOOLS</div>
            <div className="px-2 space-y-1">
              <button 
                className={`w-full flex items-center p-2 rounded ${selectedTool === 'player' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
                onClick={() => setSelectedTool('player')}
              >
                <div className="w-4 h-4 bg-cyan-400 mr-2"></div>
                <span>Player</span>
              </button>
              <button 
                className={`w-full flex items-center p-2 rounded ${selectedTool === 'platform' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
                onClick={() => setSelectedTool('platform')}
              >
                <div className="w-4 h-4 bg-gray-400 mr-2"></div>
                <span>Platform</span>
              </button>
              <button 
                className={`w-full flex items-center p-2 rounded ${selectedTool === 'enemy' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
                onClick={() => setSelectedTool('enemy')}
              >
                <div className="w-4 h-4 bg-red-500 mr-2"></div>
                <span>Enemy</span>
              </button>
              <button 
                className={`w-full flex items-center p-2 rounded ${selectedTool === 'collectible' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
                onClick={() => setSelectedTool('collectible')}
              >
                <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
                <span>Collectible</span>
              </button>
              
              {selectedObject && (
                <div className="mt-4">
                  <div className="p-2 font-semibold text-sm text-gray-400">SELECTED OBJECT</div>
                  <p className="px-2 py-1 text-sm">Type: {selectedObject.type}</p>
                  <button 
                    className="w-full flex items-center p-2 rounded bg-red-600 hover:bg-red-700 mt-2"
                    onClick={deleteSelectedObject}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main canvas area */}
        <div className="flex-1 flex flex-col bg-black items-center justify-center">
          {activeTab === 'editor' ? (
            <canvas 
              ref={editorCanvasRef} 
              width={800} 
              height={600} 
              className="border border-gray-700"
              onMouseDown={handleEditorMouseDown}
              onMouseMove={handleEditorMouseMove}
              onMouseUp={handleEditorMouseUp}
              onMouseLeave={handleEditorMouseUp}
            />
          ) : (
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={600} 
              className="border border-gray-700"
            />
          )}
        </div>

        {/* Console output */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-2 font-semibold text-sm text-gray-400">CONSOLE</div>
          <div className="h-full overflow-y-auto px-2">
            {messages.map((msg, index) => (
              <div 
                key={msg.id || index} 
                className={`py-1 text-sm ${
                  msg.type === 'error' ? 'text-red-400' : 
                  msg.type === 'success' ? 'text-green-400' : 
                  msg.type === 'warning' ? 'text-yellow-400' : 
                  'text-gray-300'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-blue-800 text-white text-xs">
        <div>
          {activeTab === 'editor' ? 
            `Editor | Selected tool: ${selectedTool}` : 
            `Game running: ${gameRunning ? 'Yes' : 'No'}`
          }
        </div>
        <div>SAAAM Engine v1.0</div>
      </div>
    </div>
  );
};

export default GameStudio;

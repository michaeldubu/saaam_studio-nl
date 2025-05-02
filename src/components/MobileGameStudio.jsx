import React, { useState, useRef, useEffect } from 'react';
import { Save, Play, Square, Download, Grid, Layers, Settings, Plus, Menu, X, ChevronRight, MessageCircle } from 'lucide-react';

const MobileGameStudio = () => {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'game'
  const [selectedTool, setSelectedTool] = useState('platform');
  const [showToolDrawer, setShowToolDrawer] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [currentLevel, setCurrentLevel] = useState({
    name: "My Level",
    player: { x: 50, y: 300 },
    platforms: [
      { x: 0, y: 550, width: 800, height: 50, color: '#888888' } // Ground
    ],
    enemies: [],
    collectibles: []
  });
  const [messages, setMessages] = useState([
    { text: 'Welcome to SAAAM Game Studio!', type: 'info', id: 1 }
  ]);

  const canvasRef = useRef(null);
  const editorCanvasRef = useRef(null);
  const gameInitialized = useRef(false);

  // Check if engine is loaded
  const [engineLoaded, setEngineLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate engine loading
    const timeout = setTimeout(() => {
      setEngineLoaded(true);
      addMessage('Game engine ready', 'success');
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  // Initialize canvas when component mounts
  useEffect(() => {
    if (editorCanvasRef.current && activeTab === 'editor') {
      const canvas = editorCanvasRef.current;
      const ctx = canvas.getContext('2d');
      drawEditorGrid(ctx);
      drawLevelObjects(ctx);
    }
  }, [activeTab, currentLevel]);

  // Add message to console
  const addMessage = (text, type = 'info') => {
    setMessages(prev => [...prev, { text, type, id: Date.now() }]);
  };

  // Draw editor grid
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

  // Draw level objects
  const drawLevelObjects = (ctx) => {
    // Draw player
    const player = currentLevel.player;
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(player.x, player.y, 32, 48);
    
    // Draw platforms
    for (const platform of currentLevel.platforms) {
      ctx.fillStyle = platform.color || '#888888';
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    // Draw enemies
    if (currentLevel.enemies) {
      for (const enemy of currentLevel.enemies) {
        ctx.fillStyle = enemy.color || '#FF0000';
        ctx.fillRect(enemy.x, enemy.y, enemy.width || 32, enemy.height || 32);
      }
    }
    
    // Draw collectibles
    if (currentLevel.collectibles) {
      for (const collectible of currentLevel.collectibles) {
        ctx.fillStyle = collectible.color || '#FFFF00';
        ctx.fillRect(collectible.x, collectible.y, collectible.width || 20, collectible.height || 20);
      }
    }
  };

  const handleStartGame = () => {
    if (!engineLoaded) {
      addMessage('Cannot start game - engine not loaded', 'error');
      return;
    }
    setActiveTab('game');
    setGameRunning(true);
    addMessage('Game started', 'success');
  };

  const handleStopGame = () => {
    setActiveTab('editor');
    setGameRunning(false);
    addMessage('Game stopped', 'info');
  };

  const handleSave = () => {
    // This would normally save to local storage or cloud
    addMessage('Level saved', 'success');
  };

  const handleExport = () => {
    // This would normally export the level
    addMessage('Level exported', 'success');
  };

  const handleCanvasTouch = (e) => {
    // Basic touch handling would go here
    // For a real app, this would be more complex
    const rect = e.target.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    
    addMessage(`Canvas touched at ${Math.round(x)}, ${Math.round(y)}`, 'info');
    
    // Create a new object based on the selected tool
    if (selectedTool === 'platform') {
      const newPlatform = {
        x: x - 50,
        y: y - 10,
        width: 100,
        height: 20,
        color: '#888888'
      };
      
      setCurrentLevel(prev => ({
        ...prev,
        platforms: [...prev.platforms, newPlatform]
      }));
    } else if (selectedTool === 'enemy') {
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
    } else if (selectedTool === 'collectible') {
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
    } else if (selectedTool === 'player') {
      setCurrentLevel(prev => ({
        ...prev,
        player: { x: x - 16, y: y - 24 }
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="mr-2"
            onClick={() => setShowToolDrawer(!showToolDrawer)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-yellow-400">SAAAM Studio</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={handleSave}
          >
            <Save className="w-5 h-5" />
          </button>
          {activeTab === 'editor' ? (
            <button 
              className={`p-2 rounded-full ${engineLoaded ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600'}`}
              onClick={handleStartGame}
              disabled={!engineLoaded}
            >
              <Play className="w-5 h-5" />
            </button>
          ) : (
            <button 
              className="p-2 rounded-full bg-red-600 hover:bg-red-700"
              onClick={handleStopGame}
            >
              <Square className="w-5 h-5" />
            </button>
          )}
          <button 
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={handleExport}
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Tool drawer (slides in from left) */}
      <div className={`fixed left-0 top-0 h-full bg-gray-800 z-20 w-64 transform transition-transform ${showToolDrawer ? 'translate-x-0' : '-translate-x-full'} shadow-lg`}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-bold">Tools</h2>
          <button onClick={() => setShowToolDrawer(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-sm text-gray-400 mb-2">LEVEL EDITOR TOOLS</h3>
          <div className="space-y-2">
            <button 
              className={`w-full flex items-center p-2 rounded ${selectedTool === 'player' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
              onClick={() => {
                setSelectedTool('player');
                setShowToolDrawer(false);
              }}
            >
              <div className="w-4 h-4 bg-cyan-400 mr-2"></div>
              <span>Player</span>
            </button>
            <button 
              className={`w-full flex items-center p-2 rounded ${selectedTool === 'platform' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
              onClick={() => {
                setSelectedTool('platform');
                setShowToolDrawer(false);
              }}
            >
              <div className="w-4 h-4 bg-gray-400 mr-2"></div>
              <span>Platform</span>
            </button>
            <button 
              className={`w-full flex items-center p-2 rounded ${selectedTool === 'enemy' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
              onClick={() => {
                setSelectedTool('enemy');
                setShowToolDrawer(false);
              }}
            >
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span>Enemy</span>
            </button>
            <button 
              className={`w-full flex items-center p-2 rounded ${selectedTool === 'collectible' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
              onClick={() => {
                setSelectedTool('collectible');
                setShowToolDrawer(false);
              }}
            >
              <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
              <span>Collectible</span>
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm text-gray-400 mb-2">LEVEL OPTIONS</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center p-2 rounded hover:bg-gray-700">
                <Grid className="w-4 h-4 mr-2" />
                <span>Toggle Grid</span>
              </button>
              <button className="w-full flex items-center p-2 rounded hover:bg-gray-700">
                <Layers className="w-4 h-4 mr-2" />
                <span>Layer Manager</span>
              </button>
              <button className="w-full flex items-center p-2 rounded hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                <span>Level Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Editor canvas */}
        {activeTab === 'editor' ? (
          <div 
            className="h-full w-full touch-none"
            onTouchStart={handleCanvasTouch}
          >
            <canvas
              ref={editorCanvasRef}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain mx-auto"
            />
          </div>
        ) : (
          // Game canvas
          <div className="h-full w-full bg-black flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain mx-auto"
            />
          </div>
        )}
        
        {/* Floating tool indicator */}
        <div className="absolute bottom-20 left-4 bg-gray-800 rounded-full px-3 py-1 text-sm flex items-center shadow-lg">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            selectedTool === 'player' ? 'bg-cyan-400' :
            selectedTool === 'platform' ? 'bg-gray-400' :
            selectedTool === 'enemy' ? 'bg-red-500' :
            'bg-yellow-400'
          }`}></div>
          <span className="capitalize">{selectedTool}</span>
        </div>
        
        {/* Floating action button */}
        <button 
          className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
          onClick={() => setShowConsole(!showConsole)}
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {messages.filter(m => m.type === 'error').length}
          </div>
        </button>
      </div>

      {/* Console drawer (slides up from bottom) */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gray-800 z-10 border-t border-gray-700 transition-transform transform ${showConsole ? 'translate-y-0' : 'translate-y-full'}`} style={{height: '40%'}}>
        <div className="p-2 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-bold text-sm">Console</h2>
          <button onClick={() => setShowConsole(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-2 overflow-y-auto h-full">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
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

      {/* Status bar */}
      <div className="bg-blue-800 px-2 py-1 text-xs flex justify-between items-center">
        <div>
          {activeTab === 'editor' ? 
            `Editor | Selected tool: ${selectedTool}` : 
            `Game running: ${gameRunning ? 'Yes' : 'No'}`
          }
        </div>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-1 ${engineLoaded ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Engine: {engineLoaded ? 'Ready' : 'Loading...'}</span>
        </div>
      </div>
    </div>
  );
};

export default MobileGameStudio;
// [MobileCodeEditor.jsx]
// Paste this into: src/components/MobileCodeEditor.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Save, Play, ChevronLeft, FileText, Info, Menu, X, Terminal, Settings,
  Download, Upload, RefreshCw, CheckCircle, AlertCircle
} from 'lucide-react';

const MobileCodeEditor = () => {
  const [code, setCode] = useState(`// SAAAM Script
// Created: ${new Date().toLocaleString()}

function create() {
  this.position = vec2(100, 100);
  this.velocity = vec2(0, 0);
  this.sprite = "player_idle";
}

function step() {
  if (keyboard_check(vk_right)) {
    this.velocity.x = 5;
  } else if (keyboard_check(vk_left)) {
    this.velocity.x = -5;
  } else {
    this.velocity.x = 0;
  }

  this.velocity.y += 0.5;

  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  if (this.position.y > 550) {
    this.position.y = 550;
    this.velocity.y = 0;
  }
}

function draw() {
  draw_sprite(this.sprite, this.position.x, this.position.y);
}`);
  const [fileName, setFileName] = useState('player.saaam');
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState([{ text: 'SAAAM Code Editor ready', type: 'info', id: 1 }]);
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [engineLoaded, setEngineLoaded] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEngineLoaded(true);
      addMessage('SAAAM Engine connected', 'success');
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const lines = code.split('\n').length;
    if (lineNumbersRef.current) {
      lineNumbersRef.current.value = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
      if (textareaRef.current) {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    }
    const timeout = setTimeout(() => validateCode(), 800);
    return () => clearTimeout(timeout);
  }, [code]);

  const addMessage = (text, type = 'info') => {
    setMessages(prev => [...prev, { text, type, id: Date.now() }]);
  };

  const validateCode = () => {
    const errors = [];
    const lines = code.split('\n');
    if (!code.includes('function create()')) {
      errors.push({ line: 1, message: 'Missing create() function', type: 'warning' });
    }
    if (!code.includes('function step()')) {
      errors.push({ line: 1, message: 'Missing step() function', type: 'warning' });
    }
    lines.forEach((line, index) => {
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      if (openBraces > closeBraces) errors.push({ line: index + 1, message: 'Missing }', type: 'error' });
      if (closeBraces > openBraces) errors.push({ line: index + 1, message: 'Unexpected }', type: 'error' });
    });
    setSyntaxErrors(errors);
    if (errors.length > 0) {
      addMessage(`Validation: ${errors.length} issues`, errors.some(e => e.type === 'error') ? 'error' : 'warning');
    } else {
      addMessage('Code valid', 'success');
    }
  };

  const handleRunCode = () => {
    if (!engineLoaded) return addMessage('Engine not ready', 'error');
    if (syntaxErrors.some(e => e.type === 'error')) return addMessage('Fix syntax errors first', 'error');
    setIsRunning(true);
    addMessage('Running script...');
    setTimeout(() => {
      addMessage('Script ran successfully', 'success');
      setIsRunning(false);
    }, 800);
  };

  const handleSave = () => addMessage(`Saved "${fileName}"`, 'success');

  const handleSelect = e => {
    const pos = e.target.selectionStart;
    setCursorPosition(pos);
    showCodeSuggestions(pos);
  };

  const showCodeSuggestions = pos => {
    const text = code.substring(0, pos);
    const match = text.match(/[\w_.]+$/);
    const prefix = match ? match[0].toLowerCase() : '';
    if (prefix.length > 1) {
      const pool = [
        { label: 'keyboard_check', detail: 'Check if key is held' },
        { label: 'keyboard_check_pressed', detail: 'Key was just pressed' },
        { label: 'vec2', detail: '2D Vector' },
        { label: 'draw_sprite', detail: 'Draw a sprite' },
        { label: 'velocity', detail: 'Object velocity' }
      ];
      const filtered = pool.filter(s => s.label.includes(prefix));
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const applySuggestion = s => {
    const text = code.substring(0, cursorPosition);
    const after = code.substring(cursorPosition);
    const match = text.match(/[\w_.]+$/);
    const replaceStart = match ? text.length - match[0].length : text.length;
    const newText = text.substring(0, replaceStart) + s.label + after;
    setCode(newText);
    setShowSuggestions(false);
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = replaceStart + s.label.length;
    }, 10);
  };

  const handleScroll = e => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <Menu className="w-6 h-6 mr-2" />
          <div className="text-lg font-bold text-yellow-400">{fileName}</div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600" onClick={handleSave}>
            <Save className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded-full ${engineLoaded ? 'bg-green-600' : 'bg-gray-600'} ${isRunning ? 'animate-pulse' : ''}`}
            onClick={handleRunCode}
            disabled={!engineLoaded || isRunning}
          >
            <Play className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Editor */}
      <div className="flex flex-1 overflow-hidden">
        <textarea
          ref={lineNumbersRef}
          readOnly
          className="w-12 bg-gray-800 text-gray-500 text-sm text-right py-2 px-1 resize-none select-none"
        />
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            className="w-full h-full bg-gray-900 text-sm font-mono px-2 py-2 resize-none"
            value={code}
            onChange={e => setCode(e.target.value)}
            onSelect={handleSelect}
            onScroll={handleScroll}
            spellCheck={false}
          />
          {showSuggestions && (
            <div className="absolute z-10 top-0 left-16 bg-gray-800 border border-gray-600 shadow-lg rounded">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => applySuggestion(s)}
                  className="px-3 py-2 text-sm hover:bg-gray-700 cursor-pointer"
                >
                  <div className="font-bold">{s.label}</div>
                  <div className="text-xs text-gray-400">{s.detail}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Console */}
      <div className="bg-gray-800 px-3 py-2 border-t border-gray-700 text-sm max-h-32 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-1 ${msg.type === 'error' ? 'text-red-400' : msg.type === 'success' ? 'text-green-400' : 'text-gray-300'}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCodeEditor;

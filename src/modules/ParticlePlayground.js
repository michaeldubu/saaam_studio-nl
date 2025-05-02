// Draw tabs
function drawTabs(ctx) {
  // Draw tabs bar
  ctx.fillStyle = "#333344";
  ctx.fillRect(0, 30, 800, 40);
  
  // Draw tab buttons
  for (let i = 0; i < tabButtons.length; i++) {
    const x = 200 + i * 110;
    const y = 40;
    const width = 100;
    const height = 30;
    
    // Background
    ctx.fillStyle = activeTab === tabButtons[i].tab ? "#4CAF50" : "#666677";
    ctx.fillRect(x, y, width, height);
    
    // Text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(tabButtons[i].name, x + width / 2, y + height / 2 + 5);
  }
  
  // Draw title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Particle Playground", 20, 55);
}

// Draw emitter list
function drawEmitterList(ctx) {
  // Draw list background
  ctx.fillStyle = "#222233";
  ctx.fillRect(10, 80, 170, 310);
  
  // Draw header
  ctx.fillStyle = "#333344";
  ctx.fillRect(10, 80, 170, 20);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Emitters", 95, 95);
  
  // Draw emitter items
  const listY = 100;
  const listItemHeight = 30;
  
  for (let i = 0; i < emitters.length; i++) {
    const y = listY + i * listItemHeight;
    const isSelected = i === currentEmitterIndex;
    
    // Item background
    ctx.fillStyle = isSelected ? "#4CAF50" : "#333344";
    ctx.fillRect(10, y, 170, listItemHeight);
    
    // Toggle button
    ctx.fillStyle = emitters[i].active ? "#4CAF50" : "#F44336";
    ctx.fillRect(150, y + 5, 20, 20);
    
    // Emitter name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(emitters[i].name, 15, y + 20);
  }
}

// Draw controls panel
function drawControlsPanel(ctx) {
  const currentEmitter = emitters[currentEmitterIndex];
  
  // Draw panel background
  ctx.fillStyle = "#222233";
  ctx.fillRect(190, 80, 600, 510);
  
  // Draw header
  ctx.fillStyle = "#444455";
  ctx.fillRect(190, 80, 600, 30);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${currentEmitter.name} Properties`, 490, 100);
  
  // Draw color section
  ctx.fillStyle = "#333344";
  ctx.fillRect(200, 280, 580, 70);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "14px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Colors:", 210, 300);
  
  // Draw color buttons
  const colorY = 310;
  
  // Color 1 button
  ctx.fillStyle = currentEmitter.color1;
  ctx.fillRect(120, colorY, 30, 30);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.strokeRect(120, colorY, 30, 30);
  
  // Color 2 button
  ctx.fillStyle = currentEmitter.color2;
  ctx.fillRect(160, colorY, 30, 30);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.strokeRect(160, colorY, 30, 30);
  
  // Color labels
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("1", 135, colorY + 45);
  ctx.fillText("2", 175, colorY + 45);
  
  // Draw toggle buttons section
  ctx.fillStyle = "#333344";
  ctx.fillRect(200, 350, 580, 40);
  
  // Blending toggle
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "12px Arial";
  ctx.textAlign = "right";
  ctx.fillText("Blending:", 115, 370);
  
  ctx.fillStyle = currentEmitter.useBlending ? "#4CAF50" : "#F44336";
  ctx.fillRect(120, 360, 60, 20);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(currentEmitter.useBlending ? "ON" : "OFF", 150, 375);
  
  // Spin toggle
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "right";
  ctx.fillText("Spin:", 245, 370);
  
  ctx.fillStyle = currentEmitter.spin ? "#4CAF50" : "#F44336";
  ctx.fillRect(250, 360, 60, 20);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(currentEmitter.spin ? "ON" : "OFF", 280, 375);
  
  // Burst toggle
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "right";
  ctx.fillText("Burst Mode:", 375, 370);
  
  ctx.fillStyle = currentEmitter.burstMode ? "#4CAF50" : "#F44336";
  ctx.fillRect(380, 360, 60, 20);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(currentEmitter.burstMode ? "ON" : "OFF", 410, 375);
  
  // Draw shape buttons section
  ctx.fillStyle = "#333344";
  ctx.fillRect(200, 400, 580, 40);
  
  // Particle shape button
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "right";
  ctx.fillText("Particle Shape:", 115, 420);
  
  ctx.fillStyle = "#666677";
  ctx.fillRect(120, 410, 80, 20);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(currentEmitter.particleShape, 160, 425);
  
  // Emission shape button
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "right";
  ctx.fillText("Emission Shape:", 245, 420);
  
  ctx.fillStyle = "#666677";
  ctx.fillRect(250, 410, 80, 20);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(currentEmitter.emissionShape, 290, 425);
  
  // Fade mode button
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "right";
  ctx.fillText("Fade Mode:", 375, 420);
  
  ctx.fillStyle = "#666677";
  ctx.fillRect(380, 410, 80, 20);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(currentEmitter.fadeMode, 420, 425);
  
  // Draw sliders
  const sliderY = 450;
  const sliderHeight = 25;
  const sliderWidth = 150;
  const labelWidth = 120;
  const startX = 200;
  
  for (let i = 0; i < sliders.length; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = startX + col * (sliderWidth + labelWidth + 20);
    const y = sliderY + row * sliderHeight;
    
    // Draw label
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`${sliders[i].name}:`, x + labelWidth - 5, y + 15);
    
    // Draw slider track
    ctx.fillStyle = "#333344";
    ctx.fillRect(x + labelWidth, y, sliderWidth, 15);
    
    // Calculate slider position
    const value = currentEmitter[sliders[i].property];
    const ratio = (value - sliders[i].min) / (sliders[i].max - sliders[i].min);
    const handlePos = Math.floor(ratio * sliderWidth);
    
    // Draw slider handle
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(x + labelWidth + handlePos - 5, y - 2, 10, 19);
    
    // Draw value
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText(value.toString(), x + labelWidth + sliderWidth + 5, y + 15);
  }
}

// Draw presets panel
function drawPresetsPanel(ctx) {
  // Draw panel background
  ctx.fillStyle = "#222233";
  ctx.fillRect(190, 80, 600, 510);
  
  // Draw header
  ctx.fillStyle = "#444455";
  ctx.fillRect(190, 80, 600, 30);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Preset Effects", 490, 100);
  
  // Draw preset buttons
  const presetY = 120;
  const presetHeight = 40;
  const presetWidth = 130;
  const presetMargin = 20;
  const presetsPerRow = 4;
  
  for (let i = 0; i < presetButtons.length; i++) {
    const row = Math.floor(i / presetsPerRow);
    const col = i % presetsPerRow;
    const x = 200 + col * (presetWidth + presetMargin);
    const y = presetY + row * (presetHeight + presetMargin);
    
    // Button background
    ctx.fillStyle = "#444455";
    ctx.fillRect(x, y, presetWidth, presetHeight);
    
    // Button text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(presetButtons[i].name, x + presetWidth / 2, y + presetHeight / 2 + 5);
  }
  
  // Draw preset description
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "14px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Click a preset to apply it to the current emitter.", 200, 280);
  ctx.fillText("Presets will override all current emitter settings.", 200, 300);
  ctx.fillText("Press TAB to cycle between emitters.", 200, 320);
  ctx.fillText("Press ENTER to toggle emitter on/off.", 200, 340);
  ctx.fillText("Press SPACE to toggle UI visibility.", 200, 360);
}

// Draw help panel
function drawHelpPanel(ctx) {
  // Draw panel background
  ctx.fillStyle = "#222233";
  ctx.fillRect(190, 80, 600, 510);
  
  // Draw header
  ctx.fillStyle = "#444455";
  ctx.fillRect(190, 80, 600, 30);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Particle Playground Help", 490, 100);
  
  // Draw help text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "14px Arial";
  ctx.textAlign = "left";
  
  const helpText = [
    "Mouse Controls:",
    "- Click and drag emitters to move them",
    "- Click on emitter in list to select it",
    "- Click toggle button to enable/disable emitter",
    "- Click and drag sliders to adjust properties",
    "",
    "Keyboard Controls:",
    "- TAB: Cycle through emitters",
    "- ENTER: Toggle current emitter on/off",
    "- SPACE: Toggle UI visibility / Trigger burst",
    "- N: Create new emitter",
    "- DELETE/BACKSPACE: Delete current emitter",
    "- S: Cycle particle shape",
    "- E: Cycle emission shape",
    "- F: Cycle fade mode",
    "- B: Toggle blending",
    "- R: Toggle spin",
    "- X: Toggle burst mode",
    "- 1/2: Change emitter colors",
    "",
    "Particle Properties:",
    "- Speed: How fast particles move",
    "- Size: Physical size of particles",
    "- Life: How long particles exist (seconds)",
    "- Spread: Angle of particle dispersion",
    "- Direction: Base angle of emission",
    "- Gravity: Downward acceleration",
    "- Opacity: Transparency of particles",
    "- Emission Rate: Particles emitted per second",
    "- Spin: Rotation of particles",
    "- Acceleration: Change in speed over time",
    "- Wind: Sideways force on particles"
  ];
  
  for (let i = 0; i < helpText.length; i++) {
    ctx.fillText(helpText[i], 200, 130 + i * 20);
  }
}

// Draw color picker
function drawColorPicker(ctx) {
  const colorSize = 20;
  const colorsPerRow = 6;
  const pickerWidth = colorsPerRow * colorSize + 20;
  const pickerHeight = 4 * colorSize + 50;
  const startX = colorPicker.x;
  const startY = colorPicker.y + 35;
  
  // Draw background
  ctx.fillStyle = "rgba(30, 30, 40, 0.95)";
  ctx.fillRect(
    startX - 10, 
    colorPicker.y - 10, 
    pickerWidth, 
    pickerHeight
  );
  
  // Draw title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    `Select Color ${colorPicker.colorIndex + 1}`, 
    startX + (colorsPerRow * colorSize) / 2, 
    colorPicker.y + 15
  );
  
  // Draw color grid
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", 
    "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", 
    "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E", 
    "#607D8B", "#FFFFFF", "#EEEEEE", "#BDBDBD", "#757575", "#424242"
  ];
  
  for (let i = 0; i < colors.length; i++) {
    const row = Math.floor(i / colorsPerRow);
    const col = i % colorsPerRow;
    const x = startX + col * colorSize;
    const y = startY + row * colorSize;
    
    // Draw color square
    ctx.fillStyle = colors[i];
    ctx.fillRect(x, y, colorSize, colorSize);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, colorSize, colorSize);
  }
}

// Draw info text
function drawInfoText(ctx) {
  // Draw performance info
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "12px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`FPS: ${fps}`, 10, 20);
  ctx.fillText(`Particles: ${particles.length}/${MAX_PARTICLES}`, 10, 40);
  
  // Draw controls hint if UI is hidden
  if (!showUI) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press SPACE to show UI", 400, 580);
  }
}

// Create a new emitter
function createNewEmitter() {
  const newEmitter = {
    name: "New Emitter " + (emitters.length + 1),
    x: 400,
    y: 300,
    active: true,
    color1: "#4FC3F7",
    color2: "#2196F3",
    minSpeed: 100,
    maxSpeed: 200,
    minSize: 5,
    maxSize: 15,
    minLife: 1.0,
    maxLife: 3.0,
    spreadAngle: 360,
    direction: 0,
    gravity: 0,
    opacity: 0.8,
    useBlending: true,
    emissionShape: "point",
    emissionRate: EMISSION_RATE,
    particleShape: "circle",
    fadeMode: "out",
    spin: false,
    spinSpeed: 0,
    acceleration: 0,
    windDirection: 0,
    windStrength: 0
  };
  
  emitters.push(newEmitter);
  currentEmitterIndex = emitters.length - 1;
  
  // Play sound if available
  if (SAAAM.playSound) {
    SAAAM.playSound("create");
  }
}

// Cycle through fade modes
function cycleFadeMode() {
  const modes = ["out", "in", "pulse", "none", "blink", "color"];
  const currentMode = emitters[currentEmitterIndex].fadeMode;
  const currentIndex = modes.indexOf(currentMode);
  const nextIndex = (currentIndex + 1) % modes.length;
  
  emitters[currentEmitterIndex].fadeMode = modes[nextIndex];
  
  // Play sound if available
  if (SAAAM.playSound) {
    SAAAM.playSound("toggle");
  }
}

// Apply a preset to the current emitter
function applyPreset(presetName) {
  const emitter = emitters[currentEmitterIndex];
  
  switch (presetName) {
    case "fire":
      emitter.color1 = "#FF5722";
      emitter.color2 = "#FFEB3B";
      emitter.minSpeed = 50;
      emitter.maxSpeed = 150;
      emitter.minSize = 5;
      emitter.maxSize = 15;
      emitter.minLife = 0.5;
      emitter.maxLife = 2.0;
      emitter.spreadAngle = 30;
      emitter.direction = -90;
      emitter.gravity = -20;
      emitter.opacity = 0.8;
      emitter.useBlending = true;
      emitter.emissionShape = "point";
      emitter.emissionRate = EMISSION_RATE * 1.5;
      emitter.particleShape = "circle";
      emitter.fadeMode = "out";
      emitter.spin = false;
      emitter.spinSpeed = 0;
      emitter.acceleration = 0;
      emitter.windDirection = 0;
      emitter.windStrength = 0;
      emitter.burstMode = false;
      break;
      
    case "water":
      emitter.color1 = "#29B6F6";
      emitter.color2 = "#81D4FA";
      emitter.minSpeed = 200;
      emitter.maxSpeed = 300;
      emitter.minSize = 3;
      emitter.maxSize = 8;
      emitter.minLife = 0.8;
      emitter.maxLife = 2.0;
      emitter.spreadAngle = 20;
      emitter.direction = -90;
      emitter.gravity = GRAVITY;
      emitter.opacity = 0.8;
      emitter.useBlending = true;
      emitter.emissionShape = "point";
      emitter.emissionRate = EMISSION_RATE;
      emitter.particleShape = "circle";
      emitter.fadeMode = "out";
      emitter.spin = false;
      emitter.spinSpeed = 0;
      emitter.acceleration = -50;
      emitter.windDirection = 0;
      emitter.windStrength = 0;
      emitter.burstMode = false;
      break;
      
    case "smoke":
      emitter.color1 = "#78909C";
      emitter.color2 = "#B0BEC5";
      emitter.minSpeed = 20;
      emitter.maxSpeed = 50;
      emitter.minSize = 10;
      emitter.maxSize = 30;
      emitter.minLife = 2.0;
      emitter.maxLife = 5.0;
      emitter.spreadAngle = 20;
      emitter.direction = -90;
      emitter.gravity = -10;
      emitter.opacity = 0.4;
      emitter.useBlending = false;
      emitter.emissionShape = "point";
      emitter.emissionRate = EMISSION_RATE * 0.7;
      emitter.particleShape = "circle";
      emitter.fadeMode = "out";
      emitter.spin = true;
      emitter.spinSpeed = 20;
      emitter.acceleration = 0;
      emitter.windDirection = 0;
      emitter.windStrength = 10;
      emitter.burstMode = false;
      break;
      
    case "magic":
      emitter.color1 = "#E040FB";
      emitter.color2 = "#7C4DFF";
      emitter.minSpeed = 100;
      emitter.maxSpeed = 200;
      emitter.minSize = 2;
      emitter.maxSize = 6;
      emitter.minLife = 1.0;
      emitter.maxLife = 3.0;
      emitter.spreadAngle = 360;
      emitter.direction = 0;
      emitter.gravity = 0;
      emitter.opacity = 1.0;
      emitter.useBlending = true;
      emitter.emissionShape = "circle";
      emitter.emissionRadius = 50;
      emitter.emissionRate = EMISSION_RATE * 0.8;
      emitter.particleShape = "star";
      emitter.fadeMode = "pulse";
      emitter.spin = true;
      emitter.spinSpeed = 90;
      emitter.acceleration = 0;
      emitter.windDirection = 0;
      emitter.windStrength = 0;
      emitter.burstMode = false;
      break;
      
    case "snow":
      emitter.color1 = "#FFFFFF";
      emitter.color2 = "#E3F2FD";
      emitter.minSpeed = 30;
      emitter.maxSpeed = 70;
      emitter.minSize = 3;
      emitter.maxSize = 8;
      emitter.minLife = 5.0;
      emitter.maxLife = 10.0;
      emitter.spreadAngle = 30;
      emitter.direction = 90;
      emitter.gravity = 20;
      emitter.opacity = 0.9;
      emitter.useBlending = false;
      emitter.emissionShape = "line";
      emitter.emissionWidth = 800;
      emitter.emissionRate = EMISSION_RATE * 0.5;
      emitter.particleShape = "flake";
      emitter.fadeMode = "none";
      emitter.spin = true;
      emitter.spinSpeed = 15;
      emitter.acceleration = 0;
      emitter.windDirection = 0;
      emitter.windStrength = 20;
      emitter.burstMode = false;
      break;
      
    case "explosion":
      emitter.color1 = "#FF9800";
      emitter.color2 = "#FFEB3B";
      emitter.minSpeed = 200;
      emitter.maxSpeed = 400;
      emitter.minSize = 5;
      emitter.maxSize = 15;
      emitter.minLife = 0.5;
      emitter.maxLife = 1.5;
      emitter.spreadAngle = 360;
      emitter.direction = 0;
      emitter.gravity = 100;
      emitter.opacity = 1.0;
      emitter.useBlending = true;
      emitter.emissionShape = "point";
      emitter.emissionRate = EMISSION_RATE * 5;
      emitter.particleShape = "circle";
      emitter.fadeMode = "out";
      emitter.spin = false;
      emitter.spinSpeed = 0;
      emitter.acceleration = -150;
      emitter.windDirection = 0;
      emitter.windStrength = 0;
      emitter.burstMode = true;
      emitter.burstCount = 100;
      emitter.burstCooldown = 1.0;
      emitter.burstTimer = 0;
      break;
      
    case "confetti":
      emitter.color1 = "#F44336"; // Multiple colors will be assigned during emission
      emitter.color2 = "#4CAF50";
      emitter.minSpeed = 150;
      emitter.maxSpeed = 300;
      emitter.minSize = 5;
      emitter.maxSize = 10;
      emitter.minLife = 2.0;
      emitter.maxLife = 5.0;
      emitter.spreadAngle = 120;
      emitter.direction = -90;
      emitter.gravity = 150;
      emitter.opacity = 1.0;
      emitter.useBlending = false;
      emitter.emissionShape = "line";
      emitter.emissionWidth = 200;
      emitter.emissionRate = EMISSION_RATE * 2;
      emitter.particleShape = "square";
      emitter.fadeMode = "none";
      emitter.spin = true;
      emitter.spinSpeed = 180;
      emitter.acceleration = 0;
      emitter.windDirection = 0;
      emitter.windStrength = 10;
      emitter.burstMode = true;
      emitter.burstCount = 200;
      emitter.burstCooldown = 2.0;
      emitter.burstTimer = 0;
      emitter.confetti = true; // Special flag for confetti effect
      break;
      
    case "galaxy":
      emitter.color1 = "#3F51B5";
      emitter.color2 = "#E040FB";
      emitter.minSpeed = 10;
      emitter.maxSpeed = 100;
      emitter.minSize = 2;
      emitter.maxSize = 6;
      emitter.minLife = 5.0;
      emitter.maxLife = 10.0;
      emitter.spreadAngle = 360;
      emitter.direction = 0;
      emitter.gravity = 0;
      emitter.opacity = 0.8;
      emitter.useBlending = true;
      emitter.emissionShape = "circle";
      emitter.emissionRadius = 100;
      emitter.emissionRate = EMISSION_RATE * 0.6;
      emitter.particleShape = "star";
      emitter.fadeMode = "pulse";
      emitter.spin = false;
      emitter.spinSpeed = 0;
      emitter.acceleration = 0;
      emitter.windDirection = 0;
      emitter.windStrength = 0;
      emitter.burstMode = false;
      emitter.orbital = true; // Special flag for orbital movement
      emitter.orbitalSpeed = 20;
      break;
  }
}
// Handle color picker clicks
function handleColorPickerClick(mouseX, mouseY) {
  // Color palette layout
  const colorSize = 20;
  const colorsPerRow = 6;
  const startX = colorPicker.x;
  const startY = colorPicker.y + 35;
  
  // Predefined colors
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", 
    "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", 
    "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E", 
    "#607D8B", "#FFFFFF", "#EEEEEE", "#BDBDBD", "#757575", "#424242"
  ];
  
  // Check each color in the palette
  for (let i = 0; i < colors.length; i++) {
    const row = Math.floor(i / colorsPerRow);
    const col = i % colorsPerRow;
    const x = startX + col * colorSize;
    const y = startY + row * colorSize;
    
    if (mouseX >= x && mouseX <= x + colorSize &&
        mouseY >= y && mouseY <= y + colorSize) {
      // Update emitter color
      if (colorPicker.colorIndex === 0) {
        emitters[currentEmitterIndex].color1 = colors[i];
      } else {
        emitters[currentEmitterIndex].color2 = colors[i];
      }
      
      colorPicker.active = false;
      
      // Play sound if available
      if (SAAAM.playSound) {
        SAAAM.playSound("color");
      }
      
      return;
    }
  }
  
  // Close color picker if clicked outside
  if (mouseX < startX - 10 || mouseX > startX + colorsPerRow * colorSize + 10 ||
      mouseY < colorPicker.y - 10 || mouseY > startY + 4 * colorSize + 10) {
    colorPicker.active = false;
  }
}

// Change the color of the current emitter
function changeEmitterColor(colorIndex) {
  const colors = [
    ["#F44336", "#FFEB3B"],  // Red-Yellow (Fire)
    ["#29B6F6", "#81D4FA"],  // Blue (Water)
    ["#78909C", "#B0BEC5"],  // Gray (Smoke)
    ["#E040FB", "#7C4DFF"],  // Purple (Magic)
    ["#FFFFFF", "#E3F2FD"],  // White (Snow)
    ["#4CAF50", "#8BC34A"],  // Green
    ["#FFC107", "#FFEB3B"],  // Yellow
    ["#FF5722", "#FF9800"],  // Orange
    ["#9C27B0", "#E040FB"]   // Purple
  ];
  
  const randomColorSet = colors[Math.floor(Math.random() * colors.length)];
  
  if (colorIndex === 0) {
    emitters[currentEmitterIndex].color1 = randomColorSet[0];
  } else {
    emitters[currentEmitterIndex].color2 = randomColorSet[1];
  }
  
  // Play sound if available
  if (SAAAM.playSound) {
    SAAAM.playSound("color");
  }
}

// Cycle through particle shapes
function cycleParticleShape() {
  const shapes = ["circle", "square", "triangle", "star", "flake", "heart", "ring", "bubble"];
  const currentShape = emitters[currentEmitterIndex].particleShape;
  const currentIndex = shapes.indexOf(currentShape);
  const nextIndex = (currentIndex + 1) % shapes.length;
  
  emitters[currentEmitterIndex].particleShape = shapes[nextIndex];
  
  // Play sound if available
  if (SAAAM.playSound) {
    SAAAM.playSound("shape");
  }
}

// Cycle through emission shapes
function cycleEmissionShape() {
  const shapes = ["point", "circle", "line", "rectangle", "ring"];
  const currentShape = emitters[currentEmitterIndex].emissionShape;
  const currentIndex = shapes.indexOf(currentShape);
  const nextIndex = (currentIndex + 1) % shapes.length;
  
  emitters[currentEmitterIndex].emissionShape = shapes[nextIndex];
  
  // Add default properties for the shape if needed
  if (shapes[nextIndex] === "circle" && !emitters[currentEmitterIndex].emissionRadius) {
    emitters[currentEmitterIndex].emissionRadius = 50;
  } else if (shapes[nextIndex] === "line" && !emitters[currentEmitterIndex].emissionWidth) {
    emitters[currentEmitterIndex].emissionWidth = 200;
  } else if (shapes[nextIndex] === "rectangle") {
    if (!emitters[currentEmitterIndex].emissionWidth) emitters[currentEmitterIndex].emissionWidth = 100;
    if (!emitters[currentEmitterIndex].emissionHeight) emitters[currentEmitterIndex].emissionHeight = 50;
  } else if (shapes[nextIndex] === "ring") {
    if (!emitters[currentEmitterIndex].emissionRadius) emitters[currentEmitterIndex].emissionRadius = 70;
    if (!emitters[currentEmitterIndex].emissionThickness) emitters[currentEmitterIndex].emissionThickness = 10;
  }
  
  // Play sound if available
  if (SAAAM.playSound) {
    SAAAM.playSound("shape");
  }
}

// Draw a snowflake shape
function drawSnowflake(ctx, x, y, radius) {
  const branches = 6;
  
  ctx.beginPath();
  
  for (let i = 0; i < branches; i++) {
    const angle = (i * Math.PI * 2) / branches;
    
    // Main branch
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + radius * Math.cos(angle),
      y + radius * Math.sin(angle)
    );
    
    // Side branches
    const midX = x + (radius * 0.5) * Math.cos(angle);
    const midY = y + (radius * 0.5) * Math.sin(angle);
    
    // Sub-branch 1
    const subAngle1 = angle + Math.PI / 4;
    ctx.moveTo(midX, midY);
    ctx.lineTo(
      midX + (radius * 0.3) * Math.cos(subAngle1),
      midY + (radius * 0.3) * Math.sin(subAngle1)
    );
    
    // Sub-branch 2
    const subAngle2 = angle - Math.PI / 4;
    ctx.moveTo(midX, midY);
    ctx.lineTo(
      midX + (radius * 0.3) * Math.cos(subAngle2),
      midY + (radius * 0.3) * Math.sin(subAngle2)
    );
  }
  
  ctx.stroke();
}

// Draw a heart shape
function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  
  // Heart curve
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(
    x, y, 
    x - size, y, 
    x - size, y + size * 0.7
  );
  ctx.bezierCurveTo(
    x - size, y + size * 1.1, 
    x, y + size * 1.5, 
    x, y + size * 1.5
  );
  ctx.bezierCurveTo(
    x, y + size * 1.5, 
    x + size, y + size * 1.1, 
    x + size, y + size * 0.7
  );
  ctx.bezierCurveTo(
    x + size, y, 
    x, y, 
    x, y + size * 0.3
  );
  
  ctx.closePath();
  ctx.fill();
}

// Interpolate between two colors
function interpolateColor(color1, color2, factor) {
  // Convert hex colors to RGB
  const r1 = parseInt(color1.substr(1, 2), 16);
  const g1 = parseInt(color1.substr(3, 2), 16);
  const b1 = parseInt(color1.substr(5, 2), 16);
  
  const r2 = parseInt(color2.substr(1, 2), 16);
  const g2 = parseInt(color2.substr(3, 2), 16);
  const b2 = parseInt(color2.substr(5, 2), 16);
  
  // Interpolate RGB values
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Update emitters
function updateEmitters(deltaTime) {
  for (const emitter of emitters) {
    if (!emitter.active) continue;
    
    // Handle burst mode
    if (emitter.burstMode) {
      if (emitter.burstTimer > 0) {
        emitter.burstTimer -= deltaTime;
      } else {
        // Trigger burst
        triggerBurst(emitter);
        emitter.burstTimer = emitter.burstCooldown;
      }
    } else {
      // Regular emission
      // Calculate particles to emit based on emission rate and deltaTime
      const particlesToEmit = Math.floor(emitter.emissionRate * deltaTime);
      
      for (let i = 0; i < particlesToEmit; i++) {
        // Don't emit if at max particles
        if (particles.length >= MAX_PARTICLES) break;
        
        // Create particle
        emitParticle(emitter);
      }
    }
  }
}

// Trigger a burst of particles
function triggerBurst(emitter) {
  // Emit a burst of particles all at once
  for (let i = 0; i < emitter.burstCount; i++) {
    // Don't emit if at max particles
    if (particles.length >= MAX_PARTICLES) break;
    
    // Create particle
    emitParticle(emitter);
  }
  
  // Play sound if available
  if (SAAAM.playSound) {
    SAAAM.playSound("burst");
  }
}

// Emit a single particle from an emitter
function emitParticle(emitter) {
  // Calculate emission position based on shape
  let posX, posY;
  
  switch (emitter.emissionShape) {
    case "point":
      posX = emitter.x;
      posY = emitter.y;
      break;
      
    case "circle":
      // Random point in circle
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * emitter.emissionRadius;
      posX = emitter.x + Math.cos(angle) * radius;
      posY = emitter.y + Math.sin(angle) * radius;
      break;
      
    case "line":
      // Random point along a line
      posX = emitter.x - (emitter.emissionWidth / 2) + Math.random() * emitter.emissionWidth;
      posY = emitter.y;
      break;
      
    case "rectangle":
      // Random point in rectangle
      posX = emitter.x - (emitter.emissionWidth / 2) + Math.random() * emitter.emissionWidth;
      posY = emitter.y - (emitter.emissionHeight / 2) + Math.random() * emitter.emissionHeight;
      break;
      
    case "ring":
      // Random point on a ring
      const ringAngle = Math.random() * Math.PI * 2;
      const ringRadius = emitter.emissionRadius - (emitter.emissionThickness / 2) + 
                        Math.random() * emitter.emissionThickness;
      posX = emitter.x + Math.cos(ringAngle) * ringRadius;
      posY = emitter.y + Math.sin(ringAngle) * ringRadius;
      break;
      
    default:
      posX = emitter.x;
      posY = emitter.y;
  }
  
  // Calculate direction
  let directionAngle;
  if (emitter.spreadAngle >= 360) {
    // Full 360 spread
    directionAngle = Math.random() * Math.PI * 2;
  } else {
    // Directional spread
    const spreadRadians = emitter.spreadAngle * Math.PI / 180;
    const directionRadians = emitter.direction * Math.PI / 180;
    directionAngle = directionRadians + (Math.random() * spreadRadians - spreadRadians / 2);
  }
  
  // Calculate speed
  const speed = emitter.minSpeed + Math.random() * (emitter.maxSpeed - emitter.minSpeed);
  
  // Calculate size
  const size = emitter.minSize + Math.random() * (emitter.maxSize - emitter.minSize);
  
  // Calculate life
  const life = emitter.minLife + Math.random() * (emitter.maxLife - emitter.minLife);
  
  // Determine colors
  let color;
  if (emitter.confetti) {
    // For confetti, assign random colors
    const confettiColors = ["#F44336", "#4CAF50", "#2196F3", "#FFEB3B", "#9C27B0", "#FF9800"];
    color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  } else {
    // Normal color interpolation will happen during update
    color = emitter.color1;
  }
  
  // Create particle
  const particle = {
    x: posX,
    y: posY,
    vx: Math.cos(directionAngle) * speed,
    vy: Math.sin(directionAngle) * speed,
    size: size,
    color: color,
    initialColor: emitter.color1,
    targetColor: emitter.color2,
    life: life,
    maxLife: life,
    shape: emitter.particleShape,
    fadeMode: emitter.fadeMode,
    opacity: emitter.opacity,
    spin: emitter.spin,
    rotation: Math.random() * 360,
    spinSpeed: emitter.spin ? (Math.random() * 2 - 1) * emitter.spinSpeed : 0,
    acceleration: emitter.acceleration,
    initialVelocity: {
      x: Math.cos(directionAngle) * speed,
      y: Math.sin(directionAngle) * speed
    },
    blending: emitter.useBlending,
    orbital: emitter.orbital,
    orbitalCenter: emitter.orbital ? { x: emitter.x, y: emitter.y } : null,
    orbitalRadius: emitter.orbital ? 
      Math.sqrt(Math.pow(posX - emitter.x, 2) + Math.pow(posY - emitter.y, 2)) : 0,
    orbitalAngle: emitter.orbital ? 
      Math.atan2(posY - emitter.y, posX - emitter.x) : 0,
    orbitalSpeed: emitter.orbital ? 
      (Math.random() * 0.5 + 0.5) * emitter.orbitalSpeed * (Math.random() > 0.5 ? 1 : -1) : 0
  };
  
  particles.push(particle);
}

// Update all particles
function updateParticles(deltaTime) {
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    
    // Update life
    particle.life -= deltaTime;
    
    // Skip if dead
    if (particle.life <= 0) continue;
    
    // Calculate life ratio for animation
    const lifeRatio = particle.life / particle.maxLife;
    
    // Update opacity based on fade mode
    switch (particle.fadeMode) {
      case "out":
        particle.opacity *= lifeRatio;
        break;
      case "in":
        particle.opacity = 1 - lifeRatio;
        break;
      case "pulse":
        particle.opacity = 0.3 + 0.7 * Math.sin(lifeRatio * Math.PI);
        break;
      case "blink":
        particle.opacity = Math.sin(lifeRatio * Math.PI * 8) > 0 ? 1 : 0;
        break;
      case "color":
        // Opacity stays the same, color will change in draw
        break;
      // 'none' case keeps original opacity
    }
    
    // Update size based on life
    if (particle.fadeMode === "out" || particle.fadeMode === "in") {
      particle.size *= 0.995;
    }
    
    if (particle.orbital) {
      // Orbital movement
      particle.orbitalAngle += particle.orbitalSpeed * deltaTime * (Math.PI / 180);
      particle.x = particle.orbitalCenter.x + Math.cos(particle.orbitalAngle) * particle.orbitalRadius;
      particle.y = particle.orbitalCenter.y + Math.sin(particle.orbitalAngle) * particle.orbitalRadius;
    } else {
      // Apply velocity
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      
      // Apply acceleration
      if (particle.acceleration !== 0) {
        const speedX = particle.vx;
        const speedY = particle.vy;
        const speed = Math.sqrt(speedX * speedX + speedY * speedY);
        
        if (speed > 0) {
          const directionX = speedX / speed;
          const directionY = speedY / speed;
          
          // Apply acceleration in the direction of movement
          const accelerationX = directionX * particle.acceleration * deltaTime;
          const accelerationY = directionY * particle.acceleration * deltaTime;
          
          particle.vx += accelerationX;
          particle.vy += accelerationY;
        }
      }
      
      // Apply gravity to vertical velocity
      for (const emitter of emitters) {
        if (emitter.active && emitter.gravity !== 0) {
          particle.vy += emitter.gravity * deltaTime;
        }
      }
      
      // Apply wind from active emitters
      for (const emitter of emitters) {
        if (emitter.active && emitter.windStrength > 0) {
          const windRadians = emitter.windDirection * Math.PI / 180;
          particle.vx += Math.cos(windRadians) * emitter.windStrength * deltaTime;
          particle.vy += Math.sin(windRadians) * emitter.windStrength * deltaTime;
        }
      }
    }
    
    // Update rotation if spinning
    if (particle.spin) {
      particle.rotation += particle.spinSpeed * deltaTime;
    }
  }
}

// Clean up dead particles
function cleanupParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    
    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Draw the background
function drawBackground(ctx) {
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, "#1a1a2e");
  gradient.addColorStop(1, "#16213e");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);
  
  // Draw a subtle grid
  ctx.strokeStyle = "rgba(80, 140, 200, 0.1)";
  ctx.lineWidth = 1;
  
  // Vertical grid lines
  for (let x = 0; x < 800; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }
  
  // Horizontal grid lines
  for (let y = 0; y < 600; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }
  
  // Draw subtle ambient stars
  for (let i = 0; i < 50; i++) {
    const x = (Math.sin(i * 3.14159 + gameTime * 0.1) * 400) + 400;
    const y = (Math.cos(i * 3.14159 + gameTime * 0.08) * 300) + 300;
    
    const size = 1 + Math.sin(gameTime + i) * 0.5;
    const alpha = 0.1 + Math.sin(gameTime * 0.5 + i) * 0.05;
    
    ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Draw all particles
function drawParticles(ctx) {
  // Sort particles by blending mode to minimize state changes
  const nonBlendingParticles = [];
  const blendingParticles = [];
  
  for (const particle of particles) {
    if (particle.blending) {
      blendingParticles.push(particle);
    } else {
      nonBlendingParticles.push(particle);
    }
  }
  
  // Draw non-blending particles
  for (const particle of nonBlendingParticles) {
    drawParticle(ctx, particle);
  }
  
  // Set blending mode
  ctx.globalCompositeOperation = "lighter";
  
  // Draw blending particles
  for (const particle of blendingParticles) {
    drawParticle(ctx, particle);
  }
  
  // Reset blend mode
  ctx.globalCompositeOperation = "source-over";
}

// Draw a single particle
function drawParticle(ctx, particle) {
  // Skip if opacity is 0
  if (particle.opacity <= 0) return;
  
  // Calculate color based on life (if using color fade mode)
  if (particle.fadeMode === "color") {
    const lifeRatio = particle.life / particle.maxLife;
    particle.color = interpolateColor(
      particle.initialColor, 
      particle.targetColor, 
      1 - lifeRatio
    );
  }
  
  // Set transparency
  ctx.globalAlpha = particle.opacity;
  
  // Save context for rotation
  ctx.save();
  
  // Translate to particle position
  ctx.translate(particle.x, particle.y);
  
  // Rotate if needed
  if (particle.spin) {
    ctx.rotate(particle.rotation * Math.PI / 180);
  }
  
  // Set fill color
  ctx.fillStyle = particle.color;
  
  // Draw based on shape
  switch (particle.shape) {
    case "circle":
      ctx.beginPath();
      ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case "square":
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      break;
      
    case "triangle":
      ctx.beginPath();
      ctx.moveTo(0, -particle.size / 2);
      ctx.lineTo(particle.size / 2, particle.size / 2);
      ctx.lineTo(-particle.size / 2, particle.size / 2);
      ctx.closePath();
      ctx.fill();
      break;
      
    case "star":
      drawStar(ctx, 0, 0, 5, particle.size / 2, particle.size / 4);
      break;
      
    case "flake":
      drawSnowflake(ctx, 0, 0, particle.size / 2);
      break;
      
    case "heart":
      drawHeart(ctx, 0, 0, particle.size / 2);
      break;
      
    case "ring":
      ctx.beginPath();
      ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
      ctx.arc(0, 0, particle.size / 3, 0, Math.PI * 2, true);
      ctx.fill();
      break;
      
    case "bubble":
      ctx.beginPath();
      ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.3})`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(0, 0, particle.size / 2 - 1, 0, Math.PI * 2);
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Highlight
      ctx.beginPath();
      ctx.arc(-particle.size / 5, -particle.size / 5, particle.size / 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.8})`;
      ctx.fill();
      break;
      
    default:
      ctx.beginPath();
      ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
      ctx.fill();
  }
  
  // Restore context
  ctx.restore();
  
  // Reset transparency
  ctx.globalAlpha = 1.0;
}

// Draw a star shape
function drawStar(ctx, x, y, points, outerRadius, innerRadius) {
  ctx.beginPath();
  
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points;
    
    if (i === 0) {
      ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    } else {
      ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    }
  }
  
  ctx.closePath();
  ctx.fill();
}

// Draw emitters
function drawEmitters(ctx) {
  for (let i = 0; i < emitters.length; i++) {
    const emitter = emitters[i];
    const isSelected = i === currentEmitterIndex;
    
    // Draw emitter icon
    ctx.beginPath();
    
    // Draw circle
    ctx.fillStyle = emitter.active ? 
      (isSelected ? "#4CAF50" : "#2196F3") : 
      (isSelected ? "#F44336" : "#9E9E9E");
    
    ctx.arc(emitter.x, emitter.y, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw emitter indicator
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    
    if (emitter.emissionShape === "point") {
      // Point emitter - draw lines
      const spreadRadians = emitter.spreadAngle * Math.PI / 180;
      const directionRadians = emitter.direction * Math.PI / 180;
      
      if (emitter.spreadAngle < 360) {
        // Draw direction line
        ctx.beginPath();
        ctx.moveTo(emitter.x, emitter.y);
        ctx.lineTo(
          emitter.x + Math.cos(directionRadians) * 25,
          emitter.y + Math.sin(directionRadians) * 25
        );
        ctx.stroke();
        
        // Draw spread lines if not full 360
        if (emitter.spreadAngle > 0) {
          // Left spread line
          ctx.beginPath();
          ctx.moveTo(emitter.x, emitter.y);
          ctx.lineTo(
            emitter.x + Math.cos(directionRadians - spreadRadians / 2) * 20,
            emitter.y + Math.sin(directionRadians - spreadRadians / 2) * 20
          );
          ctx.stroke();
          
          // Right spread line
          ctx.beginPath();
          ctx.moveTo(emitter.x, emitter.y);
          ctx.lineTo(
            emitter.x + Math.cos(directionRadians + spreadRadians / 2) * 20,
            emitter.y + Math.sin(directionRadians + spreadRadians / 2) * 20
          );
          ctx.stroke();
        }
      } else {
        // 360 spread - draw a circle
        ctx.beginPath();
        ctx.arc(emitter.x, emitter.y, 20, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (emitter.emissionShape === "circle") {
      // Circle emitter
      ctx.beginPath();
      ctx.arc(emitter.x, emitter.y, emitter.emissionRadius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (emitter.emissionShape === "line") {
      // Line emitter
      ctx.beginPath();
      ctx.moveTo(emitter.x - emitter.emissionWidth / 2, emitter.y);
      ctx.lineTo(emitter.x + emitter.emissionWidth / 2, emitter.y);
      ctx.stroke();
    } else if (emitter.emissionShape === "rectangle") {
      // Rectangle emitter
      ctx.strokeRect(
        emitter.x - emitter.emissionWidth / 2,
        emitter.y - emitter.emissionHeight / 2,
        emitter.emissionWidth,
        emitter.emissionHeight
      );
    } else if (emitter.emissionShape === "ring") {
      // Ring emitter
      const innerRadius = emitter.emissionRadius - emitter.emissionThickness / 2;
      const outerRadius = emitter.emissionRadius + emitter.emissionThickness / 2;
      
      ctx.beginPath();
      ctx.arc(emitter.x, emitter.y, innerRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(emitter.x, emitter.y, outerRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw name if selected
    if (isSelected) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(emitter.name, emitter.x, emitter.y - 25);
    }
  }
}

// Draw UI
function drawUI(ctx) {
  // Draw UI panel background
  ctx.fillStyle = "rgba(30, 30, 40, 0.8)";
  ctx.fillRect(0, 0, 800, 600);
  
  // Draw tabs
  drawTabs(ctx);
  
  // Draw the active tab content
  switch (activeTab) {
    case "controls":
      drawControlsPanel(ctx);
      break;
    case "presets":
      drawPresetsPanel(ctx);
      break;
    case "help":
      drawHelpPanel(ctx);
      break;
  }
  
  // Draw emitter list (always visible)
  drawEmitterList(ctx);
  
  // Draw "New Emitter" button
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(10, 400, 170, 30);
  
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("New Emitter (N)", 95, 420);
  
  // Draw color picker if active
  if (colorPicker.active) {
    drawColorPicker(ctx);
  }
}// Particle Playground - Interactive Template
// A creative sandbox for experimenting with particle effects

// Register game lifecycle functions
SAAAM.registerCreate(create);
SAAAM.registerStep(step);
SAAAM.registerDraw(draw);

// Constants for particle system
const MAX_PARTICLES = 2000;
const GRAVITY = 200;
const EMISSION_RATE = 50; // Particles per second

// Main particle system
let particles = [];
let emitters = [];
let currentEmitterIndex = 0;

// Game time tracking
let gameTime = 0;

// UI state
let showUI = true;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let selectedParameter = null;
let sliders = [];
let colorPicker = { active: false, colorIndex: 0, x: 0, y: 0 };
let presetButtons = [];
let tabButtons = [];
let activeTab = 'controls';

// Performance stats
let fps = 0;
let frameCount = 0;
let lastFpsUpdate = 0;

// Create function - run once at game start
function create() {
  console.log("Particle Playground initialized!");
  
  // Create default emitters
  createDefaultEmitters();
  
  // Create UI controls
  createUIControls();
  
  // Play ambient music if available
  if (SAAAM.playMusic) {
    SAAAM.playMusic("ambient", 0.3, true);
  }
}

// Step function - run every frame
function step(deltaTime) {
  // Update game time
  gameTime += deltaTime;
  
  // Update FPS counter
  updateFPS(deltaTime);
  
  // Handle UI interaction
  handleInput(deltaTime);
  
  // Update emitters
  updateEmitters(deltaTime);
  
  // Update particles
  updateParticles(deltaTime);
  
  // Particle cleanup
  cleanupParticles();
}

// Draw function - render the scene
function draw(ctx) {
  // Draw background
  drawBackground(ctx);
  
  // Draw particles
  drawParticles(ctx);
  
  // Draw emitters
  drawEmitters(ctx);
  
  // Draw UI
  if (showUI) {
    drawUI(ctx);
  }
  
  // Draw info text
  drawInfoText(ctx);
}

// Update FPS counter
function updateFPS(deltaTime) {
  frameCount++;
  
  if (gameTime - lastFpsUpdate >= 1.0) {
    fps = Math.round(frameCount / (gameTime - lastFpsUpdate));
    frameCount = 0;
    lastFpsUpdate = gameTime;
  }
}

// Create default particle emitters
function createDefaultEmitters() {
  // Fire emitter
  emitters.push({
    name: "Fire",
    x: 400,
    y: 450,
    active: true,
    color1: "#FF5722",
    color2: "#FFEB3B",
    minSpeed: 50,
    maxSpeed: 150,
    minSize: 5,
    maxSize: 15,
    minLife: 0.5,
    maxLife: 2.0,
    spreadAngle: 30,
    direction: -90, // Up
    gravity: -20,  // Slight upward drift
    opacity: 0.8,
    useBlending: true,
    emissionShape: "point",
    emissionRate: EMISSION_RATE * 1.5,
    particleShape: "circle",
    fadeMode: "out",
    spin: false,
    spinSpeed: 0,
    acceleration: 0,
    windDirection: 0,
    windStrength: 0
  });
  
  // Water fountain
  emitters.push({
    name: "Fountain",
    x: 200,
    y: 400,
    active: true,
    color1: "#29B6F6",
    color2: "#81D4FA",
    minSpeed: 200,
    maxSpeed: 300,
    minSize: 3,
    maxSize: 8,
    minLife: 0.8,
    maxLife: 2.0,
    spreadAngle: 20,
    direction: -90, // Up
    gravity: GRAVITY,
    opacity: 0.8,
    useBlending: true,
    emissionShape: "point",
    emissionRate: EMISSION_RATE,
    particleShape: "circle",
    fadeMode: "out",
    spin: false,
    spinSpeed: 0,
    acceleration: -50,
    windDirection: 0,
    windStrength: 0
  });
  
  // Smoke
  emitters.push({
    name: "Smoke",
    x: 600,
    y: 450,
    active: true,
    color1: "#78909C",
    color2: "#B0BEC5",
    minSpeed: 20,
    maxSpeed: 50,
    minSize: 10,
    maxSize: 30,
    minLife: 2.0,
    maxLife: 5.0,
    spreadAngle: 20,
    direction: -90, // Up
    gravity: -10, // Slight upward drift
    opacity: 0.4,
    useBlending: false,
    emissionShape: "point",
    emissionRate: EMISSION_RATE * 0.7,
    particleShape: "circle",
    fadeMode: "out",
    spin: true,
    spinSpeed: 20,
    acceleration: 0,
    windDirection: 0,
    windStrength: 10
  });
  
  // Magic sparkles
  emitters.push({
    name: "Magic",
    x: 300,
    y: 300,
    active: true,
    color1: "#E040FB",
    color2: "#7C4DFF",
    minSpeed: 100,
    maxSpeed: 200,
    minSize: 2,
    maxSize: 6,
    minLife: 1.0,
    maxLife: 3.0,
    spreadAngle: 360, // All directions
    direction: 0,
    gravity: 0,
    opacity: 1.0,
    useBlending: true,
    emissionShape: "circle",
    emissionRadius: 50,
    emissionRate: EMISSION_RATE * 0.8,
    particleShape: "star",
    fadeMode: "pulse",
    spin: true,
    spinSpeed: 90,
    acceleration: 0,
    windDirection: 0,
    windStrength: 0
  });
  
  // Snow
  emitters.push({
    name: "Snow",
    x: 500,
    y: 50,
    active: true,
    color1: "#FFFFFF",
    color2: "#E3F2FD",
    minSpeed: 30,
    maxSpeed: 70,
    minSize: 3,
    maxSize: 8,
    minLife: 5.0,
    maxLife: 10.0,
    spreadAngle: 30,
    direction: 90, // Down
    gravity: 20, // Light gravity
    opacity: 0.9,
    useBlending: false,
    emissionShape: "line",
    emissionWidth: 800,
    emissionRate: EMISSION_RATE * 0.5,
    particleShape: "flake",
    fadeMode: "none",
    spin: true,
    spinSpeed: 15,
    acceleration: 0,
    windDirection: 0,
    windStrength: 20
  });
  
  // Explosion
  emitters.push({
    name: "Explosion",
    x: 700,
    y: 200,
    active: false, // Starts inactive
    color1: "#FF9800",
    color2: "#FFEB3B",
    minSpeed: 200,
    maxSpeed: 400,
    minSize: 5,
    maxSize: 15,
    minLife: 0.5,
    maxLife: 1.5,
    spreadAngle: 360, // All directions
    direction: 0,
    gravity: 100,
    opacity: 1.0,
    useBlending: true,
    emissionShape: "point",
    emissionRate: EMISSION_RATE * 5,
    particleShape: "circle",
    fadeMode: "out",
    spin: false,
    spinSpeed: 0,
    acceleration: -150,
    windDirection: 0,
    windStrength: 0,
    burstMode: true,
    burstCount: 100,
    burstCooldown: 1.0,
    burstTimer: 0
  });
}

// Create UI controls
function createUIControls() {
  // Parameter sliders
  sliders = [
    { name: "Min Speed", property: "minSpeed", min: 0, max: 300, step: 5 },
    { name: "Max Speed", property: "maxSpeed", min: 0, max: 500, step: 5 },
    { name: "Min Size", property: "minSize", min: 1, max: 30, step: 1 },
    { name: "Max Size", property: "maxSize", min: 1, max: 50, step: 1 },
    { name: "Min Life", property: "minLife", min: 0.1, max: 5, step: 0.1 },
    { name: "Max Life", property: "maxLife", min: 0.1, max: 10, step: 0.1 },
    { name: "Spread Angle", property: "spreadAngle", min: 0, max: 360, step: 5 },
    { name: "Direction", property: "direction", min: -180, max: 180, step: 5 },
    { name: "Gravity", property: "gravity", min: -300, max: 300, step: 10 },
    { name: "Opacity", property: "opacity", min: 0, max: 1, step: 0.05 },
    { name: "Emission Rate", property: "emissionRate", min: 1, max: 200, step: 1 },
    { name: "Spin Speed", property: "spinSpeed", min: 0, max: 360, step: 5 },
    { name: "Acceleration", property: "acceleration", min: -200, max: 200, step: 10 },
    { name: "Wind Strength", property: "windStrength", min: 0, max: 100, step: 5 },
    { name: "Wind Direction", property: "windDirection", min: -180, max: 180, step: 5 }
  ];
  
  // Preset buttons
  presetButtons = [
    { name: "Fire", preset: "fire" },
    { name: "Water", preset: "water" },
    { name: "Smoke", preset: "smoke" },
    { name: "Magic", preset: "magic" },
    { name: "Snow", preset: "snow" },
    { name: "Explosion", preset: "explosion" },
    { name: "Confetti", preset: "confetti" },
    { name: "Galaxy", preset: "galaxy" }
  ];
  
  // Tab buttons
  tabButtons = [
    { name: "Controls", tab: "controls" },
    { name: "Presets", tab: "presets" },
    { name: "Help", tab: "help" }
  ];
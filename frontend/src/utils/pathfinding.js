import { racks, warehouseConfig } from '../data/warehouse';

// Create a grid representation of the warehouse
// 0 = walkable, 1 = obstacle (racks/walls)
export function createWarehouseGrid() {
  const { width, height, gridSize } = warehouseConfig;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  
  // Initialize grid as all walkable
  const grid = Array(rows).fill(null).map(() => Array(cols).fill(0));
  
  // Mark racks as obstacles
  racks.forEach(rack => {
    const startCol = Math.floor(rack.x / gridSize);
    const endCol = Math.ceil((rack.x + rack.width) / gridSize);
    const startRow = Math.floor(rack.y / gridSize);
    const endRow = Math.ceil((rack.y + rack.height) / gridSize);
    
    for (let row = startRow; row < endRow && row < rows; row++) {
      for (let col = startCol; col < endCol && col < cols; col++) {
        if (row >= 0 && col >= 0) {
          grid[row][col] = 1;
        }
      }
    }
  });
  
  return grid;
}

// A* Pathfinding Algorithm
export function findShortestPath(startX, startY, endX, endY) {
  const { gridSize } = warehouseConfig;
  const grid = createWarehouseGrid();
  
  const startCol = Math.floor(startX / gridSize);
  const startRow = Math.floor(startY / gridSize);
  const endCol = Math.floor(endX / gridSize);
  const endRow = Math.floor(endY / gridSize);
  
  const rows = grid.length;
  const cols = grid[0].length;
  
  // Validate start and end points
  if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols) {
    return [];
  }
  if (endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
    return [];
  }
  
  // Find nearest walkable cell to destination if it's on a rack
  let targetRow = endRow;
  let targetCol = endCol;
  
  if (grid[endRow]?.[endCol] === 1) {
    // Find nearest aisle point
    const nearestAisle = findNearestWalkable(grid, endRow, endCol);
    if (nearestAisle) {
      targetRow = nearestAisle.row;
      targetCol = nearestAisle.col;
    }
  }
  
  // A* implementation
  const openSet = [];
  const closedSet = new Set();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();
  
  const getKey = (row, col) => `${row},${col}`;
  
  const heuristic = (row, col) => {
    return Math.abs(row - targetRow) + Math.abs(col - targetCol);
  };
  
  const startKey = getKey(startRow, startCol);
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(startRow, startCol));
  openSet.push({ row: startRow, col: startCol, f: fScore.get(startKey) });
  
  const directions = [
    { dr: -1, dc: 0 },  // up
    { dr: 1, dc: 0 },   // down
    { dr: 0, dc: -1 },  // left
    { dr: 0, dc: 1 },   // right
    { dr: -1, dc: -1 }, // diagonal
    { dr: -1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: 1, dc: 1 },
  ];
  
  while (openSet.length > 0) {
    // Get node with lowest fScore
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const currentKey = getKey(current.row, current.col);
    
    if (current.row === targetRow && current.col === targetCol) {
      // Reconstruct path
      const path = [];
      let key = currentKey;
      while (key) {
        const [row, col] = key.split(',').map(Number);
        path.unshift({
          x: col * gridSize + gridSize / 2,
          y: row * gridSize + gridSize / 2,
        });
        key = cameFrom.get(key);
      }
      
      // Add the actual destination point at the end
      if (path.length > 0) {
        path.push({ x: endX, y: endY });
      }
      
      return simplifyPath(path);
    }
    
    closedSet.add(currentKey);
    
    for (const { dr, dc } of directions) {
      const newRow = current.row + dr;
      const newCol = current.col + dc;
      const neighborKey = getKey(newRow, newCol);
      
      // Check bounds
      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
        continue;
      }
      
      // Check if walkable
      if (grid[newRow][newCol] === 1) {
        continue;
      }
      
      // Check if in closed set
      if (closedSet.has(neighborKey)) {
        continue;
      }
      
      // Diagonal movement cost is higher
      const moveCost = (dr !== 0 && dc !== 0) ? 1.414 : 1;
      const tentativeGScore = gScore.get(currentKey) + moveCost;
      
      if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeGScore);
        const f = tentativeGScore + heuristic(newRow, newCol);
        fScore.set(neighborKey, f);
        
        if (!openSet.some(n => n.row === newRow && n.col === newCol)) {
          openSet.push({ row: newRow, col: newCol, f });
        }
      }
    }
  }
  
  return []; // No path found
}

// Find nearest walkable cell
function findNearestWalkable(grid, row, col) {
  const rows = grid.length;
  const cols = grid[0].length;
  const maxRadius = 10;
  
  for (let radius = 1; radius <= maxRadius; radius++) {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          if (grid[newRow][newCol] === 0) {
            return { row: newRow, col: newCol };
          }
        }
      }
    }
  }
  
  return null;
}

// Simplify path by removing intermediate points on straight lines
function simplifyPath(path) {
  if (path.length <= 2) return path;
  
  const simplified = [path[0]];
  
  for (let i = 1; i < path.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const current = path[i];
    const next = path[i + 1];
    
    // Check if current point is on a straight line between prev and next
    const dx1 = current.x - prev.x;
    const dy1 = current.y - prev.y;
    const dx2 = next.x - current.x;
    const dy2 = next.y - current.y;
    
    // If direction changes, keep the point
    if (Math.sign(dx1) !== Math.sign(dx2) || Math.sign(dy1) !== Math.sign(dy2)) {
      simplified.push(current);
    }
  }
  
  simplified.push(path[path.length - 1]);
  return simplified;
}

// Calculate total path distance
export function calculatePathDistance(path) {
  if (path.length < 2) return 0;
  
  let distance = 0;
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - path[i - 1].x;
    const dy = path[i].y - path[i - 1].y;
    distance += Math.sqrt(dx * dx + dy * dy);
  }
  
  // Convert pixels to meters (assuming 1 pixel = 0.1 meters)
  return (distance * 0.1).toFixed(1);
}

// Estimate walking time (average walking speed: 1.4 m/s)
export function calculateWalkingTime(path) {
  const distanceMeters = calculatePathDistance(path);
  const timeSeconds = distanceMeters / 1.4;
  
  if (timeSeconds < 60) {
    return `${Math.round(timeSeconds)} sec`;
  }
  
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = Math.round(timeSeconds % 60);
  return `${minutes}m ${seconds}s`;
}

// Get turn-by-turn directions
export function getDirections(path, productName, rackId) {
  if (path.length < 2) return [];
  
  const directions = [];
  directions.push({
    step: 1,
    instruction: 'Start from Worker Entrance',
    icon: '🚶',
  });
  
  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1];
    const current = path[i];
    const next = path[i + 1];
    
    const dx1 = current.x - prev.x;
    const dy1 = current.y - prev.y;
    const dx2 = next.x - current.x;
    const dy2 = next.y - current.y;
    
    // Determine turn direction
    const cross = dx1 * dy2 - dy1 * dx2;
    
    if (Math.abs(cross) > 10) {
      const turn = cross > 0 ? 'Turn right' : 'Turn left';
      directions.push({
        step: directions.length + 1,
        instruction: turn,
        icon: cross > 0 ? '➡️' : '⬅️',
      });
    }
  }
  
  directions.push({
    step: directions.length + 1,
    instruction: `Arrive at Rack ${rackId}`,
    icon: '📍',
  });
  
  directions.push({
    step: directions.length + 1,
    instruction: `Pick up: ${productName}`,
    icon: '📦',
  });
  
  return directions;
}

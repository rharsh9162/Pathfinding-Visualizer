import { bfs } from './algorithms/bfs.js';
import { dfs } from './algorithms/dfs.js';
import { dijkstra } from './algorithms/dijkstra.js';
import { astar } from './algorithms/astar.js';

const rows = 25;
const cols = 60;
let isMouseDown = false;
let dragMode = null; // "start", "target", or null
let startNode = { row: 5, col: 5 };
let targetNode = { row: 15, col: 45 };
let animationSpeed = 50; // Default to Average
let bombNode = null;
let visitSpeed = 40;  // For visited node
let pathSpeed = 30;   // For path drawing

function createGrid() {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const node = document.createElement('div');
      node.classList.add('grid-node');
      node.id = `node-${row}-${col}`;

      if (row === startNode.row && col === startNode.col) {
        node.classList.add('start');
        node.innerHTML = '&#10148;';
      } else if (row === targetNode.row && col === targetNode.col) {
        node.classList.add('target');
        node.innerHTML = '&#9673;';
      }

      node.addEventListener('mousedown', () => {
  if (node.classList.contains('start')) {
    dragMode = 'start';
  } else if (node.classList.contains('target')) {
    dragMode = 'target';
  } else {
    toggleWall(node);
  }
  isMouseDown = true;
});

node.addEventListener('mouseenter', () => {
  if (!isMouseDown) return;

  if (dragMode === 'start') {
    moveNode('start', node);
  } else if (dragMode === 'target') {
    moveNode('target', node);
  } else {
    toggleWall(node); 
  }
});


      container.appendChild(node);
    }
  }
}

function toggleWall(node) {
  if (
    !node.classList.contains('start') &&
    !node.classList.contains('target') &&
    !node.classList.contains('bomb')
  ) {
    node.classList.toggle('wall');
  }
}

function moveNode(type, newNode) {
  const [newRow, newCol] = newNode.id.split('-').slice(1).map(Number);
  if (newNode.classList.contains('wall') || newNode.classList.contains('bomb')) return;

  if (type === 'start') {
    const prev = document.getElementById(`node-${startNode.row}-${startNode.col}`);
    prev.classList.remove('start');
    prev.innerHTML = '';
    startNode = { row: newRow, col: newCol };
    newNode.classList.add('start');
    newNode.innerHTML = '&#10148;';
  } else if (type === 'target') {
    const prev = document.getElementById(`node-${targetNode.row}-${targetNode.col}`);
    prev.classList.remove('target');
    prev.innerHTML = '';
    targetNode = { row: newRow, col: newCol };
    newNode.classList.add('target');
    newNode.innerHTML = '&#9673;';
  }
}

function clearWalls() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const node = document.getElementById(`node-${row}-${col}`);
      node.classList.remove('wall', 'visited', 'path', 'bomb');
    }
  }
}

function clearBoard() {
  clearWalls();
  createGrid();
}

function addBomb() {
  const bombRow = 10;
  const bombCol = 25;
  bombNode = { row: bombRow, col: bombCol };
  const node = document.getElementById(`node-${bombRow}-${bombCol}`);

  // Don't overwrite start or target
  if (node.classList.contains('start') || node.classList.contains('target')) return;

  node.classList.add('bomb');
  node.innerHTML = '&#128163;'; // 💣
}


function getGrid() {
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      const node = document.getElementById(`node-${row}-${col}`);
      rowArray.push({
        row,
        col,
        isWall: node.classList.contains('wall'),
      });
    }
    grid.push(rowArray);
  }
  return grid;
}

function clearPathOnly() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const node = document.getElementById(`node-${row}-${col}`);
      node.classList.remove('visited', 'path', 'current');
    }
  }
}


function animate(visitedNodes, shortestPath) {
  for (let i = 0; i <= visitedNodes.length; i++) {
    if (i === visitedNodes.length) {
      setTimeout(() => {
        animatePath(shortestPath, () => {
          alert(`✅ Path length: ${shortestPath.length} steps`);
        });
      }, visitSpeed * i);
      return;
    }

    setTimeout(() => {
      const { row, col } = visitedNodes[i];
      const node = document.getElementById(`node-${row}-${col}`);
      if (!node.classList.contains('start') && !node.classList.contains('target')) {
        node.classList.add('current');
        setTimeout(() => {
          node.classList.remove('current');
          node.classList.add('visited');
        }, visitSpeed / 2);
      }
    }, visitSpeed * i);
  }
}


function animatePath(path, callback) {
  for (let i = 0; i < path.length; i++) {
    setTimeout(() => {
      const { row, col } = path[i];
      const node = document.getElementById(`node-${row}-${col}`);
      if (!node.classList.contains('start') && !node.classList.contains('target')) {
        node.classList.add('path');
      }

      if (i === path.length - 1 && callback) callback();
    }, pathSpeed * i);
  }
}


function generateMaze() {
  clearWalls(); // Clear previous walls, but keep start, target, bomb

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const node = document.getElementById(`node-${row}-${col}`);
      const isStart = node.classList.contains('start');
      const isTarget = node.classList.contains('target');
      const isBomb = node.classList.contains('bomb');

      if (isStart || isTarget || isBomb) continue;

      if (Math.random() < 0.28) {
        node.classList.add('wall');
      }
    }
  }
}




function visualize() {
  const algo = document.getElementById('algorithmSelector').value;
  const grid = getGrid();
  const start = grid[startNode.row][startNode.col];
  const end = grid[targetNode.row][targetNode.col];

  let result;

  // Bomb logic
  if (bombNode) {
    const bomb = grid[bombNode.row][bombNode.col];
    let res1, res2;

    switch (algo) {
      case 'bfs':
        res1 = bfs(grid, start, bomb);
        res2 = bfs(grid, bomb, end);
        break;
      case 'dfs':
        res1 = dfs(grid, start, bomb);
        res2 = dfs(grid, bomb, end);
        break;
      case 'dijkstra':
        res1 = dijkstra(grid, start, bomb);
        res2 = dijkstra(grid, bomb, end);
        break;
      case 'astar':
        res1 = astar(grid, start, bomb);
        res2 = astar(grid, bomb, end);
        break;
      default:
        alert('Invalid algorithm selected');
        return;
    }

    result = {
      visitedNodes: [...res1.visitedNodes, ...res2.visitedNodes],
      path: [...res1.path, ...res2.path],
    };
  }

  // No bomb
  else {
    switch (algo) {
      case 'bfs':
        result = bfs(grid, start, end);
        break;
      case 'dfs':
        result = dfs(grid, start, end);
        break;
      case 'dijkstra':
        result = dijkstra(grid, start, end);
        break;
      case 'astar':
        result = astar(grid, start, end);
        break;
      default:
        alert('Invalid algorithm selected');
        return;
    }
  }

  animate(result.visitedNodes, result.path);
}


window.visualize = visualize;
window.clearBoard = clearBoard;
window.clearWalls = clearWalls;
window.addBomb = addBomb;
window.generateMaze = generateMaze;
window.clearPathOnly = clearPathOnly;


window.onload = () => {
  createGrid();

  document.body.onmousedown = () => (isMouseDown = true);
  document.body.onmouseup = () => {
    isMouseDown = false;
    dragMode = null;
  };

  // ✅ Speed selector setup
  const speedSelector = document.getElementById('speedSelector');
  speedSelector.value = 'average'; // default

  speedSelector.addEventListener('change', (e) => {
    const speed = e.target.value;
    switch (speed) {
      case 'fast':
        visitSpeed = 5;
        pathSpeed = 15;
        break;
      case 'average':
        visitSpeed = 40;
        pathSpeed = 30;
        break;
      case 'slow':
        visitSpeed = 190;
        pathSpeed = 70;
        break;
    }
  });

  // ✅ Show welcome modal
  const modal = document.getElementById('welcomeModal');
  const closeBtn = document.getElementById('closeModal');

  if (modal && closeBtn) {
    modal.style.display = 'flex';
    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };
  }
};





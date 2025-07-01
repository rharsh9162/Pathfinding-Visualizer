export function dfs(grid, start, target) {
  const visited = [];
  const path = [];
  const found = dfsHelper(start, target, grid, visited, path, new Set());
  return { visitedNodes: visited, path: found ? path.reverse() : [] };
}

function dfsHelper(node, target, grid, visited, path, seen) {
  const key = `${node.row},${node.col}`;
  if (seen.has(key)) return false;
  seen.add(key);
  visited.push(node);

  if (node === target) {
    path.push(node);
    return true;
  }

  for (const neighbor of getNeighbors(grid, node)) {
    if (dfsHelper(neighbor, target, grid, visited, path, seen)) {
      path.push(node);
      return true;
    }
  }

  return false;
}

function getNeighbors(grid, node) {
  const { row, col } = node;
  const neighbors = [];

  const directions = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1]
  ];

  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;
    if (
      r >= 0 &&
      r < grid.length &&
      c >= 0 &&
      c < grid[0].length &&
      !grid[r][c].isWall
    ) {
      neighbors.push(grid[r][c]);
    }
  }

  return neighbors;
}

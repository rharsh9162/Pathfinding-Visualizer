export function bfs(grid, startNode, endNode) {
  const visitedNodes = [];
  const queue = [];
  const cameFrom = {};

  queue.push(startNode);
  const visited = new Set();
  visited.add(`${startNode.row}-${startNode.col}`);

  while (queue.length) {
    const current = queue.shift();
    visitedNodes.push(current);

    if (current.row === endNode.row && current.col === endNode.col) break;

    for (const neighbor of getNeighbors(current, grid)) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key) && !neighbor.isWall) {
        visited.add(key);
        cameFrom[key] = current;
        queue.push(neighbor);
      }
    }
  }

  const path = reconstructPath(cameFrom, endNode);
  return { visitedNodes, path };
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}

function reconstructPath(cameFrom, endNode) {
  const path = [];
  let current = endNode;
  while (cameFrom[`${current.row}-${current.col}`]) {
    path.unshift(current);
    current = cameFrom[`${current.row}-${current.col}`];
  }
  return path;
}

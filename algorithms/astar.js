export function astar(grid, start, target) {
  const visitedNodes = [];
  const openSet = [start];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  for (const row of grid) {
    for (const node of row) {
      const key = `${node.row}-${node.col}`;
      gScore[key] = Infinity;
      fScore[key] = Infinity;
    }
  }

  const startKey = `${start.row}-${start.col}`;
  gScore[startKey] = 0;
  fScore[startKey] = heuristic(start, target);

  while (openSet.length > 0) {
    openSet.sort((a, b) =>
      fScore[`${a.row}-${a.col}`] - fScore[`${b.row}-${b.col}`]
    );
    const current = openSet.shift();
    visitedNodes.push(current);

    if (current === target) {
      const path = [];
      let curr = current;
      while (curr) {
        path.unshift(curr);
        const key = `${curr.row}-${curr.col}`;
        curr = cameFrom[key];
      }
      return { visitedNodes, path };
    }

    for (const neighbor of getNeighbors(grid, current)) {
      const currKey = `${current.row}-${current.col}`;
      const neighborKey = `${neighbor.row}-${neighbor.col}`;
      const tentativeG = gScore[currKey] + 1;

      if (tentativeG < gScore[neighborKey]) {
        cameFrom[neighborKey] = current;
        gScore[neighborKey] = tentativeG;
        fScore[neighborKey] =
          tentativeG + heuristic(neighbor, target);
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return { visitedNodes, path: [] };
}

function heuristic(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col); // Manhattan distance
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

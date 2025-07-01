export function dijkstra(grid, start, target) {
  const visitedNodes = [];
  const dist = {};
  const prev = {};
  const pq = [];

  for (const row of grid) {
    for (const node of row) {
      const key = `${node.row}-${node.col}`;
      dist[key] = Infinity;
      prev[key] = null;
    }
  }

  const startKey = `${start.row}-${start.col}`;
  dist[startKey] = 0;
  pq.push({ node: start, distance: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.distance - b.distance);
    const { node } = pq.shift();
    const key = `${node.row}-${node.col}`;

    if (dist[key] === Infinity) break;
    if (visitedNodes.includes(node)) continue;

    visitedNodes.push(node);
    if (node === target) break;

    for (const neighbor of getNeighbors(grid, node)) {
      const nKey = `${neighbor.row}-${neighbor.col}`;
      const alt = dist[key] + 1;
      if (alt < dist[nKey]) {
        dist[nKey] = alt;
        prev[nKey] = node;
        pq.push({ node: neighbor, distance: alt });
      }
    }
  }

  const path = [];
  let curr = target;
  while (curr) {
    path.unshift(curr);
    curr = prev[`${curr.row}-${curr.col}`];
  }

  return { visitedNodes, path };
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

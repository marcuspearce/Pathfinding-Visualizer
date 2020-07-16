// Performs Dijkstra's algorithm (https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/)
// Returns all nodes in order in which they were visited = visitedNodesInOrder
    // makes all nodes point back to their prev node -> allows to compute shortest path by backtracking from finish node

export function dijkstra(grid, startNode, finishNode) {

    let visitedNodesInOrder = [];
    startNode.distance = 0;
    // startNode.isVisited = true;
    updateUnvisitedNeighbors(startNode,grid);
    let unvisitedNodes = getAllNodes(grid);
    // !! operator returns boolean association of the value (i.e. if not 0 then true)
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);            // COULD CHANGE W/ MINHEAP
        let closestNode = unvisitedNodes.shift();

        // if encounter a wall, skip it
        if (closestNode.isWall) {
            continue;
        } 
        // if closest node is at a distance of infinity, must be trapped so stop
        if (closestNode.distance === Infinity) {
            return visitedNodesInOrder;
        }
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        // found finishNode
        // if (closestNode === finishNode) {
        if(closestNode.isFinish) {
            // console.log("found ending");
            return visitedNodesInOrder;
        }
        updateUnvisitedNeighbors(closestNode, grid);
    }
}


function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((node_A, node_B) => node_A.distance - node_B.distance);
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node,grid);
    for(const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node,grid) {
    const neighbors = [];
    const {row,col} = node;
    if(row > 0)
        neighbors.push(grid[row-1][col]);
    if (row < grid.length - 1) 
        neighbors.push(grid[row + 1][col]);
    if (col > 0) 
        neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) 
        neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}


export function dijkstraReturnFinishNode(grid, startNode, finishNode) {

    let visitedNodesInOrder = [];
    startNode.distance = 0;
    // startNode.isVisited = true;
    updateUnvisitedNeighbors(startNode,grid);
    let unvisitedNodes = getAllNodes(grid);
    // !! operator returns boolean association of the value (i.e. if not 0 then true)
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);            // COULD CHANGE W/ MINHEAP
        let closestNode = unvisitedNodes.shift();

        // if encounter a wall, skip it
        if (closestNode.isWall) {
            continue;
        } 
        // if closest node is at a distance of infinity, must be trapped so stop
        if (closestNode.distance === Infinity) {
            return visitedNodesInOrder;
        }
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        // found finishNode
        // if (closestNode === finishNode) {
        if(closestNode.isFinish) {
            return closestNode;
        }
        updateUnvisitedNeighbors(closestNode, grid);
    }
}
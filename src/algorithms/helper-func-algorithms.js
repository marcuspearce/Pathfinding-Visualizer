// Backtracks from finishNode to find the shortest path.
export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        console.log(`getNodesInShortestPathOrder: ${currentNode}`);
        nodesInShortestPathOrder.unshift(currentNode);  // unshift -- add new item to beginning of array and return new length
        currentNode = currentNode.previousNode;
    }   
    return nodesInShortestPathOrder;
}
import React, { Component } from "react";
import Node from "./Node/Node";
import {dijkstra} from '../algorithms/dijkstra';
import {getNodesInShortestPathOrder} from '../algorithms/helper-func-algorithms';

import "./PathfindingVisualizer.css";

const NUM_ROWS = 20;
const NUM_COLS = 30;
const START_ROW = 10;
const START_COL = 5;
const FINISH_ROW = 10;
const FINISH_COL = 25;

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    componentDidMount() {
        const nodes = getInitialGrid();
        this.setState({ grid: nodes });
    }

    handleMouseDown(row,col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid,row,col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row,col) {
        // below allows user to hold mouse down and "drag" to make wall
        if(!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid,row,col);
        this.setState({grid:newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    // goes thru each node in VisitedNodesInOrder, creates new node w/ isVisited = true
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                    setTimeout(() => {
                        this.animateShortestPath(nodesInShortestPathOrder);
                    }, 10 * i);
                    return;
                }
                setTimeout(() => {
                    const node = visitedNodesInOrder[i];
                    const classCheck = document.getElementById(`node-${node.row}-${node.col}`).className
                    if(classCheck !== 'node node-start' && classCheck !== 'node node-finish')
                    {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                    }
                }, 10 * i);
            }
      }
    
    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            const classCheck = document.getElementById(`node-${node.row}-${node.col}`).className
            if(classCheck !== 'node node-start' && classCheck !== 'node node-finish')
            {
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }   
        }, 50 * i);
        }
    }


    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_ROW][START_COL];
        const finishNode = grid[FINISH_ROW][FINISH_COL];
        const visitedNodesInOrder = dijkstra(grid,startNode,finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

        // test returns correct shortest path 
        // for(const node of nodesInShortestPathOrder){
        //     console.log("hello");
        //     console.log(`info: ${node.getElementById} , ${node.row} , ${node.col}`);
        // }
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }





    // go thru each node of grid and reset states, init start and end
    reset() {
        // const resetGrid = this.state.grid.slice();

        const resetGrid = [];
        for (let row = 0; row < NUM_ROWS; row++) {
            const currentRow = [];
            for (let col = 0; col < NUM_COLS; col++) {
                currentRow.push(createNode(row,col));
            }
            resetGrid.push(currentRow);
        }

        for (let i = 0; i < NUM_ROWS; i++) {
            for (let j = 0; j < NUM_COLS; j++) {
                const node = resetGrid[i][j];
                // console.log(node);
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
                if(node.row === START_ROW && node.col === START_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
                }
                if(node.row === FINISH_ROW && node.col === FINISH_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
                }
            }
        }

        this.setState({ grid: resetGrid });

        // this.setState({grid:resetGrid});
    }






    render() {
        const { grid, mouseIsPressed } = this.state;

        return (
            // need to encapsulate entire return stuff in single elemtnt <> <\>
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visualize Dijkstra's Algorithm
                </button>
                <button onClick={() => this.reset()}>
                    Reset
                </button>
                <div className="grid">
                    {grid.map((row, rowIndex) => {
                        return (
                            <div key={rowIndex}>
                            {row.map((node, nodeIndex) => {
                                const {row, col, isStart, isFinish, isWall} = node;
                                return (
                                    <Node 
                                        key={nodeIndex}
                                        row={row}
                                        col={col}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row,col) => 
                                            this.handleMouseDown(row,col)
                                        }
                                        onMouseEnter={(row,col) => 
                                            this.handleMouseEnter(row,col)
                                        }
                                        onMouseUp={() => this.handleMouseUp()}>
                                    </Node>
                                );
                            })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}


const getInitialGrid = () => {
    const nodes = [];
    for (let row = 0; row < NUM_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < NUM_COLS; col++) {
            currentRow.push(createNode(row,col));
        }
        nodes.push(currentRow);
    }
    return nodes;
};

const createNode = (row, col) => {
    return {
        row,
        col,
        isStart: row === START_ROW && col === START_COL,
        isFinish: row === FINISH_ROW && col === FINISH_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

// makes Node at given (row,col) a wall (wall property is true)
const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice(); // return shallow copy of array
    const node = newGrid[row][col];
    // ... spread operator -> expands an array into a list  
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};
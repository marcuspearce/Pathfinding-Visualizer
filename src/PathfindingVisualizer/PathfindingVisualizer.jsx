import React, { Component } from "react";
import Node from "./Node/Node";
import {dijkstra, dijkstraReturnFinishNode} from '../algorithms/dijkstra';
import {getNodesInShortestPathOrder} from '../algorithms/helper-func-algorithms';

import "./PathfindingVisualizer.css";

const NUM_ROWS = 20;
const NUM_COLS = 30;
const INIT_START_ROW = 10;
const INIT_START_COL = 5;
const INIT_FINISH_ROW = 10;
const INIT_FINISH_COL = 25;

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            changeWall: false,
            startNode: null,
            changeStart: false,
            finishNode: null,
            changeFinish: false,
        };
    }

    componentDidMount() {
        const nodes = getInitialGrid();
        const startNode = findStartOrFinishNode(nodes, "start");
        const finishNode = findStartOrFinishNode(nodes, "finish");
        this.setState({ grid: nodes, startNode: startNode , finishNode: finishNode});
    }

    handleMouseDown(row,col) {
        const grid = this.state.grid;
        const node = grid[row][col];
        // const newGrid = grid.slice();

        // if in changeStart state, change startNode if allowed
        if(this.state.changeStart){
            // don't allow to place start node in a wall or finish
            if(node.isWall || node.isFinish){
                const prevStart = this.state.startNode;
                const newGrid = modifyGrid(this.state.grid, prevStart.row, prevStart.col,"start", true);
                this.setState({grid:newGrid, startNode:prevStart, changeStart:false});
            }
            else {
                const newGrid = modifyGrid(this.state.grid, row, col,"start", true);
                this.setState({grid:newGrid, startNode:node, changeStart:false});
            }
            return;
        }
        // check if start -> if yes then set changeStartState to true
        else if(node.isStart) {
            const newGrid = modifyGrid(this.state.grid,row,col,"start",false);
            this.setState({grid:newGrid, changeStart: true});
        }


        // if in changeFinish state, change finishNode if allowed
        else if(this.state.changeFinish){
            // don't allow to place finish node in a wall or start
            if(node.isWall || node.isStart){
                const prevFinish = this.state.finishNode;
                const newGrid = modifyGrid(this.state.grid, prevFinish.row, prevFinish.col,"finish", true);
                this.setState({grid:newGrid, finishNode:prevFinish, changeFinish:false});
            }
            else {
                const newGrid = modifyGrid(this.state.grid, row, col,"finish", true);
                this.setState({grid:newGrid, finishNode:node, changeFinish:false});
            }
            return;
        }
        // check if finish -> if yes then set changeFinishState to true
        else if(node.isFinish) {
            const newGrid = modifyGrid(this.state.grid,row,col,"finish",false);
            this.setState({grid:newGrid,changeFinish: true});

        }


        // if currently is changeWall state -> make not changeWall state
        else if (this.state.changeWall) {
            this.setState({changeWall: false});
        }
        // if not in changeWall state 
            // -> if clicked a wall make it not wall , if clicked not a wall/start/finish then toggle changeWall state
        else if(!this.state.changeWall) {
            if(node.isWall) {
                const newGrid = modifyGrid(this.state.grid,row,col,"wall",false);
                this.setState({grid:newGrid});
            }
            else {
                const newGrid = modifyGrid(this.state.grid,row,col,"wall",true);
                this.setState({grid:newGrid, changeWall:true});
            }
        }

        // this.setState({grid: newGrid, mouseIsPressed: true});
        this.setState({mouseIsPressed:true});
    }

    handleMouseEnter(row,col) {

        // const newGrid = this.state.grid;
        // if enter w/ changeStart state, make current node startNode style (but don't set startNode yet)
        if(this.state.changeStart) {
            const newGrid = modifyGrid(this.state.grid,row,col,"start",true);
            this.setState({grid:newGrid});
        }

        // if enter w/ changeFinish state, make current node changeFinish style (but don't set finishNode yet)
        if(this.state.changeFinish) {
            const newGrid = modifyGrid(this.state.grid,row,col,"finish",true);
            this.setState({grid:newGrid});
        }

        // if enter and w/ changeWall state, set current node to be a wall
        else if(this.state.changeWall) {
            const newGrid = modifyGrid(this.state.grid,row,col,"wall",true);
            this.setState({grid:newGrid});
        }
        // this.setState({grid:newGrid});
    }

    handleMouseLeave(row,col) {
        // const newGrid = this.state.grid;
        if(this.state.changeStart) {
            const newGrid = modifyGrid(this.state.grid,row,col,"start",false);
            this.setState({grid:newGrid});
        }
        if(this.state.changeFinish) {
            const newGrid = modifyGrid(this.state.grid,row,col,"finish",false);
            this.setState({grid:newGrid});
        }
        // this.setState({grid:newGrid});
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
        let grid = this.state.grid;
        let startNode = this.state.startNode;
        let finishNode = this.state.finishNode;

        const visitedNodesInOrder = dijkstra(grid,startNode,finishNode);

        const newFinishNode = dijkstraReturnFinishNode(grid,startNode,finishNode);
        this.setState({finishNode:newFinishNode});

        // const nodesInShortestPathOrder = getNodesInShortestPathOrder(this.state.finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(newFinishNode);

        // ***** TESTING *****
        // console.log("running visualize dijkstra");
        // console.log(`startNode : ( ${startNode.row},${startNode.col} ) `)
        // console.log(`finishNode : ( ${finishNode.row},${finishNode.col} )`);
        // for(const node of nodesInShortestPathOrder){
        //     console.log(`shortest path: ${node.row} , ${node.col} , ${node.previousNode}`);
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
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
                if(node.row === INIT_START_ROW && node.col === INIT_START_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
                    node.isStart = true;
                    this.setState({startNode:node});
                }
                if(node.row === INIT_FINISH_ROW && node.col === INIT_FINISH_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
                    node.isFinish = true;
                    this.setState({finishNode:node});
                }
            }
        }

        this.setState({ grid: resetGrid, changeWall:false, changeStart:false, changeFinish:false });
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
                                        onMouseLeave={(row,col) =>
                                            this.handleMouseLeave(row,col)
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
        // isStart: row === INIT_START_ROW && col === INIT_START_COL,
        // isFinish: row === INIT_FINISH_ROW && col === INIT_FINISH_COL,
        isWall: false,
        distance: Infinity,
        isVisited: false,
        previousNode: null,
    };
};






// used to update grid with a new node
    // typeNode = start, wall, etc
    // active = true/false -> if true then SET to typeNode, if false then set to NOT typeNode
const modifyGrid = (grid,row,col,typeNode,active) => {
    let newGrid = grid.slice(); // return shallow copy of array
    const node = newGrid[row][col];

    if(typeNode === "wall") {
        // cant make start or finish node a wall
        if(node.isStart || node.isFinish) {
            return newGrid;
        }
        // // ... spread operator -> expands an array into a list  
        // const newNode = {
        //     ...node,
        //     isWall: active,
        // };
        const newNode = createNode(row,col);
        newNode.isWall = active;
        newGrid[row][col] = newNode;
        return newGrid;
    }

    if(typeNode === "start") {
        // cant make wall or finish start
        if(node.isWall || node.isFinish) {
            return newGrid;
        }
        const newNode = createNode(row,col);
        newNode.isStart = active;
        newGrid[row][col] = newNode;
        return newGrid;
    }

    if(typeNode === "finish") {
        // cant make wall or start finish
        if(node.isWall || node.isStart) {
            return newGrid;
        }
        const newNode = createNode(row,col);
        newNode.isFinish = active;
        newGrid[row][col] = newNode;
        return newGrid;
    }
}


// identify and return the start or finish node AT FIRST
const findStartOrFinishNode = (grid, startOrFinish) => {
    for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
            const node = grid[row][col];
            if(startOrFinish === "start")
            {
                if(row === INIT_START_ROW && col === INIT_START_COL) {
                    node.isStart = true;
                    return node;
                }
            } else {
                if(row === INIT_FINISH_ROW && col === INIT_FINISH_COL) {
                    node.isFinish = true;
                    return node;
                }
            }
        }
    }
}



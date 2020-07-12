import React, {Component} from 'react';
import GridSquare from './GridSquare/GridSquare';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
        };
    }

    componentDidMount() {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 30; col++) {
                currentRow.push([]);
            }
            grid.push(currentRow);
        }
        this.setState({grid})
    }

    render() {
        const {grid} = this.state;
        console.log(grid);

        return (
            <div>
                <div>
                    <p1>Pathfinding Visualizer</p1>
                </div>
                <div className="grid">
                    {grid.map((row, rowIndex) => {
                        return (
                            <div>
                                {row.map((gridSquare, gridSquareIndex) => <GridSquare></GridSquare>)}
                            </div>   
                        );
                    })}
                </div>
            </div>
        );
    }
}
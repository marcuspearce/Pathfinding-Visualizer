import React, {Component} from 'react';
import GridSquare from './GridSquare/GridSquare';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gridSquares: [],
        };
    }

    render() {
        return (
            <div>
                <p>Hello World</p>
                <GridSquare></GridSquare>
            </div>
        )
    }
}
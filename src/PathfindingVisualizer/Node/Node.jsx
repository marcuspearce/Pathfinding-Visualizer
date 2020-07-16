import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // define what a Node is
    render() {
        const {
            row,
            col,
            isStart, 
            isFinish,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseLeave,
            onMouseUp,
        } = this.props;
        // add extra class name depending on if isStart or isFinish property of Node
        const extraClassName = isStart
            ? 'node-start'
            : isFinish
            ? 'node-finish'
            : isWall
            ? 'node-wall'
            : '';
        return (
            <div 
                id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row,col)}
                onMouseEnter={() => onMouseEnter(row,col)}
                onMouseLeave={() => onMouseLeave(row,col)}
                onMouseUp={() => onMouseUp()}>
            </div>
        );
    }
}

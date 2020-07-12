import React, {Component} from 'react';

import './GridSquare.css';

export default class GridSquare extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="gridSquare"></div>
        );
    }
}
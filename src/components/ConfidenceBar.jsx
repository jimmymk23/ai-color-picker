import React, { Component } from 'react'
import Chart from "chart.js";

export default class ConfidenceBar extends Component {

    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.confidence = (props.confidence - 0.5) * 2;
        console.log({
            confidence: props.confidence,
            barValue: this.confidence
        })
    }

    componentDidMount() {
        this.myChartRef = this.chartRef.current.getContext("2d");

        new Chart(this.myChartRef, {
            type: "horizontalBar",
            data: {
                //Bring in data
                data: [this.confidence]
            },
            options: {
                color: context => {
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value < 0 ? 'red' :  // draw negative values in red
                        'blue';                 // else, draw negative values in blue\
                },
                scales: {
                    // xAxes: [-1, 1]
                }
            }
        });
    }

    componentDidUpdate(props) {
        this.confidence = (props.confidence - 0.5) * 2;
        console.log({
            confidence: props.confidence,
            barValue: this.confidence
        })
    }

    render() {
        return (
            <div className="confidence_bar">
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}
import React, { Component } from 'react'
import Chart from "chart.js";

export default class ConfidenceBar extends Component {

    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.confidence = props.confidence;
    }


    componentDidMount() {
        this.myChartRef = this.chartRef.current.getContext("2d");

        new Chart(this.myChartRef, {
            type: "horizontalBar",
            data: {
                //Bring in data
                // labels: [""],
                datasets: [
                    {
                        label: 'Black to White',
                        data: [this.confidence]
                    }
                ]
            },
            options: {
                backgroundColor: 'rbga(10, 75, 165, .9)',
            }
        });
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
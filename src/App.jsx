// Import Libraries
import React, { Component } from 'react'
// Import Stylesheets
import './sass/main.sass'
// Import Components
import DataPoint from './components/DataPoint.jsx';

export default class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			database: []
		}

		this.BgColor = {
			r: Math.random(),
			g: Math.random(),
			b: Math.random()
		}

		this.process = this.process.bind(this);
		this.refreshLocalDB = this.refreshLocalDB.bind(this);
		this.skip = this.skip.bind(this);
		this.reset = this.reset.bind(this);
	}

	componentDidMount() {
		// Load DOM Elements
		this.color_box = document.querySelector('#color');
		this.guess_color = document.querySelector('#guess-color');
		this.black_text = document.querySelector('#black');
		this.white_button = document.querySelector('#white_button');
		this.black_button = document.querySelector('#black_button');
		this.print_button = document.querySelector('#print_button');
		this.databaseGrid = document.querySelector('#color_data_grid');
		this.color_box.style.backgroundColor = `rgb(${this.BgColor.r * 255}, ${this.BgColor.g * 255}, ${this.BgColor.b * 255})`;

		// Send BG Color and get Text Color to Initialize
		// fetch(`${this.baseAPIurl}api-text-color-ai/initialize`, {
		fetch('/api-v1/initialize', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(this.BgColor)
		})
			.then(response => response.json())
			.then(res => {
				this.guess_color.style.color = res.text_color;
				this.setState({ database: res.dataDocs });
			})
	}

	process(e) {
		// If the user selects the black button, the correct color will be 0 for black
		// otherwise the correct color will be 1 for white
		this.chosenTextColor = (e.target.id) === 'black_button' ? 0 : 1

		// Set BG and Text to white while waiting for server
		this.color_box.style.backgroundColor = '#FFF';
		this.black_text.style.color = '#FFF';
		this.guess_color.style.color = '#FFF';
		this.submissionData = {
			BgColor: this.BgColor,
			chosenTextColor: this.chosenTextColor
		};

		fetch('/api-v1/process', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(this.submissionData)
		})
			.then(response => response.json())
			.then(res => {
				this.BgColor = res.BgColor;
				this.color_box.style.backgroundColor = `rgb(${this.BgColor.r * 255}, ${this.BgColor.g * 255}, ${this.BgColor.b * 255})`;
				this.black_text.style.color = '#000';
				this.guess_color.style.color = res.proposedTextColor === 0 ? '#000' : '#FFF';
				this.insertedId = res.insertedId;
			})
			.then(() => {
				// Add last selection to local DB Array in state
				this.oldDB = Array.from(this.state.database);
				this.updatedDB = this.oldDB.concat({
					input: this.submissionData.BgColor,
					output: [this.submissionData.chosenTextColor],
					_id: this.insertedId
				});
				this.setState({ database: this.updatedDB });
			})
	}

	skip() {
		this.BgColor = {
			r: Math.random(),
			g: Math.random(),
			b: Math.random()
		}
		this.color_box.style.backgroundColor = `rgb(${this.BgColor.r * 255}, ${this.BgColor.g * 255}, ${this.BgColor.b * 255})`;
	}

	refreshLocalDB() {
		this.setState({ database: [] });
		fetch('/api-v1/retreive-data')
			.then(response => response.json())
			.then(res => {
				this.setState({ database: res });
			})
	}

	reset() {
		if (window.confirm('Are you sure you want to reset the database? All Data will be lost.')) {
			fetch('/api-v1/reset-data');
			this.refreshLocalDB();
		}
	}

	render() {
    	return (
      		<div className="App">
				<div className="container">
					<h1>Color Prediction</h1>
					<div id="color_recognition_container">
						<div id="color_section">
							<div id="color">
								<p id="white">White Text</p>
								<p id="black">Black Text</p>
								<p id="guess-color">Guess Text</p>
							</div>
						</div>
						<div id="button_section">
							<div className="button_row">
								<button id="black_button" onClick={this.process} >Black</button>
								<button id="white_button" onClick={this.process} >White</button>
							</div>
							<div className="button_row">
								<button id="print_button" className="background_green" onClick={this.refreshLocalDB}>Refresh Data</button>
								{/* <button id="reset_button" className="background_red" onClick={this.reset}>Reset</button> */}
								<button id="skip_button" className="background_yellow" onClick={this.skip}>Skip</button>
							</div>

							<div id="color_data_grid">
								{Array.from(this.state.database).reverse().map((item) => {
									return <DataPoint
										key={item._id}
										bgColor={item.input}
										textColor={item.output[0]}
										id={item._id}
										refreshDBFunc={this.refreshLocalDB}
									/>
								})}
							</div>
						</div>
					</div>
				</div>
      		</div>
		)
	}
}

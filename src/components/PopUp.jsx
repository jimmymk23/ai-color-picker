import React, { Component } from 'react'

export default class PopUp extends Component {

    constructor(props) {
        super(props);
        this.BgColor = props.BgColor;
        this.textColor = props.textColor;
        this.initial = props.initial;
        this.id = props.id;

        this.switch = props.switchFunc;
        this.save = props.saveFunc;
        this.delete = props.deleteFunc;
    }

    componentDidMount() {
        this.color_elem = document.querySelector('.bgColor');
        this.color_elem.style.backgroundColor = this.BgColor;
        this.color_elem.textContent = this.initial;
    }

    componentDidUpdate() {
        this.color_elem.textContent = this.initial;
    }

    render() {
        return (
            <div id="edit_popup">
                <div className="solid_bg">

                    <div className="bgColor"></div>
                    <div className="edit-options">
                        <button onClick={this.switch}>Switch</button>
                        <button className="background_red" onClick={this.delete}>Delete</button>
                    </div>
                    <button className="background_green" onClick={this.save}>Done</button>
                </div>
            </div>
        )
    }
}

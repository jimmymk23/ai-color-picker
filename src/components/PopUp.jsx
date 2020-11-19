import React, { Component } from 'react'

export default class PopUp extends Component {

    constructor(props) {
        super(props);
        this.BgColor = props.BgColor;
        this.textColor = props.textColor;
        this.id = props.id;
        this.closeEdit = props.closeEditFunc;

        this.state = {
            initial: props.initial
        }

        this.switch = this.switch.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.color_elem = document.querySelector('.bgColor');
        this.color_elem.style.backgroundColor = this.BgColor;
    }

    switch() {
        // Change Color
        if (this.textColor === '#000') {
            this.textColor = '#FFF';
        } else {
            this.textColor = '#000';
        }
        this.color_elem.style.color = this.textColor;

        // Change Letter
        if (this.state.initial === 'B') {
            this.setState({ initial: 'W' });
        } else {
            this.setState({ initial: 'B' });
        }
    }

    delete() { }

    render() {
        return (
            <div id="edit_popup">
                <div className="solid_bg">

                    <div className="bgColor">{this.state.initial}</div>
                    <div className="edit-options">
                        <button onClick={this.switch}>Switch</button>
                        <button className="background_red" onClick={this.delete}>Delete</button>
                    </div>
                    <button className="background_green" onClick={this.closeEdit}>Done</button>
                </div>
            </div>
        )
    }
}

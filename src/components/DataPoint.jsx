import React, { Component } from 'react'
import PopUp from './PopUp.jsx';

export default class DataPoint extends Component {

    constructor(props) {
        super(props)
        this.BgColor = `rgb(${props.bgColor.r * 255}, ${props.bgColor.g * 255}, ${props.bgColor.b * 255})`;
        this.textColor = props.textColor === 0 ? '#000' : '#FFF';
        this.id = props.id;
        this.initial = props.textColor === 0 ? 'B' : 'W';
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.state = {
            edit: false
        }
    }

    componentDidMount() {
        this.element = document.querySelector(`#data-point-${this.id}`);
        this.element.style.backgroundColor = this.BgColor;
        this.element.style.color = this.textColor;
    }

    openEdit() {
        if (!this.state.edit) {
            this.setState({ edit: true });
        }
    }

    closeEdit() {
        if (this.state.edit) {
            this.setState({ edit: false });
        }
    }

    render() {
        return (
            <div className='color_data_item' id={`data-point-${this.id}`} onClick={this.openEdit}>
                {this.initial}
                {this.state.edit && <PopUp BgColor={this.BgColor} textColor={this.textColor} id={this.id} initial={this.initial} closeEditFunc={this.closeEdit} />}
            </div>
        )
    }
}

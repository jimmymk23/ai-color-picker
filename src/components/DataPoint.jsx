import React, { Component } from 'react'
import PopUp from './PopUp.jsx';

export default class DataPoint extends Component {

    constructor(props) {
        super(props);

        this.BgColor = `rgb(${props.bgColor.r * 255}, ${props.bgColor.g * 255}, ${props.bgColor.b * 255})`;
        this.textColor = props.textColor === 0 ? '#000' : '#FFF';
        this.id = props.id;
        this.initial = props.textColor === 0 ? 'B' : 'W';
        this.refreshLocalDB = props.refreshDBFunc;

        this.state = {
            edit: false,
            // initial: this.initial
        }

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.switch = this.switch.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.element = document.querySelector(`#data-point-${this.id}`);
        this.element.style.backgroundColor = this.BgColor;
        this.element.style.color = this.textColor;
        //Set Initial
        // this.element.textContent = this.initial;
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

    switch() {
        // Change Color
        if (this.textColor === '#000') {
            this.textColor = '#FFF';
        } else {
            this.textColor = '#000';
        }
        this.element.style.color = this.textColor;

        // Change Letter
        if (this.initial === 'B') {
            this.initial = 'W';
        } else {
            this.initial = 'B';
        }
        // this.element.textContent = this.initial;
    }

    delete() {
        if (window.confirm('Are you sure you want to remove this color?')) {
            fetch('/api-v1/delete', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ id: this.id })
            });
            this.closeEdit();
            this.refreshLocalDB();
        }
    }

    save() {
        if (this.textColor === '#000') {
            this.colorCode = 0;
        } else {
            this.colorCode = 1;
        }
        const data = {
            id: this.id,
            colorCode: this.colorCode
        }

        fetch('api-v1/save-edited-color', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        this.closeEdit();
    }

    render() {
        return (
            <div className='color_data_item' id={`data-point-${this.id}`} onClick={this.openEdit}>
                {this.initial}
                {this.state.edit && <PopUp
                    BgColor={this.BgColor}
                    textColor={this.textColor}
                    id={this.id}
                    initial={this.initial}
                    switchFunc={this.switch}
                    saveFunc={this.save}
                    deleteFunc={this.delete}
                />}
            </div>
        )
    }
}

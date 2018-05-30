import React from "react";
import Display from "./Display";
import ButtonPanel from "./ButtonPanel";
import calculate from "../logic/calculate";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: null,        // result number
            next: null,         // next operation
            operation: null     // +/-,*,%,etc
        };
    }

    handleClick = buttonName => {
        this.setState(calculate(this.state, buttonName));
    };

    render(){
        return (
            <div className="com-app">
                <Display value={this.state.next || this.state.total || "0"} />
                <ButtonPanel clickHandler={this.handleClick} />
            </div>
        );
    };
}

export default App;
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>

        <QueensForm />
      </div>
    );
  }
}

var QueensForm = React.createClass({
    getInitialState: function() {
        return {
            result: [],
            input: 1
        };
    },

    handleUserInput: function(number) {
        this.setState({
            input: number
        });
    },

    onSubmit: function(e) {
        e.preventDefault();
        var http = new XMLHttpRequest();

        http.onreadystatechange = function() {
            if (http.readyState === XMLHttpRequest.DONE) {
                if (http.responseText !== "{}") {
                    var split = http.responseText.split("{");
                    split.splice(0,1);
                    for (var i = 0; i < split.length; i++) {
                        split[i] = "{" + split[i];
                        split[i] = JSON.parse(split[i]);
                    }

                    this.setState({
                        result: split
                    });
                }
            }
            // TODO: Change this, as it makes the UI redraw itself.
            else {
                this.setState({
                    result: []
                });
            }
        }.bind(this);

        http.open( "GET", "http://localhost:5000/model/queens.json?n=" + this.state.input, true);
        http.send(null);

    },

    render: function() {
        var rows = [];
        var grids = [];
        // TODO: split into it's own object and assign keys.
        this.state.result.forEach(function(row) {
            rows.push(<p>{row.q.join(' ')}</p>);
            grids.push(<Grid1D result={row.q}></Grid1D>);
        });

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <NumberInput min="1" max="10" onUserInput={this.handleUserInput} input={this.state.input} />
    				<button className="pure-button" onClick={this.onSubmit}>Submit</button>
    			</form>
                {grids}
                {rows}
            </div>
        )
    }
});

var NumberInput = React.createClass({
    getInitialState: function() {
        return {
            number: this.props.min
        };
    },

    onChange: function() {
        this.props.onUserInput(this.refs.numberInput.value);
    },

    render: function() {
        return (
            <div>
                <input ref="numberInput" onChange={this.onChange} value={this.props.input} type="range" min={this.props.min} max={this.props.max}></input>
                <p>{this.props.input}</p>
            </div>
        );
    }
});

var Grid1D = React.createClass({
    render: function() {
        var items = [];
        for (var i = 0; i < this.props.result.length; i++) {
                items.push(<Grid1DRow key={i} result={this.props.result[i]} size={this.props.result.length} />);
        }

        return <div className="Grid1D">{items}</div>;
    }
});

var Grid1DRow = React.createClass({
    render: function() {
        var squares = [];
        for (var i = 1; i <= this.props.size; i++) {
            if (this.props.result === i) {
                squares.push(<div key={i} className="WhiteSquare"></div>);
            }
            else {
                squares.push(<div key={i} className="BlackSquare"></div>);
            }
        }

        return <div>{squares}</div>;
    }
});

export default App;

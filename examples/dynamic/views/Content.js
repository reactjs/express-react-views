var React = require('react');

var TodoList = React.createClass({
  render: function() {
    var i = 0;
    var createItem = function(itemText) {
      return <li key={i++}>{itemText}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});

var TodoApp = React.createClass({
  getInitialState: function() {
    return this.props;
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
  },
  render: function() {
    return (
      <div className="container">
        <h3>TODO List</h3>
        <TodoList items={this.state.items} />
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Write task" onChange={this.onChange} value={this.state.text} />
            &nbsp;
          </div>
          <button className="btn btn-primary">{'Add #' + (this.state.items.length + 1)}</button>
        </form>
      </div>
    );
  }
});

module.exports = TodoApp;

var React = require('react');

class TodoList extends React.Component {
  render() {
    var i = 0;
    var createItem = function(itemText) {
      return <li key={i++}>{itemText}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = props;
  }
  onChange(e) {
    this.setState({text: e.target.value});
  }
  handleSubmit(e) {
    e.preventDefault();
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
  }
  render() {
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
}

module.exports = TodoApp;

import { render, Component } from 'inferno';

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }
  render() {
    return (
      <div>
        <h1>Header!</h1>
      </div>
    );
  }
}

render(
  <MyComponent />,
  document.getElementById("app")
);

import React from "react";
import "./App.css";

import { combineReducers, createStore } from "redux";
import { Provider, connect } from "react-redux";

const Actions = {
  ADD: "add",
  DELETE: "delete",
  INCREASE: "increase",
  DECREASE: "decrease",
};

const ADD = {
  type: Actions.ADD,
  count: {
    text: "To do something",
    NumCount: 0,
    isDone: false,
  },
};

const DELETE = {
  type: Actions.DELETE,
  countId: 101,
};

const initialState = [];

function reducer(state = initialState, action) {
  switch (action.type) {
    case Actions.ADD: {
      const taskToAdd = {
        ...action.payload.text,
        id: Math.floor(Math.random() * 1000),
        NumCount: 0,
        isDone: false,
      };
      return [...state, taskToAdd];
    }
    case Actions.DELETE: {
      return state.filter((count) => count.id !== action.payload.countId);
    }
    case "increase": {
      const index = state.findIndex(
        (count) => count.id === action.payload.countId
      );

      return [
        ...state.slice(0, index),
        { ...state[index], NumCount: state[index].NumCount + 1 },
        ...state.slice(index + 1),
      ];
    }
    case "decrease": {
      const index = state.findIndex(
        (count) => count.id === action.payload.countId
      );

      return [
        ...state.slice(0, index),
        { ...state[index], NumCount: state[index].NumCount - 1 },
        ...state.slice(index + 1),
      ];
    }
    default:
      return state;
  }
}

class Counter extends React.Component {
  state = {
    text: "",
  };

  buttonDecrease = () => {};

  render() {
    return (
      <>
        <input
          type="text"
          onChange={(e) => this.setState({ text: e.target.value })}
          value={this.state.text}
        />
        <button
          onClick={() => {
            this.props.onAdd({ text: this.state.text });
            this.setState({ text: "" });
          }}
        >
          ADD
        </button>
        <div>
          {this.props.counts.map((count) => (
            <div key={count.id}>
              {count.text} <br />
              <button onClick={() => this.props.onDecrease(count.id)}>-</button>
              {count.NumCount}
              <button onClick={() => this.props.onIncrease(count.id)}>+</button>
              <button onClick={() => this.props.onDelete(count.id)}>X</button>
            </div>
          ))}
        </div>
      </>
    );
  }
}

const ConnectedCounter = connect(
  (state) => ({
    counts: state,
  }),
  (dispatch) => ({
    onAdd: (text) => dispatch({ type: Actions.ADD, payload: { text } }),
    onDelete: (countId) =>
      dispatch({ type: Actions.DELETE, payload: { countId } }),
    onIncrease: (countId) =>
      dispatch({ type: Actions.INCREASE, payload: { countId } }),
    onDecrease: (countId) =>
      dispatch({ type: Actions.DECREASE, payload: { countId } }),
  })
)(Counter);

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function App() {
  return (
    <div>
      <Provider store={store}>
        <ConnectedCounter />
      </Provider>
    </div>
  );
}

export default App;

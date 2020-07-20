import React from "react";
import "./App.css";

import { combineReducers, createStore } from "redux";
import { Provider, connect } from "react-redux";

const Actions = {
  ADD: "add",
  LOADED: "loaded",
  DELETE: "delete",
  INCREASE: "increase",
  DECREASE: "decrease",
};

const ADD = {
  type: Actions.ADD,
  count: {
    text: "To do something",
    NumCount: 0,
  },
};

const DELETE = {
  type: Actions.DELETE,
  countId: 101,
};

const initialState = [];

function reducerCounters(state = initialState, action) {
  switch (action.type) {
    case Actions.LOADED: {
      return action.payload.counters;
    }
    case Actions.ADD: {
      const taskToAdd = {
        ...action.payload.text,
        NumCount: 0,
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

const LoadingActions = {
  CHANGE_LOADING: "Loading/CHANGE_ACTIONS",
};

function loadingReducer(state = false, action) {
  if (action.type === LoadingActions.CHANGE_LOADING) {
    return action.payload.isLoading;
  }

  return state;
}

const reducer = combineReducers({
  counters: reducerCounters,
  isLoading: loadingReducer,
});

class Counter extends React.Component {
  state = {
    text: "",
  };

  async componentDidMount() {
    this.props.changeLoading(true);

    const response = await fetch("/counters");
    const counters = await response.json();

    this.props.onLoaded(counters);

    this.props.changeLoading(false);
  }

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
          onClick={async () => {
            this.props.changeLoading(true);
            const response = await fetch("/counters", {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({ text: this.state.text, NumCount: 0 }),
            });
            const counterText = await response.json();

            this.props.onAdd(counterText);
            this.setState({ text: "" });
            this.props.changeLoading(false);
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
              <button
                onClick={async () => {
                  this.props.changeLoading(true);
                  await fetch(`/counters/${count.id}`, {
                    method: "DELETE",
                  });
                  this.props.onDelete(count.id);
                  this.props.changeLoading(false);
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </>
    );
  }
}

const ConnectedCounter = connect(
  (state) => ({
    counts: state.counters,
  }),
  (dispatch) => ({
    onAdd: (text) => dispatch({ type: Actions.ADD, payload: { text } }),
    onDelete: (countId) =>
      dispatch({ type: Actions.DELETE, payload: { countId } }),
    onIncrease: (countId) =>
      dispatch({ type: Actions.INCREASE, payload: { countId } }),
    onDecrease: (countId) =>
      dispatch({ type: Actions.DECREASE, payload: { countId } }),
    onLoaded: (counters) =>
      dispatch({ type: Actions.LOADED, payload: { counters } }),
    changeLoading: (isLoading) =>
      dispatch({ type: LoadingActions.CHANGE_LOADING, payload: { isLoading } }),
  })
)(Counter);

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const Loader = ({ children, isLoading }) => (
  <div className={isLoading ? "loading" : null}>{children}</div>
);

const ConnectedLoader = connect((state) => ({ isLoading: state.isLoading }))(
  Loader
);

function App() {
  return (
    <div>
      <Provider store={store}>
        <ConnectedLoader>
          <ConnectedCounter />
        </ConnectedLoader>
      </Provider>
    </div>
  );
}

export default App;

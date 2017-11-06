// @flow
import React, { Component } from "react";
import "./Todo.css";

type Props = {};

type State = {
  todosList: Array<{
    label: string,
    complete: boolean
  }>,
  hide: Array<number>,
  filter: string,
  value: string
};

class Todolist extends React.Component<Props, State> {
  handleChange: Function;
  handleSubmit: Function;

  constructor(props: Props) {
    super(props);
    this.state = { todosList: [], hide: [], filter: "all", value: "" };
    fetch("data/api.json")
      .then(response => response.json())
      .then(myJson => {
        let todos = myJson.todos;
        this.setState({ todosList: todos });
      });
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onLiClick(index: number) {
    let copy = this.state.todosList;
    let copyHide = this.state.hide;
    copy[index].complete = this.state.todosList[index].complete ? false : true;

    switch (this.state.filter) {
      case "all":
        break;
      case "complete":
        if (!copy[index].complete) {
          copyHide.push(index);
        }
        break;
      case "todo":
        if (copy[index].complete) {
          copyHide.push(index);
        }
        break;
    }
    this.setState({ todosList: copy, hide: copyHide });
  }

  onButtonClick(value: string) {
    let copyHide = [];
    if (value != "all") {
      this.state.todosList.map((item, index) => {
        let isComplete = value == "complete" ? true : false;
        if (isComplete != item.complete) {
          copyHide.push(index);
        }
      });
    }
    this.setState({ hide: copyHide, filter: value });
  }

  handleChange(event: SyntheticInputEvent<HTMLButtonElement>) {
    this.setState({ value: event.currentTarget.value });
  }

  handleSubmit(event: SyntheticInputEvent<HTMLButtonElement>) {
    let copy = this.state.todosList;
    let newTodo = {
      label: this.state.value,
      complete: false
    };
    copy.push(newTodo);
    this.setState({ todosList: copy, value: "" });
    event.preventDefault();
  }

  render() {
    const isEmpty = !!this.state.todosList && this.state.todosList.length === 0;

    return (
      <div>
        <h1>TodoList</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Todo:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <ul>
          {isEmpty && (
            <li>
              <span>No element! Try creating one!</span>
            </li>
          )}
          {!!this.state.todosList &&
            this.state.todosList.map((item, index) => {
              let classes = item.complete ? "complete" : "";
              this.state.hide.includes(index)
                ? (classes = classes + " hide")
                : (classes = classes);
              return (
                <li
                  className={classes}
                  onClick={() => this.onLiClick(index)}
                  key={index}
                >
                  {item.label}
                </li>
              );
            })}
        </ul>
        <button onClick={() => this.onButtonClick("all")}>Tous</button>
        <button onClick={() => this.onButtonClick("complete")}>Terminé</button>
        <button onClick={() => this.onButtonClick("todo")}>A faire</button>
      </div>
    );
  }
}

export default Todolist;

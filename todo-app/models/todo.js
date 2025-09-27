let todos = [];
let nextId = 1;

class Todo {
  constructor(title) {
    this.id = nextId++;
    this.title = title;
    this.completed = false;
  }
}

module.exports = {
  todos,
  Todo,
};

function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      if (key === 'checked' || key === 'value') {
        element[key] = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  if (callbacks) {
    Object.keys(callbacks).forEach((eventName) => {
      element.addEventListener(eventName, callbacks[eventName]);
    });
  }

  return element;
}

class Component {
  constructor() {
    this._domNode = null;
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newDom = this.render();
    this._domNode.replaceWith(newDom);
    this._domNode = newDom;
  }
}

 class Task extends Component {
  constructor({ text, done, idx, onToggle, onDelete }) {
    super();
    this.text = text;
    this.done = done;
    this.idx = idx;
    this.onToggle = onToggle;
    this.onDelete = onDelete;
    this.confirmDelete = false;
  }

  render() {
    const checkbox = createElement(
        'input',
        { type: 'checkbox', checked: this.done },
        null,
        { change: e => this.onToggle(this.idx, e) }
    );
    const label = createElement(
        'label',
        { style: `color: ${this.done ? 'grey' : 'black'}` },
        this.text
    );
    
    const btnAttrs = {};
    if (this.confirmDelete) {
      btnAttrs.style = 'background-color: red;'; 
    }

    const deleteBtn = createElement(
        'button',
        btnAttrs,
        '🗑️',
        { click: this._onDeleteClick.bind(this) }
    );

    return createElement('li', {}, [ checkbox, label, deleteBtn ]);
  }

  _onDeleteClick() {
    if (!this.confirmDelete) {
      this.confirmDelete = true;
      this.update();
    } else {
      this.onDelete(this.idx);
    }
  }
}


class AddTask extends Component {
  constructor(onAddTask, onInputChange, value) {
    super();
    this.onAddTask = onAddTask;
    this.onInputChange = onInputChange;
    this.value = value;
  }
  render() {
    return createElement(
        'div',
        { class: 'add-todo' },
        [
          createElement(
              'input',
              {
                id: 'new-todo',
                type: 'text',
                placeholder: 'Задание',
                value: this.value
              },
              null,
              { input: this.onInputChange }
          ),
          createElement(
              'button',
              { id: 'add-btn' },
              '+',
              { click: this.onAddTask }
          )
        ]
    );
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      todos: [
        { text: 'Сделать домашку', done: false },
        { text: 'Сделать практику', done: false },
        { text: 'Пойти домой',    done: false },
      ],
      newTodo: '',
    };
  }

  render() {
    const addTaskNode = new AddTask(
        this.onAddTask.bind(this),
        this.onAddInputChange.bind(this),
        this.state.newTodo
    ).getDomNode();
    
    const tasksNodes = this.state.todos.map((todo, idx) =>
        new Task({
          text: todo.text,
          done: todo.done,
          idx,
          onToggle: this.onToggleTask.bind(this),
          onDelete: this.deleteTask.bind(this)
        }).getDomNode()
    );
    const listNode = createElement('ul', { id: 'todos' }, tasksNodes);
    
    return createElement('div', { class: 'todo-list' }, [
      createElement('h1', {}, 'TODO List'),
      addTaskNode,
      listNode
    ]);
  }

  onAddInputChange(event) {
    this.state.newTodo = event.target.value;
  }

  onAddTask(event) {
    event.preventDefault();
    const text = this.state.newTodo.trim();
    if (!text) return;
    this.state.todos.push({ text, done: false });
    this.state.newTodo = '';
    this.update();
  }

  onToggleTask(idx, event) {
    this.state.todos[idx].done = event.target.checked;
    this.update();
  }

  deleteTask(idx) {
    this.state.todos.splice(idx, 1);
    this.update();
  }

  handleDeleteClick() {
    if (!this.confirmDelete) {
      this.confirmDelete = true;
      this.update();
    } else {
      this.deleteTask(this.idx);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(new TodoList().getDomNode());
});



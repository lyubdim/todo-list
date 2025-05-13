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
    this.inputElement = createElement(
      'input',
      {
        id: 'new-todo',
        type: 'text',
        placeholder: 'Задание',
        value: this.state.newTodo
      },
      null,
      { input: this.onAddInputChange.bind(this) }
    );
    this.addBtn = createElement(
      'button',
      { id: 'add-btn' },
      '+',
      { click: this.onAddTask.bind(this) }
    );

    this.listElement = createElement(
      'ul',
      { id: 'todos' },
      this.state.todos.map((todo, idx) =>
        createElement('li', {}, [
          createElement('input',
            { type: 'checkbox', checked: todo.done },
            null,
            { change: this.onToggleTask.bind(this, idx) }
          ),
          createElement('label',
            { style: `color: ${todo.done ? 'grey' : 'black'}` },
            todo.text
          ),
          createElement('button', {}, '🗑️', {
            click: this.deleteTask.bind(this, idx)
          })
        ])
      )
    );

    return createElement('div', { class: 'todo-list' }, [
      createElement('h1', {}, 'TODO List'),
      createElement('div', { class: 'add-todo' }, [
        this.inputElement,
        this.addBtn
      ]),
      this.listElement
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
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(new TodoList().getDomNode());
});

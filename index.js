function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
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
  constructor() {}

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      todos: ['Сделать домашку', 'Сделать практику', 'Пойти домой'],
      newTodo: '',
    };
  }

  render() {
    return createElement('div', { class: 'todo-list' }, [
      createElement('h1', {}, 'TODO List'),
      createElement('div', { class: 'add-todo' }, [
        createElement('input', {
          id: 'new-todo',
          type: 'text',
          placeholder: 'Задание'
        },null, 
      { input: this.onAddInputChange.bind(this) }),


        createElement('button', { id: 'add-btn' }, '+', { click: this.onAddTask.bind(this) })
      ]),
      createElement('ul', { id: 'todos' },
          this.state.todos.map(todo =>
              createElement('li', {}, [
                createElement('input', { type: 'checkbox' }),
                createElement('label', {}, todo),
                createElement('button', {}, '🗑️')
              ])
          )
      )
    ]);
  }
  onAddTask(event) {
    const text = this.state.newTodo.trim();
    this.state.todos.push(text);
    this.state.newTodo = '';

    this.inputElement.value = '';

    this.listElement.innerHTML = '';
    this.state.todos.forEach(todoText => {
      this.listElement.appendChild(this.createTodoItem(todoText));
    });
  }

  onAddInputChange(event) {
    this.state.newTodo = event.target.value;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(new TodoList().getDomNode());
});

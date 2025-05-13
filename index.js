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
      todos: ['Сделать домашку', 'Сделать практику', 'Пойти домой'],
      newTodo: '',
    };
  }

  render() {
    const root = createElement('div', { class: 'todo-list' }, [
      createElement('h1', {}, 'TODO List'),
      createElement('div', { class: 'add-todo' }, [
        createElement(
            'input',
            {
              id: 'new-todo',
              type: 'text',
              placeholder: 'Задание',
              value: this.state.newTodo
            },
            null,
            { input: this.onAddInputChange.bind(this) }
        ),
        createElement('button', { id: 'add-btn' }, '+', {
          click: this.onAddTask.bind(this)
        })
      ]),
      createElement(
          'ul',
          { id: 'todos' },
          this.state.todos.map(todo =>
              createElement('li', {}, [
                createElement('input', { type: 'checkbox' }),
                createElement('label', {}, todo),
                createElement('button', {}, '🗑️')
              ])
          )
      )
    ]);

    return root;
  }

  onAddInputChange(event) {
    this.state.newTodo = event.target.value;
  }

  onAddTask() {
    const text = this.state.newTodo.trim();
    if (!text) return;                
    this.state.todos.push(text);      
    this.state.newTodo = '';           
    this.update();                    
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(new TodoList().getDomNode());
});

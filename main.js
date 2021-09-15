
let todoList = document.querySelector('.todo__list');
let form = document.querySelector('.form');
let formInput = document.querySelector('.form__input');
let list = document.querySelector('.todo__list');
window.onload = render(getTodos, list);


async function getTodos() {
    let todosResponse = await fetch('http://localhost:3000/todos');
    let todosArr = await todosResponse.json();
    return todosArr;
};
async function render(getRequest, inElem) {
    let arrTodos = await getRequest();
    inElem.innerHTML = arrTodos.map(item => {
        if (item.completed === false) {
            return `<li class="todo__list-item" data-id="${item.id}" data-status="${item.completed}">${item.title}<div class="cancel"></div></li>`
        } else {
            return `<li class="todo__list-item active" data-id="${item.id}" data-status="${item.completed}">${item.title}<div class="cancel"></div></li>`
        }
    }).join('');
}
function valueInObj(elem) {
    return {
        'title': elem.value,
        'completed': false
    }
};

function todoChanging(elemStatus, elemText) {
    if (elemStatus === 'true') {
        return {
            'title': elemText,
            'completed': false
        }
    } else if (elemStatus === 'false') {
        return {
            'title': elemText,
            'completed': true
        }
    };
}

async function createTodo(value, inElem) {
    let todoResponse = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(valueInObj(value))
    });
    let getTodo = await todoResponse.json();
    let li = `<li class="todo__list-item active" data-id="${getTodo.id}" data-status="${getTodo.completed}">${getTodo.title}<div class="cancel"></div></li>`;
    inElem.innerHTML += li;
};

async function changeStatus(id, status, text) {
    let request = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(todoChanging(status, text))
    });
};

async function deleteItem(id) {
    let request = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE'
    });
};

form.addEventListener('submit', event => {
    event.preventDefault();
    createTodo(formInput, todoList);
    form.reset();
});

list.addEventListener('click', event => {
    if (event.target.tagName === 'DIV') {
        let itemId = +event.target.closest('.todo__list-item').getAttribute('data-id');
        event.target.closest('.todo__list-item').remove();
        deleteItem(itemId);
    } else {
        event.target.classList.toggle('active');
        changeStatus(+event.target.getAttribute('data-id'), event.target.getAttribute('data-status'), event.target.textContent);
        if (event.target.getAttribute('data-status') === 'true') {
            event.target.setAttribute('data-status', false)
        } else {
            event.target.setAttribute('data-status', true)
        }
    }
});


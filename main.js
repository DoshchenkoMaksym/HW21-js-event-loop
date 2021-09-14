
let todoList = document.querySelector('.todo__list');
let form = document.querySelector('.form');
let formInput = document.querySelector('.form__input');
let list = document.querySelector('.todo__list');
window.onload = getTodos(todoList);


async function getTodos(inElem) {
    let todosResponse = await fetch('http://localhost:3000/todos');
    let todosArr = await todosResponse.json();
    inElem.innerHTML = todosArr.map(item => {
        if (item.completed === false) {
            return `<li class="todo__list-item" data-id="${item.id}" data-status="${item.completed}">${item.title}<div class="cancel"></div></li>`
        } else {
            return `<li class="todo__list-item active" data-id="${item.id}" data-status="${item.completed}">${item.title}<div class="cancel"></div></li>`
        }
    }).join('');
};

function valueInObj(elem) {
    return {
        'title': elem.value,
        'completed': false
    }
};

function getStatus(elemStatus, elemText) {
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

async function setTodo(value, inElem) {
    let todoResponse = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(valueInObj(value))
    });
    let getTodo = await todoResponse.json();
    let li = document.createElement('li');
    li.classList.add('todo__list-item');
    li.setAttribute('data-id', `${getTodo.id}`);
    li.setAttribute('data-status', `${getTodo.completed}`);
    li.innerHTML = `${getTodo.title}<div class="cancel"></div>`;
    inElem.append(li);
};

async function changeStatus(id, status, text) {
    let request = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(getStatus(status, text))
    });
};

async function deleteItem(id) {
    let request = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE'
    });
};

form.addEventListener('submit', event => {
    event.preventDefault();
    setTodo(formInput, todoList);
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


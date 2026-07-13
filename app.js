const formEl = document.querySelector(".create-form");
const todoWrapEl = document.querySelector('.todo-list')
let editId = null;
let baseUrl = "https://biyovo1194.pythonanywhere.com/api/v1";
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  let formData = new FormData(formEl);

  let newTodo = {
    title: formData.get("title"),
    description: formData.get("description"),
    completed: false,
  };
  if (editId === null) {
    postTodo(newTodo);
} else {
    updateTodo(editId, newTodo);
}
});

async function postTodo(newTodo) {
  try {
    let res = await fetch(baseUrl + `/tasks/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    if (!res.ok) {
      throw new Error("yaratishda muammo");
    }
    let data = await res.json();
    console.log(data);
    getTodo()
    formEl.reset()
  } catch (error) {
    console.log(error);
  }
}

window.editTodo = function (id) {
    let todo = document.querySelector(`[data-id="${id}"]`);

    editId = id;

    document.querySelector('[name="title"]').value =
        todo.querySelector(".todo-title").textContent;

    document.querySelector('[name="description"]').value =
        todo.querySelector(".todo-desc").textContent;
}


window.deleteTodo= async function (id) {
    try {
    let res =await fetch(baseUrl+`/tasks/${id}/`, {
        method:"DELETE",
    });
    if (res.status==200|| res.status==204) {
        console.log('ochirildi');
    }
    } catch (error) {
        console.log(error);
    }
    getTodo()
}

function UpdateUi(arr) {
    todoWrapEl.innerHTML = "";
    arr.forEach(item=> {
        
        todoWrapEl.innerHTML+=`
<li class="todo-item" data-id="${item.id}" data-completed="${item.completed}">
  <button
    class="check"
    type="button"
    aria-label="Mark as completed"
    data-action="toggle"
    onclick="toggleTodo(${item.id}, ${item.completed})"
  >
    <span class="check-icon" aria-hidden="true"></span>
  </button>

  <div class="todo-content">
    <div class="todo-top">
      <h3 class="todo-title">${item.title}</h3>
      <span class="badge ${item.completed ? "badge-completed" : "badge-active"}">
        ${item.completed ? "Completed" : "Active"}
      </span>
    </div>

    <p class="todo-desc">${item.description}</p>

    <div class="meta">
      <span class="meta-item">
        <span class="meta-label">ID:</span>
        <span class="meta-value">${item.id}</span>
      </span>

      <span class="meta-item">
        <span class="meta-label">Created:</span>
        <span class="meta-value">${item.created_at}</span>
      </span>
    </div>
  </div>

  <div class="todo-actions">
    <button
      class="icon-btn"
      type="button"
      title="Edit"
      data-action="edit"
      onclick="editTodo(${item.id})"
    >
      ✎
    </button>

    <button
      class="icon-btn danger"
      type="button"
      title="Delete"
      data-action="delete"
      onclick="deleteTodo(${item.id})"
    >
      🗑
    </button>
  </div>
</li>
`
    });
}

async function getTodo() {
    try {
        let res = await fetch(baseUrl+`/tasks/`)
        if (!res.ok) {
            throw new Error("olib kelishda muammo");
        }
        let data = await res.json()
        UpdateUi(data.data.results)
    } catch (error) {
        console.log(error);
        
    }
}

getTodo()

   async function updateTodo(id, updatedTodo) {
  try {
    let res = await fetch(baseUrl + `/tasks/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });

    if (!res.ok) {
      throw new Error("Tahrirlashda muammo");
    }

    let data = await res.json();
    console.log(data);

    editId = null;
    formEl.reset();
    getTodo();
  } catch (error) {
    console.log(error);
  }
}

window.toggleTodo = async function (id, completed) {
  let updatedTodo = {
    completed: !completed,
  };

  try {
    let res = await fetch(baseUrl + `/tasks/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });

    if (!res.ok) {
      throw new Error("Statusni o'zgartirishda muammo");
    }

    let data = await res.json();
    console.log(data);

    getTodo();
  } catch (error) {
    console.log(error);
  }
};
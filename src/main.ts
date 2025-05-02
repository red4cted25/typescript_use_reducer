interface Task{
  id:number,
  text:string,
  completed:boolean,
}

class TodoList {
  private Tasks: Task[]=[]

  //This method takes a parameter of the typeTask and adds it to the Tasks array in the class
  //The Tasks array is declared as a private property of the class, which means it can only be accessed from within the class
  addTask(todo:Task){
    this.Tasks.push(todo)
  }

  //This method takes a parameter of a type number, which represents the id of the task to be removed
  removeTaskById(id:number){
    this.Tasks = this.Tasks.filter((todo)=> todo.id !== id)
  }

  //This method returns the Tasks Array
  getTask(){
    return this.Tasks
  }
}

class TodoListUI{
  private todoList: TodoList;

  constructor(todoList:TodoList){
    this.todoList = todoList
  }

  //Updates the user interface to display the list of tasks in the todo list object
  displayTasks(){
    const todoListElement = document.getElementById("todo-list")!
    todoListElement.innerHTML = ""

    this.todoList.getTask().forEach((todo)=> {
      const todoElement = document.createElement("li")
      todoElement.innerHTML = `
        <input type="checkbox" data-id="${todo.id}" ${todo.completed ? "checked" : ""}/>
        <span>${todo.text}</span>
        <button class="remove-todo" data-id="${todo.id}">Remove</button>
      `;
      todoListElement.appendChild(todoElement);
    });

    // Add event listeners to the checkboxes to handle completion status
    const checkboxes = todoListElement.querySelectorAll("input[type='checkbox']")
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const input = event.target as HTMLInputElement;
        const id = parseInt(input.getAttribute("data-id")!);
        this.todoList.getTask().forEach((task) => {
          if (task.id === id) {
            task.completed = input.checked;
          }
        });
      });
    });
  }

  //this method add a new task to the todolist object and updates the user interface to displey the new task
  addTodo(){
    const newTodoInput = document.getElementById("new-todo") as HTMLInputElement
    const newTodoText = newTodoInput.value.trim()

    if(newTodoText){
      const newTodo: Task = {
        id:Date.now(),
        text:newTodoText,
        completed:false,
      }

      this.todoList.addTask(newTodo)
      this.displayTasks()
      newTodoInput.value = ""
    }
  }

  //this method removes a task with a specific id from the todolist object and updates the user interface to reflect the change
  removeTodoById(id:number){
    this.todoList.removeTaskById(id)
    this.displayTasks()
  }


  //event listeners to the HTML elements in the user interface to respond to user interactions
  bindEvents(){
    document
      .getElementById("add-todo")!
      .addEventListener("click", ()=> this.addTodo())
    document.addEventListener("click", (event)=>{
      const target = event.target as HTMLElement
      if(target.matches(".remove-todo")){
        const id = parseInt(target.getAttribute("data-id")!)
        this.removeTodoById(id)
      }
    })

    const newTodoInput = document.getElementById("new-todo") as HTMLInputElement
    newTodoInput.addEventListener("keypress", (event)=>{
      if(event.key === "Enter"){
        this.addTodo()
      }
    })
  }
}

const todoList = new TodoList()
const ui = new TodoListUI(todoList)

ui.displayTasks()
ui.bindEvents()

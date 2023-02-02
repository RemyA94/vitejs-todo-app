import html from "./app.html?raw";
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from "./use-cases";


const ElementIDs = {
    ClearCompleted: '.clear-completed',
    NewTodoInput: '#new-todo-input',
    PendigCountLabel: '#pending-count',
    TodoFilters: '.filter',
    TodoList: '.todo-list',
}


/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

    const displayTodo = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(ElementIDs.PendigCountLabel);
    }

    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodo();
    })();

    //html references
    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
    const TodoListUL = document.querySelector(ElementIDs.TodoList);
    const ClearCompletedButton = document.querySelector(ElementIDs.ClearCompleted);
    const TodoFiltersLIs = document.querySelectorAll(ElementIDs.TodoFilters);
    // const PendigCountLabel = document.querySelector(ElementIDs.PendigCountLabel);

    //Listeners
    newDescriptionInput.addEventListener('keyup', (event) => {
        // console.log(event.target.value);
        if (event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) throw new Error('Descripcion is required');
        if (event.target.value.trim().length > 200) throw new Error('Description should not exceed 200 characters')

        todoStore.addTodo(event.target.value);
        displayTodo();
        event.target.value = '';
    })

    TodoListUL.addEventListener('click', (event) => {
        const elementId = event.target.closest('[data-id]');
        todoStore.toggleTodo(elementId.getAttribute('data-id'));
        displayTodo();
    })

    TodoListUL.addEventListener('click', (event) => {
        const isDestroyElement = event.target.className === 'destroy';
        const elementId = event.target.closest('[data-id]');
        if (!elementId || !isDestroyElement) return

        todoStore.deleteTodo(elementId.getAttribute('data-id'));
        displayTodo();
    })

    ClearCompletedButton.addEventListener('click', (event) => {
        const clearCompleted = event.target.className === 'clear-completed';
        if (!clearCompleted) return;

        todoStore.deleteCompleted();
        displayTodo();
    })

    TodoFiltersLIs.forEach(element => {
        element.addEventListener('click', (element) => {
            TodoFiltersLIs.forEach(ele => ele.classList.remove('selected'));
            element.target.classList.add('selected');
            // console.log(element.target.id);

            switch (element.target.id) {
                case 'All':
                    todoStore.setFilter(Filters.All)
                    break;
                case 'Pending':
                    todoStore.setFilter(Filters.Pending)
                    break;
                case 'Completed':
                    todoStore.setFilter(Filters.Completed)
                    break;
            }
            displayTodo();
        })
    })


}
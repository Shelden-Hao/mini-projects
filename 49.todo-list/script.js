const form = document.getElementById('form')
const input = document.getElementById('input')
const todosUL = document.getElementById('todos')
// 从本地存储中获取名为 'todos' 的数据，并将其解析为 JavaScript 对象
// JSON.parse() 是将 JSON 字符串转换为 JavaScript 对象的方法
const todos = JSON.parse(localStorage.getItem('todos'))
// 如果 'todos' 存在（不为 null），则遍历 todos 数组，调用 addTodo 函数来添加每个 todo 到页面中
if (todos) {
    todos.forEach(todo => addTodo(todo))
}
// 给表单添加一个提交事件监听器
form.addEventListener('submit', (e) => {
    // 阻止表单的默认提交行为
    e.preventDefault()

    addTodo()
})

function addTodo(todo) {
    // 获取用户输入的 todo 文本
    let todoText = input.value
    // 如果传入了 todo 参数，则使用传入的 todo 的文本值
    if (todo) {
        todoText = todo.text
    }
    // 判断 todoText 是否为空
    if (todoText) {
        const todoEl = document.createElement('li')
        // 如果传入了 todo 参数，并且该 todo 的 completed 属性为 true，则添加 'completed' 类名
        if (todo && todo.completed) {
            todoEl.classList.add('completed')
        }

        todoEl.innerText = todoText

        todoEl.addEventListener('click', () => {
            //toggle切换类型：即有该类名则去掉，没有则加上
            todoEl.classList.toggle('completed')
            updateLS()
        })
        // contextmenu右击触发事件
        todoEl.addEventListener('contextmenu', (e) => {
            e.preventDefault()

            todoEl.remove()
            updateLS()
        })

        todosUL.appendChild(todoEl)

        input.value = ''

        updateLS()
    }
}

function updateLS() {
    todosEl = document.querySelectorAll('li')

    const todos = []
    // 对象的属性值可以是任何有效的 JavaScript 表达式
    todosEl.forEach(todoEl => {
        todos.push({
            text: todoEl.innerText,
            completed: todoEl.classList.contains('completed')
        })
    })

    localStorage.setItem('todos', JSON.stringify(todos))
}
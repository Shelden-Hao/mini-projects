const panels = document.querySelectorAll('.panel')

panels.forEach(panel => {
  panel.addEventListener('click', () => {
    removeActiveClasses()
    panel.classList.add('active')
  })
})
// 循环遍历语句，对名为 panels 的数组（或类数组对象）中的每个元素执行相同的操作
// 'click' 事件监听器。当用户点击该元素时，触发指定的回调函数。
// removeActiveClasses(): 这是一个自定义的函数，用于移除所有元素上的 'active' 类。它在点击任何 panel 元素之前被调用，以确保只有一个 panel 元素可以处于 'active' 状态。

function removeActiveClasses() {
  panels.forEach(panel => {
    panel.classList.remove('active')
  })
}
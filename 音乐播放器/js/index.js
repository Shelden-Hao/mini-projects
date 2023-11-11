/**
 * 解析字符串
 * 字符串 -> 对象数组
 * {time: 开始时间,word: 歌词内容}
 */
function parseLrc() {
  // 先变成对象
  let lines = lrc.split('\n');
  let result = []
  for (let i = 0; i < lines.length; i++) {
    let str = lines[i];
    let parts = str.split(']')
    let timeStr = parts[0].substring(1)
    let obj = {
      time: parseTime(timeStr),
      words: parts[1]
    }
    result.push(obj)
  }
  return result
}
/**
 * 将时间的字符串转换为数字（s）
 * @param {String} timeStr 时间字符串
 */
function parseTime(timeStr) {
  let parts = timeStr.split(':')
  return +parts[0] * 60 + +parts[1]
}
let lrcData = parseLrc()


const doms = {
  audio: document.querySelector('audio'),
  ul: document.querySelector('.container ul'),
  container: document.querySelector('.container')
}

/**
 * 计算出当前播放器的播放进度下
 * 应该高亮显示的歌词下标
 */
function findIndex() {
  const curTime = doms.audio.currentTime
  for (let i = 0; i < lrcData.length; i++) {
    if (lrcData[i].time > curTime) {
      return i - 1
    }
  }
  return lrcData.length - 1
}
/**
 * 创建歌词列表
 */
function createLrcList() {
  // 创建文档片段
  let frag = document.createDocumentFragment()
  for (let i = 0; i < lrcData.length; i++) {
    let li = document.createElement('li')
    li.innerText = lrcData[i].words
    frag.appendChild(li)  // 如果直接加到 ul 中会每次都渲染 dom
  }
  doms.ul.appendChild(frag)
}
createLrcList()
// 容器高度
let containerHeight = doms.container.clientHeight
let liHeight = doms.ul.children[0].clientHeight
// 最大偏移量
let maxOffset = doms.ul.clientHeight - containerHeight
/**
 * 设置ul元素的偏移量
 */
function setOffset() {
  let index = findIndex()
  let offset = liHeight * index + liHeight / 2 - containerHeight / 2
  if (offset < 0) {
    offset = 0
  }
  // if (offset > maxOffset) {
  //   offset = maxOffset
  // }
  doms.ul.style.transform = `translateY(-${offset}px)`
  let li = doms.ul.querySelector('.active')
  if (li) {
    li.classList.remove('active')
  }
  li = doms.ul.children[index]
  if (li) {
    li.classList.add('active')
  }
}
doms.audio.addEventListener('timeupdate', setOffset)
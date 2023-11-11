// 单件商品数据
class UIGoods {
  constructor(g) {
    this.data = g
    this.choose = 0
  }
  // 获取总价
  getTotalPrice() {
    return this.data.price * this.choose
  }
  // 是否选中了此件商品
  isChoose() {
    return this.choose > 0
  }
  // 数量加1
  increase() {
    this.choose++
  }
  // 数量减1
  decrease() {
    if (this.choose === 0) {
      return
    }
    this.choose--
  }

}
// 整个界面的数据
class UIData {
  constructor() {
    const uiGoods = []
    for (let i = 0; i < goods.length; i++) {
      let uig = new UIGoods(goods[i])
      uiGoods.push(uig)
    }
    this.uiGoods = uiGoods
    // 起送费
    this.deliveryThreshold = 30
    // 配送费
    this.deliveryPrice = 5
  }
  getTotalPrice() {
    let sum = 0
    for (let i = 0; i < this.uiGoods.length; i++) {
      let g = this.uiGoods[i]
      sum += g.getTotalPrice()
    }
    return sum
  }
  incrase(index) {
    this.uiGoods[index].increase()
  }
  decrease(index) {
    this.uiGoods[index].decrease()
  }
  getTotalChooseNumber() {
    let sum = 0
    for (let i = 0; i < this.uiGoods.length; i++) {
      sum += this.uiGoods[i].choose
    }
    return sum
  }
  hasGoodsInCar() {
    return this.getTotalChooseNumber() > 0
  }
  // 是否跨过了配送标准
  isCrossDeliveryThreshold() {
    return this.getTotalPrice() >= this.deliveryThreshold
  }
  isChoose(index) {
    return this.uiGoods[index].isChoose()
  }
}
// 整个界面
class UI {
  constructor() {
    this.uiData = new UIData()
    this.doms = {
      goodsContainer: document.querySelector('.goods-list'),
      deliveryPrice: document.querySelector('.footer-car-tip'),
      footerPay: document.querySelector('.footer-pay'),
      footerPayInnerSpan: document.querySelector('.footer-pay span'),
      totalPrice: document.querySelector('.footer-car-total'),
      car: document.querySelector('.footer-car'),
      badge: document.querySelector('.footer-car-badge'),
    }
    let carRect = this.doms.car.getBoundingClientRect()
    let jumpTarget = {
      x: carRect.left + carRect.width / 2,
      y: carRect.top + carRect.height / 5
    }
    this.jumpTarget = jumpTarget
    this.createHTML()
    this.updateFooter()
    this.listenEvent()
  }
  // 监听各种事件
  listenEvent() {
    this.doms.car.addEventListener('animationend', function() {
      this.classList.remove('animate')
    })
  }
  createHTML() {
    let html = ''
    for (let i = 0; i < this.uiData.uiGoods.length; i++) {
      let g = this.uiData.uiGoods[i]
      console.log(g)
      html += `<div class="goods-item">
          <img src="${g.data.pic}" alt="" class="goods-pic" />
          <div class="goods-info">
            <h2 class="goods-title">${g.data.title}</h2>
            <p class="goods-desc">${g.data.desc}</p>
            <p class="goods-sell">
              <span>月售 ${g.data.sellNumber}</span>
              <span>好评率${g.data.favorRate}%</span>
            </p>
            <div class="goods-confirm">
              <p class="goods-price">
                <span class="goods-price-unit">￥</span>
                <span>${g.data.price}</span>
              </p>
              <div class="goods-btns">
                <i index=${i} class="iconfont i-jianhao"></i>
                <span>${g.choose}</span>
                <i index=${i} class="iconfont i-jiajianzujianjiahao"></i>
              </div>
            </div>
          </div>
        </div>`
    }
    this.doms.goodsContainer.innerHTML = html
  }
  increase(index) {
    this.uiData.incrase(index)
    this.updateGoodsItem(index)
    this.updateFooter()
    this.jump(index)
  }
  decrease(index) {
    this.uiData.decrease(index)
    this.updateGoodsItem(index)
    this.updateFooter()
  }
  updateGoodsItem(index) {
    let goodsDom = this.doms.goodsContainer.children[index]
    if (this.uiData.isChoose(index)) {
      goodsDom.classList.add('active')
    } else {
      goodsDom.classList.remove('active')
    }
    let span = goodsDom.querySelector('.goods-btns span')
    span.textContent = this.uiData.uiGoods[index].choose
  }
  updateFooter() {
    // 总价
    let total = this.uiData.getTotalPrice()
    this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`
    // 设置配送费还差多少
    if (this.uiData.isCrossDeliveryThreshold()) {
      // 到达起送点
      this.doms.footerPay.classList.add('active')
    } else {
      this.doms.footerPay.classList.remove('active')
      // 更新差值
      let dis = this.uiData.deliveryThreshold - total
      dis = dis.toFixed(1)
      this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`
    }
    // 设置总价
    this.doms.totalPrice.textContent = total.toFixed(1)
    // 设置购物车的样式状态
    if (this.uiData.hasGoodsInCar()) {
      this.doms.car.classList.add('active')
    } else {
      this.doms.car.classList.remove('active')
    }
    // 设置购物车中的数量
    this.doms.badge.textContent = this.uiData.getTotalChooseNumber()
  }
  carAnimate() {
    this.doms.car.classList.add('animate')
  }
  // 抛物线跳跃元素
  jump(index) {
    // 找到对应商品的加号
    let btnAdd = this.doms.goodsContainer.children[index].querySelector('.i-jiajianzujianjiahao')
    let rect = btnAdd.getBoundingClientRect()
    let start = {
      x: rect.left,
      y: rect.top
    }
    let div = document.createElement('div')
    div.className = 'add-to-car'
    let i = document.createElement('i')
    i.className = 'iconfont i-jiajianzujianjiahao'
    // 设置初始位置
    div.style.transform = `translateX(${start.x}px)`
    i.style.transform = `translateY(${start.y}px)`
    div.appendChild(i)
    document.body.appendChild(div)
    // 强行渲染
    div.clientWidth;
    // 设置结束位置
    div.style.transform = `translateX(${this.jumpTarget.x}px)`
    i.style.transform = `translateY(${this.jumpTarget.y}px)`
    let that = this
    div.addEventListener('transitionend',function () {
      div.remove()
      that.carAnimate()
    }, {
      once: true  // 事件仅触发一次
    })
  }
}
const ui = new UI()

// 事件
ui.doms.goodsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('i-jiajianzujianjiahao')) {
    let index = +e.target.getAttribute('index')
    ui.increase(index)
  } else if(e.target.classList.contains('i-jianhao')){
    let index = +e.target.getAttribute('index')
    ui.decrease(index)
  }
})
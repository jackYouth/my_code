function TablePlugin(tableContainer,formContainer){
  this.$table = $(tableContainer)
  this.$tbody = this.$table.children('tbody')

  this.$form = $(formContainer)
  this.$inps = this.$form.children('input')
  this.$add = this.$form.children('.add')
  this.$edit = this.$form.children('.edit')
  this.$del = this.$form.children('.del')
  this.$up = this.$form.children('.up')
  this.$down = this.$form.children('.down')
  this.init()
}

var proto = TablePlugin.prototype
proto.init = function(){
  var _this = this
  //增
  this.$add.on('click',function(){
    _this.add()
  })
  //删
  this.$del.on('click',function(){
    _this.del()
  })
  //改
  this.$edit.on('click',function(){
    _this.edit()
  })
  //查
  this.$up.on('click',function(){
    _this.move('up')
  })

  this.$down.on('click',function(){
    _this.move('down')
  })
}
//排序
proto.sort = function(){
  for (var i = 0; i < $('tr:not(:first)').length; i++) {
    $('tr:not(:first)').eq(i).children().first().text(i+1);
  }
}
//增
proto.add = function(){
  var _this = this
  var trlen = this.$tbody.find('tr').length
  var template = ''
  this.$inps.map(function(i,o){
    template += `<td>${ o.value }</td>`
  })
  //trlen是当前行的索引，map出来的是inp里面的值
  template = `<tr><td>${ trlen }</td>${ template }</tr>`
  this.$tbody.append(template)
  //每添加一行，重新赋值，清空值
  this.$inps.map(function(i,o){
    o.value = ''
  })
  //选中当前行事件
  this.$tbody.find('tr').eq(trlen).on('click',function(){
    $(this).addClass('selected').siblings().removeClass('selected')
    $(this).children('td').map(function(i,o){
      if (i === 0) return false
      _this.$inps[--i].value = o.innerHTML
    })
  })
}
//删
proto.del = function(){
  this.$tbody.find('.selected').remove()
  this.$inps.map(function(i,o){
    o.value = ''
  })
  this.sort()
}
//改
proto.edit = function(){
  var _this = this
  this.$tbody.find('.selected td').map(function(i,o){
    if(i === 0) return false
    o.innerHTML = _this.$inps[--i].value
  })
}
//移动
proto.move = function(el){
  var prevRow = this.$tbody.find('tr.selected').prev()
  var afterRow = this.$tbody.find('tr.selected').next()
  var inx = this.$tbody.find('.selected').index()
  if (el === 'up' && prevRow && inx !== 1) {
    this.$tbody.find('tr.selected').after(prevRow)
  }
  if (el === 'down' && afterRow) {
    this.$tbody.find('tr.selected').before(afterRow)
  }
    this.sort()
}
//调用
new TablePlugin('#myTable','#myForm')

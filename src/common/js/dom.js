export function addClass(el, className) {
  // 如果元素有指定的class，则什么也不做
  if (hasClass(el, className)) {
    return
  }
  // 添加class
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 判断元素有没有指定的class
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
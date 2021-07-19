// 模拟java里的睡眠函数
function sleep(cb, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(cb());
    }, time)
  })
}
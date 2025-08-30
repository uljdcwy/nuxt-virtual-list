export function generateData(count = 10000) {
  const items = []
  for (let i = 1; i <= count; i++) {
    items.push({
      id: i,
      text: `User #${i} — 示例文本，测试虚拟列表第 ${i} 项`,
      avatar: `https://api.dicebear.com/6.x/identicon/svg?seed=user-${i}`
    })
  }
  return items
}

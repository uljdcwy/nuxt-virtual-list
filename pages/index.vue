<template>
  <div style="padding:24px;max-width:900px;margin:0 auto">
    <h1>Nuxt 3 虚拟列表示例（10,000 条）</h1>

    <div style="margin:12px 0; display:flex; gap:12px; align-items:center;">
      <input v-model="query" @input="onInput" placeholder="搜索文本（防抖）" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:4px" />
      <div>结果：{{ filtered.length }}</div>
      <button @click="reset" style="padding:8px 12px">重置</button>
    </div>

    <VirtualList
      :items="filtered"
      :itemHeight="70"
      :containerHeight="600"
      :buffer="5"
      ref="vlist"
    />

    <div style="margin-top:12px;display:flex;gap:8px;align-items:center;">
      <button @click="scrollToTop">滚到顶部</button>
      <button @click="scrollToMiddle">滚到中间（第5000项）</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VirtualList from '~/components/VirtualList.vue'
import { generateData } from '~/utils/generateData'
import { useDebounce } from '~/composables/useDebounce'

// 生成 10000 条数据（模拟 API 返回）
const all = generateData(10000)

// 搜索绑定
const query = ref('')
const filtered = ref(all.slice()) // 初始全部

// 虚拟列表引用（用于示例的 scrollToIndex）
const vlist = ref<any>(null)

// 防抖搜索：当用户输入时 200ms 防抖后执行过滤
const doFilter = (q: string) => {
  if (!q) {
    filtered.value = all.slice()
    return
  }
  const lower = q.toLowerCase()
  filtered.value = all.filter(item => item.text.toLowerCase().includes(lower) || String(item.id).includes(lower))
}
const debouncedFilter = useDebounce(doFilter, 200)

// input 事件触发防抖
function onInput() {
  debouncedFilter(query.value)
}

// reset
function reset() {
  query.value = ''
  filtered.value = all.slice()
}

function scrollToTop() {
  vlist.value?.scrollToIndex?.(0)
}
function scrollToMiddle() {
  console.log("test ", vlist.value)
  vlist.value?.scrollToIndex?.(5000)
}

onMounted(() => {})
</script>

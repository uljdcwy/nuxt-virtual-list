<template>
  <div ref="root" class="virtual-list-root" @scroll="onScroll"
    :style="{ overflowY: 'auto', height: containerHeight + 'px', position: 'relative' }">
    
    <!-- 固定总高度的容器 -->
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <div v-for="(item, idx) in visibleItems" 
        :key="item.id" 
        class="virtual-item"
        :style="{
          height: itemHeight + 'px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
          position: 'absolute',
          top: (startIndex + idx) * itemHeight + 'px',  // 关键点：定位
          left: 0,
          right: 0
        }">
        <img :src="item.avatar" alt=""
          style="width:40px;height:40px;border-radius:4px;margin-right:12px;flex-shrink:0" />
        <div>
          <div style="font-weight:600">{{ item.text }}</div>
          <div style="font-size:12px;color:#666">id: {{ item.id }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDebounce } from '~/composables/useDebounce'

const props = withDefaults(defineProps<{
  items: Array<{ id: number, [key: string]: any }>,
  itemHeight?: number,
  containerHeight?: number,
  buffer?: number
}>(), {
  itemHeight: 70,
  containerHeight: 600,
  buffer: 5
})

const root = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const total = computed(() => props.items.length)

// 可视区渲染数量
const itemsPerViewport = computed(() => Math.ceil(props.containerHeight / props.itemHeight))

// 计算起止索引
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer))
const endIndex = computed(() => Math.min(total.value - 1, startIndex.value + itemsPerViewport.value + props.buffer * 2))

// 可见数据
const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value + 1)
})

// 总高度
const totalHeight = computed(() => total.value * props.itemHeight)

// 滚动事件
const dbFn = useDebounce(() => {
  if (root.value) {
    scrollTop.value = root.value.scrollTop
  }
}, 50)
function onScroll() {
  dbFn()
}

// 提供方法
function scrollToIndex(index: number) {
  if (!root.value) return
  const clamped = Math.max(0, Math.min(index, total.value - 1));
  root.value.scrollTop = clamped * props.itemHeight
  scrollTop.value = root.value.scrollTop
}
defineExpose({ scrollToIndex })
</script>

<style scoped>
.virtual-list-root {
  width: 100%;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  background: white;
  position: relative;
}

.virtual-item {
  border-bottom: 1px solid #f0f0f0;
}
</style>

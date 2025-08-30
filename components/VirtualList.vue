<template>
  <div ref="root" class="virtual-list-root" @scroll="onScroll"
    :style="{ overflowY: 'auto', height: containerHeight + 'px' }">
    <div :style="{ height: topSpacer + 'px' }"></div>

    <div role="list">
      <div v-for="(item, idx) in visibleItems" :key="item.id" class="virtual-item"
        :style="{ height: itemHeight + 'px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '8px' }">
        <img :src="item.avatar" alt=""
          style="width:40px;height:40px;border-radius:4px;margin-right:12px;flex-shrink:0" />
        <div>
          <div style="font-weight:600">{{ item.text }}</div>
          <div style="font-size:12px;color:#666">id: {{ item.id }}</div>
        </div>
      </div>
    </div>

    <div :style="{ height: bottomSpacer + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
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

const itemsPerViewport = computed(() => Math.ceil(props.containerHeight / props.itemHeight))
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer))
const endIndex = computed(() => Math.min(total.value - 1, Math.ceil((scrollTop.value + props.containerHeight) / props.itemHeight) + props.buffer))

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value + 1)
})

const topSpacer = computed(() => startIndex.value * props.itemHeight)
const bottomSpacer = computed(() => Math.max(0, (total.value - 1 - endIndex.value) * props.itemHeight))

const dbFn = useDebounce(() => {
  scrollTop.value = root.value.scrollTop
}, 50)
function onScroll() {
  if (!root.value) return
  dbFn()
}

function scrollToIndex(index: number) {
  console.log("root", root)
  if (!root.value) return
  const clamped = Math.max(0, Math.min(index, total.value - 1));
  console.log(clamped, "clamped")
  root.value.scrollTop = clamped * props.itemHeight
  scrollTop.value = root.value.scrollTop
}

defineExpose({
  scrollToIndex
})

onMounted(() => { })
onBeforeUnmount(() => { })
</script>

<style scoped>
.virtual-list-root {
  width: 100%;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  background: white;
}

.virtual-item {
  border-bottom: 1px solid #f0f0f0;
}
</style>

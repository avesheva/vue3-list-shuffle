<script setup lang="ts">
import { onMounted, watch } from 'vue'

export interface IProps {
  id?: string,
  duration?: number,
  shuffleOnInit?: boolean,
  restoreOrder?: number | string | boolean,
  shuffle?: number | string | boolean,
}
export type ListItemDataType = { index: number, top: number, bottom: number, height: number }

const props = withDefaults(defineProps<IProps>(), {
  id: 'listWrapper',
  duration: 1,
  shuffleOnInit: false,
  shuffle: Date.now(),
  restoreOrder: Date.now(),
})

const initialOrder: ListItemDataType[] = []
let listWrapper: HTMLDivElement | null = null

const shuffleArray = (array: ListItemDataType[]) => {
  const arrClone = [...array]

  for (let i = arrClone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = arrClone[i]; arrClone[i] = arrClone[j]; arrClone[j] = t
  }

  return arrClone
}

const shuffleList = (toInitOrder = false) => {
  if (!listWrapper) return

  const newOrder = toInitOrder ? [ ...initialOrder ] : shuffleArray(initialOrder)
  const updatedCoordinates: ListItemDataType[] = []

  for (let i = 0; i < newOrder.length; i++) {
    updatedCoordinates[i] = { ...newOrder[i] }

    if (i === 0) {
      updatedCoordinates[i].top = initialOrder[i].top
      updatedCoordinates[i].bottom = updatedCoordinates[i].top + updatedCoordinates[i].height
      continue
    }

    updatedCoordinates[i].top = updatedCoordinates[i - 1].bottom
    updatedCoordinates[i].bottom = updatedCoordinates[i].top + updatedCoordinates[i].height
  }

  for (let i = 0; i < updatedCoordinates.length; i++) {
    const item = updatedCoordinates[i]
    const currentElement = listWrapper.children[item.index] as HTMLElement
    const top = item.top - initialOrder[item.index].top

    currentElement.style.transform = `translate(0, ${ top }px)`
  }
}

watch(() => props.shuffle, () => {
  shuffleList()
})

watch(() => props.restoreOrder, () => {
  shuffleList(true)
})

onMounted(() => {
  listWrapper = document.getElementById(props.id) as HTMLDivElement

  if (listWrapper) {
    for (let i = 0; i < listWrapper.children.length; i++) {
      const element = listWrapper.children[i] as HTMLElement
      const clientRect = element.getBoundingClientRect()

      element.style.transitionProperty = 'transform'
      element.style.transitionDuration = `${ props.duration }s`

      initialOrder.push({ index: i, top: clientRect.top, bottom: clientRect.bottom, height: clientRect.height })
    }
  }

  if (props.shuffleOnInit) {
    shuffleList()
  }
})
</script>

<template>
  <div :id="id">
    <slot />
  </div>
</template>

<style scoped>

</style>

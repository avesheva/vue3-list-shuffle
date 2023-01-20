<script setup lang="ts">
import { onMounted, watch } from 'vue'

export interface IProps {
  id?: string,
  duration?: number,
  shuffleOnInit?: boolean,
  restoreOrder?: number | string | boolean,
  shuffle?: number | string | boolean,
}
export type ListItemDataType = { index: number, top: number }

const props = withDefaults(defineProps<IProps>(), {
  id: 'listWrapper',
  duration: 1,
  shuffleOnInit: false,
  shuffle: 'KoypS3Gk0Cw8VS',
  restoreOrder: 'KoypS3Gk0Cw8VS',
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

  for (let i = 0; i < listWrapper.children.length; i++) {
    const currentElement = listWrapper.children[i] as HTMLElement
    const newIndex = newOrder.findIndex((item  ) => item.index === i)
    const top = initialOrder[newIndex].top - initialOrder[i].top

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

      element.style.transitionProperty = 'transform'
      element.style.transitionDuration = `${ props.duration }s`

      initialOrder.push({ index: i, top: element.getBoundingClientRect().top })
    }
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

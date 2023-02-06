<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'

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
const emit = defineEmits(['shuffled'])

const initialOrder = ref<ListItemDataType[]>([])
let mutationObserver: MutationObserver
let newOrder: ListItemDataType[] = []
let listWrapper: HTMLDivElement | null = null
let timerId: ReturnType<typeof setTimeout>

const shuffleArray = (array: ListItemDataType[]) => {
  const arrClone = [...array]

  clearTimeout(timerId)

  for (let i = arrClone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = arrClone[i]; arrClone[i] = arrClone[j]; arrClone[j] = t
  }

  timerId = setTimeout(() => {
    emit('shuffled', arrClone.map((item) => item.index))
  }, props.duration * 1000)

  return arrClone
}

const positionCalculate = (list: ListItemDataType[]): ListItemDataType[] => {
  const updatedCoordinates: ListItemDataType[] = []

  for (let i = 0; i < list.length; i++) {
    updatedCoordinates[i] = { ...list[i] }

    if (i === 0) {
      updatedCoordinates[i].top = initialOrder.value[i].top
      updatedCoordinates[i].bottom = updatedCoordinates[i].top + updatedCoordinates[i].height
      continue
    }

    updatedCoordinates[i].top = updatedCoordinates[i - 1].bottom
    updatedCoordinates[i].bottom = updatedCoordinates[i].top + updatedCoordinates[i].height
  }

  return updatedCoordinates
}
const moveItems = (list: ListItemDataType[], wrapper: HTMLElement) => {
  const updatedCoordinates = positionCalculate(list)

  for (let i = 0; i < updatedCoordinates.length; i++) {
    const item = updatedCoordinates[i]
    const currentElement = wrapper.children[item.index] as HTMLElement

    if (initialOrder.value[item.index]) {
      const top = item.top - initialOrder.value[item.index].top
      currentElement.style.transform = `translate(0, ${ top }px)`
    }
  }
}

const initialComputing = () => {
  if (!listWrapper) return

  initialOrder.value = []

  for (let i = 0; i < listWrapper.children.length; i++) {
    const element = listWrapper.children[i] as HTMLElement

    element.style.transitionProperty = 'transform'
    element.style.transitionDuration = `${ props.duration }s`
    element.setAttribute('index', `${ i }`)

    initialOrder.value.push(
      {
        index: i,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight,
        height: element.offsetHeight,
      },
    )
  }
}

const shuffleList = (toInitOrder = false) => {
  if (!listWrapper) return

  newOrder = toInitOrder ? [ ...initialOrder.value ] : shuffleArray(initialOrder.value)
  moveItems(newOrder, listWrapper)
}

watch(() => props.shuffle, () => {
  shuffleList()
})

watch(() => props.restoreOrder, () => {
  shuffleList(true)
})

onMounted(() => {
  listWrapper = document.getElementById(props.id) as HTMLDivElement

  initialComputing()

  mutationObserver = new MutationObserver((mutationsList: MutationRecord[]) => {
    mutationsList.forEach((mutation: MutationRecord) => {
      if (mutation.addedNodes.length > 0) {
        initialComputing()
      }

      mutation.removedNodes.forEach((node: Node) => {
        const removedItemIndex = (node as HTMLElement).getAttribute('index')
        let indexInOrder: number | null = null

        if (removedItemIndex !== '') {
          newOrder = newOrder.map((item, i) => {
            if (Number(removedItemIndex) === item.index) indexInOrder = i
            if (Number(removedItemIndex) < item.index) item.index--

            return item
          })
          indexInOrder !== null && newOrder.splice(indexInOrder, 1)

          if (listWrapper) {
            initialComputing()
            moveItems(newOrder, listWrapper)
          }
        }
      })
    })
  })

  if (listWrapper) {
    mutationObserver.observe(listWrapper, { subtree: false, childList: true })
  }

  if (props.shuffleOnInit) {
    shuffleList()
  }
})

onUnmounted(() => {
  mutationObserver?.disconnect()
})
</script>

<template>
  <div :id="id">
    <slot />
  </div>
</template>

<style scoped>

</style>

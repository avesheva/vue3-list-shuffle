# vue3-list-shuffle

Lightweight, easy to use component for animated shuffling and change order in lists

[Vue list shuffle.webm](https://user-images.githubusercontent.com/12416010/213774177-c85facc9-6436-4b08-a9d6-1c9ec399dd29.webm)

## Demo
[**Live Demo**](https://avesheva.github.io/vue3-list-shuffle/)

## Installation
```shell
# with npm
npm install vue3-list-shuffle
```
```shell
# with yarn
yarn add vue3-list-shuffle
```

## Basic usage
```vue
import VueListShuffle from 'vue3-list-shuffle';
```

```vue
    <vue-list-shuffle
      :shuffle="shuffle"
      :restore-order="restoreOrder"
      :duration="3"
    >
      <div v-for="item in 5" :key="item" class="list-item">
        ITEM: {{ item }}
      </div>
    </vue-list-shuffle>
    
    <style scoped>
     .list-item {
        background: #B08620;
        font-size: 3rem;
        padding: 1.5rem;
        border: solid 1px;
        color: #FEF0CD;
      }
    <style>
```

## Props
| NAME          | TYPE    | DEFAULT              | DESCRIPTION              |
|---------------|---------|----------------------|--------------------------|
| id            | String  | listWrapper          | Component id             |
| duration      | Number  | 1                    | Animation duration (sec) |
| shuffle       | String, Number, Boolean | Date.now() | Change this prop for calling shuffling |
| shuffleOnInit | Boolean | false                | If true, shuffles list on first init|
| restoreOrder  | String, Number, Boolean | Date.now() | Change this prop for restoring initial list order |

## Events
| NAME     | PARAMS TYPE | DESCRIPTION |
|----------|-------------|-------------|
| shuffled | number[]    | Fires after shuffling is finished. Returns array with list items indexes on new positions. |

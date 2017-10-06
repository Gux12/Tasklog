<template>
  <div contenteditable="true" class="tagInput" @input="$emit('input', $event.target.innerText)"
       placeholder="创建任务吧！" ref="tagInput">
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    props: ['value']
  }
</script>

<style lang="scss" scoped>
  .tagInput {
    flex: 1;
    min-height: 38px;
    font-size: 1rem;
    padding: 10px 10px;
    border-left: 1px solid transparent;
    word-break: break-all;
    margin-right: 10px;
    &:focus {
      outline: none;
      border: 1px solid rgba(black, .5);
    }
    &:empty:before {
      content: attr(placeholder);
      color: #bbb;
    }
    &:focus:before {
      content: none;
    }
  }
</style>

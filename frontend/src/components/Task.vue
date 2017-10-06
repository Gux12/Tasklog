<template>
  <div>
    <mt-cell-swipe :right="rightBtn" :class="{ completed: done, task: true}">
      <div slot="title">
        <span class="title">
          <span v-for="tag in task.tags"
                :key="tag.text"
                class="tag"
                :style="{backgroundColor:tag.color,color:'#fff'}">{{tag.text}}</span> {{task.tagsFree}}</span>
      </div>
      <mt-switch class="toggle" :value="done" @change="doneToggle" @click.native.stop></mt-switch>
    </mt-cell-swipe>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    name: 'Task',
    props: ['task'],
    data () {
      return {
        rightBtn: [
          {
            content: '删除',
            style: {
              background: 'red',
              color: '#fff',
              display: 'flex',
              alignItems: 'center'
            },
            handler: () => this.$messagebox.confirm('确定执行此操作?').then(async action => {
              let {task} = this
              await this.deleteTaskAsync({task})
            }).catch(err => {
              err
            })
          }
        ]
      }
    },
    computed: {
      done () {
        return !!this.task.done
      }
    },
    methods: {
      ...mapActions([
        'deleteTaskAsync',
        'toggleTaskAsync'
      ]),
      doneToggle (e) {
        const {task} = this
        console.log(this)
        this.toggleTaskAsync({task})
      }
    }
  }
</script>

<style lang="scss">
  @import "src/scss/color.scss";

  .task {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    &.completed {
      color: $color-grey;
      & .mint-cell-title {
        text-decoration: line-through;
      }
    }
    .title {
      position: relative;
      margin: 0;
      width: 100%;
      font-size: 1rem;
      font-family: inherit;
      font-weight: inherit;
      line-height: 1.4em;
      border: 0;
      color: inherit;
      padding: 6px;
      box-sizing: border-box;
      font-smoothing: antialiased;
      display: block;
      padding: 12px 16px;
      word-break: normal;
      .tag {
        padding: 5px;
        text-align: center;
        border-radius: 4px;
      }
    }

  }
</style>

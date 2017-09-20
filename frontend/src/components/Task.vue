<template>
  <mt-cell-swipe :title="task.title" :right="rightBtn" :class="{ completed: done, editing: editing, task: true}">
    <div class="time">
      <span v-text="'创建于' + new Date(task.create_time).toLocaleString()" class="create_time"></span>
      <span v-show="task.done_time" v-text="'完成于' + new Date(task.done_time).toLocaleString()" class="done_time"></span>
      <span v-show="task.done_time" v-text="timestampToStirng(task.create_time, task.done_time)"
            class="used_time"></span>
    </div>
    <mt-switch class="toggle" :value="done" @change="doneToggle"></mt-switch>
    <!--<div class="view">-->
    <!--<input class="toggle"-->
    <!--type="checkbox"-->
    <!--:checked="task.done"-->
    <!--@change="toggleTaskAsync({ task })">-->
    <!--<label v-text="task.title" @dblclick="editing = true"></label>-->
    <!--<button class="destroy" @click="deleteTaskAsync({ task })"></button>-->
    <!--</div>-->
    <!--<input class="edit"-->
    <!--v-show="editing"-->
    <!--v-focus="editing"-->
    <!--:value="task.title"-->
    <!--@keyup.enter="doneEdit"-->
    <!--@keyup.esc="cancelEdit"-->
    <!--@blur="doneEdit">-->
  </mt-cell-swipe>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { Indicator } from 'mint-ui'

  export default {
    name: 'Task',
    props: ['task'],
    data () {
      return {
        editing: false,
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
              console.log(action)
              let {task} = this
              Indicator.open()
              await this.deleteTaskAsync({task})
              Indicator.close()
            }).catch(err => {
              err
            })
          }
        ]
      }
    },
    directives: {
      focus (el, {value}, {context}) {
        if (value) {
          context.$nextTick(() => {
            el.focus()
          })
        }
      }
    },
    computed: {
      done () {
        return this.task.done === 1 || this.task.done === true
      }
    },
    methods: {
      ...mapMutations([]),
      ...mapActions([
        'deleteTaskAsync',
        'editTaskAsync',
        'toggleTaskAsync'
      ]),
      async doneToggle (e) {
        Indicator.open()
        const {task} = this
        await this.toggleTaskAsync({task})
        Indicator.close()
      },
      doneEdit (e) {
        const title = e.target.value.trim()
        const {task} = this
        if (!title) {
          this.deleteTaskAsync({
            task
          })
        } else if (this.editing) {
          this.editTaskAsync({
            task,
            title
          })
          this.editing = false
        }
      },
      cancelEdit (e) {
        e.target.value = this.task.title
        this.editing = false
      },
      timestampToStirng (start, end) {
        let timediff = parseInt((end - start) / 1000)
        let day = parseInt(timediff / 86400)
        let remain = timediff % 86400
        let hour = parseInt(remain / 3600)
        remain = remain % 3600
        let min = parseInt(remain / 60)
        let sec = remain % 60
        return `耗时${day !== 0 ? day + '天' : ''}${hour !== 0 ? hour + '时' : ''}${min !== 0 ? min + '分' : ''}${sec !== 0 ? sec + '秒' : ''}`
      }
    }
  }
</script>

<style lang="scss">
  .task {
    background-color: transparent;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    &.completed {
      color: #999999;
      & .mint-cell-title {
        text-decoration: line-through;
      }
      .time {
        .create_time {
          text-decoration: line-through;
          background-color: #999999;
        }
        .done_time {
          margin-top: 5px;
          margin-bottom: 5px;
          background-color: #309990;
          padding: 5px 5px;
          border-radius: 5px;
          color: white;
        }
        .used_time {
          margin-bottom: 5px;
          background-color: #309990;
          padding: 5px 5px;
          border-radius: 5px;
          color: white;
        }
      }
    }
    .time {
      text-align: center;
      display: flex;
      flex-flow: column;
      font-size: 0.8rem;
      margin-right: 20px;
      .create_time {
        margin-top: 5px;
        background-color: brown;
        padding: 5px 5px;
        border-radius: 5px;
        color: white;
      }
    }
  }
</style>

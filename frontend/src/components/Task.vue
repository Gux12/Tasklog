<template>
  <mt-cell-swipe :right="rightBtn" :class="{ completed: done, editing: editing, task: true}">
    <div slot="title">
      <span class="title" v-show="!editing" @click="editing = true">{{task.title}}</span>
      <textarea class="edit"
           contenteditable="true"
           v-show="editing"
           v-focus="editing"
           :value="task.title"
           @keyup.enter="doneEdit"
           @keyup.esc="cancelEdit"
           @touchstart.stop
           @touchmove.stop
           @blur="doneEdit">
      </textarea>
    </div>
    <div class="time">
      <span v-text="'创建于' + new Date(task.create_time).toLocaleString()" class="create_time"></span>
      <span v-show="task.done_time" v-text="'完成于' + new Date(task.done_time).toLocaleString()" class="done_time"></span>
      <span v-show="task.done_time" v-text="timestampToStirng(task.create_time, task.done_time)"
            class="used_time"></span>
    </div>
    <mt-switch class="toggle" :value="done" @change="doneToggle"></mt-switch>
  </mt-cell-swipe>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { Indicator } from 'mint-ui'

  let Hammer = require('hammerjs')
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
      focus: function (el, {value}, {context}) {
        if (value) {
          context.$nextTick(() => {
            el.focus()
          })
        }
      },
      press: {
        bind: function (el, {arg, value}, {context}) {
          let mc = new Hammer.Manager(el)
          mc.add(new Hammer.Press({time: arg}))
          mc.on('press', function () {
            value(el)
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
    }
    .edit {
      position: relative;
      margin: 0;
      width: 90%;
      font-size: 1rem;
      font-family: inherit;
      font-weight: inherit;
      line-height: 1.4em;
      color: inherit;
      padding: 6px;
      box-sizing: border-box;
      font-smoothing: antialiased;
      display: block;
      padding: 12px 16px;
      &:focus {
        border: 3px solid #f7ba2a;
        box-shadow: none;
        border-radius: 0px;
        outline: none;
        overflow-wrap: break-word;
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

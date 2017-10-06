<template>
  <div v-if="task!==null" class="taskEdit">
    <!--<textarea class="edit"-->
    <!--:value="task.title"-->
    <!--@keyup.enter="doneEdit"-->
    <!--@keyup.esc="cancelEdit"-->
    <mt-field
      class="edit"
      label="任务标题"
      placeholder="任务标题"
      type="textarea"
      rows="4"
      v-model="task.title">
    </mt-field>
    <div :class="['time', done?'completed':'']">
        <span v-text="'创建于' + new Date(task.create_time).toLocaleString()"
              class="create_time"></span>
      <span v-show="done"
            v-text="'完成于' + new Date(task.done_time).toLocaleString()"
            class="done_time"></span>
      <span v-show="done"
            v-text="timestampToStirng(task.create_time, task.done_time)"
            class="used_time"></span>
    </div>
    <mt-button size="large" type="primary" @click="doneEdit">更新</mt-button>
  </div>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'

  let Hammer = require('hammerjs')
  export default {
    data () {
      return {}
    },
    computed: {
      done () {
        return !!this.task.done
      }
    },
    directives: {
      focus: function (el, {value}, {context}) {
        if (value) {
          context.$nextTick(() => {
            console.log(el, 'focus')
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
    methods: {
      ...mapMutations([]),
      ...mapActions([
        'editTaskAsync'
      ]),
      doneEdit () {
        const {task} = this
        this.editTaskAsync({
          task,
          title: task.title
        })
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
    },
    props: ['task']
  }
</script>

<style lang="scss" scoped>
  @import "src/scss/color.scss";

  .taskEdit {
    padding: 5px 10px;
    .edit {
      margin-bottom: 20px;
    }
    .time {
      text-align: center;
      display: flex;
      flex-flow: column;
      font-size: 0.8rem;
      width: 100%;
      margin-bottom: 20px;
      .create_time {
        margin-top: 5px;
        background-color: $color-danger;
        padding: 5px 5px;
        border-radius: 5px;
        color: white;
      }
      &.completed {
        display: flex;
        flex-direction: column;
        .create_time {
          text-decoration: line-through;
          background-color: $color-grey;
        }
        .done_time {
          margin-top: 5px;
          margin-bottom: 5px;
          background-color: $color-success;
          padding: 5px 5px;
          border-radius: 5px;
          color: white;
        }
        .used_time {
          margin-bottom: 5px;
          background-color: $color-primary;
          padding: 5px 5px;
          border-radius: 5px;
          color: white;
        }
      }
    }
  }
</style>

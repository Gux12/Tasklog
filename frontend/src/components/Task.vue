<template>
  <li class="task" :class="{ completed: task.done, editing: editing }">
    <div class="view">
      <input class="toggle"
             type="checkbox"
             :checked="task.done"
             @change="toggleTaskAsync({ task })">
      <label v-text="task.title" @dblclick="editing = true"></label>
      <button class="destroy" @click="deleteTaskAsync({ task })"></button>
      <span v-text="new Date(task.create_time).toLocaleString()"></span>
    </div>
    <input class="edit"
           v-show="editing"
           v-focus="editing"
           :value="task.title"
           @keyup.enter="doneEdit"
           @keyup.esc="cancelEdit"
           @blur="doneEdit">
  </li>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'

  export default {
    name: 'Task',
    props: ['task'],
    data () {
      return {
        editing: false
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
    methods: {
      ...mapMutations([
      ]),
      ...mapActions([
        'deleteTaskAsync',
        'editTaskAsync',
        'toggleTaskAsync'
      ]),
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
      }
    }
  }
</script>

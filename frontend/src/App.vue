<style src="./scss/tasklog.css"></style>

<template>
  <section class="taskapp">
    <!-- header -->
    <header class="header">
      <h1>工作流</h1>
      <input class="new-task"
             autofocus
             autocomplete="off"
             placeholder="完成了什么？"
             @keyup.enter="addTask">
    </header>
    <!-- main section -->
    <section class="main" v-show="tasks.length">
      <input class="toggle-all" id="toggle-all"
             type="checkbox"
             :checked="allChecked"
             @change="toggleAll({ done: !allChecked })">
      <label for="toggle-all"></label>
      <ul class="task-list">
        <Task v-for="(task, index) in filteredTasks" :key="index" :task="task"></Task>
      </ul>
    </section>
    <!-- footer -->
    <footer class="footer" v-show="tasks.length">
      <span class="task-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize('item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters">
          <a :href="'#/' + key"
             :class="{ selected: visibility === key }"
             @click="visibility = key">{{ key | capitalize }}</a>
        </li>
      </ul>
      <button class="clear-completed"
              v-show="tasks.length > remaining"
              @click="clearCompleted">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import Task from '@/components/Task.vue'

  const filters = {
    all: tasks => tasks,
    active: tasks => tasks.filter(task => task.done),
    completed: tasks => tasks.filter(task => !task.done)
  }

  export default {
    components: {Task},
    data () {
      return {
        visibility: 'all',
        filters: filters
      }
    },
    computed: {
      tasks () {
        return this.$store.state.tasks
      },
      allChecked () {
        return this.tasks.every(task => task.done)
      },
      filteredTasks () {
        return filters[this.visibility](this.tasks)
      },
      remaining () {
        return this.tasks.filter(task => !task.done).length
      }
    },
    methods: {
      addTask (e) {
        var title = e.target.value
        if (title.trim()) {
          this.addTaskAsync({title, done: false})
        }
        e.target.value = ''
      },
      ...mapMutations([
        'toggleAll',
        'clearCompleted'
      ]),
      ...mapActions([
        'initTasks',
        'addTaskAsync'
      ])
    },
    filters: {
      pluralize: (n, w) => n === 1 ? w : (w + 's'),
      capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
    },
    async mounted () {
      this.initTasks()
    }
  }
</script>

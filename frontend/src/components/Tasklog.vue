<template>
  <section class="taskapp">
    <!-- header -->
    <header class="header">
      <mt-field label="任务" placeholder="完成了什么？" @keyup.native.enter="addTask" :attr="{autofocus:true}"
                v-model="taskInput"></mt-field>
    </header>
    <!-- main section -->
    <section class="main" v-show="tasks.length">
      <section class="main_year" v-for="(year_task,year_index) in filteredTasks" :key="year_index">
        <h1>{{year_index}}年</h1>
        <section class="main_month" v-for="(month_task,month_index) in year_task" :key="month_index">
          <h1>{{month_index}}月</h1>
          <ul class="main_date" v-for="(date_task,date_index) in month_task" :key="date_index">
            <h1>{{month_index}}月{{date_index}}日</h1>
            <Task v-for="(task, index) in date_task" :key="index" :task="task"></Task>
          </ul>
        </section>
      </section>
    </section>
    <!-- footer -->
    <mt-tabbar :value="visibility" :fixed="true">
      <mt-tab-item v-for="(val, key) in filters" :id="key" :key="key" @click.native="$router.push('/task/' + key)">
        <span>{{ key | namelize }} <mt-badge size="small" type="error" v-show="key === 'active' || key === 'all'">{{ remaining }}</mt-badge></span>
      </mt-tab-item>
    </mt-tabbar>
  </section>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import Task from '@/components/Task.vue'
  import { Toast, Indicator } from 'mint-ui'

  const filters = {
    all: tasks => tasks,
    active: tasks => tasks.filter(task => !task.done),
    completed: tasks => tasks.filter(task => task.done)
  }

  const filtersName = {
    all: '全部',
    active: '未完成',
    completed: '已完成'
  }

  export default {
    components: {Task},
    data () {
      return {
        filters: filters,
        taskInput: ''
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
        let filteredTasks = filters[this.visibility](this.tasks)
        let groupByDate = {}
        for (let item of filteredTasks) {
          let date = new Date(item.create_time)
          let itemDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            day: date.getDay() + 1
          }
          console.log(itemDate)
          if (groupByDate[itemDate.year] === undefined) groupByDate[itemDate.year] = {}
          if (groupByDate[itemDate.year][itemDate.month] === undefined) groupByDate[itemDate.year][itemDate.month] = {}
          if (groupByDate[itemDate.year][itemDate.month][itemDate.date] === undefined) groupByDate[itemDate.year][itemDate.month][itemDate.date] = []
          groupByDate[itemDate.year][itemDate.month][itemDate.date].push(item)
        }
        return groupByDate
      },
      remaining () {
        return filters['active'](this.tasks).length
      },
      visibility () {
        return this.$route.params.type
      }
    },
    methods: {
      async addTask (e) {
        var title = this.taskInput
        if (title.trim()) {
          Indicator.open()
          await this.addTaskAsync({title, done: false})
          Indicator.close()
        }
        this.taskInput = ''
        Toast('添加任务成功')
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
      namelize: s => filtersName[s]
    },
    async mounted () {
      await this.initTasks()
    }
  }
</script>

<style scoped lang="scss">
  @import "src/scss/color.scss";

  .taskapp {
    margin-top: 60px;
    .header {
      display: block;
      position: fixed;
      width: 100%;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
      &.scrollUp {
        display: none;
      }
    }
    .main {
      padding: 48px 10px 100px 10px;
      /*height: 100%;*/
      /*overflow-y: auto;*/
      /*-webkit-overflow-scrolling: touch;*/
      .main_year {
        h1 {
        }
        .main_month {
          h1 {

          }
          .main_date {
            h1 {

            }
          }
        }
      }
    }
  }

</style>

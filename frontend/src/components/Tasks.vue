<template>
  <section class="taskapp" v-loading="!ready">
    <!-- header -->
    <header class="header">
      <mt-field label="任务" placeholder="完成了什么？" @keyup.native.enter="addTask" v-model="taskInput">
      </mt-field>
    </header>
    <!-- main section -->
    <section class="main">
      <mt-loadmore
        style="min-height: 100%"
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore">
        <section
          class="main_year"
          v-for="(months,year) in timeLine"
          :key="year"
          v-if="ready && filteredTasks!==undefined && filteredTasks[year]!==undefined">
          <section
            class="main_month"
            v-for="(dates,month) in months"
            :key="month"
            v-if="filteredTasks[year][month]!==undefined">
            <h1>{{year}}年{{month}}月</h1>
            <section
              class="main_date"
              v-for="date in dates"
              :key="date"
              v-if="filteredTasks[year][month][date]!==undefined">
              <h1>{{month}}月{{date}}日</h1>
              <section class="main_tasks">
                <Task
                  v-for="(task, index) in filteredTasks[year][month][date]"
                  :key="task.title" :task="task"></Task>
              </section>
            </section>
          </section>
        </section>
        <section style="text-align: center;color: #999999;margin-top: 20px" v-else>
          <span>暂无任务</span>
        </section>
      </mt-loadmore>
    </section>
    <!-- footer -->
    <mt-tabbar :value="visibility" :fixed="true">
      <mt-tab-item v-for="(val, key) in filters" :id="key" :key="key" @click.native="$router.push('/task/' + key)">
        <span>{{ key | namelize }}
          <mt-badge size="large" type="error" v-if="key === 'active' || key === 'all'">{{active}}</mt-badge>
          <mt-badge size="large" type="success" v-else="key === 'completed'">{{completed}}</mt-badge>
        </span>
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
        taskInput: '',
        showDays: 4,
        loadMoreDays: 1,
        currentShowDays: 4,
        ready: false,
        allLoaded: false
      }
    },
    computed: {
      tasks () {
        return this.$store.state.tasks
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
          if (groupByDate[itemDate.year] === undefined) groupByDate[itemDate.year] = {}
          if (groupByDate[itemDate.year][itemDate.month] === undefined) groupByDate[itemDate.year][itemDate.month] = {}
          if (groupByDate[itemDate.year][itemDate.month][itemDate.date] === undefined) groupByDate[itemDate.year][itemDate.month][itemDate.date] = []
          groupByDate[itemDate.year][itemDate.month][itemDate.date].push(item)
        }
        return groupByDate
      },
      active () {
        return filters['active'](this.tasks).length
      },
      completed () {
        return filters['completed'](this.tasks).length
      },
      visibility () {
        return this.$route.params.type
      },
      dateToday () {
        let dateToday = new Date()
        let timestamp = dateToday.getTime()
        let timestampOffset = dateToday.getTimezoneOffset() * 60 * 1000 - 1
        timestamp = Math.ceil(timestamp / 86400000 + 1) * 86400000 + timestampOffset
        return new Date(timestamp)
      },
      timeLine () {
        let dateToday = this.dateToday
        let timeLine = {}
        for (let i = 0; i < this.currentShowDays; i++) {
          let date = new Date(dateToday.getTime() - i * 86400000)
          let itemDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            day: date.getDay() + 1
          }
          if (timeLine[itemDate.year] === undefined) timeLine[itemDate.year] = {}
          if (timeLine[itemDate.year][itemDate.month] === undefined) timeLine[itemDate.year][itemDate.month] = []
          timeLine[itemDate.year][itemDate.month].push(itemDate.date)
        }
        return timeLine
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
      // Vuex store Mutations and Actions
      ...mapMutations([
        'toggleAll',
        'clearCompleted'
      ]),
      ...mapActions([
        'initTasks',
        'addTaskAsync',
        'appendTasksAsync'
      ]),
      async loadTop () {
        await this.initTasks(`create_time?end=${this.dateToday.getTime()}&start=${this.dateToday.getTime() - this.showDays * 86400000}`)
        this.currentShowDays = this.showDays
        this.allLoaded = false
        this.$refs.loadmore.onTopLoaded()
      },
      async loadBottom () {
        await this.appendTasksAsync(`create_time?end=${this.dateToday.getTime() - (this.currentShowDays) * 86400000}&start=${this.dateToday.getTime() - (this.currentShowDays + this.loadMoreDays) * 86400000}`)
//        if (res === '') this.allLoaded = true
        this.currentShowDays += this.loadMoreDays
        this.$refs.loadmore.onBottomLoaded()
      }
    },
    directives: {
      loading (el, binding, {context}) {
        if (!context.ready) Indicator.open()
        else Indicator.close()
        console.log(context.ready)
      }
    },
    filters: {
      pluralize: (n, w) => n === 1 ? w : (w + 's'),
      namelize: s => filtersName[s]
    },
    async created () {
      await this.initTasks(`create_time?end=${this.dateToday.getTime()}&start=${this.dateToday.getTime() - this.showDays * 86400000}`)
      this.ready = true
    }
  }
</script>

<style scoped lang="scss">
  @import "src/scss/color.scss";

  .taskapp {
    .header {
      top: 84px;
      display: block;
      position: fixed;
      width: 100%;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
      z-index: 1;
      &.scrollUp {
        display: none;
      }
    }
    .main {
      /*background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#309990), to(#f7ba2a));*/
      /*background-color: #eeeeee;*/
      position: absolute;
      top: 132px;
      bottom: 48px;
      width: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .main_year {
        color: black;
        padding-bottom: 10px;
        .main_month {
          h1 {
            text-align: right;
            margin: 0;
            font-size: 1.2rem;
            padding: 5px 10px;
            color: #999999;
          }
          .main_date {
            color: #333;
            h1 {
              /*float: right;*/
              margin: 0;
              font-size: 1rem;
              color: black;
              width: 100%;
              text-align: right;
              color: #999999;
            }
            .main_tasks {
              width: calc(100% - 20px);
              margin-left: 10px;
              box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
            }
          }
        }
      }
    }
  }

</style>

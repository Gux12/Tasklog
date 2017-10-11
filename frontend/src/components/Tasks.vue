<template>
  <section class="taskapp">
    <Draggable :zIndex="4" :left="20" :top="20" v-show="doneType === 'active'"
               style="display: flex;align-items: center;flex-flow: column">
      <div class="tags_btn"
           @click="showTags = !showTags">
      </div>
      <div v-show="showTags" class="tags_connector">|||</div>
      <div :class="['tags_wrapper',showTags?'':'hidden']">
        <div :class="['tags_tag',~tagsType.indexOf(tag.text)?'selected':'']" size="small" v-for="tag in tagsArray"
             :key="tag.text"
             @click="$router.push('/task/' + $route.params.type + '/' + tag.text)">
          <span>{{tag.text}}</span>
          <mt-badge size="small" type="error">{{tag.count}}</mt-badge>
        </div>
      </div>
    </Draggable>
    <!-- header -->
    <header class="header">
      <span class="header_label">任务</span>
      <div contenteditable="true" class="header_input" @input="taskInput = arguments[0].target.innerText"
           placeholder="创建任务吧！" ref="header_input">
      </div>
      <!--<TagInput></TagInput>-->
      <mt-button type="primary" @click="addTask" class="header_btn">提交</mt-button>
    </header>
    <!--main section-->
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
                  @click.native="popupVisible = true;selectedTask = task"
                  :key="task.title" :task="task">
                </Task>
              </section>
            </section>
          </section>
        </section>
        <!--<section style="text-align: center;color: #999999;margin-top: 20px" v-else>-->
        <!--<span>暂无任务</span>-->
        <!--</section>-->
      </mt-loadmore>
    </section>
    <!-- footer -->
    <mt-tabbar :value="doneType" :fixed="true" class="task_footer">
      <mt-tab-item v-for="(val, key) in filters" :id="key" :key="key"
                   @click.native="$router.push('/task/' + key + '/' + $route.params.tags)">
        <span>{{ key | namelize }}
          <mt-badge size="large" type="error" v-if="key === 'active' || key === 'all'">{{active}}</mt-badge>
          <mt-badge size="large" type="success" v-else="key === 'completed'">{{completed}}</mt-badge>
        </span>
      </mt-tab-item>
    </mt-tabbar>
    <mt-palette-button content="+" class="task_workflow" direction="t"
                       mainButtonStyle="color:#fff;background-color:#36b9ae;">
      <div class="my-icon-button" @click="addTaskAsync({title: '#睡觉#又是美好的一天！', done: false})">睡觉</div>
      <div class="my-icon-button" @click="addTaskAsync({title: '#上班统计#开始上班啦！', done: false})">上班</div>
    </mt-palette-button>
    <mt-popup
      v-model="popupVisible"
      style="width: 100%;height: 100%;background-color: white"
      position="right">
      <mt-header title="任务详情">
        <mt-button icon="back" @click="popupVisible = false" slot="left">返回</mt-button>
      </mt-header>
      <TaskEdit :task="selectedTask"></TaskEdit>
    </mt-popup>
  </section>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import Task from '@/components/Task.vue'
  import TaskEdit from '@/components/TaskEdit.vue'
  import TagInput from '@/components/TagInput.vue'
  import { Toast } from 'mint-ui'
  import 'vue-awesome/icons/pencil'
  import Draggable from './Draggable.vue'

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

  //  const inputCheck = function (title) {
  //    let tags = title.match(/#([^\s#]+)#/g)
  //    if (tags != null) {
  //      for (let index in tags) {
  //        tags[index] = tags[index].match(/#([^\s#]+)#/)[1]
  //      }
  //    }
  //  }

  export default {
    components: {Task, TaskEdit, TagInput, Draggable},
    data () {
      return {
        filters: filters,
        taskInput: '',
        showDays: 365,
        loadMoreDays: 3,
        currentShowDays: 365,
        ready: false,
        allLoaded: true,
        popupVisible: false,
        selectedTask: null,
        showTags: false
      }
    },
    computed: {
      tasks () {
        let tasks = this.$store.state.tasks
        return tasks
      },
      doneType () {
        return this.$route.params.type
      },
      tagsType () {
        return this.$route.params.tags.split('_')
      },
      tagsArray () {
        let tagsArray = [{text: '全部', count: 0}, {text: '无标签', count: 0}]
        let filteredTasks = filters[this.doneType](this.tasks)
        for (let task of filteredTasks) {
          tagsArray.filter(tag => tag.text === '全部')[0].count++
          if (task.tags) {
            for (let tag of task.tags) {
              if (tagsArray.filter(_tag => _tag.text === tag.text).length) tagsArray.filter(_tag => _tag.text === tag.text)[0].count++
              else {
                tagsArray.push({text: tag.text, count: 1})
              }
            }
          } else {
            tagsArray.filter(tag => tag.text === '无标签')[0].count++
          }
        }
        return tagsArray
      },
      // 过滤tags的过滤函数
      filterTags () {
        let filterTags = {}
        for (let tag of this.tagsType) {
          filterTags[tag] = tasks => tasks.filter(task => task.tags !== null && task.tags.filter(_tag => _tag.text === tag).length !== 0)
        }
        filterTags['全部'] = tasks => tasks
        filterTags['无标签'] = tasks => tasks.filter(task => task.tags === null)
        return filterTags
      },
      filteredTasks () {
        let filteredTasks = filters[this.doneType](this.tasks)
        if (this.tagsType !== null) {
          for (let tag of this.tagsType) {
            filteredTasks = this.filterTags[tag](filteredTasks)
          }
        }
        let groupByDate = {}
        for (let item of filteredTasks) {
          let date = new Date(item.create_time)
          let itemDate = {
            year: date.getFullYear(),
            month: (Array(2).join(0) + (date.getMonth() + 1)).slice(-2),
            date: (Array(2).join(0) + (date.getDate() + 1)).slice(-2),
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
        return this.$store.state.count.countActive
      },
      completed () {
        return this.$store.state.count.countCompleted
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
            month: (Array(2).join(0) + (date.getMonth() + 1)).slice(-2),
            date: (Array(2).join(0) + (date.getDate() + 1)).slice(-2),
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
        let title = this.taskInput
        if (title === '') {
          Toast('任务为空')
          return
        }
        if (title.trim()) {
          await this.addTaskAsync({title, done: false})
        }
        this.taskInput = ''
        this.$refs['header_input'].innerText = ''
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
        let res = await this.appendTasksAsync(`create_time?end=${this.dateToday.getTime() - (this.currentShowDays) * 86400000}&start=${this.dateToday.getTime() - (this.currentShowDays + this.loadMoreDays) * 86400000}`)
        if (res === '') this.allLoaded = true
        this.currentShowDays += this.loadMoreDays
        this.$refs.loadmore.onBottomLoaded()
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: fixed;
      width: 100%;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
      padding: 5px 10px;
      background-color: white;
      .header_label {
        text-align: center;
        font-weight: bolder;
        margin-right: 10px;
      }
      .header_input {
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
      .header_btn {
        background-color: lighten($color-primary, 5%);
      }
    }
    .tags_btn {
      border-radius: 30px;
      width: 60px;
      height: 60px;
      border: $color-primary 5px solid;
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      &:after {
        font-size: 12px;
        font-weight: bolder;
        color: $color-primary;
        content: '(ง •̀_•́)ง';
      }
    }
    .tags_connector {
      color: white;
      font-weight: bolder;
      border: 2px solid $color-primary;
      background-color: $color-primary;
    }
    .tags_wrapper {
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      border: 4px solid $color-primary;
      max-height: 400px;
      overflow: auto;
      &.hidden {
        max-height: 0;
        border: 4px solid transparent;
        box-shadow: none;
        overflow: hidden;
      }
      .tags_tag {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: white;
        padding: 5px 10px;
        &.selected {
          color: white;
          background-color: $color-primary;
        }
      }
    }
    .main {
      position: absolute;
      top: 52px;
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
            color: $color-grey;
          }
          .main_date {
            color: #333;
            h1 {
              margin: 0;
              font-size: 1rem;
              color: black;
              width: 100%;
              text-align: right;
              color: $color-grey;
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
    .task_footer {
      box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
    }
    .task_workflow {
      bottom: 60px;
      left: calc(50% - 30px);
      position: fixed;
      .my-icon-button{
        background: $color-success;
        font-size: 0.8rem;
        width: auto;
        height: auto;
        line-height: 1em;
        padding: 5px 5px;
        color: #fff;
        border-radius: 1em;
      }
    }
  }


</style>

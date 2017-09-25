<template>
  <section class="taskapp" v-loading="!ready">
    <!-- header -->
    <header class="header">
      <span class="header_label">工作</span>
      <div contenteditable="true" class="header_input" @input="logInput = arguments[0].target.innerText"
           placeholder="完成了什么工作？" ref="header_input">
      </div>
      <mt-button type="primary" @click="addLog" class="header_btn">提交</mt-button>
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
          v-if="ready && filteredLogs!==undefined && filteredLogs[year]!==undefined">
          <section
            class="main_month"
            v-for="(dates,month) in months"
            :key="month"
            v-if="filteredLogs[year][month]!==undefined">
            <h1>{{year}}年{{month}}月</h1>
            <section
              class="main_date"
              v-for="date in dates"
              :key="date"
              v-if="filteredLogs[year][month][date]!==undefined">
              <h1>{{month}}月{{date}}日</h1>
              <section class="main_tasks">
                <Log
                  v-for="(log, index) in filteredLogs[year][month][date]"
                  :key="log.title" :log="log"></Log>
              </section>
            </section>
          </section>
        </section>
        <section style="text-align: center;color: #999999;margin-top: 20px" v-else>
          <span>暂无任务</span>
        </section>
      </mt-loadmore>
    </section>
  </section>
</template>

<script>
  import { mapActions } from 'vuex'
  import Log from '@/components/Log.vue'
  import { Toast, Indicator } from 'mint-ui'

  export default {
    components: {Log},
    data () {
      return {
        logInput: '',
        showDays: 4,
        loadMoreDays: 1,
        currentShowDays: 4,
        ready: false,
        allLoaded: false
      }
    },
    computed: {
      logs () {
        return this.$store.state.log.logs
      },
      filteredLogs () {
        let filteredLogs = this.logs
        let groupByDate = {}
        for (let item of filteredLogs) {
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
      async addLog (e) {
        var title = this.logInput
        if (title.trim()) {
          Indicator.open()
          await this['log/addLogAsync']({title, done: false, user_uid: this.$store.state.user.user.uid})
          Indicator.close()
        }
        this.logInput = ''
        this.$refs['header_input'].innerText = ''
        Toast('添加任务成功')
      },
      // Vuex store Mutations and Actions
      ...mapActions([
        'log/initLogs',
        'log/addLogAsync',
        'log/appendLogsAsync'
      ]),
      async loadTop () {
        await this['log/initLogs'](`create_time?end=${this.dateToday.getTime()}&start=${this.dateToday.getTime() - this.showDays * 86400000}/user_uid?value=${this.$store.state.user.user.uid}`)
        this.currentShowDays = this.showDays
        this.allLoaded = false
        this.$refs.loadmore.onTopLoaded()
      },
      async loadBottom () {
        await this['log/appendLogsAsync'](`create_time?end=${this.dateToday.getTime() - (this.currentShowDays) * 86400000}&start=${this.dateToday.getTime() - (this.currentShowDays + this.loadMoreDays) * 86400000}/user_uid?value=${this.$store.state.user.user.uid}`)
//        if (res === '') this.allLoaded = true
        this.currentShowDays += this.loadMoreDays
        this.$refs.loadmore.onBottomLoaded()
      }
    },
    directives: {
      loading (el, binding, {context}) {
        if (!context.ready) Indicator.open()
        else Indicator.close()
      }
    },
    filters: {
      pluralize: (n, w) => n === 1 ? w : (w + 's')
    },
    async created () {
      await this['log/initLogs'](`create_time?end=${this.dateToday.getTime()}&start=${this.dateToday.getTime() - this.showDays * 86400000}/user_uid?value=${this.$store.state.user.user.uid}`)
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
      z-index: 1;
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
        background-color: lighten(#309990, 5%);
      }
    }
    .main {
      /*background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#309990), to(#f7ba2a));*/
      /*background-color: #eeeeee;*/
      position: absolute;
      bottom: 0px;
      top: 48px;
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

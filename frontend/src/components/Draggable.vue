<template>
  <div class="draggable"
       :style="{left:`${proxy.left}px`,top:`${proxy.top}px`,'z-index':zIndex}"
       draggable="true"
       @touchstart.stop="handleTouchStart"
       @touchmove.stop.prevent="handleTouchMove"
       @touchend.stop="handleTouchEnd"
       @dragstart.stop="handleDragStart"
       @drag.stop="handleDrag"
       @dragend.stop="handleDragEnd"
       ref="draggable">
    <slot></slot>
  </div>
</template>
<script>
  import debounce from 'lodash/debounce'
  import $ from 'jquery'

  require('jquery-ui')

  export default {
    data () {
      return {
        initCursorX: 0,
        initCursorY: 0,
        initPosX: null,
        initPosY: null,
        cursorX: 0,
        cursorY: 0,
        translateX: 0,
        translateY: 0,
        downFlag: false,
        parentHeight: null,
        parentWidth: null,
        parentTop: null,
        parentLeft: null,
        height: null,
        width: null
      }
    },
    props: ['zIndex', 'left', 'top'],
    methods: {
      handleTouchStart (e) {
        this.initPosX = this.$refs.draggable.offsetLeft
        this.initPosY = this.$refs.draggable.offsetTop
        this.initCursorX = e.touches[0].pageX
        this.initCursorY = e.touches[0].pageY
        this.cursorX = e.touches[0].pageX
        this.cursorY = e.touches[0].pageY
        this.downFlag = true
      },
      handleTouchMove: debounce(function (e) {
        if (this.downFlag) {
          this.cursorX = e.touches[0].pageX
          this.cursorY = e.touches[0].pageY
        }
      }, 10),
      handleTouchEnd (e) {
        this.downFlag = false
      },
      handleDragStart (e) {
        this.initPosX = this.$refs.draggable.offsetLeft
        this.initPosY = this.$refs.draggable.offsetTop
        this.initCursorX = e.pageX
        this.initCursorY = e.pageY
        this.cursorX = e.pageX
        this.cursorY = e.pageY
        this.downFlag = true
      },
      handleDrag: debounce(function (e) {
//        if (this.downFlag) {
//          this.cursorX = e.pageX
//          this.cursorY = e.pageY
//        }
      }, 5),
      handleDragEnd (e) {
        if (this.downFlag) {
          this.cursorX = e.pageX + this.$refs.draggable.clientWidth / 2
          this.cursorY = e.pageY - this.$refs.draggable.clientHeight / 2
          console.log(this.cursorX, this.cursorY)
        }
        this.downFlag = false
      },
      xyOverflow (axisXY, axis) {
        if (axis === 'x') return (axisXY < this.boundary.left ? this.boundary.left : (axisXY > this.boundary.right ? this.boundary.right : axisXY))
        else return (axisXY < this.boundary.top ? this.boundary.top : (axisXY > this.boundary.bottom ? this.boundary.bottom : axisXY))
      }
    },
    mounted () {
      // parent size
//      this.parentHeight = this.$refs.draggable.parentElement.clientHeight
//      this.parentWidth = this.$refs.draggable.parentElement.clientWidth
//      this.parentTop = this.$refs.draggable.parentElement.offsetTop + 84
//      this.parentLeft = this.$refs.draggable.parentElement.offsetLeft
      this.parentHeight = window.innerHeight
      this.parentWidth = window.innerWidth
      this.parentTop = 0
      this.parentLeft = 0
      console.log(window.innerHeight, window.innerWidth)
      // this size
      console.log($(this.$refs.draggable).width(), $(this.$refs.draggable).height())
      console.log($(this.$refs.draggable).innerWidth(), $(this.$refs.draggable).innerHeight())
      console.log($(this.$refs.draggable).outerWidth(), $(this.$refs.draggable).outerHeight())
      this.height = this.$refs.draggable.clientHeight
      console.log(this.height)
      this.width = this.$refs.draggable.clientWidth
      console.log(this.width)
      // init
      this.initPosX = this.left
      this.initPosY = this.top + 136
    },
    computed: {
      proxy () {
        return {
          left: this.xyOverflow(this.initPosX + this.cursorX - this.initCursorX, 'x'),
          top: this.xyOverflow(this.initPosY + this.cursorY - this.initCursorY, 'y')
        }
      },
      boundary () {
        return {
          top: this.parentTop,
          right: this.parentWidth - this.width + this.parentLeft,
          bottom: this.parentHeight - this.height + this.parentTop,
          left: this.parentLeft
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "src/scss/color.scss";

  .draggable {
    position: fixed;
  }
</style>

<template>
    <div class="hello">
        <div>
        <h1>数组的处理</h1>
        <div class="v-step-0">
            <h1>第一步</h1>
        </div>
        <div>
            <span class="v-step-1">第二步</span>
            <hr>
        </div>
        <div style="margin-top:20px">
            <span class="v-step-2">第三步</span>
        </div>
        </div>
        <v-tour name="myTour" :steps="steps" :options="myOptions" :callbacks="myCallbacks">
            <template slot-scope="tour">
                <transition name="fade">
                    <v-step
                            v-if="tour.currentStep === index"
                            v-for="(step, index) of tour.steps"
                            :key="index"
                            :step="step"
                            :color="redColor"
                            :previous-step="tour.previousStep"
                            :next-step="tour.nextStep"
                            :stop="tour.stop"
                            :is-first="tour.isFirst"
                            :is-last="tour.isLast"
                            :labels="tour.labels"
                    >
                        <template v-if="tour.currentStep === 2">
                            <!--<div slot="actions">-->
                                <!--<button @click="tour.previousStep" class="btn btn-primary">Previous step</button>-->
                                <!--<button @click="tour.nextStep" class="btn btn-primary">Next step</button>-->
                            <!--</div>-->
                        </template>
                    </v-step>
                </transition>
            </template>
        </v-tour>
    </div>
</template>

<script>
  export default {
    name: 'arrayOperation',
    data(){
      return {
        myCallbacks: {
          onPreviousStep: this.myCustomPreviousStepCallback,
          onNextStep: this.myCustomNextStepCallback,
          onStop: this.myCustomStopStepCallback,
          onStart: this.myCustomStartStepCallback
        },
        myOptions: {
          useKeyboardNavigation: false,
          default: false
        },
        steps: [
          {
            target: '.v-step-0',  // We're using document.querySelector() under the hood
            content: `<strong>1</strong>!`
          },
          {
            target: '.v-step-1',
            content: '2'
          },
          {
            target: '.v-step-2',
            content: '3',
            params: {
              placement: 'top'
            }
          }
        ],
        dataList: [],
        list: [
          {
            "id":"001",
            "name":"li1",
            "age":"25",
          },{
            "id":"002",
            "name":"li3",
            "age":"21",
          },{
            "id":"003",
            "name":"li1",
            "age":"21",
          },{
            "id":"001",
            "name":"li6",
            "age":"11",
          },{
            "id":"002",
            "name":"li8",
            "age":"12",
          },{
            "id":"004",
            "name":"li8",
            "age":"10",
          },
        ]
      }
    },
    methods:{
      myCustomPreviousStepCallback (currentStep) {
        console.log("Previous",currentStep);
        // this.$router.push({path:'/VuexDome'})
      },
      myCustomNextStepCallback (currentStep) {
        console.log("Next",currentStep)
        if (currentStep === 1) {
          this.$router.push({path:'/TourDome'})
        }
      },
      myCustomStopStepCallback (currentStep) {
        console.log("Stop",currentStep);
      },
      myCustomStartStepCallback (currentStep) {
        if(currentStep === '' || currentStep == null){

        }else {
          this.steps = [
            {
              target: '.v-step-2',
              content: '3',
              params: {
                placement: 'top'
              }
            },
            {
              target: '.v-step-1',
              content: '2'
            },
            {
              target: '.v-step-0',  // We're using document.querySelector() under the hood
              content: `<strong>1</strong>!`
            },
          ]
        }
        console.log("Start",currentStep);
      },
      redColor(){
        return red;
      },
      // 数组中key为name的单放一个数组，再将数组去重
      arryEach(){
        this.dataList = this.list.map(item=>{
          return item["name"]
        })
        //数组去重
        this.dataList = Array.from(new Set(this.dataList));
        //将数组组成键值对的样式
        // this.dataList = this.dataList.map(item=>{
        //   let arr = [];
        //   arr.push({
        //     "name":item,
        //   })
        //   return arr;
        // })
        console.log('dataList',this.dataList);
      }
    },
    mounted: function () {
      this.$tours['myTour'].start()
    },
    created(){
      this.arryEach();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
    .model{
        width: 100%;
        height: 100%;
        z-index: 100;
        background: #ddd;
        opacity: 0.5;
        position: absolute;
    }
</style>


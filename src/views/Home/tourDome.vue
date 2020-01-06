<template>
    <div class="hello">
        <h1>数组的处理</h1>
        <div class="v-step-3">
            <h1>第三步</h1>
        </div>
        <div>
            <span class="v-step-4">第四步</span>
            <hr>
        </div>
        <div style="margin-top:20px">
            <span>第五步</span>
        </div>
        <Tabs v-model="nameNum" :animated="false">
            <TabPane label="标签一" name="name1">
                <div class="v-step-5">
                    <span>标签一的内容</span>
                </div>
            </TabPane>
            <TabPane label="标签二" name="name2">标签二的内容</TabPane>
            <TabPane label="标签三" name="name3">
                <span class="v-step-6">标签三的内容</span>
            </TabPane>
        </Tabs>
        <v-tour name="myTour" :steps="steps" :options="myOptions" :callbacks="myCallbacks">
            <template slot-scope="tour">
                <transition name="fade">
                    <v-step
                            v-if="tour.currentStep === index"
                            v-for="(step, index) of tour.steps"
                            :key="index"
                            :step="step"
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
    name: "tourDome",
    data() {
      return {
        nameNum:'name2',
        myCallbacks: {
          onPreviousStep: this.myCustomPreviousStepCallback,
          onNextStep: this.myCustomNextStepCallback,
          onStop: this.myCustomStopStepCallback
        },
        myOptions: {
          useKeyboardNavigation: false,
          default: true
        },
        steps: [
          {
            target: '.v-step-3',  // We're using document.querySelector() under the hood
            content: `3`
          },
          {
            target: '.v-step-4',
            content: '4'
          },
          {
            target: '.v-step-5',
            content: '5',
            params: {
              placement: 'top'
            }
          },
          {
            target: '.v-step-6',
            content: '6'
          },
        ],
        dataList: [],
        list: [
          {
            "id": "001",
            "name": "li1",
            "age": "25",
          }, {
            "id": "002",
            "name": "li3",
            "age": "21",
          }, {
            "id": "003",
            "name": "li1",
            "age": "21",
          }, {
            "id": "001",
            "name": "li6",
            "age": "11",
          }, {
            "id": "002",
            "name": "li8",
            "age": "12",
          }, {
            "id": "004",
            "name": "li8",
            "age": "10",
          },
        ]
      }
    },
    methods:{
      myCustomPreviousStepCallback (currentStep) {
        console.log("Previous",currentStep);
        if (currentStep === 3) {
          this.nameNum = "name1"
        }else if (currentStep === 4) {
          this.nameNum = "name3"
        }
      },
      myCustomNextStepCallback (currentStep) {
        console.log("Next",currentStep)
        if (currentStep === 1) {
          this.nameNum = "name1"
        }else if (currentStep === 2) {
          this.nameNum = "name3"
        }
      },
      myCustomStopStepCallback (currentStep) {
        console.log("Stop",currentStep);
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
  }
</script>

<style scoped>

</style>

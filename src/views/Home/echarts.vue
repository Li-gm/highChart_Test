<template>
  <Row>
    <!--饼图-->
    <Col span="24">
      <div id="Omics" :style="{width: '100%', height: '220px' ,border:'1px solid #ddd'}"></div>
    </Col>
    <!--柱状图-->
    <Col span="24">
      <div id="clinical" :style="{marginLeft:'5%',width: '90%', height: '300px'}"></div>
    </Col>
  </Row>
</template>

<script>
  export default {
    name: "echarts",
    data(){
      return{
        colBarList:['A','B','C','D'],
        dataBarList:[1,2,3,4],
      }
    },
    methods:{
      //饼图
      chartsCohort(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('Omics'));
        // 绘制图表
        myChart.setOption({
          title : {
            text: 'Omics:',
            subtext: '',
            textStyle:{
              //文字颜色
              color:'#4d5a6f',
            },
            x:'left'
          },
          // color:['#f6da22','#bbe2e8','#6cacde','#f293a3'],
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            textStyle:{
              fontSize : 14,
            },
          },
          series : [
            {
              name: 'Omics',
              type: 'pie',
              avoidLabelOverlap: false,
              /*
              * labelLine配置指示线的显隐的，
              * label配置文字的位置和显隐的
              * */
              /*labelLine: {
                normal: {
                  show: true
                }
              },
              label: {
                position:'inside',
                normal: {
                  show: false,
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '14',
                    fontWeight: 'bold'
                  }
                }
              },*/
              radius : '60%',
              center: ['45%', '50%'],
              data:[
                {value:12, name:'Genomic'},
                {value:32, name:'NcRNA'},
                {value:189, name:'Transcriptome'},
                {value:7, name:'Methly'},
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      },
      chartsClinical(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('clinical'));
        // 绘制图表
        myChart.setOption({
          color: ['#3398DB'],
          title: {
            text: '-lg(p-value)',
            subtext: '',
            x: '60%',
            y:'8%',
            textStyle:{
              //文字颜色
              color:'#4d5a6f',
              //字体风格,'normal','italic','oblique'
              fontStyle:'normal',
              //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
              fontWeight:'normal',
              //字体大小
              fontSize:18
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show: true,
            x:'right',
            y:'top',
            itemSize:20,
            iconStyle:{
              normal:{
                color:'white',//设置颜色
                fontSize:'20px'
              }
            },
            feature: {
              mark: {show: true},
              // dataView: {readOnly: false},
              //restore: {show: true},
              saveAsImage: {
                show: true,
                pixelRatio: 1,
                title: 'save',
                type: 'png',
                lang: ['点击保存'],
              }
            },
          },
          legend: {
            // data: ['2011年']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            position: 'top',
            // boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.colBarList
          },
          series: [
            {
              // name: '2011年',
              type: 'bar',
              barMaxWidth:30,//最大宽度
              data: this.dataBarList,
              //渐变颜色的实现
              itemStyle: {
                emphasis: {
                  barBorderRadius: 7
                },
                normal: {
                  // barBorderRadius: 7,
                  color: new this.$echarts.graphic.LinearGradient(
                    0, 0, 1, 0,
                    [
                      {offset: 0, color: '#3977E6'},
                      {offset: 1, color: '#37BBF8'}

                    ]
                  )
                }
              }
            },

          ]
        });
        //this.downloadUrl = myChart.getConnectedDataURL();
      },
    },
    mounted(){
      this.chartsCohort();
      this.chartsClinical();
    }
  }
</script>

<style scoped>

</style>

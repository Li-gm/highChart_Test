<template>
    <div>
        <div style="text-align: left;margin-top: 30px;margin-left: 30px">
            <Button type="primary" size="large" @click="vuexText">跳转</Button>
        </div>
        <div id="container3" style="height: 400px; min-width: 310px; max-width: 600px; margin: 0 auto"></div>
        <div id="container" style="min-width:400px;height:400px"></div>
        <div id="container1" style="min-width:400px;height:400px"></div>
        <div id="container2"></div>
    </div>
</template>

<script>
  import Highcharts from 'highcharts/highstock';
  export default {
    name: "highCharts",
    data(){
      return{

      }
    },
    methods:{
      vuexText(){
        this.$router.push({path:'/ArrayOperation'})
      },
      highCharts1(){
        Highcharts.chart('container', {
          chart: {
            type: 'column'
          },
          title: {
            text: '百分比堆叠柱状图'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: ['苹果', '橘子', '梨', '葡萄', '香蕉']
          },
          yAxis: {
            min: 0,
            title: {
              text: '水果消费总量'
            }
          },
          tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>' +
              '({point.percentage:.0f}%)<br/>',
            //:.0f 表示保留 0 位小数，详见教程：https://www.hcharts.cn/docs/basic-labels-string-formatting
            shared: true
          },
          plotOptions: {
            column: {
              stacking: 'percent'
            }
          },
          series: [{
            name: '小张',
            data: [5, 3, 4, 7, 2]
          },
            {
              name: '小彭',
              data: [2, 2, 3, 2, 1]
            }, {
              name: '小潘',
              data: [3, 4, 4, 2, 5]
            }]
        });
      },
      highChartsShow(){
        Highcharts.chart('container1', {
          chart: {
            type: 'column'
          },
          title: {
            text: '坐标轴标签旋转的柱状图'
          },
          credits: {
            enabled: false
          },
          // subtitle: {
          //   text: '数据截止 2017-03，来源: <a href="https://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
          // },
          xAxis: {
            type: 'category',
            labels: {
              rotation: -45  // 设置轴标签旋转角度
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: '人口 (百万)'
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormat: '人口总量: <b>{point.y:.1f} 百万</b>'
          },
          series: [{
            name: '总人口',
            data: [
              ['上海', 24.25],
              ['卡拉奇', 23.50],
              ['北京', 21.51],
              ['德里', 16.78],
              ['拉各斯', 16.06],
              ['天津', 15.20],
              ['伊斯坦布尔', 14.16],
              ['东京', 13.51],
              ['广州', 13.08],
              ['孟买', 12.44],
              ['莫斯科', 12.19],
              ['圣保罗', 12.03],
              ['深圳', 10.46],
              ['雅加达', 10.07],
              ['拉合尔', 10.05],
              ['首尔', 9.99],
              ['武汉', 9.78],
              ['金沙萨', 9.73],
              ['开罗', 9.27],
              ['墨西哥', 8.87]
            ],
            dataLabels: {
              enabled: true,
              rotation: -90,
              color: '#FFFFFF',
              align: 'right',
              format: '{point.y:.1f}', // :.1f 为保留 1 位小数
              y: 10
            }
          }]
        });
      },
      highCharts2(){
        Highcharts.chart('container2', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: '不同国家人口密度及面积对比'
          },
          credits: {
            enabled: false
          },
          subtitle: {
            text: '扇区长度（圆周方法）表示面积，宽度（纵向）表示人口密度'
          },
          tooltip: {
            headerFormat: '',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
              '面积 (平方千米): <b>{point.y}</b><br/>' +
              '人口密度 (每平方千米人数): <b>{point.z}</b><br/>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              },
              showInLegend: true
            }
          },
          series: [{
            type: 'pie',
            colorByPoint: true,
            minPointSize: 10,
            innerSize: '20%',
            zMin: 0,
            name: 'countries',
            data: [{
              name: '西班牙',
              y: 455370,
              z: 92.9,
              sliced: true,
            }, {
              name: '法国',
              y: 551500,
              z: 118.7
            }, {
              name: '波兰',
              y: 312685,
              z: 124.6,
              sliced: true,
            }, {
              name: '捷克共和国',
              y: 78867,
              z: 137.5
            }, {
              name: '意大利',
              y: 301340,
              z: 201.8
            }, {
              name: '瑞士',
              y: 41277,
              z: 214.5,
              sliced: true,
            }, {
              name: '德国',
              y: 357022,
              z: 235.6
            }]
          }]
        });
      },
      highCharts3(){
        Highcharts.chart('container3', {
          chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
          },
          title: {
            text: ''
          },
          xAxis: {
            categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura'],
            opposite: true
          },
          yAxis: {
            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            title: null
          },
          colorAxis: {
            min: 1,
            minColor: '#fff',
            maxColor: Highcharts.getOptions().colors[5]
          },
          legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
          },
          tooltip: {
            formatter: function () {
              return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
            }
          },
          series: [{
            name: 'Sales per employee',
            borderWidth: 1,
            data: [[0, 0,190], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
            dataLabels: {
              enabled: false,
              color: '#000000'
            }
          }]
        });
      },

    },
    created(){

    },
    mounted(){
      this.highChartsShow();
      this.highCharts1();
      this.highCharts2();
      this.highCharts3();
    }
  }
</script>

<style scoped>
    #container2 {
        min-width: 300px;
        max-width: 800px;
        height: 500px;
        margin: 1em auto;
    }
</style>

<template>
<Row>
    <!--<Col span='24' style="text-align: left">-->
        <!--<Form ref="formDynamic" :model="formDynamic" :label-width="100">-->
            <!--<FormItem-->
                    <!--v-for="(item, index) in formDynamic.diseaseInfo"-->
                    <!--:key="index"-->
                    <!--:label="item.label"-->
                    <!--:prop="item.value">-->
                <!--<Col span="24">-->
                    <!--<Input type="item.type" v-model="item.value" :autosize="{minRows: 4,maxRows: 6}" :placeholder="item.label"></Input>-->
                <!--</Col>-->
            <!--</FormItem>-->
        <!--</Form>-->

        <!--&lt;!&ndash;<Form :model="informtion" :label-width="100">&ndash;&gt;-->
        <!--&lt;!&ndash;<Col span="24">&ndash;&gt;-->
        <!--&lt;!&ndash;<FormItem label="疾病相关的别名">&ndash;&gt;-->
        <!--&lt;!&ndash;<Input type="text" v-model="informtion.diseasename" placeholder="疾病相关的别名..."></Input>&ndash;&gt;-->
        <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
        <!--&lt;!&ndash;</Col>&ndash;&gt;-->
        <!--&lt;!&ndash;</Form>&ndash;&gt;-->
    <!--</Col>-->
    <Col span='24'>
        <vue-form-generator @validated="onValidated" :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
    </Col>
    <Col span='24' style="margin-top: 20px">
        <vue-form-generator @validated="onValidated" :schema="schema1" :model="model1" :options="formOptions"></vue-form-generator>
    </Col>
    <Col span="24">
        <Button>select</Button>
    </Col>
</Row>
</template>

<script>
  const inputs = [
    {
      "test_param": {
        "multiple": false,
        "help": "",
        "display": null,
        "optional": false,
        "argument": null,
        "value": "minimum_random_number_interpolation",
        "label": "Interpolation Method",
        "is_dynamic": false,
        "textable": false,
        "model_class": "SelectToolParameter",
        "hidden": false,
        "refresh_on_change": true,
        "type": "select",
        "options": [["Column Random Number Interpolation", "minimum_random_number_interpolation", true], ["Column Minimum Interpolation", "col_minimum_value_interpolation", false], ["Dataframe Minimum Interpolation", "dataframe_minimum_value_interpolation", false], ["Group Row Minimum Interpolation", "row_group_minimum_value_interpolation", false]],
        "name": "interpolation_method_selector"
      },
      "model_class": "Conditional",
      "cases": [
        {
        "model_class": "ConditionalWhen",
        "value": "minimum_random_number_interpolation",
        "inputs": [{
          "help": "A decimal between 0-1. When this value is set to 0.01, the tool will calculate the random number using the smallest 5 percent of the non-null values.",
          "min": 0,
          "datalist": [],
          "max": 1,
          "area": false,
          "argument": null,
          "value": "0.01",
          "label": "Random Number Parameter",
          "is_dynamic": false,
          "optional": false,
          "model_class": "FloatToolParameter",
          "hidden": false,
          "refresh_on_change": false,
          "type": "float",
          "name": "quantile_threshold"
        }, {
          "help": "Minimum number of non-missing values used to calculate random number parameters. This parameter takes effect when the number of missing values calculated according to \"Random number parameter\" is less than this value (A column contains **100** non-missing protein, when \"Random Number Parameter\" is set to **0.01** and \"Minimum Number of Non-missing Values\" is set to **3**, this tool will calculate parameters using the **3** smallest non-missing values).",
          "min": 3,
          "datalist": [],
          "max": 10,
          "area": false,
          "argument": null,
          "value": "3",
          "label": "Minimum Number of Non-missing Values",
          "is_dynamic": false,
          "optional": false,
          "model_class": "IntegerToolParameter",
          "hidden": false,
          "refresh_on_change": false,
          "type": "integer",
          "name": "min_non_missing_value_threshold"
        }]
      },
        {
        "model_class": "ConditionalWhen",
        "value": "row_group_minimum_value_interpolation",
        "inputs": [{
          "help": "Specify the column index level as the grouping criteria, the first row is recorded as 0 and the subsequent rows are sequentially incremented. In particular, the last line can be represented by -1.",
          "min": -1,
          "datalist": [],
          "max": 5,
          "area": false,
          "argument": null,
          "value": "0",
          "label": "Grouping Standard",
          "is_dynamic": false,
          "optional": false,
          "model_class": "IntegerToolParameter",
          "hidden": false,
          "refresh_on_change": false,
          "type": "integer",
          "name": "col_index_level"
        }]
      },
        {
        "model_class": "ConditionalWhen",
        "value": "col_minimum_value_interpolation",
        "inputs": []
      },
        {
        "model_class": "ConditionalWhen", "value": "dataframe_minimum_value_interpolation", "inputs": []}],
      "type": "conditional",
      "name": "interpolation_method"
    }
  ]
  export default {
    name: "formGenerator",
    data(){
      return{
        schema:{
          fields:[
          ]
        },
        schema1:{
          fields:[
          ]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true
        },
        model:{
          minimum_random_number_interpolation:'minimum_random_number_interpolation',
        },
        model1:{
          minimum_random_number_interpolation:'minimum_random_number_interpolation',
        },
        listAllOption:[],
        name:'',
      }
    },
    watch:{
      model(){
       debugger
     }
    },
    methods:{
      initData(){
        let type =inputs[0].test_param["options"];
        type.forEach(item=>{
          this.listAllOption.push(item[1]);
          // this.listAllOption.push({
          //   id:item[0],
          //   value:item[1]
          // });
        })
        // this.listAllOption = JSON.stringify(this.listAllOption)
        console.log(this.listAllOption);
        //this.schema['fields'] = inputs.test_param
        this.schema['fields'].push({
          type:inputs[0].test_param["type"],
          model:inputs[0].test_param['value'],
          label:inputs[0].test_param['label'],
          values:this.listAllOption,
          selectOptions:{
            // onChanged:function (val) {
            //     console.log(val);
            // }
          }
        });
      },
      onValidated() {
        this.name = this.model['minimum_random_number_interpolation'];
        this.schema1['fields'] = [];
        for(let i= 0;i<inputs[0].cases.length;i++){
            if(this.name === inputs[0].cases[i].value){
              for(let j= 0;j<inputs[0].cases[i].inputs.length;j++){
                if(inputs[0].cases[i].inputs[j].type === 'float'){
                  this.schema1['fields'].push({
                    type: "input",
                    inputType: "Range",
                    label: inputs[0].cases[i].inputs[j].label,
                    model: inputs[0].cases[i].inputs[j].name,
                  });
                }else if(inputs[0].cases[i].inputs[j].type === 'integer'){
                  this.schema1['fields'].push({
                    type: "input",
                    inputType: "Number",
                    label: inputs[0].cases[i].inputs[j].label,
                    model: inputs[0].cases[i].inputs[j].name,
                    min:inputs[0].cases[i].inputs[j].min,
                    max:inputs[0].cases[i].inputs[j].max,
                  });
                }
              }

            }else if(this.name === inputs[0].cases[i].value){
            debugger
                for(let j= 0;j<inputs[0].cases[i].inputs.length;j++){
                  if(inputs[0].cases[i].inputs[j].type === 'integer'){
                    this.schema1['fields'].push({
                      type: "input",
                      inputType: "Number",
                      label: inputs[0].cases[i].inputs[j].label,
                      model: inputs[0].cases[i].inputs[j].name,
                      min:inputs[0].cases[i].inputs[j].min,
                      max:inputs[0].cases[i].inputs[j].max,
                    });
                  }
                }

          }
        }
        console.log(this.name);
      }
    },
    created(){
      this.initData();
    }
  }
</script>

<style scoped>

</style>

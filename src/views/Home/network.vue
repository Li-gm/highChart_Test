<template>
    <div id="contact">
        <Row class="toolBox">
            <Col span="5">
                <span style="font-size: 16px;padding-right: 10px">Disease:</span>
                <i-switch v-model="networkControl.disease" size="large" @on-change="diseaseChange">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
            </Col>
            <Col span="5">
                <span style="font-size: 16px;padding-right: 10px">Gene:</span>
                <i-switch v-model="networkControl.gene" size="large" @on-change="geneChange">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
            </Col>
            <Col span="7">
                <span style="font-size: 16px;padding-right: 10px">Gene Name:</span>
                <i-switch v-model="networkControl.geneName" size="large" @on-change="geneNameChange">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
            </Col>
            <Col span="7">
                <span style="font-size: 16px;padding-right: 10px">Disease Name:</span>
                <i-switch v-model="networkControl.diseaseName" size="large" @on-change="diseaseNameChange">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
            </Col>
        </Row>
        <Row class="toolBox" style="margin-top: 20px">
            <Col span="4">
                <Button type="primary" @click="downLoad" style="font-size: 14px">Save Photo</Button>
                <a :href="png64" download="download.png" style="visibility: hidden" id="networkChartDownload"></a>
            </Col>
            <Col span="10">
                <span style="font-size: 16px;padding-right: 10px">Interactions:</span>
                <Select v-model="edgesval" style="width:200px" @on-change="edgesChange">
                    <Option v-for="item in edgesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col span="10">
                <span style="font-size: 16px;padding-right: 10px">Layout:</span>
                <Select v-model="layoutVal" style="width:200px" @on-change="layoutChange">
                    <Option v-for="item in layoutList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
        </Row>
        <div ref="networkContainer" id="networkContainer"></div>
    </div>
</template>

<script>
  import cytoscape from 'cytoscape'
  import panzoom from 'cytoscape-panzoom'
  let cy;
  let disease_nodes;
  let term_nodes;
  let disease_edges;
  let disease_gene_edges;
  let gene_edges;
  let gene_nodes;

  panzoom(cytoscape)
  export default {
    name: "knowledgeBase",
    data() {
      return {
        png64:'',
        idBackground: {backgroundColor: "white", height: "550px"},
        edgesval:'all',
        edgesList:[
          {
            value:'all',
            label:'All'
          },
          {
            value:'ProteinInteraction',
            label:'Protein Interaction'
          },
          {
            value:'Biosystem',
            label:'In the same Biosystem'
          },
          {
            value:'GeneFamily',
            label:'In the same Gene Family'
          },
          {
            value:'TranscriptionInteraction',
            label:'Transcription Interaction'
          },
        ],
        layoutVal:'cose',
        layoutList:[
          {
            value:'cose',
            label:'Cose'
          },
          {
            value:'circle',
            label:'Circle'
          },
          {
            value:'grid',
            label:'Grid'
          },
          {
            value:'concentric',
            label:'Concentric'
          },
        ],
        modalShow: false,
        selectValue: 'gene',
        textContent: '',
        loading: true,
        typeList: [
          {
            value: 'gene',
            label: 'Gene'
          },
          {
            value: 'phenotype',
            label: 'Phenotype'
          },
        ],
        columnsPhenotype: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'HPO ID',
            key: 'HPO_ID'
          },
          {
            title: 'Input Phenotype',
            key: 'inputPhenotype'
          },
          {
            title: 'Standard Phenotype',
            key: 'standardPhenotype'
          }
        ],
        dataPhenotype: [],
        A1: [],
        A2: [],
        A3: [],
        A4: [],
        A5: [],
        tableSelectList: [],
        dataList: [],
        renderData: [],
        networkControl: {
          disease: true,
          gene: true,
          geneName: true,
          diseaseName: false
        },
        elements: [{
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 1, "id": "ADRB1", "color_weight": 1}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.9553, "id": "ADRA2C", "color_weight": 0.9553}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.6608, "id": "CLIC2", "color_weight": 0.6608}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.3738, "id": "SH3GL2", "color_weight": 0.3738}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.3157, "id": "GNA15", "color_weight": 0.3157}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.3142, "id": "PLN", "color_weight": 0.3142}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.291, "id": "KCNMA1", "color_weight": 0.291}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2563, "id": "TGFB2", "color_weight": 0.2563}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2542, "id": "BCHE", "color_weight": 0.2542}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2487, "id": "TGFB3", "color_weight": 0.2487}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2487, "id": "PRICKLE1", "color_weight": 0.2487}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2449, "id": "PRKCA", "color_weight": 0.2449}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2442, "id": "TNF", "color_weight": 0.2442}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2415, "id": "RAC1", "color_weight": 0.2415}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2342, "id": "KCNK13", "color_weight": 0.2342}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2335, "id": "ATP2A2", "color_weight": 0.2335}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2328, "id": "ADAMTS12", "color_weight": 0.2328}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2328, "id": "PRKACA", "color_weight": 0.2328}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2326, "id": "TBC1D4", "color_weight": 0.2326}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2288, "id": "USP3", "color_weight": 0.2288}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.228, "id": "CH25H", "color_weight": 0.228}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2279, "id": "OTUD7A", "color_weight": 0.2279}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2263, "id": "TGFB1", "color_weight": 0.2263}
        }, {
          "classes": "Predicted gene",
          "group": "nodes",
          "data": {"weight": 0.2256, "id": "AR", "color_weight": 0.2256}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2256, "id": "NOS3", "color_weight": 0.2256}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2242, "id": "TGFBR1", "color_weight": 0.2242}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2237, "id": "SMAD3", "color_weight": 0.2237}
        }, {
          "classes": "Predicted gene",
          "group": "nodes",
          "data": {"weight": 0.2208, "id": "MAPK1", "color_weight": 0.2208}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2201, "id": "AKT1", "color_weight": 0.2201}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2182, "id": "MYLK", "color_weight": 0.2182}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2173, "id": "PRKAG2", "color_weight": 0.2173}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2171, "id": "INS", "color_weight": 0.2171}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2163, "id": "TGFBR2", "color_weight": 0.2163}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2122, "id": "KIAA1598", "color_weight": 0.2122}
        }, {
          "classes": "Predicted gene",
          "group": "nodes",
          "data": {"weight": 0.2096, "id": "ADRA2A", "color_weight": 0.2096}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2092, "id": "PARVA", "color_weight": 0.2092}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2087, "id": "ADRB2", "color_weight": 0.2087}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2083, "id": "AGTR1", "color_weight": 0.2083}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2081, "id": "AVP", "color_weight": 0.2081}
        }, {
          "classes": "Predicted gene",
          "group": "nodes",
          "data": {"weight": 0.2077, "id": "MAPK3", "color_weight": 0.2077}
        }, {
          "classes": "Predicted gene",
          "group": "nodes",
          "data": {"weight": 0.2055, "id": "CALM1", "color_weight": 0.2055}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2036, "id": "HIF1A", "color_weight": 0.2036}
        }, {
          "classes": "Predicted gene",
          "group": "nodes",
          "data": {"weight": 0.2029, "id": "CALM2", "color_weight": 0.2029}
        }, {
          "classes": "Predicted gene",
          "group": "nodes",
          "data": {"weight": 0.2024, "id": "CALM3", "color_weight": 0.2024}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2006, "id": "LRIG3", "color_weight": 0.2006}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.2004, "id": "PRKG1", "color_weight": 0.2004}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.1972, "id": "IFRD1", "color_weight": 0.1972}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.197, "id": "PSMB8", "color_weight": 0.197}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.1965, "id": "PIK3CG", "color_weight": 0.1965}
        }, {
          "classes": "Reported gene",
          "group": "nodes",
          "data": {"weight": 0.1961, "id": "BTG1", "color_weight": 0.1961}
        }, {
          "classes": "disease",
          "group": "nodes",
          "data": {"weight": 0.0007869, "id": "cardiomyopathy heart failure"}
        }, {
          "classes": "disease",
          "group": "nodes",
          "data": {"weight": 0.09254, "id": "dyspnea paroxysmal"}
        }, {
          "classes": "disease",
          "group": "nodes",
          "data": {"weight": 0.5288, "id": "congestive heart failure and beta blocker response modifier of"}
        }, {
          "classes": "disease",
          "group": "nodes",
          "data": {"weight": 1, "id": "heart failure"}
        }, {
          "classes": "disease",
          "group": "nodes",
          "data": {"weight": 0.04068, "id": "congestive heart failure"}
        }, {
          "classes": "disease",
          "group": "nodes",
          "data": {"weight": 0.1888, "id": "x linked intellectual deficit cardiomegaly congestive heart failure"}
        }, {
          "classes": "disease",
          "group": "nodes",
          "data": {"weight": 0.3965, "id": "mortality in heart failure"}
        }, {
          "classes": "disease",
          "group": "nodes",
          "data": {"weight": 0.09254, "id": "left sided heart failure"}
        }, {"classes": "term", "group": "nodes", "data": {"id": "heart failure"}}, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "cardiomyopathy heart failure",
            "target": "ADRB1",
            "id": "cardiomyopathy heart failure with ADRB1"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "cardiomyopathy heart failure",
            "target": "heart failure",
            "id": "cardiomyopathy heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "congestive heart failure",
            "target": "ADRB1",
            "id": "congestive heart failure with ADRB1"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "congestive heart failure",
            "target": "heart failure",
            "id": "congestive heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "congestive heart failure and beta blocker response modifier of",
            "target": "ADRB1",
            "id": "congestive heart failure and beta blocker response modifier of with ADRB1"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "congestive heart failure and beta blocker response modifier of",
            "target": "heart failure",
            "id": "congestive heart failure and beta blocker response modifier of with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "ADRB1", "id": "heart failure with ADRB1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "ADRB1", "id": "heart failure with ADRB1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "ADRB1", "id": "heart failure with ADRB1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "congestive heart failure and beta blocker response modifier of",
            "target": "ADRA2C",
            "id": "congestive heart failure and beta blocker response modifier of with ADRA2C"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "congestive heart failure and beta blocker response modifier of",
            "target": "heart failure",
            "id": "congestive heart failure and beta blocker response modifier of with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "ADRA2C", "id": "heart failure with ADRA2C"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "ADRA2C", "id": "heart failure with ADRA2C"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "ADRA2C", "id": "heart failure with ADRA2C"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "congestive heart failure",
            "target": "CLIC2",
            "id": "congestive heart failure with CLIC2"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "congestive heart failure",
            "target": "heart failure",
            "id": "congestive heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "CLIC2", "id": "heart failure with CLIC2"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "x linked intellectual deficit cardiomegaly congestive heart failure",
            "target": "CLIC2",
            "id": "x linked intellectual deficit cardiomegaly congestive heart failure with CLIC2"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "x linked intellectual deficit cardiomegaly congestive heart failure",
            "target": "heart failure",
            "id": "x linked intellectual deficit cardiomegaly congestive heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "SH3GL2", "id": "heart failure with SH3GL2"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "SH3GL2", "id": "heart failure with SH3GL2"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "GNA15", "id": "heart failure with GNA15"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "GNA15", "id": "heart failure with GNA15"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "PLN", "id": "heart failure with PLN"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "KCNMA1",
            "id": "mortality in heart failure with KCNMA1"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "heart failure",
            "id": "mortality in heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "dyspnea paroxysmal", "target": "TGFB2", "id": "dyspnea paroxysmal with TGFB2"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "dyspnea paroxysmal",
            "target": "heart failure",
            "id": "dyspnea paroxysmal with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "TGFB2",
            "id": "left sided heart failure with TGFB2"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "heart failure",
            "id": "left sided heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "BCHE", "id": "heart failure with BCHE"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "dyspnea paroxysmal", "target": "TGFB3", "id": "dyspnea paroxysmal with TGFB3"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "dyspnea paroxysmal",
            "target": "heart failure",
            "id": "dyspnea paroxysmal with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "TGFB3",
            "id": "left sided heart failure with TGFB3"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "heart failure",
            "id": "left sided heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "PRICKLE1", "id": "heart failure with PRICKLE1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "PRKCA", "id": "heart failure with PRKCA"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "TNF", "id": "heart failure with TNF"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "TNF", "id": "heart failure with TNF"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "RAC1", "id": "heart failure with RAC1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "KCNK13",
            "id": "mortality in heart failure with KCNK13"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "heart failure",
            "id": "mortality in heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "ATP2A2", "id": "heart failure with ATP2A2"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "ATP2A2", "id": "heart failure with ATP2A2"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "ADAMTS12",
            "id": "mortality in heart failure with ADAMTS12"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "heart failure",
            "id": "mortality in heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "PRKACA", "id": "heart failure with PRKACA"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "TBC1D4", "id": "heart failure with TBC1D4"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "USP3", "id": "heart failure with USP3"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "CH25H", "id": "heart failure with CH25H"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "OTUD7A",
            "id": "mortality in heart failure with OTUD7A"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "heart failure",
            "id": "mortality in heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "TGFB1", "id": "heart failure with TGFB1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "congestive heart failure",
            "target": "NOS3",
            "id": "congestive heart failure with NOS3"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "congestive heart failure",
            "target": "heart failure",
            "id": "congestive heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "NOS3", "id": "heart failure with NOS3"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "NOS3", "id": "heart failure with NOS3"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "dyspnea paroxysmal", "target": "TGFBR1", "id": "dyspnea paroxysmal with TGFBR1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "dyspnea paroxysmal",
            "target": "heart failure",
            "id": "dyspnea paroxysmal with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "TGFBR1",
            "id": "left sided heart failure with TGFBR1"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "heart failure",
            "id": "left sided heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "dyspnea paroxysmal", "target": "SMAD3", "id": "dyspnea paroxysmal with SMAD3"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "dyspnea paroxysmal",
            "target": "heart failure",
            "id": "dyspnea paroxysmal with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "SMAD3",
            "id": "left sided heart failure with SMAD3"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "heart failure",
            "id": "left sided heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "AKT1", "id": "heart failure with AKT1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "dyspnea paroxysmal", "target": "MYLK", "id": "dyspnea paroxysmal with MYLK"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "dyspnea paroxysmal",
            "target": "heart failure",
            "id": "dyspnea paroxysmal with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "MYLK",
            "id": "left sided heart failure with MYLK"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "heart failure",
            "id": "left sided heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "congestive heart failure",
            "target": "PRKAG2",
            "id": "congestive heart failure with PRKAG2"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "congestive heart failure",
            "target": "heart failure",
            "id": "congestive heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "PRKAG2", "id": "heart failure with PRKAG2"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "INS", "id": "heart failure with INS"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "dyspnea paroxysmal", "target": "TGFBR2", "id": "dyspnea paroxysmal with TGFBR2"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "dyspnea paroxysmal",
            "target": "heart failure",
            "id": "dyspnea paroxysmal with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "TGFBR2",
            "id": "left sided heart failure with TGFBR2"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "heart failure",
            "id": "left sided heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "KIAA1598", "id": "heart failure with KIAA1598"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "KIAA1598", "id": "heart failure with KIAA1598"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "PARVA",
            "id": "mortality in heart failure with PARVA"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "heart failure",
            "id": "mortality in heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "cardiomyopathy heart failure",
            "target": "ADRB2",
            "id": "cardiomyopathy heart failure with ADRB2"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "cardiomyopathy heart failure",
            "target": "heart failure",
            "id": "cardiomyopathy heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "ADRB2", "id": "heart failure with ADRB2"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "ADRB2", "id": "heart failure with ADRB2"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "AGTR1", "id": "heart failure with AGTR1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "AGTR1", "id": "heart failure with AGTR1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "AGTR1", "id": "heart failure with AGTR1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "AVP", "id": "heart failure with AVP"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "AVP", "id": "heart failure with AVP"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "HIF1A", "id": "heart failure with HIF1A"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "HIF1A", "id": "heart failure with HIF1A"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "LRIG3", "id": "heart failure with LRIG3"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "dyspnea paroxysmal", "target": "PRKG1", "id": "dyspnea paroxysmal with PRKG1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "dyspnea paroxysmal",
            "target": "heart failure",
            "id": "dyspnea paroxysmal with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "PRKG1", "id": "heart failure with PRKG1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "PRKG1",
            "id": "left sided heart failure with PRKG1"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "left sided heart failure",
            "target": "heart failure",
            "id": "left sided heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "IFRD1",
            "id": "mortality in heart failure with IFRD1"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "mortality in heart failure",
            "target": "heart failure",
            "id": "mortality in heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {
            "source": "congestive heart failure",
            "target": "PSMB8",
            "id": "congestive heart failure with PSMB8"
          }
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {
            "source": "congestive heart failure",
            "target": "heart failure",
            "id": "congestive heart failure with heart failure"
          }
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "PSMB8", "id": "heart failure with PSMB8"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "PIK3CG", "id": "heart failure with PIK3CG"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "PIK3CG", "id": "heart failure with PIK3CG"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "disease_gene",
          "group": "edges",
          "data": {"source": "heart failure", "target": "BTG1", "id": "heart failure with BTG1"}
        }, {
          "classes": "disease_term",
          "group": "edges",
          "data": {"source": "heart failure", "target": "heart failure", "id": "heart failure with heart failure"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "SH3GL2", "weight": "0.01724", "id": "ADRB1 with SH3GL2"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "ADRB2", "weight": "0.0005361", "id": "ADRB1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "TNF", "weight": "0.001653", "id": "ADRB1 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "ATP2A2", "weight": "0.001284", "id": "ADRB1 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "TGFBR1", "weight": "0.001444", "id": "ADRB1 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "SH3GL2", "weight": "0.003632", "id": "ADRB1 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "RAC1", "weight": "0.0007222", "id": "ADRB1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "HIF1A", "weight": "0.0005092", "id": "ADRB1 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "SMAD3", "weight": "0.001444", "id": "ADRB1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "TGFB2", "weight": "0.001444", "id": "ADRB1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "AGTR1", "weight": "0.001126", "id": "ADRB1 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "PRKAG2", "weight": "0.0007232", "id": "ADRB1 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "TGFBR2", "weight": "0.001444", "id": "ADRB1 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "PRKACA", "weight": "2.651e-05", "id": "ADRB1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "NOS3", "weight": "0.001177", "id": "ADRB1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "MYLK", "weight": "0.001444", "id": "ADRB1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "AVP", "weight": "0.00113", "id": "ADRB1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "TGFB1", "weight": "6.765e-06", "id": "ADRB1 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "PRKG1", "weight": "0.001466", "id": "ADRB1 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "ADRA2C", "weight": "0.01548", "id": "ADRB1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "PIK3CG", "weight": "0.0007336", "id": "ADRB1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "KCNMA1", "weight": "0.003611", "id": "ADRB1 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "GNA15", "weight": "0.003632", "id": "ADRB1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "PLN", "weight": "0.003611", "id": "ADRB1 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "PRICKLE1", "weight": "0.001805", "id": "ADRB1 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "ADRB2", "weight": "0.0002643", "id": "ADRB1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "INS", "weight": "0.0007222", "id": "ADRB1 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "TGFB3", "weight": "0.001444", "id": "ADRB1 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "AKT1", "weight": "2.454e-06", "id": "ADRB1 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "PSMB8", "weight": "0.0007222", "id": "ADRB1 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB1", "target": "PRKCA", "weight": "1.613e-05", "id": "ADRB1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "TNF", "weight": "0.0008265", "id": "ADRA2C with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "SH3GL2", "weight": "0.001816", "id": "ADRA2C with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "RAC1", "weight": "0.0004814", "id": "ADRA2C with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "HIF1A", "weight": "0.0005432", "id": "ADRA2C with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "MYLK", "weight": "0.001444", "id": "ADRA2C with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "NOS3", "weight": "0.001177", "id": "ADRA2C with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "AVP", "weight": "0.0009041", "id": "ADRA2C with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "KCNMA1", "weight": "0.003611", "id": "ADRA2C with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "ADRB1", "weight": "0.01606", "id": "ADRA2C with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "ADRB2", "weight": "0.0002643", "id": "ADRA2C with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "PRICKLE1", "weight": "0.001805", "id": "ADRA2C with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "INS", "weight": "0.0007222", "id": "ADRA2C with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "TGFB3", "weight": "0.0009629", "id": "ADRA2C with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "PSMB8", "weight": "0.0007703", "id": "ADRA2C with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "PRKCA", "weight": "1.344e-05", "id": "ADRA2C with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "ATP2A2", "weight": "0.001284", "id": "ADRA2C with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "TGFBR1", "weight": "0.0007703", "id": "ADRA2C with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "SMAD3", "weight": "0.0007703", "id": "ADRA2C with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "TGFB2", "weight": "0.0009629", "id": "ADRA2C with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "OTUD7A", "weight": "0.001926", "id": "ADRA2C with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "TGFBR2", "weight": "0.0007703", "id": "ADRA2C with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "PRKACA", "weight": "1.768e-05", "id": "ADRA2C with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "BCHE", "weight": "0.001926", "id": "ADRA2C with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "PRKAG2", "weight": "0.0009642", "id": "ADRA2C with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "AGTR1", "weight": "0.001126", "id": "ADRA2C with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "TGFB1", "weight": "4.51e-06", "id": "ADRA2C with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "PRKG1", "weight": "0.001466", "id": "ADRA2C with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "USP3", "weight": "0.001926", "id": "ADRA2C with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "PIK3CG", "weight": "0.0007336", "id": "ADRA2C with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "PLN", "weight": "0.003611", "id": "ADRA2C with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "ADAMTS12", "weight": "0.001926", "id": "ADRA2C with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "GNA15", "weight": "0.002422", "id": "ADRA2C with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "CH25H", "weight": "0.001444", "id": "ADRA2C with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2C", "target": "AKT1", "weight": "2.454e-06", "id": "ADRA2C with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CLIC2", "target": "MYLK", "weight": "0.0007703", "id": "CLIC2 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CLIC2", "target": "AVP", "weight": "0.0004068", "id": "CLIC2 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CLIC2", "target": "PSMB8", "weight": "0.0004333", "id": "CLIC2 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CLIC2", "target": "PRKACA", "weight": "2.209e-05", "id": "CLIC2 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CLIC2", "target": "KCNK13", "weight": "0.002407", "id": "CLIC2 with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CLIC2", "target": "ATP2A2", "weight": "0.00107", "id": "CLIC2 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CLIC2", "target": "PLN", "weight": "0.003009", "id": "CLIC2 with PLN"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "ADRB1", "weight": "0.07623", "id": "SH3GL2 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "TGFB3", "weight": "0.001444", "id": "SH3GL2 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "AKT1", "weight": "1.636e-06", "id": "SH3GL2 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "PSMB8", "weight": "0.0009629", "id": "SH3GL2 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "PRKCA", "weight": "8.601e-06", "id": "SH3GL2 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "PIK3CG", "weight": "0.0003668", "id": "SH3GL2 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "ADRA2C", "weight": "0.007741", "id": "SH3GL2 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "ADAMTS12", "weight": "0.001444", "id": "SH3GL2 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "GNA15", "weight": "0.001816", "id": "SH3GL2 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "ADRB1", "weight": "0.01606", "id": "SH3GL2 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "PRICKLE1", "weight": "0.001805", "id": "SH3GL2 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "ADRB2", "weight": "0.0002643", "id": "SH3GL2 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "INS", "weight": "0.0004814", "id": "SH3GL2 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "TGFB2", "weight": "0.001444", "id": "SH3GL2 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "PRKACA", "weight": "1.768e-05", "id": "SH3GL2 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "TGFBR2", "weight": "0.001444", "id": "SH3GL2 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "PRKAG2", "weight": "0.0009642", "id": "SH3GL2 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "AGTR1", "weight": "0.0009383", "id": "SH3GL2 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "MYLK", "weight": "0.0007222", "id": "SH3GL2 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "NOS3", "weight": "0.0005887", "id": "SH3GL2 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "KIAA1598", "weight": "0.003027", "id": "SH3GL2 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "PRKG1", "weight": "0.000977", "id": "SH3GL2 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "TGFB1", "weight": "6.765e-06", "id": "SH3GL2 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "AVP", "weight": "0.00113", "id": "SH3GL2 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "ATP2A2", "weight": "0.0006419", "id": "SH3GL2 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "TNF", "weight": "0.0008816", "id": "SH3GL2 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "TBC1D4", "weight": "0.002407", "id": "SH3GL2 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "TGFBR1", "weight": "0.001444", "id": "SH3GL2 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "SMAD3", "weight": "0.001444", "id": "SH3GL2 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "HIF1A", "weight": "0.0005092", "id": "SH3GL2 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SH3GL2", "target": "RAC1", "weight": "0.0004814", "id": "SH3GL2 with RAC1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "ADRB2", "weight": "0.000717", "id": "GNA15 with ADRB2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "PRKCA", "weight": "2.188e-05", "id": "GNA15 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "TGFB3", "weight": "0.001444", "id": "GNA15 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "PSMB8", "weight": "0.0007222", "id": "GNA15 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "PRKCA", "weight": "1.613e-05", "id": "GNA15 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "ADRA2C", "weight": "0.01032", "id": "GNA15 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "KCNMA1", "weight": "0.002407", "id": "GNA15 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "ADRB1", "weight": "0.01606", "id": "GNA15 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "ADRB2", "weight": "0.0002643", "id": "GNA15 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "PRICKLE1", "weight": "0.001805", "id": "GNA15 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "INS", "weight": "0.0004814", "id": "GNA15 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "NOS3", "weight": "0.001177", "id": "GNA15 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "MYLK", "weight": "0.001444", "id": "GNA15 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "AVP", "weight": "0.0009041", "id": "GNA15 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "TNF", "weight": "0.001653", "id": "GNA15 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "SH3GL2", "weight": "0.001816", "id": "GNA15 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "RAC1", "weight": "0.0004814", "id": "GNA15 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "HIF1A", "weight": "0.0005092", "id": "GNA15 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "AKT1", "weight": "2.454e-06", "id": "GNA15 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "PIK3CG", "weight": "0.000489", "id": "GNA15 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "PLN", "weight": "0.003611", "id": "GNA15 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "CH25H", "weight": "0.001444", "id": "GNA15 with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "TGFB2", "weight": "0.001444", "id": "GNA15 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "BCHE", "weight": "0.001444", "id": "GNA15 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "AGTR1", "weight": "0.001126", "id": "GNA15 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "PRKAG2", "weight": "0.0009642", "id": "GNA15 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "TGFBR2", "weight": "0.001444", "id": "GNA15 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "PRKACA", "weight": "2.651e-05", "id": "GNA15 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "TGFB1", "weight": "6.765e-06", "id": "GNA15 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "PRKG1", "weight": "0.000977", "id": "GNA15 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "ATP2A2", "weight": "0.001284", "id": "GNA15 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "TGFBR1", "weight": "0.001444", "id": "GNA15 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "GNA15", "target": "SMAD3", "weight": "0.001444", "id": "GNA15 with SMAD3"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "PRKACA", "weight": "0.0001079", "id": "PLN with PRKACA"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "ATP2A2", "weight": "0.005224", "id": "PLN with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "ADRB2", "weight": "0.0002643", "id": "PLN with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "INS", "weight": "0.0007222", "id": "PLN with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "KCNK13", "weight": "0.002407", "id": "PLN with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "ADRA2C", "weight": "0.01548", "id": "PLN with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "PIK3CG", "weight": "0.0007336", "id": "PLN with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "ADRB1", "weight": "0.01606", "id": "PLN with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "GNA15", "weight": "0.003632", "id": "PLN with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "KCNMA1", "weight": "0.003611", "id": "PLN with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "PRKCA", "weight": "1.613e-05", "id": "PLN with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "TGFB3", "weight": "0.001444", "id": "PLN with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "PSMB8", "weight": "0.0004333", "id": "PLN with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "AKT1", "weight": "2.454e-06", "id": "PLN with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "TGFBR1", "weight": "0.0009629", "id": "PLN with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "HIF1A", "weight": "0.001018", "id": "PLN with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "RAC1", "weight": "0.0007222", "id": "PLN with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "ATP2A2", "weight": "0.001284", "id": "PLN with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "TNF", "weight": "0.001653", "id": "PLN with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "TBC1D4", "weight": "0.003611", "id": "PLN with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "NOS3", "weight": "0.001177", "id": "PLN with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "MYLK", "weight": "0.001444", "id": "PLN with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "CLIC2", "weight": "0.009802", "id": "PLN with CLIC2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "AVP", "weight": "0.0004068", "id": "PLN with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "PRKG1", "weight": "0.001466", "id": "PLN with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "TGFB1", "weight": "6.765e-06", "id": "PLN with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "TGFB2", "weight": "0.001444", "id": "PLN with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "AGTR1", "weight": "0.001126", "id": "PLN with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PLN", "target": "PRKACA", "weight": "2.651e-05", "id": "PLN with PRKACA"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "KCNK13", "weight": "0.007324", "id": "KCNMA1 with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "RAC1", "weight": "0.0007222", "id": "KCNMA1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "INS", "weight": "0.0007222", "id": "KCNMA1 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "ADRB2", "weight": "0.0002643", "id": "KCNMA1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "GNA15", "weight": "0.002422", "id": "KCNMA1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "ADRB1", "weight": "0.01606", "id": "KCNMA1 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "PLN", "weight": "0.003611", "id": "KCNMA1 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "KCNK13", "weight": "0.002407", "id": "KCNMA1 with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "ATP2A2", "weight": "0.001284", "id": "KCNMA1 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "PIK3CG", "weight": "0.0007336", "id": "KCNMA1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "ADRA2C", "weight": "0.01548", "id": "KCNMA1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "AVP", "weight": "0.0006781", "id": "KCNMA1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "PRKG1", "weight": "0.001466", "id": "KCNMA1 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "TGFB1", "weight": "4.51e-06", "id": "KCNMA1 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "NOS3", "weight": "0.001177", "id": "KCNMA1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "MYLK", "weight": "0.001444", "id": "KCNMA1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "PRKCA", "weight": "1.613e-05", "id": "KCNMA1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "AGTR1", "weight": "0.001126", "id": "KCNMA1 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "BCHE", "weight": "0.001805", "id": "KCNMA1 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "PRKACA", "weight": "2.651e-05", "id": "KCNMA1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "AKT1", "weight": "2.454e-06", "id": "KCNMA1 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "TGFB2", "weight": "0.0009629", "id": "KCNMA1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNMA1", "target": "TGFB3", "weight": "0.0009629", "id": "KCNMA1 with TGFB3"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TGFB1", "weight": "1.835e-05", "id": "TGFB2 with TGFB1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TGFBR1", "weight": "0.003918", "id": "TGFB2 with TGFBR1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TGFBR2", "weight": "0.005877", "id": "TGFB2 with TGFBR2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TGFB3", "weight": "0.003918", "id": "TGFB2 with TGFB3"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "RAC1", "weight": "0.001465", "id": "TGFB2 with RAC1"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "AVP", "weight": "0.002751", "id": "TGFB2 with AVP"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TGFB1", "weight": "1.372e-05", "id": "TGFB2 with TGFB1"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TGFB3", "weight": "0.00293", "id": "TGFB2 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "PLN", "weight": "0.003611", "id": "TGFB2 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "ADRB1", "weight": "0.01606", "id": "TGFB2 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "GNA15", "weight": "0.003632", "id": "TGFB2 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "KCNMA1", "weight": "0.002407", "id": "TGFB2 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "ADRA2C", "weight": "0.01032", "id": "TGFB2 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "PIK3CG", "weight": "0.0007336", "id": "TGFB2 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "INS", "weight": "0.0007222", "id": "TGFB2 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "ADRB2", "weight": "0.0002643", "id": "TGFB2 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "AKT1", "weight": "2.454e-06", "id": "TGFB2 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TGFB3", "weight": "0.001444", "id": "TGFB2 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "PRKCA", "weight": "1.613e-05", "id": "TGFB2 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TNF", "weight": "0.001653", "id": "TGFB2 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "ATP2A2", "weight": "0.001284", "id": "TGFB2 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "SMAD3", "weight": "0.001444", "id": "TGFB2 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "HIF1A", "weight": "0.001018", "id": "TGFB2 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "RAC1", "weight": "0.0007222", "id": "TGFB2 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "SH3GL2", "weight": "0.003632", "id": "TGFB2 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TGFBR1", "weight": "0.001444", "id": "TGFB2 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "PRKACA", "weight": "2.651e-05", "id": "TGFB2 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TGFBR2", "weight": "0.001444", "id": "TGFB2 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "AGTR1", "weight": "0.001126", "id": "TGFB2 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "PRKAG2", "weight": "0.001446", "id": "TGFB2 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "PRKG1", "weight": "0.000977", "id": "TGFB2 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "TGFB1", "weight": "6.765e-06", "id": "TGFB2 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB2", "target": "NOS3", "weight": "0.001177", "id": "TGFB2 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "PSMB8", "weight": "0.0007703", "id": "BCHE with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "AKT1", "weight": "9.815e-07", "id": "BCHE with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "PRKCA", "weight": "8.064e-06", "id": "BCHE with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "GNA15", "weight": "0.001453", "id": "BCHE with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "KCNMA1", "weight": "0.001805", "id": "BCHE with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "ADAMTS12", "weight": "0.001926", "id": "BCHE with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "KCNK13", "weight": "0.001805", "id": "BCHE with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "PIK3CG", "weight": "0.0003668", "id": "BCHE with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "ADRA2C", "weight": "0.008257", "id": "BCHE with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "INS", "weight": "0.0006018", "id": "BCHE with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "CH25H", "weight": "0.001444", "id": "BCHE with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "ADRB2", "weight": "0.000141", "id": "BCHE with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "PRKAG2", "weight": "0.0005785", "id": "BCHE with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "PRKACA", "weight": "1.326e-05", "id": "BCHE with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "OTUD7A", "weight": "0.001926", "id": "BCHE with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "TGFBR2", "weight": "0.0007703", "id": "BCHE with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "USP3", "weight": "0.001926", "id": "BCHE with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "TGFB1", "weight": "3.608e-06", "id": "BCHE with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "NOS3", "weight": "0.000471", "id": "BCHE with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "HIF1A", "weight": "0.0005432", "id": "BCHE with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "SMAD3", "weight": "0.0007703", "id": "BCHE with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "BCHE", "target": "TGFBR1", "weight": "0.0007703", "id": "BCHE with TGFBR1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "TGFBR1", "weight": "0.003918", "id": "TGFB3 with TGFBR1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "TGFBR2", "weight": "0.003918", "id": "TGFB3 with TGFBR2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "TGFB2", "weight": "0.003918", "id": "TGFB3 with TGFB2"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "TGFB2", "weight": "0.00293", "id": "TGFB3 with TGFB2"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "AVP", "weight": "0.002751", "id": "TGFB3 with AVP"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "RAC1", "weight": "0.001465", "id": "TGFB3 with RAC1"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "TGFB1", "weight": "1.372e-05", "id": "TGFB3 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "KCNMA1", "weight": "0.002407", "id": "TGFB3 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "ADRB1", "weight": "0.01606", "id": "TGFB3 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "GNA15", "weight": "0.003632", "id": "TGFB3 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "PLN", "weight": "0.003611", "id": "TGFB3 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "ADRA2C", "weight": "0.01032", "id": "TGFB3 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "PIK3CG", "weight": "0.0007336", "id": "TGFB3 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "INS", "weight": "0.0007222", "id": "TGFB3 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "ADRB2", "weight": "0.0002643", "id": "TGFB3 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "AKT1", "weight": "2.454e-06", "id": "TGFB3 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "PRKCA", "weight": "1.613e-05", "id": "TGFB3 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "ATP2A2", "weight": "0.001284", "id": "TGFB3 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "TNF", "weight": "0.001653", "id": "TGFB3 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "RAC1", "weight": "0.0007222", "id": "TGFB3 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "HIF1A", "weight": "0.001018", "id": "TGFB3 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "SMAD3", "weight": "0.001444", "id": "TGFB3 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "TGFBR1", "weight": "0.001444", "id": "TGFB3 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "SH3GL2", "weight": "0.003632", "id": "TGFB3 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "AGTR1", "weight": "0.001126", "id": "TGFB3 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "PRKAG2", "weight": "0.001446", "id": "TGFB3 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "TGFBR2", "weight": "0.001444", "id": "TGFB3 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "PRKACA", "weight": "2.651e-05", "id": "TGFB3 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "TGFB2", "weight": "0.001444", "id": "TGFB3 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "TGFB1", "weight": "6.765e-06", "id": "TGFB3 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "PRKG1", "weight": "0.000977", "id": "TGFB3 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB3", "target": "NOS3", "weight": "0.001177", "id": "TGFB3 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "PRKCA", "weight": "1.613e-05", "id": "PRICKLE1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "AKT1", "weight": "1.636e-06", "id": "PRICKLE1 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "PSMB8", "weight": "0.001204", "id": "PRICKLE1 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "ADRB2", "weight": "0.0001322", "id": "PRICKLE1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "INS", "weight": "0.0003611", "id": "PRICKLE1 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "PIK3CG", "weight": "0.0003668", "id": "PRICKLE1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "ADRA2C", "weight": "0.007741", "id": "PRICKLE1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "GNA15", "weight": "0.001816", "id": "PRICKLE1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "ADRB1", "weight": "0.008029", "id": "PRICKLE1 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "MYLK", "weight": "0.0007222", "id": "PRICKLE1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "NOS3", "weight": "0.0005887", "id": "PRICKLE1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "TGFB1", "weight": "3.383e-06", "id": "PRICKLE1 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "PRKG1", "weight": "0.000977", "id": "PRICKLE1 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "AVP", "weight": "0.0006781", "id": "PRICKLE1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "TGFBR2", "weight": "0.0007222", "id": "PRICKLE1 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "PRKACA", "weight": "2.651e-05", "id": "PRICKLE1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "AGTR1", "weight": "0.000563", "id": "PRICKLE1 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "PRKAG2", "weight": "0.0007232", "id": "PRICKLE1 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "TGFBR1", "weight": "0.0007222", "id": "PRICKLE1 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "SH3GL2", "weight": "0.001816", "id": "PRICKLE1 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "SMAD3", "weight": "0.001444", "id": "PRICKLE1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "RAC1", "weight": "0.0007222", "id": "PRICKLE1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "HIF1A", "weight": "0.0005092", "id": "PRICKLE1 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "TNF", "weight": "0.0008265", "id": "PRICKLE1 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRICKLE1", "target": "ATP2A2", "weight": "0.0006419", "id": "PRICKLE1 with ATP2A2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "MYLK", "weight": "0.001959", "id": "PRKCA with MYLK"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "RAC1", "weight": "0.001959", "id": "PRKCA with RAC1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "PRKG1", "weight": "0.005964", "id": "PRKCA with PRKG1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "GNA15", "weight": "0.004927", "id": "PRKCA with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "MYLK", "weight": "0.001444", "id": "PRKCA with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "NOS3", "weight": "0.001177", "id": "PRKCA with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "AVP", "weight": "0.001356", "id": "PRKCA with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "SH3GL2", "weight": "0.001937", "id": "PRKCA with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "RAC1", "weight": "0.0007222", "id": "PRKCA with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "HIF1A", "weight": "0.001018", "id": "PRKCA with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "TNF", "weight": "0.001653", "id": "PRKCA with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "TGFB3", "weight": "0.001444", "id": "PRKCA with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "PSMB8", "weight": "0.0009629", "id": "PRKCA with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "PRICKLE1", "weight": "0.003611", "id": "PRKCA with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "ADRB2", "weight": "0.0002643", "id": "PRKCA with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "INS", "weight": "0.0007222", "id": "PRKCA with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "ADRA2C", "weight": "0.0129", "id": "PRKCA with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "KCNK13", "weight": "0.001805", "id": "PRKCA with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "KCNMA1", "weight": "0.003611", "id": "PRKCA with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "ADRB1", "weight": "0.01606", "id": "PRKCA with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "TGFB1", "weight": "6.765e-06", "id": "PRKCA with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "KIAA1598", "weight": "0.001937", "id": "PRKCA with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "PRKG1", "weight": "0.001466", "id": "PRKCA with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "TGFB2", "weight": "0.001444", "id": "PRKCA with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "TGFBR2", "weight": "0.001444", "id": "PRKCA with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "PRKACA", "weight": "2.651e-05", "id": "PRKCA with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "BCHE", "weight": "0.001805", "id": "PRKCA with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "AGTR1", "weight": "0.001126", "id": "PRKCA with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "PRKAG2", "weight": "0.001446", "id": "PRKCA with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "TGFBR1", "weight": "0.001444", "id": "PRKCA with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "SMAD3", "weight": "0.001444", "id": "PRKCA with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "ATP2A2", "weight": "0.001284", "id": "PRKCA with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "TBC1D4", "weight": "0.003611", "id": "PRKCA with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "AKT1", "weight": "2.454e-06", "id": "PRKCA with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "CH25H", "weight": "0.001444", "id": "PRKCA with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "PIK3CG", "weight": "0.0007336", "id": "PRKCA with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "PLN", "weight": "0.003611", "id": "PRKCA with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "PARVA", "weight": "0.003611", "id": "PRKCA with PARVA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKCA", "target": "GNA15", "weight": "0.003632", "id": "PRKCA with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "TGFB1", "weight": "6.765e-06", "id": "TNF with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "PRKG1", "weight": "0.000977", "id": "TNF with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "KIAA1598", "weight": "0.001937", "id": "TNF with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "TGFB2", "weight": "0.001444", "id": "TNF with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "PRKAG2", "weight": "0.001446", "id": "TNF with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "AGTR1", "weight": "0.001126", "id": "TNF with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "TGFBR2", "weight": "0.001444", "id": "TNF with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "PRKACA", "weight": "2.651e-05", "id": "TNF with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "TGFBR1", "weight": "0.001444", "id": "TNF with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "SMAD3", "weight": "0.001444", "id": "TNF with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "ATP2A2", "weight": "0.001284", "id": "TNF with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "TBC1D4", "weight": "0.003611", "id": "TNF with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "AKT1", "weight": "2.454e-06", "id": "TNF with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "PIK3CG", "weight": "0.0007336", "id": "TNF with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "GNA15", "weight": "0.003632", "id": "TNF with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "PLN", "weight": "0.003611", "id": "TNF with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "NOS3", "weight": "0.001177", "id": "TNF with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "MYLK", "weight": "0.0009629", "id": "TNF with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "AVP", "weight": "0.0009041", "id": "TNF with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "SH3GL2", "weight": "0.001937", "id": "TNF with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "RAC1", "weight": "0.0007222", "id": "TNF with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "HIF1A", "weight": "0.001018", "id": "TNF with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "PRKCA", "weight": "1.613e-05", "id": "TNF with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "TGFB3", "weight": "0.001444", "id": "TNF with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "PSMB8", "weight": "0.0009629", "id": "TNF with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "ADRB2", "weight": "0.0001322", "id": "TNF with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "PRICKLE1", "weight": "0.001805", "id": "TNF with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "INS", "weight": "0.0007222", "id": "TNF with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "ADRA2C", "weight": "0.007741", "id": "TNF with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TNF", "target": "ADRB1", "weight": "0.01606", "id": "TNF with ADRB1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "PRKCA", "weight": "4.375e-05", "id": "RAC1 with PRKCA"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "AKT1", "weight": "9.985e-06", "id": "RAC1 with AKT1"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "TGFB1", "weight": "1.372e-05", "id": "RAC1 with TGFB1"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "AVP", "weight": "0.002751", "id": "RAC1 with AVP"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "TGFB3", "weight": "0.00293", "id": "RAC1 with TGFB3"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "TGFB2", "weight": "0.00293", "id": "RAC1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "AKT1", "weight": "2.454e-06", "id": "RAC1 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "ADAMTS12", "weight": "0.001444", "id": "RAC1 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "PLN", "weight": "0.003611", "id": "RAC1 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "PARVA", "weight": "0.003611", "id": "RAC1 with PARVA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "GNA15", "weight": "0.002422", "id": "RAC1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "PIK3CG", "weight": "0.0007336", "id": "RAC1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "TGFB1", "weight": "6.765e-06", "id": "RAC1 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "KIAA1598", "weight": "0.002422", "id": "RAC1 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "PRKG1", "weight": "0.000977", "id": "RAC1 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "TGFBR2", "weight": "0.001444", "id": "RAC1 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "PRKACA", "weight": "2.651e-05", "id": "RAC1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "PRKAG2", "weight": "0.001446", "id": "RAC1 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "AGTR1", "weight": "0.001126", "id": "RAC1 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "TGFB2", "weight": "0.001444", "id": "RAC1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "SMAD3", "weight": "0.001444", "id": "RAC1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "TGFBR1", "weight": "0.001444", "id": "RAC1 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "TBC1D4", "weight": "0.003009", "id": "RAC1 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "ATP2A2", "weight": "0.001284", "id": "RAC1 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "PRKCA", "weight": "1.613e-05", "id": "RAC1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "PSMB8", "weight": "0.001204", "id": "RAC1 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "TGFB3", "weight": "0.001444", "id": "RAC1 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "INS", "weight": "0.0007222", "id": "RAC1 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "PRICKLE1", "weight": "0.003611", "id": "RAC1 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "ADRB2", "weight": "0.0002643", "id": "RAC1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "KCNMA1", "weight": "0.003611", "id": "RAC1 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "ADRB1", "weight": "0.01606", "id": "RAC1 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "ADRA2C", "weight": "0.01032", "id": "RAC1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "AVP", "weight": "0.0009041", "id": "RAC1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "MYLK", "weight": "0.001444", "id": "RAC1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "NOS3", "weight": "0.001177", "id": "RAC1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "HIF1A", "weight": "0.001018", "id": "RAC1 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "SH3GL2", "weight": "0.002422", "id": "RAC1 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "RAC1", "target": "TNF", "weight": "0.001653", "id": "RAC1 with TNF"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "KCNK13", "target": "KCNMA1", "weight": "0.007324", "id": "KCNK13 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNK13", "target": "MYLK", "weight": "0.0007703", "id": "KCNK13 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNK13", "target": "CLIC2", "weight": "0.007841", "id": "KCNK13 with CLIC2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNK13", "target": "PRKCA", "weight": "8.064e-06", "id": "KCNK13 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNK13", "target": "PLN", "weight": "0.002407", "id": "KCNK13 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNK13", "target": "PRKACA", "weight": "1.768e-05", "id": "KCNK13 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNK13", "target": "KCNMA1", "weight": "0.002407", "id": "KCNK13 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNK13", "target": "BCHE", "weight": "0.001805", "id": "KCNK13 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KCNK13", "target": "ATP2A2", "weight": "0.0008558", "id": "KCNK13 with ATP2A2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "PLN", "weight": "0.01469", "id": "ATP2A2 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "PSMB8", "weight": "0.0007222", "id": "ATP2A2 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "AKT1", "weight": "2.454e-06", "id": "ATP2A2 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "TGFB3", "weight": "0.001444", "id": "ATP2A2 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "PRKCA", "weight": "1.613e-05", "id": "ATP2A2 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "KCNMA1", "weight": "0.003611", "id": "ATP2A2 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "GNA15", "weight": "0.003632", "id": "ATP2A2 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "ADRB1", "weight": "0.01606", "id": "ATP2A2 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "PLN", "weight": "0.003611", "id": "ATP2A2 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "KCNK13", "weight": "0.002407", "id": "ATP2A2 with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "PIK3CG", "weight": "0.0007336", "id": "ATP2A2 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "ADRA2C", "weight": "0.01548", "id": "ATP2A2 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "INS", "weight": "0.0007222", "id": "ATP2A2 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "ADRB2", "weight": "0.0002643", "id": "ATP2A2 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "PRICKLE1", "weight": "0.001805", "id": "ATP2A2 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "PRKAG2", "weight": "0.001446", "id": "ATP2A2 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "AGTR1", "weight": "0.001126", "id": "ATP2A2 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "TGFBR2", "weight": "0.0007222", "id": "ATP2A2 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "PRKACA", "weight": "2.651e-05", "id": "ATP2A2 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "TGFB2", "weight": "0.001444", "id": "ATP2A2 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "AVP", "weight": "0.0006781", "id": "ATP2A2 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "TGFB1", "weight": "6.765e-06", "id": "ATP2A2 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "PRKG1", "weight": "0.001466", "id": "ATP2A2 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "NOS3", "weight": "0.001177", "id": "ATP2A2 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "CLIC2", "weight": "0.009802", "id": "ATP2A2 with CLIC2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "MYLK", "weight": "0.001444", "id": "ATP2A2 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "TBC1D4", "weight": "0.003611", "id": "ATP2A2 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "TNF", "weight": "0.001653", "id": "ATP2A2 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "RAC1", "weight": "0.0007222", "id": "ATP2A2 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "HIF1A", "weight": "0.001018", "id": "ATP2A2 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "SMAD3", "weight": "0.0007222", "id": "ATP2A2 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "TGFBR1", "weight": "0.0007222", "id": "ATP2A2 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ATP2A2", "target": "SH3GL2", "weight": "0.001816", "id": "ATP2A2 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "TGFB1", "weight": "3.608e-06", "id": "ADAMTS12 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "AVP", "weight": "0.0005425", "id": "ADAMTS12 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "USP3", "weight": "0.001926", "id": "ADAMTS12 with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "PSMB8", "weight": "0.0007703", "id": "ADAMTS12 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "AKT1", "weight": "9.815e-07", "id": "ADAMTS12 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "TGFBR2", "weight": "0.0007703", "id": "ADAMTS12 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "OTUD7A", "weight": "0.001926", "id": "ADAMTS12 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "BCHE", "weight": "0.001926", "id": "ADAMTS12 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "SMAD3", "weight": "0.0007703", "id": "ADAMTS12 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "HIF1A", "weight": "0.0005432", "id": "ADAMTS12 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "RAC1", "weight": "0.0002889", "id": "ADAMTS12 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "INS", "weight": "0.0003852", "id": "ADAMTS12 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "SH3GL2", "weight": "0.001453", "id": "ADAMTS12 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "TGFBR1", "weight": "0.0007703", "id": "ADAMTS12 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "ADRB2", "weight": "0.000141", "id": "ADAMTS12 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADAMTS12", "target": "ADRA2C", "weight": "0.008257", "id": "ADAMTS12 with ADRA2C"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "PLN", "weight": "0.01469", "id": "PRKACA with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "TGFB2", "weight": "0.001444", "id": "PRKACA with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "PRKAG2", "weight": "0.001446", "id": "PRKACA with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "AGTR1", "weight": "0.001126", "id": "PRKACA with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "BCHE", "weight": "0.001805", "id": "PRKACA with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "TGFBR2", "weight": "0.001444", "id": "PRKACA with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "CLIC2", "weight": "0.009802", "id": "PRKACA with CLIC2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "PRKG1", "weight": "0.001466", "id": "PRKACA with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "KIAA1598", "weight": "0.001937", "id": "PRKACA with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "TGFB1", "weight": "6.765e-06", "id": "PRKACA with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "ATP2A2", "weight": "0.001284", "id": "PRKACA with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "TBC1D4", "weight": "0.003611", "id": "PRKACA with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "TGFBR1", "weight": "0.001444", "id": "PRKACA with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "SMAD3", "weight": "0.001444", "id": "PRKACA with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "AKT1", "weight": "2.454e-06", "id": "PRKACA with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "PIK3CG", "weight": "0.0007336", "id": "PRKACA with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "GNA15", "weight": "0.003632", "id": "PRKACA with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "PLN", "weight": "0.003611", "id": "PRKACA with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "CH25H", "weight": "0.001444", "id": "PRKACA with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "NOS3", "weight": "0.001177", "id": "PRKACA with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "MYLK", "weight": "0.001444", "id": "PRKACA with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "AVP", "weight": "0.001356", "id": "PRKACA with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "TNF", "weight": "0.001653", "id": "PRKACA with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "SH3GL2", "weight": "0.002422", "id": "PRKACA with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "HIF1A", "weight": "0.001018", "id": "PRKACA with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "RAC1", "weight": "0.0007222", "id": "PRKACA with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "TGFB3", "weight": "0.001444", "id": "PRKACA with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "PSMB8", "weight": "0.001204", "id": "PRKACA with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "PRKCA", "weight": "1.613e-05", "id": "PRKACA with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "KCNK13", "weight": "0.002407", "id": "PRKACA with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "ADRA2C", "weight": "0.01032", "id": "PRKACA with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "ADRB1", "weight": "0.01606", "id": "PRKACA with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "KCNMA1", "weight": "0.003611", "id": "PRKACA with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "ADRB2", "weight": "0.0002643", "id": "PRKACA with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "PRICKLE1", "weight": "0.003611", "id": "PRKACA with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKACA", "target": "INS", "weight": "0.0007222", "id": "PRKACA with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "PLN", "weight": "0.003611", "id": "TBC1D4 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "TNF", "weight": "0.001653", "id": "TBC1D4 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "ATP2A2", "weight": "0.001284", "id": "TBC1D4 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "PIK3CG", "weight": "0.000489", "id": "TBC1D4 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "HIF1A", "weight": "0.001018", "id": "TBC1D4 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "RAC1", "weight": "0.0006018", "id": "TBC1D4 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "INS", "weight": "0.0007222", "id": "TBC1D4 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "SH3GL2", "weight": "0.002422", "id": "TBC1D4 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "ADRB2", "weight": "0.0001762", "id": "TBC1D4 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "PRKACA", "weight": "2.651e-05", "id": "TBC1D4 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "AKT1", "weight": "2.454e-06", "id": "TBC1D4 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "AGTR1", "weight": "0.0007507", "id": "TBC1D4 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "PRKAG2", "weight": "0.001446", "id": "TBC1D4 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "AVP", "weight": "0.0009041", "id": "TBC1D4 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "PRKCA", "weight": "1.613e-05", "id": "TBC1D4 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TBC1D4", "target": "NOS3", "weight": "0.001177", "id": "TBC1D4 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "ADRA2C", "weight": "0.008257", "id": "USP3 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "ADAMTS12", "weight": "0.001926", "id": "USP3 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "OTUD7A", "weight": "0.002407", "id": "USP3 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "TGFBR2", "weight": "0.0009629", "id": "USP3 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "PSMB8", "weight": "0.001204", "id": "USP3 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "BCHE", "weight": "0.001926", "id": "USP3 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "TGFBR1", "weight": "0.001204", "id": "USP3 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "ADRB2", "weight": "0.0002203", "id": "USP3 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "SMAD3", "weight": "0.001204", "id": "USP3 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "TGFB1", "weight": "4.51e-06", "id": "USP3 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "HIF1A", "weight": "0.0008487", "id": "USP3 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "USP3", "target": "INS", "weight": "0.0003852", "id": "USP3 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "NOS3", "weight": "0.000471", "id": "CH25H with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "PRKCA", "weight": "6.451e-06", "id": "CH25H with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "PRKAG2", "weight": "0.0005785", "id": "CH25H with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "BCHE", "weight": "0.001444", "id": "CH25H with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "PRKACA", "weight": "1.061e-05", "id": "CH25H with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "AKT1", "weight": "9.815e-07", "id": "CH25H with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "PSMB8", "weight": "0.0005777", "id": "CH25H with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "INS", "weight": "0.0002889", "id": "CH25H with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "GNA15", "weight": "0.001453", "id": "CH25H with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "ADRA2C", "weight": "0.006193", "id": "CH25H with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CH25H", "target": "PIK3CG", "weight": "0.0002934", "id": "CH25H with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "TGFBR1", "weight": "0.0009629", "id": "OTUD7A with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "ADRB2", "weight": "0.0001762", "id": "OTUD7A with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "SMAD3", "weight": "0.0009629", "id": "OTUD7A with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "TGFB1", "weight": "4.51e-06", "id": "OTUD7A with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "HIF1A", "weight": "0.000679", "id": "OTUD7A with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "INS", "weight": "0.0003852", "id": "OTUD7A with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "USP3", "weight": "0.002407", "id": "OTUD7A with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "ADRA2C", "weight": "0.008257", "id": "OTUD7A with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "ADAMTS12", "weight": "0.001926", "id": "OTUD7A with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "TGFBR2", "weight": "0.0009629", "id": "OTUD7A with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "PSMB8", "weight": "0.0009629", "id": "OTUD7A with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "OTUD7A", "target": "BCHE", "weight": "0.001926", "id": "OTUD7A with BCHE"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "TGFBR1", "weight": "0.003918", "id": "TGFB1 with TGFBR1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "TGFBR2", "weight": "0.003918", "id": "TGFB1 with TGFBR2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "TGFB2", "weight": "0.003918", "id": "TGFB1 with TGFB2"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "RAC1", "weight": "0.001465", "id": "TGFB1 with RAC1"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "AVP", "weight": "0.002751", "id": "TGFB1 with AVP"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "TGFB3", "weight": "0.00293", "id": "TGFB1 with TGFB3"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "TGFB2", "weight": "0.00293", "id": "TGFB1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "TGFBR1", "weight": "0.001444", "id": "TGFB1 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "SMAD3", "weight": "0.001444", "id": "TGFB1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "ATP2A2", "weight": "0.001284", "id": "TGFB1 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "USP3", "weight": "0.002407", "id": "TGFB1 with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "KIAA1598", "weight": "0.001937", "id": "TGFB1 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "PRKG1", "weight": "0.000977", "id": "TGFB1 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "TGFB2", "weight": "0.001444", "id": "TGFB1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "AGTR1", "weight": "0.001126", "id": "TGFB1 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "PRKAG2", "weight": "0.001446", "id": "TGFB1 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "BCHE", "weight": "0.001926", "id": "TGFB1 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "PRKACA", "weight": "2.651e-05", "id": "TGFB1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "TGFBR2", "weight": "0.001444", "id": "TGFB1 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "OTUD7A", "weight": "0.002407", "id": "TGFB1 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "PIK3CG", "weight": "0.0007336", "id": "TGFB1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "GNA15", "weight": "0.003632", "id": "TGFB1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "ADAMTS12", "weight": "0.001926", "id": "TGFB1 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "PLN", "weight": "0.003611", "id": "TGFB1 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "PARVA", "weight": "0.002407", "id": "TGFB1 with PARVA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "AKT1", "weight": "2.454e-06", "id": "TGFB1 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "SH3GL2", "weight": "0.003632", "id": "TGFB1 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "HIF1A", "weight": "0.001018", "id": "TGFB1 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "RAC1", "weight": "0.0007222", "id": "TGFB1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "TNF", "weight": "0.001653", "id": "TGFB1 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "NOS3", "weight": "0.001177", "id": "TGFB1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "MYLK", "weight": "0.0009629", "id": "TGFB1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "AVP", "weight": "0.0006781", "id": "TGFB1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "PRICKLE1", "weight": "0.001805", "id": "TGFB1 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "ADRB2", "weight": "0.0002643", "id": "TGFB1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "INS", "weight": "0.0007222", "id": "TGFB1 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "ADRA2C", "weight": "0.01032", "id": "TGFB1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "ADRB1", "weight": "0.01606", "id": "TGFB1 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "KCNMA1", "weight": "0.002407", "id": "TGFB1 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "PRKCA", "weight": "1.613e-05", "id": "TGFB1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "TGFB3", "weight": "0.001444", "id": "TGFB1 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFB1", "target": "PSMB8", "weight": "0.001204", "id": "TGFB1 with PSMB8"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "AR", "target": "SMAD3", "weight": "0.005877", "id": "AR with SMAD3"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "AR", "target": "HIF1A", "weight": "0.002763", "id": "AR with HIF1A"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "AR", "target": "AKT1", "weight": "9.985e-06", "id": "AR with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "INS", "weight": "0.0007222", "id": "AR with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "ADRB2", "weight": "0.0002203", "id": "AR with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "PRICKLE1", "weight": "0.001805", "id": "AR with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "GNA15", "weight": "0.001816", "id": "AR with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "ADRB1", "weight": "0.008029", "id": "AR with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "PLN", "weight": "0.002407", "id": "AR with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "ADAMTS12", "weight": "0.001926", "id": "AR with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "PIK3CG", "weight": "0.0003668", "id": "AR with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "ADRA2C", "weight": "0.008257", "id": "AR with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "PRKCA", "weight": "1.344e-05", "id": "AR with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "PSMB8", "weight": "0.001204", "id": "AR with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "AKT1", "weight": "2.454e-06", "id": "AR with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "TGFB3", "weight": "0.001204", "id": "AR with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "RAC1", "weight": "0.0006018", "id": "AR with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "HIF1A", "weight": "0.0008487", "id": "AR with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "SMAD3", "weight": "0.001204", "id": "AR with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "TGFBR1", "weight": "0.001204", "id": "AR with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "SH3GL2", "weight": "0.001816", "id": "AR with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "ATP2A2", "weight": "0.0006419", "id": "AR with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "TNF", "weight": "0.001102", "id": "AR with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "USP3", "weight": "0.003009", "id": "AR with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "AVP", "weight": "0.0009041", "id": "AR with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "TGFB1", "weight": "5.638e-06", "id": "AR with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "PRKG1", "weight": "0.0007328", "id": "AR with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "NOS3", "weight": "0.0005887", "id": "AR with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "MYLK", "weight": "0.0009629", "id": "AR with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "BCHE", "weight": "0.001926", "id": "AR with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "PRKAG2", "weight": "0.0009642", "id": "AR with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "AGTR1", "weight": "0.0009383", "id": "AR with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "OTUD7A", "weight": "0.002407", "id": "AR with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "TGFBR2", "weight": "0.001204", "id": "AR with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "PRKACA", "weight": "2.651e-05", "id": "AR with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AR", "target": "TGFB2", "weight": "0.001204", "id": "AR with TGFB2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "AKT1", "weight": "3.328e-06", "id": "NOS3 with AKT1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "AGTR1", "weight": "0.001527", "id": "NOS3 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "ATP2A2", "weight": "0.001284", "id": "NOS3 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "TBC1D4", "weight": "0.003611", "id": "NOS3 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "TGFBR1", "weight": "0.001444", "id": "NOS3 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "SMAD3", "weight": "0.001444", "id": "NOS3 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "TGFB2", "weight": "0.001444", "id": "NOS3 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "BCHE", "weight": "0.001444", "id": "NOS3 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "AGTR1", "weight": "0.001126", "id": "NOS3 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "PRKAG2", "weight": "0.001446", "id": "NOS3 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "TGFBR2", "weight": "0.001444", "id": "NOS3 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "PRKACA", "weight": "2.651e-05", "id": "NOS3 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "TGFB1", "weight": "6.765e-06", "id": "NOS3 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "PRKG1", "weight": "0.001466", "id": "NOS3 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "PIK3CG", "weight": "0.0007336", "id": "NOS3 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "GNA15", "weight": "0.003632", "id": "NOS3 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "PLN", "weight": "0.003611", "id": "NOS3 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "CH25H", "weight": "0.001444", "id": "NOS3 with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "AKT1", "weight": "2.454e-06", "id": "NOS3 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "TNF", "weight": "0.001653", "id": "NOS3 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "SH3GL2", "weight": "0.001816", "id": "NOS3 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "RAC1", "weight": "0.0007222", "id": "NOS3 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "HIF1A", "weight": "0.001018", "id": "NOS3 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "MYLK", "weight": "0.001444", "id": "NOS3 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "AVP", "weight": "0.0006781", "id": "NOS3 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "ADRA2C", "weight": "0.01548", "id": "NOS3 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "KCNMA1", "weight": "0.003611", "id": "NOS3 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "ADRB1", "weight": "0.01606", "id": "NOS3 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "ADRB2", "weight": "0.0002643", "id": "NOS3 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "PRICKLE1", "weight": "0.001805", "id": "NOS3 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "INS", "weight": "0.0007222", "id": "NOS3 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "TGFB3", "weight": "0.001444", "id": "NOS3 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "PSMB8", "weight": "0.0007222", "id": "NOS3 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "NOS3", "target": "PRKCA", "weight": "1.613e-05", "id": "NOS3 with PRKCA"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "TGFB1", "weight": "1.835e-05", "id": "TGFBR1 with TGFB1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "TGFBR2", "weight": "0.004898", "id": "TGFBR1 with TGFBR2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "TGFB2", "weight": "0.003918", "id": "TGFBR1 with TGFB2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "TGFB3", "weight": "0.003918", "id": "TGFBR1 with TGFB3"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "SMAD3", "weight": "0.003918", "id": "TGFBR1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "ATP2A2", "weight": "0.0006419", "id": "TGFBR1 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "TNF", "weight": "0.001653", "id": "TGFBR1 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "SMAD3", "weight": "0.001444", "id": "TGFBR1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "HIF1A", "weight": "0.001018", "id": "TGFBR1 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "RAC1", "weight": "0.0007222", "id": "TGFBR1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "SH3GL2", "weight": "0.003632", "id": "TGFBR1 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "PRKACA", "weight": "2.651e-05", "id": "TGFBR1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "OTUD7A", "weight": "0.002407", "id": "TGFBR1 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "TGFBR2", "weight": "0.001444", "id": "TGFBR1 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "AGTR1", "weight": "0.001126", "id": "TGFBR1 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "PRKAG2", "weight": "0.001446", "id": "TGFBR1 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "BCHE", "weight": "0.001926", "id": "TGFBR1 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "TGFB2", "weight": "0.001444", "id": "TGFBR1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "PRKG1", "weight": "0.000977", "id": "TGFBR1 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "TGFB1", "weight": "6.765e-06", "id": "TGFBR1 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "USP3", "weight": "0.003009", "id": "TGFBR1 with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "AVP", "weight": "0.0006781", "id": "TGFBR1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "MYLK", "weight": "0.001444", "id": "TGFBR1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "NOS3", "weight": "0.001177", "id": "TGFBR1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "PLN", "weight": "0.002407", "id": "TGFBR1 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "ADAMTS12", "weight": "0.001926", "id": "TGFBR1 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "GNA15", "weight": "0.003632", "id": "TGFBR1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "ADRB1", "weight": "0.01606", "id": "TGFBR1 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "PIK3CG", "weight": "0.0007336", "id": "TGFBR1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "ADRA2C", "weight": "0.008257", "id": "TGFBR1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "INS", "weight": "0.0007222", "id": "TGFBR1 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "ADRB2", "weight": "0.0002643", "id": "TGFBR1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "PRICKLE1", "weight": "0.001805", "id": "TGFBR1 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "PSMB8", "weight": "0.001204", "id": "TGFBR1 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "AKT1", "weight": "2.454e-06", "id": "TGFBR1 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "TGFB3", "weight": "0.001444", "id": "TGFBR1 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR1", "target": "PRKCA", "weight": "1.613e-05", "id": "TGFBR1 with PRKCA"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "TGFBR1", "weight": "0.003918", "id": "SMAD3 with TGFBR1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "TGFBR2", "weight": "0.001959", "id": "SMAD3 with TGFBR2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "AKT1", "weight": "6.657e-06", "id": "SMAD3 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "MYLK", "weight": "0.001444", "id": "SMAD3 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "NOS3", "weight": "0.001177", "id": "SMAD3 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "AVP", "weight": "0.0006781", "id": "SMAD3 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "SH3GL2", "weight": "0.003632", "id": "SMAD3 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "RAC1", "weight": "0.0007222", "id": "SMAD3 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "HIF1A", "weight": "0.001018", "id": "SMAD3 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "TNF", "weight": "0.001653", "id": "SMAD3 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "PRKCA", "weight": "1.613e-05", "id": "SMAD3 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "TGFB3", "weight": "0.001444", "id": "SMAD3 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "PSMB8", "weight": "0.001204", "id": "SMAD3 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "PRICKLE1", "weight": "0.003611", "id": "SMAD3 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "ADRB2", "weight": "0.0002643", "id": "SMAD3 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "INS", "weight": "0.0007222", "id": "SMAD3 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "ADRA2C", "weight": "0.008257", "id": "SMAD3 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "ADRB1", "weight": "0.01606", "id": "SMAD3 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "TGFB1", "weight": "6.765e-06", "id": "SMAD3 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "KIAA1598", "weight": "0.001937", "id": "SMAD3 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "PRKG1", "weight": "0.0007328", "id": "SMAD3 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "USP3", "weight": "0.003009", "id": "SMAD3 with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "TGFB2", "weight": "0.001444", "id": "SMAD3 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "TGFBR2", "weight": "0.001444", "id": "SMAD3 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "OTUD7A", "weight": "0.002407", "id": "SMAD3 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "PRKACA", "weight": "2.651e-05", "id": "SMAD3 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "BCHE", "weight": "0.001926", "id": "SMAD3 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "PRKAG2", "weight": "0.001446", "id": "SMAD3 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "AGTR1", "weight": "0.001126", "id": "SMAD3 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "TGFBR1", "weight": "0.001444", "id": "SMAD3 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "ATP2A2", "weight": "0.0006419", "id": "SMAD3 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "AKT1", "weight": "2.454e-06", "id": "SMAD3 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "PIK3CG", "weight": "0.0007336", "id": "SMAD3 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "ADAMTS12", "weight": "0.001926", "id": "SMAD3 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "SMAD3", "target": "GNA15", "weight": "0.003632", "id": "SMAD3 with GNA15"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "SMAD3", "weight": "0.005877", "id": "MAPK1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "BCHE", "weight": "0.001805", "id": "MAPK1 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "AGTR1", "weight": "0.001126", "id": "MAPK1 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "PRKAG2", "weight": "0.001446", "id": "MAPK1 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "TGFBR2", "weight": "0.001444", "id": "MAPK1 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "PRKACA", "weight": "2.651e-05", "id": "MAPK1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "TGFB2", "weight": "0.001444", "id": "MAPK1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "TGFB1", "weight": "6.765e-06", "id": "MAPK1 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "KIAA1598", "weight": "0.003027", "id": "MAPK1 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "PRKG1", "weight": "0.001466", "id": "MAPK1 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "TBC1D4", "weight": "0.003611", "id": "MAPK1 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "ATP2A2", "weight": "0.001284", "id": "MAPK1 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "SMAD3", "weight": "0.001444", "id": "MAPK1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "TGFBR1", "weight": "0.001444", "id": "MAPK1 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "AKT1", "weight": "2.454e-06", "id": "MAPK1 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "GNA15", "weight": "0.003632", "id": "MAPK1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "ADAMTS12", "weight": "0.001444", "id": "MAPK1 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "PLN", "weight": "0.003611", "id": "MAPK1 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "PARVA", "weight": "0.003611", "id": "MAPK1 with PARVA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "PIK3CG", "weight": "0.0007336", "id": "MAPK1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "AVP", "weight": "0.001356", "id": "MAPK1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "NOS3", "weight": "0.001177", "id": "MAPK1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "MYLK", "weight": "0.001444", "id": "MAPK1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "TNF", "weight": "0.001653", "id": "MAPK1 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "RAC1", "weight": "0.0007222", "id": "MAPK1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "HIF1A", "weight": "0.001018", "id": "MAPK1 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "SH3GL2", "weight": "0.003027", "id": "MAPK1 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "PSMB8", "weight": "0.0009629", "id": "MAPK1 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "TGFB3", "weight": "0.001444", "id": "MAPK1 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "PRKCA", "weight": "1.613e-05", "id": "MAPK1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "KCNMA1", "weight": "0.003611", "id": "MAPK1 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "ADRB1", "weight": "0.01606", "id": "MAPK1 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "KCNK13", "weight": "0.001805", "id": "MAPK1 with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "ADRA2C", "weight": "0.01548", "id": "MAPK1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "INS", "weight": "0.0007222", "id": "MAPK1 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "PRICKLE1", "weight": "0.001805", "id": "MAPK1 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK1", "target": "ADRB2", "weight": "0.0002643", "id": "MAPK1 with ADRB2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "SMAD3", "weight": "0.003918", "id": "AKT1 with SMAD3"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "NOS3", "weight": "0.001597", "id": "AKT1 with NOS3"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "RAC1", "weight": "0.002939", "id": "AKT1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "TGFB2", "weight": "0.001444", "id": "AKT1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "PRKAG2", "weight": "0.001446", "id": "AKT1 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "AGTR1", "weight": "0.001126", "id": "AKT1 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "BCHE", "weight": "0.001444", "id": "AKT1 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "PRKACA", "weight": "2.651e-05", "id": "AKT1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "TGFBR2", "weight": "0.001444", "id": "AKT1 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "PRKG1", "weight": "0.001466", "id": "AKT1 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "KIAA1598", "weight": "0.001937", "id": "AKT1 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "TGFB1", "weight": "6.765e-06", "id": "AKT1 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "ATP2A2", "weight": "0.001284", "id": "AKT1 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "TBC1D4", "weight": "0.003611", "id": "AKT1 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "TGFBR1", "weight": "0.001444", "id": "AKT1 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "SMAD3", "weight": "0.001444", "id": "AKT1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "PIK3CG", "weight": "0.0007336", "id": "AKT1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "GNA15", "weight": "0.003632", "id": "AKT1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "PARVA", "weight": "0.003611", "id": "AKT1 with PARVA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "ADAMTS12", "weight": "0.001444", "id": "AKT1 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "PLN", "weight": "0.003611", "id": "AKT1 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "CH25H", "weight": "0.001444", "id": "AKT1 with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "NOS3", "weight": "0.001177", "id": "AKT1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "MYLK", "weight": "0.001444", "id": "AKT1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "AVP", "weight": "0.001356", "id": "AKT1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "TNF", "weight": "0.001653", "id": "AKT1 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "SH3GL2", "weight": "0.002422", "id": "AKT1 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "HIF1A", "weight": "0.001018", "id": "AKT1 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "RAC1", "weight": "0.0007222", "id": "AKT1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "TGFB3", "weight": "0.001444", "id": "AKT1 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "PSMB8", "weight": "0.0009629", "id": "AKT1 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "PRKCA", "weight": "1.613e-05", "id": "AKT1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "ADRA2C", "weight": "0.01548", "id": "AKT1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "ADRB1", "weight": "0.01606", "id": "AKT1 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "KCNMA1", "weight": "0.003611", "id": "AKT1 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "ADRB2", "weight": "0.0002643", "id": "AKT1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "PRICKLE1", "weight": "0.002407", "id": "AKT1 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AKT1", "target": "INS", "weight": "0.0007222", "id": "AKT1 with INS"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "PRKCA", "weight": "2.188e-05", "id": "MYLK with PRKCA"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "LRIG3", "weight": "0.007324", "id": "MYLK with LRIG3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "TGFBR2", "weight": "0.0007222", "id": "MYLK with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "PRKACA", "weight": "2.651e-05", "id": "MYLK with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "AGTR1", "weight": "0.001126", "id": "MYLK with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "PRKAG2", "weight": "0.001446", "id": "MYLK with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "TGFB1", "weight": "4.51e-06", "id": "MYLK with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "PRKG1", "weight": "0.001466", "id": "MYLK with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "AVP", "weight": "0.0006781", "id": "MYLK with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "CLIC2", "weight": "0.006273", "id": "MYLK with CLIC2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "NOS3", "weight": "0.001177", "id": "MYLK with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "ATP2A2", "weight": "0.001284", "id": "MYLK with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "TNF", "weight": "0.001102", "id": "MYLK with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "SMAD3", "weight": "0.001444", "id": "MYLK with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "RAC1", "weight": "0.0007222", "id": "MYLK with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "HIF1A", "weight": "0.0005092", "id": "MYLK with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "TGFBR1", "weight": "0.001444", "id": "MYLK with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "SH3GL2", "weight": "0.001816", "id": "MYLK with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "AKT1", "weight": "2.454e-06", "id": "MYLK with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "PSMB8", "weight": "0.0007222", "id": "MYLK with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "PRKCA", "weight": "1.613e-05", "id": "MYLK with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "PLN", "weight": "0.003611", "id": "MYLK with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "PARVA", "weight": "0.003611", "id": "MYLK with PARVA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "KCNMA1", "weight": "0.003611", "id": "MYLK with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "ADRB1", "weight": "0.01606", "id": "MYLK with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "GNA15", "weight": "0.003632", "id": "MYLK with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "ADRA2C", "weight": "0.01548", "id": "MYLK with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "PIK3CG", "weight": "0.0007336", "id": "MYLK with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "KCNK13", "weight": "0.001926", "id": "MYLK with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "INS", "weight": "0.0007222", "id": "MYLK with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "PRICKLE1", "weight": "0.001805", "id": "MYLK with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MYLK", "target": "ADRB2", "weight": "0.0002643", "id": "MYLK with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "NOS3", "weight": "0.001177", "id": "PRKAG2 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "MYLK", "weight": "0.001444", "id": "PRKAG2 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "AVP", "weight": "0.0009041", "id": "PRKAG2 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "SH3GL2", "weight": "0.002422", "id": "PRKAG2 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "HIF1A", "weight": "0.000679", "id": "PRKAG2 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "RAC1", "weight": "0.0007222", "id": "PRKAG2 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "TNF", "weight": "0.001653", "id": "PRKAG2 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "PRKCA", "weight": "1.613e-05", "id": "PRKAG2 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "TGFB3", "weight": "0.001444", "id": "PRKAG2 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "PSMB8", "weight": "0.0009629", "id": "PRKAG2 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "ADRB2", "weight": "0.0001762", "id": "PRKAG2 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "PRICKLE1", "weight": "0.001805", "id": "PRKAG2 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "INS", "weight": "0.0007222", "id": "PRKAG2 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "ADRA2C", "weight": "0.01032", "id": "PRKAG2 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "ADRB1", "weight": "0.008029", "id": "PRKAG2 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "PRKG1", "weight": "0.0007328", "id": "PRKAG2 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "TGFB1", "weight": "6.765e-06", "id": "PRKAG2 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "TGFB2", "weight": "0.001444", "id": "PRKAG2 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "AGTR1", "weight": "0.001126", "id": "PRKAG2 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "BCHE", "weight": "0.001444", "id": "PRKAG2 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "PRKACA", "weight": "2.651e-05", "id": "PRKAG2 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "TGFBR2", "weight": "0.001444", "id": "PRKAG2 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "TGFBR1", "weight": "0.001444", "id": "PRKAG2 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "SMAD3", "weight": "0.001444", "id": "PRKAG2 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "ATP2A2", "weight": "0.001284", "id": "PRKAG2 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "TBC1D4", "weight": "0.003611", "id": "PRKAG2 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "AKT1", "weight": "2.454e-06", "id": "PRKAG2 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "CH25H", "weight": "0.001444", "id": "PRKAG2 with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "PIK3CG", "weight": "0.0007336", "id": "PRKAG2 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKAG2", "target": "GNA15", "weight": "0.002422", "id": "PRKAG2 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "ADRB1", "weight": "0.01606", "id": "INS with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "KCNMA1", "weight": "0.003611", "id": "INS with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "ADRA2C", "weight": "0.01548", "id": "INS with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "ADRB2", "weight": "0.0002643", "id": "INS with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "PRICKLE1", "weight": "0.001805", "id": "INS with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "PSMB8", "weight": "0.0009629", "id": "INS with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "TGFB3", "weight": "0.001444", "id": "INS with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "PRKCA", "weight": "1.613e-05", "id": "INS with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "TNF", "weight": "0.001653", "id": "INS with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "HIF1A", "weight": "0.001018", "id": "INS with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "RAC1", "weight": "0.0007222", "id": "INS with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "SH3GL2", "weight": "0.002422", "id": "INS with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "AVP", "weight": "0.001356", "id": "INS with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "MYLK", "weight": "0.001444", "id": "INS with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "NOS3", "weight": "0.001177", "id": "INS with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "PLN", "weight": "0.003611", "id": "INS with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "ADAMTS12", "weight": "0.001926", "id": "INS with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "GNA15", "weight": "0.002422", "id": "INS with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "PIK3CG", "weight": "0.0007336", "id": "INS with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "CH25H", "weight": "0.001444", "id": "INS with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "AKT1", "weight": "2.454e-06", "id": "INS with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "TBC1D4", "weight": "0.003611", "id": "INS with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "ATP2A2", "weight": "0.001284", "id": "INS with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "SMAD3", "weight": "0.001444", "id": "INS with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "TGFBR1", "weight": "0.001444", "id": "INS with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "PRKACA", "weight": "2.651e-05", "id": "INS with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "OTUD7A", "weight": "0.001926", "id": "INS with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "TGFBR2", "weight": "0.001444", "id": "INS with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "PRKAG2", "weight": "0.001446", "id": "INS with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "AGTR1", "weight": "0.001126", "id": "INS with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "BCHE", "weight": "0.003009", "id": "INS with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "TGFB2", "weight": "0.001444", "id": "INS with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "PRKG1", "weight": "0.001466", "id": "INS with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "KIAA1598", "weight": "0.001937", "id": "INS with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "TGFB1", "weight": "6.765e-06", "id": "INS with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "INS", "target": "USP3", "weight": "0.001926", "id": "INS with USP3"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "TGFB1", "weight": "1.835e-05", "id": "TGFBR2 with TGFB1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "TGFBR1", "weight": "0.004898", "id": "TGFBR2 with TGFBR1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "TGFB2", "weight": "0.005877", "id": "TGFBR2 with TGFB2"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "TGFB3", "weight": "0.003918", "id": "TGFBR2 with TGFB3"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "SMAD3", "weight": "0.001959", "id": "TGFBR2 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "ATP2A2", "weight": "0.0006419", "id": "TGFBR2 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "TNF", "weight": "0.001653", "id": "TGFBR2 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "TGFBR1", "weight": "0.001444", "id": "TGFBR2 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "SH3GL2", "weight": "0.003632", "id": "TGFBR2 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "RAC1", "weight": "0.0007222", "id": "TGFBR2 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "HIF1A", "weight": "0.001018", "id": "TGFBR2 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "SMAD3", "weight": "0.001444", "id": "TGFBR2 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "TGFB2", "weight": "0.001444", "id": "TGFBR2 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "BCHE", "weight": "0.001926", "id": "TGFBR2 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "AGTR1", "weight": "0.001126", "id": "TGFBR2 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "PRKAG2", "weight": "0.001446", "id": "TGFBR2 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "OTUD7A", "weight": "0.002407", "id": "TGFBR2 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "PRKACA", "weight": "2.651e-05", "id": "TGFBR2 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "NOS3", "weight": "0.001177", "id": "TGFBR2 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "MYLK", "weight": "0.0007222", "id": "TGFBR2 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "USP3", "weight": "0.002407", "id": "TGFBR2 with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "AVP", "weight": "0.0006781", "id": "TGFBR2 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "TGFB1", "weight": "6.765e-06", "id": "TGFBR2 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "PRKG1", "weight": "0.0007328", "id": "TGFBR2 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "PIK3CG", "weight": "0.0003668", "id": "TGFBR2 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "ADRA2C", "weight": "0.008257", "id": "TGFBR2 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "GNA15", "weight": "0.003632", "id": "TGFBR2 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "ADRB1", "weight": "0.01606", "id": "TGFBR2 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "ADAMTS12", "weight": "0.001926", "id": "TGFBR2 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "ADRB2", "weight": "0.0002643", "id": "TGFBR2 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "PRICKLE1", "weight": "0.001805", "id": "TGFBR2 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "INS", "weight": "0.0007222", "id": "TGFBR2 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "TGFB3", "weight": "0.001444", "id": "TGFBR2 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "PSMB8", "weight": "0.001204", "id": "TGFBR2 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "AKT1", "weight": "2.454e-06", "id": "TGFBR2 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "TGFBR2", "target": "PRKCA", "weight": "1.613e-05", "id": "TGFBR2 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KIAA1598", "target": "PRKCA", "weight": "8.601e-06", "id": "KIAA1598 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KIAA1598", "target": "SH3GL2", "weight": "0.003027", "id": "KIAA1598 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KIAA1598", "target": "SMAD3", "weight": "0.0007703", "id": "KIAA1598 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KIAA1598", "target": "TGFB1", "weight": "3.608e-06", "id": "KIAA1598 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KIAA1598", "target": "INS", "weight": "0.0003852", "id": "KIAA1598 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KIAA1598", "target": "RAC1", "weight": "0.0004814", "id": "KIAA1598 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KIAA1598", "target": "TNF", "weight": "0.0008816", "id": "KIAA1598 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KIAA1598", "target": "AKT1", "weight": "1.309e-06", "id": "KIAA1598 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KIAA1598", "target": "PSMB8", "weight": "0.0007703", "id": "KIAA1598 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "KIAA1598", "target": "PRKACA", "weight": "1.414e-05", "id": "KIAA1598 with PRKACA"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "ADRB1", "weight": "0.04356", "id": "ADRA2A with ADRB1"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "ADRA2C", "weight": "0.0314", "id": "ADRA2A with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "CH25H", "weight": "0.001444", "id": "ADRA2A with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "GNA15", "weight": "0.002422", "id": "ADRA2A with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "PLN", "weight": "0.003611", "id": "ADRA2A with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "ADAMTS12", "weight": "0.001926", "id": "ADRA2A with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "PIK3CG", "weight": "0.0007336", "id": "ADRA2A with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "AKT1", "weight": "2.454e-06", "id": "ADRA2A with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "SMAD3", "weight": "0.0007703", "id": "ADRA2A with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "TGFBR1", "weight": "0.0007703", "id": "ADRA2A with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "ATP2A2", "weight": "0.001284", "id": "ADRA2A with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "USP3", "weight": "0.001926", "id": "ADRA2A with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "PRKG1", "weight": "0.001466", "id": "ADRA2A with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "TGFB1", "weight": "4.51e-06", "id": "ADRA2A with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "AGTR1", "weight": "0.001126", "id": "ADRA2A with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "PRKAG2", "weight": "0.0009642", "id": "ADRA2A with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "BCHE", "weight": "0.001926", "id": "ADRA2A with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "PRKACA", "weight": "1.768e-05", "id": "ADRA2A with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "OTUD7A", "weight": "0.001926", "id": "ADRA2A with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "TGFBR2", "weight": "0.0007703", "id": "ADRA2A with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "TGFB2", "weight": "0.0009629", "id": "ADRA2A with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "INS", "weight": "0.0007222", "id": "ADRA2A with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "PRICKLE1", "weight": "0.001805", "id": "ADRA2A with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "ADRB2", "weight": "0.0002643", "id": "ADRA2A with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "ADRB1", "weight": "0.01606", "id": "ADRA2A with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "KCNMA1", "weight": "0.003611", "id": "ADRA2A with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "ADRA2C", "weight": "0.01548", "id": "ADRA2A with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "PRKCA", "weight": "1.344e-05", "id": "ADRA2A with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "PSMB8", "weight": "0.0007703", "id": "ADRA2A with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "TGFB3", "weight": "0.0009629", "id": "ADRA2A with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "HIF1A", "weight": "0.0005432", "id": "ADRA2A with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "RAC1", "weight": "0.0004814", "id": "ADRA2A with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "SH3GL2", "weight": "0.001816", "id": "ADRA2A with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "TNF", "weight": "0.0008265", "id": "ADRA2A with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "AVP", "weight": "0.0009041", "id": "ADRA2A with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "NOS3", "weight": "0.001177", "id": "ADRA2A with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRA2A", "target": "MYLK", "weight": "0.001444", "id": "ADRA2A with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PARVA", "target": "RAC1", "weight": "0.0007222", "id": "PARVA with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PARVA", "target": "TGFB1", "weight": "4.51e-06", "id": "PARVA with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PARVA", "target": "MYLK", "weight": "0.001444", "id": "PARVA with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PARVA", "target": "PRKCA", "weight": "1.613e-05", "id": "PARVA with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PARVA", "target": "AKT1", "weight": "2.454e-06", "id": "PARVA with AKT1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "GNA15", "weight": "0.009854", "id": "ADRB2 with GNA15"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "ADRB1", "weight": "0.03257", "id": "ADRB2 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "BCHE", "weight": "0.001926", "id": "ADRB2 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "PRKAG2", "weight": "0.0009642", "id": "ADRB2 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "AGTR1", "weight": "0.001126", "id": "ADRB2 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "OTUD7A", "weight": "0.002407", "id": "ADRB2 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "TGFBR2", "weight": "0.001444", "id": "ADRB2 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "PRKACA", "weight": "2.651e-05", "id": "ADRB2 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "TGFB2", "weight": "0.001444", "id": "ADRB2 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "USP3", "weight": "0.003009", "id": "ADRB2 with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "AVP", "weight": "0.00113", "id": "ADRB2 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "TGFB1", "weight": "6.765e-06", "id": "ADRB2 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "PRKG1", "weight": "0.001466", "id": "ADRB2 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "NOS3", "weight": "0.001177", "id": "ADRB2 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "MYLK", "weight": "0.001444", "id": "ADRB2 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "TBC1D4", "weight": "0.002407", "id": "ADRB2 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "ATP2A2", "weight": "0.001284", "id": "ADRB2 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "TNF", "weight": "0.0008265", "id": "ADRB2 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "RAC1", "weight": "0.0007222", "id": "ADRB2 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "HIF1A", "weight": "0.0008487", "id": "ADRB2 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "SMAD3", "weight": "0.001444", "id": "ADRB2 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "TGFBR1", "weight": "0.001444", "id": "ADRB2 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "SH3GL2", "weight": "0.003632", "id": "ADRB2 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "PSMB8", "weight": "0.001204", "id": "ADRB2 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "AKT1", "weight": "2.454e-06", "id": "ADRB2 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "TGFB3", "weight": "0.001444", "id": "ADRB2 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "PRKCA", "weight": "1.613e-05", "id": "ADRB2 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "KCNMA1", "weight": "0.003611", "id": "ADRB2 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "GNA15", "weight": "0.003632", "id": "ADRB2 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "ADRB1", "weight": "0.01606", "id": "ADRB2 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "PLN", "weight": "0.003611", "id": "ADRB2 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "ADAMTS12", "weight": "0.001926", "id": "ADRB2 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "PIK3CG", "weight": "0.0007336", "id": "ADRB2 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "ADRA2C", "weight": "0.01548", "id": "ADRB2 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "INS", "weight": "0.0007222", "id": "ADRB2 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "ADRB2", "target": "PRICKLE1", "weight": "0.001805", "id": "ADRB2 with PRICKLE1"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "NOS3", "weight": "0.001597", "id": "AGTR1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "INS", "weight": "0.0007222", "id": "AGTR1 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "ADRB2", "weight": "0.0002643", "id": "AGTR1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "PRICKLE1", "weight": "0.001805", "id": "AGTR1 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "GNA15", "weight": "0.003632", "id": "AGTR1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "ADRB1", "weight": "0.01606", "id": "AGTR1 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "KCNMA1", "weight": "0.003611", "id": "AGTR1 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "PLN", "weight": "0.003611", "id": "AGTR1 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "PIK3CG", "weight": "0.0007336", "id": "AGTR1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "ADRA2C", "weight": "0.01548", "id": "AGTR1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "PRKCA", "weight": "1.613e-05", "id": "AGTR1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "PSMB8", "weight": "0.0007222", "id": "AGTR1 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "AKT1", "weight": "2.454e-06", "id": "AGTR1 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "TGFB3", "weight": "0.001444", "id": "AGTR1 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "HIF1A", "weight": "0.0008487", "id": "AGTR1 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "RAC1", "weight": "0.0007222", "id": "AGTR1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "SMAD3", "weight": "0.001444", "id": "AGTR1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "SH3GL2", "weight": "0.003027", "id": "AGTR1 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "TGFBR1", "weight": "0.001444", "id": "AGTR1 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "TBC1D4", "weight": "0.002407", "id": "AGTR1 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "TNF", "weight": "0.001653", "id": "AGTR1 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "ATP2A2", "weight": "0.001284", "id": "AGTR1 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "AVP", "weight": "0.001356", "id": "AGTR1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "PRKG1", "weight": "0.001466", "id": "AGTR1 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "TGFB1", "weight": "6.765e-06", "id": "AGTR1 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "NOS3", "weight": "0.001177", "id": "AGTR1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "MYLK", "weight": "0.001444", "id": "AGTR1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "PRKAG2", "weight": "0.001446", "id": "AGTR1 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "PRKACA", "weight": "2.651e-05", "id": "AGTR1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "TGFBR2", "weight": "0.001444", "id": "AGTR1 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AGTR1", "target": "TGFB2", "weight": "0.001444", "id": "AGTR1 with TGFB2"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "TGFB2", "weight": "0.00293", "id": "AVP with TGFB2"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "TGFB3", "weight": "0.00293", "id": "AVP with TGFB3"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "TGFB1", "weight": "1.372e-05", "id": "AVP with TGFB1"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "RAC1", "weight": "0.001465", "id": "AVP with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "TBC1D4", "weight": "0.002407", "id": "AVP with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "ATP2A2", "weight": "0.0006419", "id": "AVP with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "TNF", "weight": "0.001102", "id": "AVP with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "HIF1A", "weight": "0.0008487", "id": "AVP with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "RAC1", "weight": "0.0004814", "id": "AVP with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "SMAD3", "weight": "0.0007222", "id": "AVP with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "SH3GL2", "weight": "0.003027", "id": "AVP with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "TGFBR1", "weight": "0.0007222", "id": "AVP with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "AGTR1", "weight": "0.001126", "id": "AVP with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "PRKAG2", "weight": "0.0009642", "id": "AVP with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "PRKACA", "weight": "2.651e-05", "id": "AVP with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "TGFBR2", "weight": "0.0007222", "id": "AVP with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "PRKG1", "weight": "0.0007328", "id": "AVP with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "TGFB1", "weight": "3.383e-06", "id": "AVP with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "NOS3", "weight": "0.0005887", "id": "AVP with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "MYLK", "weight": "0.0007222", "id": "AVP with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "CLIC2", "weight": "0.003529", "id": "AVP with CLIC2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "ADRB1", "weight": "0.01338", "id": "AVP with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "GNA15", "weight": "0.002422", "id": "AVP with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "KCNMA1", "weight": "0.001805", "id": "AVP with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "ADAMTS12", "weight": "0.001444", "id": "AVP with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "PLN", "weight": "0.001083", "id": "AVP with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "ADRA2C", "weight": "0.01032", "id": "AVP with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "PIK3CG", "weight": "0.0007336", "id": "AVP with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "INS", "weight": "0.0007222", "id": "AVP with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "ADRB2", "weight": "0.0002203", "id": "AVP with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "PRICKLE1", "weight": "0.001805", "id": "AVP with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "PSMB8", "weight": "0.0007222", "id": "AVP with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "AKT1", "weight": "2.454e-06", "id": "AVP with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "AVP", "target": "PRKCA", "weight": "1.613e-05", "id": "AVP with PRKCA"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "MYLK", "weight": "0.001959", "id": "MAPK3 with MYLK"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "HIF1A", "weight": "0.004144", "id": "MAPK3 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "AVP", "weight": "0.001356", "id": "MAPK3 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "MYLK", "weight": "0.001444", "id": "MAPK3 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "NOS3", "weight": "0.001177", "id": "MAPK3 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "RAC1", "weight": "0.0007222", "id": "MAPK3 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "HIF1A", "weight": "0.001018", "id": "MAPK3 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "SH3GL2", "weight": "0.002422", "id": "MAPK3 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "TNF", "weight": "0.001653", "id": "MAPK3 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "PRKCA", "weight": "1.613e-05", "id": "MAPK3 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "PSMB8", "weight": "0.0009629", "id": "MAPK3 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "TGFB3", "weight": "0.001444", "id": "MAPK3 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "INS", "weight": "0.0007222", "id": "MAPK3 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "PRICKLE1", "weight": "0.001805", "id": "MAPK3 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "ADRB2", "weight": "0.0002643", "id": "MAPK3 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "KCNMA1", "weight": "0.003611", "id": "MAPK3 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "ADRB1", "weight": "0.01606", "id": "MAPK3 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "ADRA2C", "weight": "0.01548", "id": "MAPK3 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "TGFB1", "weight": "6.765e-06", "id": "MAPK3 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "KIAA1598", "weight": "0.002422", "id": "MAPK3 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "PRKG1", "weight": "0.001466", "id": "MAPK3 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "TGFBR2", "weight": "0.001444", "id": "MAPK3 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "PRKACA", "weight": "2.651e-05", "id": "MAPK3 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "AGTR1", "weight": "0.001126", "id": "MAPK3 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "PRKAG2", "weight": "0.001446", "id": "MAPK3 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "TGFB2", "weight": "0.001444", "id": "MAPK3 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "SMAD3", "weight": "0.001444", "id": "MAPK3 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "TGFBR1", "weight": "0.001444", "id": "MAPK3 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "TBC1D4", "weight": "0.003611", "id": "MAPK3 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "ATP2A2", "weight": "0.001284", "id": "MAPK3 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "AKT1", "weight": "2.454e-06", "id": "MAPK3 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "PLN", "weight": "0.003611", "id": "MAPK3 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "ADAMTS12", "weight": "0.001444", "id": "MAPK3 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "PARVA", "weight": "0.003611", "id": "MAPK3 with PARVA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "GNA15", "weight": "0.003632", "id": "MAPK3 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "MAPK3", "target": "PIK3CG", "weight": "0.0007336", "id": "MAPK3 with PIK3CG"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "MYLK", "weight": "0.001959", "id": "CALM1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "TNF", "weight": "0.001653", "id": "CALM1 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "SH3GL2", "weight": "0.002422", "id": "CALM1 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "HIF1A", "weight": "0.000679", "id": "CALM1 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "RAC1", "weight": "0.0007222", "id": "CALM1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "NOS3", "weight": "0.001177", "id": "CALM1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "MYLK", "weight": "0.001444", "id": "CALM1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "AVP", "weight": "0.0009041", "id": "CALM1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "KCNK13", "weight": "0.002407", "id": "CALM1 with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "ADRA2C", "weight": "0.01548", "id": "CALM1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "ADRB1", "weight": "0.01606", "id": "CALM1 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "KCNMA1", "weight": "0.003611", "id": "CALM1 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "ADRB2", "weight": "0.0002643", "id": "CALM1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "PRICKLE1", "weight": "0.002407", "id": "CALM1 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "INS", "weight": "0.0007222", "id": "CALM1 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "TGFB3", "weight": "0.001444", "id": "CALM1 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "PSMB8", "weight": "0.0009629", "id": "CALM1 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "PRKCA", "weight": "1.613e-05", "id": "CALM1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "ATP2A2", "weight": "0.001284", "id": "CALM1 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "TBC1D4", "weight": "0.003009", "id": "CALM1 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "TGFBR1", "weight": "0.001444", "id": "CALM1 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "SMAD3", "weight": "0.001444", "id": "CALM1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "TGFB2", "weight": "0.001444", "id": "CALM1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "AGTR1", "weight": "0.001126", "id": "CALM1 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "PRKAG2", "weight": "0.001446", "id": "CALM1 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "BCHE", "weight": "0.001926", "id": "CALM1 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "PRKACA", "weight": "2.651e-05", "id": "CALM1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "TGFBR2", "weight": "0.0007703", "id": "CALM1 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "OTUD7A", "weight": "0.001926", "id": "CALM1 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "CLIC2", "weight": "0.009802", "id": "CALM1 with CLIC2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "USP3", "weight": "0.001926", "id": "CALM1 with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "PRKG1", "weight": "0.001466", "id": "CALM1 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "KIAA1598", "weight": "0.001937", "id": "CALM1 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "TGFB1", "weight": "6.765e-06", "id": "CALM1 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "PIK3CG", "weight": "0.0007336", "id": "CALM1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "GNA15", "weight": "0.003632", "id": "CALM1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "ADAMTS12", "weight": "0.001926", "id": "CALM1 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "PLN", "weight": "0.003611", "id": "CALM1 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "CH25H", "weight": "0.001444", "id": "CALM1 with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM1", "target": "AKT1", "weight": "2.454e-06", "id": "CALM1 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "TGFB2", "weight": "0.001444", "id": "HIF1A with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "PRKACA", "weight": "2.651e-05", "id": "HIF1A with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "OTUD7A", "weight": "0.002407", "id": "HIF1A with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "TGFBR2", "weight": "0.001444", "id": "HIF1A with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "PRKAG2", "weight": "0.0009642", "id": "HIF1A with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "AGTR1", "weight": "0.0009383", "id": "HIF1A with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "BCHE", "weight": "0.001926", "id": "HIF1A with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "PRKG1", "weight": "0.0007328", "id": "HIF1A with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "TGFB1", "weight": "6.765e-06", "id": "HIF1A with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "USP3", "weight": "0.003009", "id": "HIF1A with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "ATP2A2", "weight": "0.001284", "id": "HIF1A with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "TBC1D4", "weight": "0.003611", "id": "HIF1A with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "TGFBR1", "weight": "0.001444", "id": "HIF1A with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "SMAD3", "weight": "0.001444", "id": "HIF1A with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "AKT1", "weight": "2.454e-06", "id": "HIF1A with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "PIK3CG", "weight": "0.0003668", "id": "HIF1A with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "PLN", "weight": "0.003611", "id": "HIF1A with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "ADAMTS12", "weight": "0.001926", "id": "HIF1A with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "GNA15", "weight": "0.001816", "id": "HIF1A with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "MYLK", "weight": "0.0007222", "id": "HIF1A with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "NOS3", "weight": "0.001177", "id": "HIF1A with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "AVP", "weight": "0.00113", "id": "HIF1A with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "TNF", "weight": "0.001653", "id": "HIF1A with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "SH3GL2", "weight": "0.001816", "id": "HIF1A with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "RAC1", "weight": "0.0007222", "id": "HIF1A with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "TGFB3", "weight": "0.001444", "id": "HIF1A with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "PSMB8", "weight": "0.001204", "id": "HIF1A with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "PRKCA", "weight": "1.613e-05", "id": "HIF1A with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "ADRA2C", "weight": "0.008257", "id": "HIF1A with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "ADRB1", "weight": "0.008029", "id": "HIF1A with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "PRICKLE1", "weight": "0.001805", "id": "HIF1A with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "ADRB2", "weight": "0.0002203", "id": "HIF1A with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "HIF1A", "target": "INS", "weight": "0.0007222", "id": "HIF1A with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "PSMB8", "weight": "0.0009629", "id": "CALM2 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "TGFB3", "weight": "0.001444", "id": "CALM2 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "PRKCA", "weight": "1.613e-05", "id": "CALM2 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "ADRB1", "weight": "0.01606", "id": "CALM2 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "KCNMA1", "weight": "0.003611", "id": "CALM2 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "KCNK13", "weight": "0.002407", "id": "CALM2 with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "ADRA2C", "weight": "0.01548", "id": "CALM2 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "INS", "weight": "0.0007222", "id": "CALM2 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "PRICKLE1", "weight": "0.002407", "id": "CALM2 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "ADRB2", "weight": "0.0002643", "id": "CALM2 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "AVP", "weight": "0.0009041", "id": "CALM2 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "NOS3", "weight": "0.001177", "id": "CALM2 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "MYLK", "weight": "0.001444", "id": "CALM2 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "TNF", "weight": "0.001653", "id": "CALM2 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "HIF1A", "weight": "0.000679", "id": "CALM2 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "RAC1", "weight": "0.0007222", "id": "CALM2 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "SH3GL2", "weight": "0.002422", "id": "CALM2 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "AKT1", "weight": "2.454e-06", "id": "CALM2 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "GNA15", "weight": "0.003632", "id": "CALM2 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "ADAMTS12", "weight": "0.001926", "id": "CALM2 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "PLN", "weight": "0.003611", "id": "CALM2 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "PIK3CG", "weight": "0.0007336", "id": "CALM2 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "CH25H", "weight": "0.001444", "id": "CALM2 with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "AGTR1", "weight": "0.001126", "id": "CALM2 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "PRKAG2", "weight": "0.001446", "id": "CALM2 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "BCHE", "weight": "0.001926", "id": "CALM2 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "PRKACA", "weight": "2.651e-05", "id": "CALM2 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "TGFBR2", "weight": "0.0007703", "id": "CALM2 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "OTUD7A", "weight": "0.001926", "id": "CALM2 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "TGFB2", "weight": "0.001444", "id": "CALM2 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "USP3", "weight": "0.001926", "id": "CALM2 with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "KIAA1598", "weight": "0.001937", "id": "CALM2 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "PRKG1", "weight": "0.001466", "id": "CALM2 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "TGFB1", "weight": "6.765e-06", "id": "CALM2 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "CLIC2", "weight": "0.009802", "id": "CALM2 with CLIC2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "TBC1D4", "weight": "0.003009", "id": "CALM2 with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "ATP2A2", "weight": "0.001284", "id": "CALM2 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "SMAD3", "weight": "0.001444", "id": "CALM2 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM2", "target": "TGFBR1", "weight": "0.001444", "id": "CALM2 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "PRKCA", "weight": "1.613e-05", "id": "CALM3 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "TGFB3", "weight": "0.001444", "id": "CALM3 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "PSMB8", "weight": "0.0009629", "id": "CALM3 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "ADRB2", "weight": "0.0002643", "id": "CALM3 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "PRICKLE1", "weight": "0.002407", "id": "CALM3 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "INS", "weight": "0.0007222", "id": "CALM3 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "KCNK13", "weight": "0.002407", "id": "CALM3 with KCNK13"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "ADRA2C", "weight": "0.01548", "id": "CALM3 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "ADRB1", "weight": "0.01606", "id": "CALM3 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "KCNMA1", "weight": "0.003611", "id": "CALM3 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "NOS3", "weight": "0.001177", "id": "CALM3 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "MYLK", "weight": "0.001444", "id": "CALM3 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "AVP", "weight": "0.0009041", "id": "CALM3 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "SH3GL2", "weight": "0.002422", "id": "CALM3 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "HIF1A", "weight": "0.000679", "id": "CALM3 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "RAC1", "weight": "0.0007222", "id": "CALM3 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "TNF", "weight": "0.001653", "id": "CALM3 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "AKT1", "weight": "2.454e-06", "id": "CALM3 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "CH25H", "weight": "0.001444", "id": "CALM3 with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "PIK3CG", "weight": "0.0007336", "id": "CALM3 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "GNA15", "weight": "0.003632", "id": "CALM3 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "PLN", "weight": "0.003611", "id": "CALM3 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "ADAMTS12", "weight": "0.001926", "id": "CALM3 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "CLIC2", "weight": "0.009802", "id": "CALM3 with CLIC2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "USP3", "weight": "0.001926", "id": "CALM3 with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "PRKG1", "weight": "0.001466", "id": "CALM3 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "KIAA1598", "weight": "0.001937", "id": "CALM3 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "TGFB1", "weight": "6.765e-06", "id": "CALM3 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "TGFB2", "weight": "0.001444", "id": "CALM3 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "AGTR1", "weight": "0.001126", "id": "CALM3 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "PRKAG2", "weight": "0.001446", "id": "CALM3 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "BCHE", "weight": "0.001926", "id": "CALM3 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "PRKACA", "weight": "2.651e-05", "id": "CALM3 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "OTUD7A", "weight": "0.001926", "id": "CALM3 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "TGFBR2", "weight": "0.0007703", "id": "CALM3 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "TGFBR1", "weight": "0.001444", "id": "CALM3 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "SMAD3", "weight": "0.001444", "id": "CALM3 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "ATP2A2", "weight": "0.001284", "id": "CALM3 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "CALM3", "target": "TBC1D4", "weight": "0.003009", "id": "CALM3 with TBC1D4"}
        }, {
          "classes": "GENE_FAMILY gene",
          "group": "edges",
          "data": {"source": "LRIG3", "target": "MYLK", "weight": "0.00293", "id": "LRIG3 with MYLK"}
        }, {
          "classes": "HPRD gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "PRKCA", "weight": "6.563e-05", "id": "PRKG1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "TGFBR1", "weight": "0.0009629", "id": "PRKG1 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "SH3GL2", "weight": "0.002422", "id": "PRKG1 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "RAC1", "weight": "0.0004814", "id": "PRKG1 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "HIF1A", "weight": "0.0005092", "id": "PRKG1 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "SMAD3", "weight": "0.0007222", "id": "PRKG1 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "TNF", "weight": "0.001102", "id": "PRKG1 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "ATP2A2", "weight": "0.001284", "id": "PRKG1 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "NOS3", "weight": "0.001177", "id": "PRKG1 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "MYLK", "weight": "0.001444", "id": "PRKG1 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "AVP", "weight": "0.0006781", "id": "PRKG1 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "TGFB1", "weight": "4.51e-06", "id": "PRKG1 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "TGFB2", "weight": "0.0009629", "id": "PRKG1 with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "PRKAG2", "weight": "0.0007232", "id": "PRKG1 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "AGTR1", "weight": "0.001126", "id": "PRKG1 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "TGFBR2", "weight": "0.0007222", "id": "PRKG1 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "PRKACA", "weight": "2.651e-05", "id": "PRKG1 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "PRICKLE1", "weight": "0.002407", "id": "PRKG1 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "ADRB2", "weight": "0.0002643", "id": "PRKG1 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "INS", "weight": "0.0007222", "id": "PRKG1 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "ADRA2C", "weight": "0.01548", "id": "PRKG1 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "PIK3CG", "weight": "0.0007336", "id": "PRKG1 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "KCNMA1", "weight": "0.003611", "id": "PRKG1 with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "ADRB1", "weight": "0.01606", "id": "PRKG1 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "GNA15", "weight": "0.002422", "id": "PRKG1 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "PLN", "weight": "0.003611", "id": "PRKG1 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "PRKCA", "weight": "1.613e-05", "id": "PRKG1 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "TGFB3", "weight": "0.0009629", "id": "PRKG1 with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "AKT1", "weight": "2.454e-06", "id": "PRKG1 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PRKG1", "target": "PSMB8", "weight": "0.0009629", "id": "PRKG1 with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "ADRB1", "weight": "0.008029", "id": "PSMB8 with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "ADRA2C", "weight": "0.008257", "id": "PSMB8 with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "INS", "weight": "0.0004814", "id": "PSMB8 with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "PRICKLE1", "weight": "0.003009", "id": "PSMB8 with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "ADRB2", "weight": "0.0002203", "id": "PSMB8 with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "PRKCA", "weight": "1.075e-05", "id": "PSMB8 with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "TNF", "weight": "0.001102", "id": "PSMB8 with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "RAC1", "weight": "0.0006018", "id": "PSMB8 with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "HIF1A", "weight": "0.0008487", "id": "PSMB8 with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "SH3GL2", "weight": "0.002422", "id": "PSMB8 with SH3GL2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "AVP", "weight": "0.0006781", "id": "PSMB8 with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "NOS3", "weight": "0.0005887", "id": "PSMB8 with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "MYLK", "weight": "0.0007222", "id": "PSMB8 with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "GNA15", "weight": "0.001816", "id": "PSMB8 with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "ADAMTS12", "weight": "0.001926", "id": "PSMB8 with ADAMTS12"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "PLN", "weight": "0.001083", "id": "PSMB8 with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "PIK3CG", "weight": "0.0003668", "id": "PSMB8 with PIK3CG"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "CH25H", "weight": "0.001444", "id": "PSMB8 with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "AKT1", "weight": "1.636e-06", "id": "PSMB8 with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "ATP2A2", "weight": "0.0006419", "id": "PSMB8 with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "SMAD3", "weight": "0.001204", "id": "PSMB8 with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "TGFBR1", "weight": "0.001204", "id": "PSMB8 with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "BCHE", "weight": "0.001926", "id": "PSMB8 with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "PRKAG2", "weight": "0.0009642", "id": "PSMB8 with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "AGTR1", "weight": "0.000563", "id": "PSMB8 with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "TGFBR2", "weight": "0.001204", "id": "PSMB8 with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "OTUD7A", "weight": "0.002407", "id": "PSMB8 with OTUD7A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "PRKACA", "weight": "2.209e-05", "id": "PSMB8 with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "USP3", "weight": "0.003009", "id": "PSMB8 with USP3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "TGFB1", "weight": "5.638e-06", "id": "PSMB8 with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "KIAA1598", "weight": "0.001937", "id": "PSMB8 with KIAA1598"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "PRKG1", "weight": "0.000977", "id": "PSMB8 with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PSMB8", "target": "CLIC2", "weight": "0.003529", "id": "PSMB8 with CLIC2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "AKT1", "weight": "2.454e-06", "id": "PIK3CG with AKT1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "GNA15", "weight": "0.002422", "id": "PIK3CG with GNA15"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "PLN", "weight": "0.003611", "id": "PIK3CG with PLN"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "CH25H", "weight": "0.001444", "id": "PIK3CG with CH25H"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "PRKAG2", "weight": "0.001446", "id": "PIK3CG with PRKAG2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "AGTR1", "weight": "0.001126", "id": "PIK3CG with AGTR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "BCHE", "weight": "0.001805", "id": "PIK3CG with BCHE"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "PRKACA", "weight": "2.651e-05", "id": "PIK3CG with PRKACA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "TGFBR2", "weight": "0.0007222", "id": "PIK3CG with TGFBR2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "TGFB2", "weight": "0.001444", "id": "PIK3CG with TGFB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "PRKG1", "weight": "0.001466", "id": "PIK3CG with PRKG1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "TGFB1", "weight": "6.765e-06", "id": "PIK3CG with TGFB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "TBC1D4", "weight": "0.002407", "id": "PIK3CG with TBC1D4"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "ATP2A2", "weight": "0.001284", "id": "PIK3CG with ATP2A2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "SMAD3", "weight": "0.001444", "id": "PIK3CG with SMAD3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "TGFBR1", "weight": "0.001444", "id": "PIK3CG with TGFBR1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "PSMB8", "weight": "0.0007222", "id": "PIK3CG with PSMB8"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "TGFB3", "weight": "0.001444", "id": "PIK3CG with TGFB3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "PRKCA", "weight": "1.613e-05", "id": "PIK3CG with PRKCA"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "ADRB1", "weight": "0.01606", "id": "PIK3CG with ADRB1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "KCNMA1", "weight": "0.003611", "id": "PIK3CG with KCNMA1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "ADRA2C", "weight": "0.01548", "id": "PIK3CG with ADRA2C"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "INS", "weight": "0.0007222", "id": "PIK3CG with INS"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "ADRB2", "weight": "0.0002643", "id": "PIK3CG with ADRB2"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "PRICKLE1", "weight": "0.001805", "id": "PIK3CG with PRICKLE1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "AVP", "weight": "0.001356", "id": "PIK3CG with AVP"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "NOS3", "weight": "0.001177", "id": "PIK3CG with NOS3"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "MYLK", "weight": "0.001444", "id": "PIK3CG with MYLK"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "TNF", "weight": "0.001653", "id": "PIK3CG with TNF"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "HIF1A", "weight": "0.0005092", "id": "PIK3CG with HIF1A"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "RAC1", "weight": "0.0007222", "id": "PIK3CG with RAC1"}
        }, {
          "classes": "BIOSYSTEM gene",
          "group": "edges",
          "data": {"source": "PIK3CG", "target": "SH3GL2", "weight": "0.001816", "id": "PIK3CG with SH3GL2"}
        }],
      }
    },
    async mounted() {
      this.renderCytoScape()
    },
    methods: {
      //首页提交按钮事件
      submitSelect() {
      },
      //搜素按钮事件
      selectChange() {
      },
      // model 多选框数据事件
      tableCheck(val) {

      },
      GetDiagnosis() {
      },
      phenotypeGeneRelationship() {
      },

      renderCytoScape() {
        cy = cytoscape({
          container: document.getElementById('networkContainer'),
          style: cytoscape.stylesheet()
            .selector('node')
            .css({
              'content': 'data(id)',
              'text-valign': 'center',
              'font-size': 'mapData(weight, 0, 1, 18px, 22px)',
              'color': 'white',
              'text-outline-width': 'mapData(weight, 0, 0.5, 4px, 3px)',
            })
            .selector('edge')
            .css({
              'target-arrow-shape': 'none',
              'line-color': '#444401',
              'width': '0.5px',
              //'curve-style':'bezier'
            })
            .selector('edge.BIOSYSTEM')
            .css({
              'line-color': "#baba11"

            })
            .selector('edge.HPRD')
            .css({
              'line-color': "mapData(weight,0.2,0.8, #5555ff, #4444dd)"
            })
            .selector('edge.GENE_FAMILY')
            .css({
              'line-color': '#00ef33'
            })
            .selector('edge.HTRI')
            .css({
              'line-color': '#020202',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#1f1f1f'
            })
            .selector('edge.disease_term')
            .css({
              'line-color': "#ef55cc"
            })
            .selector('edge.disease_gene')
            .css({
              'line-color': "#ef55cc"
            })
            .selector(':selected')
            .css({
              'background-color': 'red',
              'line-color': 'red',
              'target-arrow-color': 'red',
              'source-arrow-color': 'red'
            })
            .selector('node.Reported')
            .css({
              'background-color': 'mapData(color_weight,0,1,#0055ff,#003366)',
              'text-outline-color': 'mapData(color_weight,0,1,#0077ff,#007766)',
              'border-width': '0px',
              'width': 'mapData(weight, 0,1, 16, 85)',
              'height': 'mapData(weight, 0,1, 16, 85)',

            })
            .selector('node.Predicted')
            .css({
              'background-color': 'mapData(color_weight,0,1, #bbbb11, #777722)',
              'text-outline-color': 'mapData(color_weight, 0, 1, #bbbb11, #777722)',
              'border-width': '0px',
              'width': 'mapData(weight, 0,1, 16, 85)',
              'height': 'mapData(weight, 0,1, 16, 85)',

            })
            .selector('node.disease')
            .css({
              'text-outline-width': '2px',
              'text-outline-color': 'mapData(weight,0,1,#e033aa,#ea0066)',
              // 'content': '',
              'text-opacity':'0',
              'shape': 'roundrectangle',
              'background-color': 'mapData(weight,0,1,#e033aa,#ea0066)',
              'width': 'mapData(weight, 0, 1, 18, 90)',
              'height': '20',
              'font-size': '10px'
            })
            .selector('node.hiddenNode')
            .css({
              'visibility': 'hidden',

            }).selector('node.hideLabel')
            .css({
              'content': ""
            })
            .selector('node.term')
            .css({
              'text-outline-width': '3px',
              'text-outline-color': '#e02222',
              'background-color': '#e02222',
              'font-size': '30px',
              'shape': 'circle',
              'width': '20px',
              'height': '20px'


            })
            .selector('.highlighted')
            .css({
              'background-color': '#ff0303',
              'line-color': '#ff0303',
              'text-outline-color': '#ff0303',
              'target-arrow-color': '#ff0303',
              'source-arrow-color': '#ff0303',

            })
            .selector('.faded')
            .css({
              'opacity': '0'

            }),
          userZoomingEnabled: true,
          panningEnabled: true,
          userPanningEnabled: true,
          layout: {
            name: 'cose',
            stiffness: 0,
            // maxSimulationTime:500
          },
          zoom: 1,
          minZoom: 1e-50,
          maxZoom: 1e50,
          elements: this.elements,
        });
        cy.panzoom({
          zoomFactor: 0.05, // zoom factor per zoom tick
          zoomDelay: 45, // how many ms between zoom ticks
          minZoom: 0.1, // min zoom level
          maxZoom: 10, // max zoom level
          fitPadding: 50, // padding when fitting
          panSpeed: 10, // how many ms in between pan ticks
          panDistance: 10, // max pan distance per tick
          panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
          panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
          panInactiveArea: 8, // radius of inactive area in pan drag box
          panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
          zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
          fitSelector: undefined, // selector of elements to fit
          animateOnFit: function () { // whether to animate on fit
            return false;
          },
          fitAnimationDuration: 1000, // duration of animation on fit
          // icon class names
          //sliderHandleIcon: 'fa fa-minus',
          sliderHandleIcon: 'ivu-icon ivu-icon-ios-remove',
          zoomInIcon: 'ivu-icon ivu-icon-ios-add',
          //zoomOutIcon: 'fa fa-minus',
          zoomOutIcon: 'ivu-icon ivu-icon-ios-remove"',
          //resetIcon: 'fa fa-expand'
          resetIcon: 'ivu-icon ivu-icon-ios-resize'
        });
        disease_nodes = cy.elements('node.disease');
        term_nodes = cy.elements('node.term');
        disease_edges = cy.elements('edge.disease_term');
        disease_gene_edges = cy.elements('edge.disease_gene');
        gene_edges = cy.elements('edge.gene');
        gene_nodes = cy.elements('node.gene');
      },
      diseaseChange(val) {
        //var cy = this.generateCyto();
        if (val === false) {
          cy.remove(disease_nodes);
          cy.remove(term_nodes);
        }else{
          cy.add(disease_nodes);
          cy.add(term_nodes);
          cy.add(disease_edges);
          cy.add(disease_gene_edges);
        }
      },
      geneChange(val){
        if(val === false){
          cy.remove(gene_nodes);
        }else{
          cy.add(gene_nodes);
          cy.add(gene_edges);
          cy.add(disease_gene_edges);
        }
      },
      geneNameChange(val){
        if(val){
          cy.elements('node.gene').removeClass('hideLabel');
        }else{
          cy.elements('node.gene').addClass('hideLabel');
        }
      },
      diseaseNameChange(val){
        if(val === true){
          cy.elements('node.disease').css('text-opacity','1');
        }else{
          cy.elements('node.disease').css('text-opacity','0');
        }
      },
      edgesChange(val){
        if(val === 'all'){
          cy.elements('edge').show();
        }else if(val === 'ProteinInteraction'){
          cy.elements('edge').hide();
          cy.elements('edge.HPRD').show();
        }else if(val === 'Biosystem'){
          cy.elements('edge').hide();
          cy.elements('edge.BIOSYSTEM').show();
        }else if(val === 'GeneFamily'){
          cy.elements('edge').hide();
          cy.elements('edge.GENE_FAMILY').show();
        }else if(val === 'TranscriptionInteraction'){
          cy.elements('edge').hide();
          cy.elements('edge.HTRI').show();
        }
      },
      layoutChange(val){
        cy.layout({
          name: val,
          //boundingBox: {x1: 0, y1: 0, w: this.extent, h: 550},
        }).run();
      },
      /*图片导出*/
      downLoad() {
        this.png64 = cy.png({bg:this.idBackground.backgroundColor});
        document.getElementById("networkChartDownload").setAttribute("href", this.png64);
        document.getElementById("networkChartDownload").click()
      },
    }
  }
</script>

<style scoped>
    #networkContainer {
        width: 90%;
        height: 700px;
        background-color: #ffffff;
        border: 1px solid #ddd;
        margin-top: 10px;
        margin-left: 5%;
    }
    .toolBox{
        margin-top: 10px;
        border: 2px solid #2196f382;
        padding: 10px 40px;
        border-radius: 9px;
    }
</style>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style>
    .cy-panzoom {
        position: absolute;
        font-size: 12px;
        color: #fff;
        font-family: arial, helvetica, sans-serif;
        line-height: 1;
        color: #666;
        font-size: 11px;
        z-index: 99999;
        box-sizing: content-box;
    }

    .cy-panzoom-zoom-button {
        cursor: pointer;
        padding: 3px;
        text-align: center;
        position: absolute;
        border-radius: 3px;
        width: 10px;
        height: 10px;
        left: 16px;
        background: #fff;
        border: 1px solid #999;
        margin-left: -1px;
        margin-top: -1px;
        z-index: 1;
        box-sizing: content-box;
    }

    .cy-panzoom-zoom-button:active,
    .cy-panzoom-slider-handle:active,
    .cy-panzoom-slider-handle.active {
        background: #ddd;
        box-sizing: content-box;
    }

    .cy-panzoom-pan-button {
        position: absolute;
        z-index: 1;
        height: 16px;
        width: 16px;
        box-sizing: content-box;
    }

    .cy-panzoom-reset {
        top: 55px;
        box-sizing: content-box;
    }

    .cy-panzoom-zoom-in {
        top: 80px;
        box-sizing: content-box;
    }

    .cy-panzoom-zoom-out {
        top: 197px;
        box-sizing: content-box;
    }

    .cy-panzoom-pan-up {
        top: 0;
        left: 50%;
        margin-left: -5px;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #666;
        box-sizing: content-box;
    }

    .cy-panzoom-pan-down {
        bottom: 0;
        left: 50%;
        margin-left: -5px;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #666;
        box-sizing: content-box;
    }

    .cy-panzoom-pan-left {
        top: 50%;
        left: 0;
        margin-top: -5px;
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-right: 5px solid #666;
        box-sizing: content-box;
    }

    .cy-panzoom-pan-right {
        top: 50%;
        right: 0;
        margin-top: -5px;
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid #666;
        box-sizing: content-box;
    }

    .cy-panzoom-pan-indicator {
        position: absolute;
        left: 0;
        top: 0;
        width: 8px;
        height: 8px;
        border-radius: 8px;
        background: #000;
        border-radius: 8px;
        margin-left: -5px;
        margin-top: -5px;
        display: none;
        z-index: 999;
        opacity: 0.6;
        box-sizing: content-box;
    }

    .cy-panzoom-slider {
        position: absolute;
        top: 97px;
        left: 17px;
        height: 100px;
        width: 15px;
        box-sizing: content-box;
    }

    .cy-panzoom-slider-background {
        position: absolute;
        top: 0;
        width: 2px;
        height: 100px;
        left: 5px;
        background: #fff;
        border-left: 1px solid #999;
        border-right: 1px solid #999;
        box-sizing: content-box;
    }

    .cy-panzoom-slider-handle {
        position: absolute;
        width: 16px;
        height: 8px;
        background: #fff;
        border: 1px solid #999;
        border-radius: 2px;
        margin-left: -2px;
        z-index: 999;
        line-height: 8px;
        cursor: default;
        box-sizing: content-box;
    }

    .cy-panzoom-slider-handle .icon {
        margin: 0 4px;
        line-height: 10px;
        box-sizing: content-box;
    }

    .cy-panzoom-no-zoom-tick {
        position: absolute;
        background: #666;
        border: 1px solid #fff;
        border-radius: 2px;
        margin-left: -1px;
        width: 8px;
        height: 2px;
        left: 3px;
        z-index: 1;
        margin-top: 3px;
        box-sizing: content-box;
    }

    .cy-panzoom-panner {
        position: absolute;
        left: 5px;
        top: 5px;
        height: 40px;
        width: 40px;
        background: #fff;
        border: 1px solid #999;
        border-radius: 40px;
        margin-left: -1px;
        box-sizing: content-box;
    }

    .cy-panzoom-panner-handle {
        position: absolute;
        left: 0;
        top: 0;
        outline: none;
        height: 40px;
        width: 40px;
        position: absolute;
        z-index: 999;
        box-sizing: content-box;
    }

    .cy-panzoom-zoom-only .cy-panzoom-slider,
    .cy-panzoom-zoom-only .cy-panzoom-panner {
        display: none;
    }

    .cy-panzoom-zoom-only .cy-panzoom-reset {
        top: 20px;
    }

    .cy-panzoom-zoom-only .cy-panzoom-zoom-in {
        top: 45px;
    }

    .cy-panzoom-zoom-only .cy-panzoom-zoom-out {
        top: 70px;
    }
</style>

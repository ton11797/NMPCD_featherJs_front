<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            Overall system
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12" lg="6">
                <CRow>
                  <CCol sm="6">
                    <CCallout color="info">
                      <small class="text-muted">Versions:</small><br>
                      <strong class="h4">{{$store.getters.getVersion.versionName}}</strong>
                    </CCallout>
                  </CCol>
                  <CCol sm="6">
                    <CCallout color="danger">
                      <small class="text-muted">Schemas:</small><br>
                      <strong class="h4">{{schemaCount}}</strong>
                    </CCallout>
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm="12" lg="6">
                <CRow>
                  <CCol sm="6">
                    <CCallout color="warning">
                      <small class="text-muted">Total data:</small><br>
                      <strong class="h4">{{totalData}}</strong>
                    </CCallout>
                  </CCol>
                  <CCol sm="6">
                    <CCallout color="success">
                      <small class="text-muted">Organic</small><br>
                      <strong class="h4">49,123</strong>
                    </CCallout>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
            <hr/>
            <br/>
            <CDataTable
              class="mb-0 table-outline"
              hover
              :items="tableItems"
              :fields="tableFields"
              head-color="light"
              no-sorting
            >
              <td slot="WaitCount" slot-scope="{item}">
                <div class="clearfix">
                  <div class="float-left">
                    <strong>{{item.WaitCount.per}}% Confirmed</strong>
                  </div>
                  <div class="float-right">
                    <small class="text-muted">{{item.dataCount}}</small>
                  </div>
                </div>
                <CProgress
                  class="progress-xs"
                  v-model="item.WaitCount.per"
                  :color="color(item.WaitCount.per)"
                />
              </td>
              <td slot="RelateCount" slot-scope="{item}">
                <div class="clearfix">
                  <div class="float-left">
                    <strong>{{item.RelateCount.per}}% Linked</strong>
                  </div>
                  <div class="float-right">
                    <small class="text-muted">{{item.dataCount}}</small>
                  </div>
                </div>
                <CProgress
                  class="progress-xs"
                  v-model="item.RelateCount.per"
                  :color="color(item.RelateCount.per)"
                />
              </td>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import MainChartExample from './charts/MainChartExample'
import WidgetsDropdown from './widgets/WidgetsDropdown'
import WidgetsBrand from './widgets/WidgetsBrand'
import api from "@/API";
export default {
  name: 'Dashboard',
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand
  },
  data () {
    return {
      selected: 'Month',
      schemaCount:0,
      versionCount:0,
      totalData:0,
      tableItems: [
        {
          Schema: "TPU",
          dataCount: 98700,
          WaitCount: {per:50,value:5000},
          RelateCount: {per:80,value:90700}
        }
      ],
      tableFields: [
        { key: 'Schema' },
        { key: 'dataCount', label: 'Data', _classes: 'text-center' },
        { key: 'WaitCount', label: 'Confirm', _classes: 'text-center' },
        { key: 'RelateCount', label: 'Relation', _classes: 'text-center' },
      ]
    }
  },
  computed: {
    versionUUID() {
      return this.$store.getters.getVersion.uuid;
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    async versionUUID(newCount, oldCount) {
      console.log("asdasdasd")
      await this.fetchData();
    }
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const respond = (await api.dashboard.update({versionUUID:this.versionUUID}))
          .data;
        this.tableItems = respond.schemaDetail;
        this.schemaCount = respond.schemaCount;
        this.versionCount = respond.versionCount;
        this.totalData = respond.totalData;
        console.log(respond)
      } catch (error) {
        console.log(error)

      }
    },
    color (value) {
      let $color
      if (value <= 25) {
        $color = 'info'
      } else if (value > 25 && value <= 50) {
        $color = 'danger'
      } else if (value > 50 && value <= 75) {
        $color = 'warning'
      } else if (value > 75 && value <= 100) {
        $color = 'success'
      }
      return $color
    }
  }
}
</script>


<style >
.xxxx4 .ivu-select-selection{
  max-height: 40px;
}
</style>
<style scoped>
.xxx1{
  width: 20%;
  max-width: 20%;
}
.box_hover{
  cursor: pointer;
  height: 42px;
  line-height: 42px;
}
.hover{
  cursor: pointer;
}
.box_hover1{
  cursor: pointer;
  height: 64px;
  line-height: 64px;
}
.box_hover2{
  cursor: pointer;
  height: 32px;
  line-height: 32px;
}
.cursorDefault{
  cursor: default;
}
</style>
<template>
<div>
  <Card shadow v-if="hasButtonPermission('102130101')">
    <Row :gutter="24" v-if="hasButtonPermission('102130101')">
      <i-col span="4" class="xxx1" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 126px;display: block;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <template>
            <!-- ,'时效问题数','退件问题数','赔偿问题数'  '昨日新增妥投超时' 头程批次管理 -->
            <count-to v-if="['昨日发货票量'].includes(infor.title)" :end="infor.count" count-class="count-style"></count-to>
            <p  v-else-if="!['昨日发货票量','待索赔包裹','头程批次管理','昨日新增妥投超时','时效问题数'].includes(infor.title)" style="margin: 0px 0 0px 0;font-size: 50px;">{{ infor.count.toFixed(2) }}</p>
            <div  v-else-if="infor.title == '待索赔包裹'" style="margin: 0px 0 0px 0;font-size: 16px;">
              <div class="box_hover1" v-for="(item1,idx) in infor.obj1" :key="`infor-${idx}`"  @click="toclaimManagement(item1.path)"
                :style="{'background-color':item1.color,color:'#fff'}" style="margin: 0 0 0px 0px;text-align: left;padding-left: 10px;">
                <span >{{ item1.title }}：{{ item1.count }}</span>
              </div>
            </div>
            <div  v-else-if="infor.title == '昨日新增妥投超时'" style="margin: 0px 0 0px 0;font-size: 16px;">
              <div class="box_hover1" v-for="(item1,idx) in infor.obj1" :key="`infor-${idx}`"  @click="toPrescTime(item1.path)"
                :style="{'background-color':item1.color,color:'#fff'}" style="margin: 0 0 0px 0px;text-align: left;padding-left: 10px;">
                <span >{{ item1.title }}：{{ item1.count }}</span>
              </div>
            </div>
            <div  v-else-if="infor.title == '时效问题数'" style="margin: 0px 0 0px 0;font-size: 16px;">
              <div class="box_hover" v-for="(item1,idx) in infor.obj1" :key="`infor-${idx}`" @click="toQuestion(item1.path)"
                :style="{'background-color':item1.color,color:'#fff'}" style="margin: 0 0 0px 0px;text-align: left;padding-left: 10px;">
                <span >{{ item1.title }}：{{ item1.count }}</span>
              </div>
            </div>
            <div  v-else-if="infor.title == '头程批次管理'" style="margin: 0px 0 0px 0;font-size: 16px;">
              <div class="box_hover2" v-for="(item1,idx) in infor.obj1" :key="`infor-${idx}`" @click="tobatchManagement(item1.path)"
                :style="{'background-color':item1.color,color:'#fff'}" style="margin: 0 0 0px 0px;text-align: left;padding-left: 10px;">
                <span >{{ item1.title }}：{{ item1.count }}</span>
              </div>
            </div>
            <h2  v-else style="margin: 20px 0 26px 0;">{{ infor.title1 }}</h2>
          </template>
          <p v-if="!['昨日新增妥投超时','头程批次管理','时效问题数'].includes(infor.title)" >{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 20px;">
      <Tabs :animated="false" type="card"  @on-click="onTabsChange"  style="min-height: 666px;">
          <TabPane label="发货汇总" name="baseInfo1" v-if="hasButtonPermission('102130102')">
            <div id="div0">
              <h2 style="height: 40px;line-height: 40px;margin-left: 4px;">发货汇总</h2>
              <!-- 需求SKU与PCS -->
              <myEcharts ref="deliveryEcharts"  :collectCompanys="collectCompanys" :saleChannels="saleChannels" :shippingmethodss="shippingmethodss"
                :onShippingmethodObjs="onShippingmethodObjs" :countries="countries" >
              </myEcharts>
            </div>
            <!-- 轨迹预警 -->
            <div id="div1">
              <h2 style="height: 40px;line-height: 40px;margin-left: 4px;">轨迹预警</h2>
              <myEcharts3 ref="trajectoryEcharts" @fatherMethod="trajectoryMethod"  :shippingmethodss="shippingmethodss" :countries="countries" ></myEcharts3>
            </div>
            <!-- 头程时效看板 -->
            <div id="div2">
              <h2 style="height: 40px;line-height: 40px;margin-left: 4px;">头程时效看板</h2>
              <myEcharts4 ref="DeliverEffectEcharts"></myEcharts4>
            </div>
            <!-- 问题件统计 -->
            <div id="div3">
              <h2 style="height: 40px;line-height: 40px;margin-left: 4px;">问题件统计</h2>
              <myEcharts2 ref="problemEcharts"  :getshippingmethodsId="getshippingmethodsId" :onShippingmethodObjs="onShippingmethodObjs" ></myEcharts2>
            </div>
            <!-- 快递统计 -->
            <div id="div4">
              <h2 style="height: 40px;line-height: 40px;margin-left: 4px;">快递统计</h2>
              <Row>
                <Col span="4" style="margin: 0 6px;">
                  <div style="display: flex;align-items: center;" v-show="!problemStatus7">
                    <div style="width: 74px;">物流方式:</div>
                    <div  style="width: 216px;">
                      <Select v-model="args7.shippingMethodId" clearable filterable placeholder="请选择物流方式">
                        <Option v-for="(item, key) in getshippingmethodsId" :value="key" :key="key">{{key}}-{{ item }}</Option>
                      </Select>
                    </div>
                  </div>
                  <span>&nbsp;</span>
                </Col>
                <Col span="4" style="margin-left: 10px;">
                  <div style="display: flex;align-items: center;" v-show="!problemStatus7">
                    <div style="width: 74px;">装车时间:</div>
                    <div style="width: 180px;">
                      <DatePicker v-model="date7" type="month" @on-change="date7Change($event)" placement="bottom-end" placeholder="请选择装车时间" style="width: 100%"></DatePicker>
                    </div>
                  </div>
                  <span>&nbsp;</span>
                </Col>
                <Col span="4" style="margin: 0 6px;">
                  <div style="display: flex;align-items: center;" v-show="!problemStatus7">
                    <div style="width: 120px;">问题类型细分:</div>
                    <div class="xxxx4">
                      <Select v-model="typesInfo7" multiple :max-tag-count="1"  clearable filterable placeholder="请选择">
                        <Option v-for="(item,idx) in problemType7" :value="idx" :key="idx+'_1'">{{ idx }}</Option>
                      </Select>
                    </div>
                  </div>
                  <span>&nbsp;</span>
                </Col>
                <Col span="4">
                  <div style="display: flex;align-items: center;" v-show="!problemStatus7">
                    <div style="width: 74px;">处理状态:</div>
                    <div class="xxxx4">
                      <Select v-model="status7" multiple :max-tag-count="1"  clearable filterable >
                        <Option value="0">未解决</Option>
                        <Option value="1">解决中</Option>
                        <Option value="2">已解决</Option>
                      </Select>
                    </div>
                  </div>
                  <span>&nbsp;</span>
                </Col>
                <Col style="margin-left: 14px;display: inline-block;">
                  <Button type="primary" @click="getOrderStatistics" :loading="tableLoading"  v-show="!problemStatus7">查询</Button>
                  <span>&nbsp;</span>
                  <div v-if="problemStatus7" style="width: 260px;height: 2px;"></div>
                </Col>
                <Col  style="text-align: left;display: inline-block;margin-left: 10px;" v-if="problemStatus7">
                  <div style="position: relative;right: 0px;">
                    <Button type="success"  @click="goBack7" :loading="tableLoading" >返回上一步</Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <div  id="dom7" v-if="!initBar7lent"  class="qqqq chart-box" style="height: 540px;margin-top: 10px;"></div>
                <div  v-if="initBar7lent"  class="wwww" style="height: 540px;margin-top: 10px;background-color: #fff;text-align: center;line-height: 540px;">
                  暂无数据
                </div>
                <div class="table-container" v-if="!initBar7lent">
                  <table>
                    <thead>
                      <tr>
                        <th :style="{width: initBar7shortName.length+'%'}">&nbsp;</th>
                        <th v-for="(item, idx) in initBar7shortName" :key="idx" :style="{width: initBar7shortName.length+'%'}">
                          {{ item }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr  v-for="(item, idx) in initBar7data" :key="idx">
                        <td>{{ item.name }}</td>
                        <td v-for="(item2, idx2) in item.data" :key="idx2">{{ item2 }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Row>
            </div>
            <div class="Anchor">
              <a v-for="item in chartValue" @click="back_1(item.id,null)" :key="item.id">{{item.title}}</a>
              <a @click="back_1(null,'Top')">置顶</a>
            </div>
          </TabPane>
          <TabPane label="票均成本" name="baseInfo2" v-if="hasButtonPermission('102130103')">
            <myTabEcharts2 ref="TicketCostEcharts"  :collectCompanys="collectCompanys" :saleChannels="saleChannels" :shippingmethodss="shippingmethodss" :countries="countries" >
            </myTabEcharts2>
          </TabPane>
          <!-- <TabPane label="头程时效看板" name="baseInfo3" v-if="hasButtonPermission('102130104')">
            <myEcharts4 ref="DeliverEffectEcharts"></myEcharts4>
          </TabPane> -->
          <TabPane label="退款率" name="baseInfo4" v-if="hasButtonPermission('102130105')">
            <myTabEcharts3 ref="RetuntRateEcharts"   :saleChannels="saleChannels"></myTabEcharts3>
          </TabPane>
          <TabPane label="妥投率" name="baseInfo5" v-if="hasButtonPermission('102130106')">
            <Row>
              <Col span="6" >
                <div style="display: flex;align-items: center;">
                  <div style="width: 80px;">发货时间:</div>
                  <div style="width: 260px;">
                    <DatePicker v-model="date5" @on-change="date5Change($event)" type="daterange" placement="bottom-end" placeholder="请选择发货时间" style="width: 100%"></DatePicker>
                  </div>
                </div>
              </Col>
              <Col span="4">
                <div style="display: flex;align-items: center;">
                  <div style="width: 74px;">物流级别:</div>
                  <div style="width: 160px;">
                    <Select v-model="args5.shippingMethodLevel" clearable filterable placeholder="请选择">
                      <Option v-for="item in shippingMethodLevelOpts" :value="item.val" :key="item.val">{{ item.label }}</Option>
                    </Select>
                  </div>
                </div>
              </Col>
              <Col span="3">
                <div style="display: flex;align-items: center;">
                  <div style="width: 4px;"></div>
                  <div>
                    <RadioGroup v-model="args5.order" @on-change="getFindPrescRate" type="button">
                      <Radio v-for="(item,idx) in statusType5" :key="'idx_'+idx" :label="item.val"><span>{{ item.label }}</span></Radio>
                    </RadioGroup>
                  </div>
                </div>
              </Col>
              <Col span="2" style="text-align: right">
                <Button type="primary" :loading="tableLoading" @click="getFindPrescRate" class="es-button-right">查询</Button>
              </Col>
            </Row>
            <Row>
              <div id="dom5" class="chart-box" style="height: 540px;margin-top: 10px;"></div>
            </Row>
          </TabPane>
          <!-- <TabPane label="问题件统计" name="baseInfo6" v-if="hasButtonPermission('102130107')">
            <myEcharts2 ref="problemEcharts"  :getshippingmethodsId="getshippingmethodsId"  ></myEcharts2>
          </TabPane> -->
          <!-- <TabPane label="快递统计" name="baseInfo7" v-if="hasButtonPermission('102130108')">
            <Row>
              <Col span="4" style="margin: 0 6px;">
                <div style="display: flex;align-items: center;" v-show="!problemStatus7">
                  <div style="width: 74px;">物流方式:</div>
                  <div  style="width: 216px;">
                    <Select v-model="args7.shippingMethodId" clearable filterable placeholder="请选择物流方式">
                      <Option v-for="(item, key) in getshippingmethodsId" :value="key" :key="key">{{key}}-{{ item }}</Option>
                    </Select>
                  </div>
                </div>
                <span>&nbsp;</span>
              </Col>
              <Col span="4" style="margin-left: 10px;">
                <div style="display: flex;align-items: center;" v-show="!problemStatus7">
                  <div style="width: 74px;">装车时间:</div>
                  <div style="width: 180px;">
                    <DatePicker v-model="date7" type="month" @on-change="date7Change($event)" placement="bottom-end" placeholder="请选择装车时间" style="width: 100%"></DatePicker>
                  </div>
                </div>
                <span>&nbsp;</span>
              </Col>
              <Col span="4" style="margin: 0 6px;">
                <div style="display: flex;align-items: center;" v-show="!problemStatus7">
                  <div style="width: 120px;">问题类型细分:</div>
                  <div class="xxxx4">
                    <Select v-model="typesInfo7" multiple :max-tag-count="1"  clearable filterable placeholder="请选择">
                      <Option v-for="(item,idx) in problemType7" :value="idx" :key="idx+'_1'">{{ idx }}</Option>
                    </Select>
                  </div>
                </div>
                <span>&nbsp;</span>
              </Col>
              <Col span="4">
                <div style="display: flex;align-items: center;" v-show="!problemStatus7">
                  <div style="width: 74px;">处理状态:</div>
                  <div class="xxxx4">
                    <Select v-model="status7" multiple :max-tag-count="1"  clearable filterable >
                      <Option value="0">未解决</Option>
                      <Option value="1">解决中</Option>
                      <Option value="2">已解决</Option>
                    </Select>
                  </div>
                </div>
                <span>&nbsp;</span>
              </Col>
              <Col style="margin-left: 14px;display: inline-block;">
                <Button type="primary" @click="getOrderStatistics" :loading="tableLoading"  v-show="!problemStatus7">查询</Button>
                <span>&nbsp;</span>
                <div v-if="problemStatus7" style="width: 260px;height: 2px;"></div>
              </Col>
              <Col  style="text-align: left;display: inline-block;margin-left: 10px;" v-if="problemStatus7">
                <div style="position: relative;right: 0px;">
                  <Button type="success"  @click="goBack7" :loading="tableLoading" >返回上一步</Button>
                </div>
              </Col>
            </Row>
            <Row>
              <div  id="dom7" v-if="!initBar7lent"  class="qqqq chart-box" style="height: 540px;margin-top: 10px;"></div>
              <div  v-if="initBar7lent"  class="wwww" style="height: 540px;margin-top: 10px;background-color: #fff;text-align: center;line-height: 540px;">
                暂无数据
              </div>
              <div class="table-container" v-if="!initBar7lent">
                <table>
                  <thead>
                    <tr>
                      <th :style="{width: initBar7shortName.length+'%'}">&nbsp;</th>
                      <th v-for="(item, idx) in initBar7shortName" :key="idx" :style="{width: initBar7shortName.length+'%'}">
                        {{ item }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr  v-for="(item, idx) in initBar7data" :key="idx">
                      <td>{{ item.name }}</td>
                      <td v-for="(item2, idx2) in item.data" :key="idx2">{{ item2 }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Row>
          </TabPane> -->
      </Tabs>
    </Row>
    <div v-show="true">
      <div id="collect1" ></div>
      <div id="dom2" ></div>
      <div id="dom3" ></div>
      <div id="dom4_1" ></div>
      <div id="dom4_2" ></div>
      <div id="dom4_3" ></div>
      <div id="dom5" ></div>
      <div id="dom8" ></div>
    </div>
  </Card>
</div>
</template>

<script>
import echarts from 'echarts'

import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import { on } from '@/libs/tools'
import { scrollTop } from '@/libs/util'
import myEcharts from './components/myEcharts.vue' // 发货汇总
import myEcharts2 from './components/myEchartsProblem' // 问题件统计
import myEcharts3 from './components/myEchartsTrajectory.vue' // 轨迹跟踪
import myEcharts4 from './components/myEchartsDeliverEffect.vue' // 头程时效看板
import myTabEcharts2 from './components/myTicketCost.vue' // 票均成本
import myTabEcharts3 from './components/myRetuntRate.vue' // 退款率
import * as logisticstypeOpr from '@/api/logisticstype.api'
import * as home from '@/api/home.api.js'
import * as awaitClaimApi from '@/api/awaitClaim.api.js'
import * as deliveryOrder from '@/api/deliveryOrderManagement.api.js'
import { getfirstClaim } from '@/api/claimManagement.api.js'
import { firstBatOrderGetCountByExample } from '@/api/batchManagement'
import { searchFirstOrder } from '@/api/docManagement'
import * as abnormalApi from '@/api/abnormalAging.api.js'
import { getshippingmethods } from '@/common/const.js'
import { mapGetters } from 'vuex'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    myEcharts,
    myEcharts2,
    myEcharts3,
    myEcharts4,
    myTabEcharts2,
    myTabEcharts3
  },
  data() {
    return {
      chartValue: [
        { id: 0, value: {}, title: '发货汇总', color: '#E87EC4' },
        { id: 1, value: {}, title: '轨迹预警', color: 'rgb(30, 116, 189)' },
        { id: 2, value: {}, title: '头程时效看板', color: 'rgb(30, 116, 189)' },
        { id: 3, value: {}, title: '问题件统计', color: 'rgb(28, 129, 191)' },
        { id: 4, value: {}, title: '快递统计', color: 'rgb(93, 199, 241)' }
      ],
      sTop: 0,
      date1: [], // 时间双向绑定
      date: [], // 时间双向绑定 - 发货汇总
      date5: [], // 时间双向绑定 - 妥投率
      date7: '', // 时间双向绑定 - 快递统计
      typesInfo7: '', // 问题类型细分 - 快递统计
      status7: ['0'], // 处理状态 - 快递统计
      problemStatus7: false,
      getshippingmethodsId: {}, // 物流商方式下拉
      collectCompanys: [],
      tableLoading: false,
      initBar7lent: true,
      initBar7data: null,
      initBar7shortName: [],
      data: {
        storyPointBarGraph: [
          { name: '2021-12-20', value: null, front: 13, back: 10.25, test: null },
          { name: '2021-12-27', value: null, front: 1.9545454545454546, back: 7.75, test: null },
          { name: '2022-1-4', value: null, front: 3.9545454545454546, back: 5.75, test: null },
          { name: '2022-1-11', value: null, front: 2.9545454545454546, back: 9.75, test: null }
        ],
        data2: [],
        data3: [],
        data4: {
          refuntRate0: [],
          refuntRate1: [],
          refuntRate2: []
        },
        data5: [
          // { loadTime: '2022-1-10', value: null, M: 13, E: 10.25, R: 5 },
        ],
        data7: [], // 问题件统计
        data7_2: [] // 问题件统计-细分
      },
      statusType6: [
        { val: '', label: '全部' },
        { val: '平邮', label: '平邮' },
        { val: '挂号', label: '挂号' },
        { val: '快递', label: '快递' }
      ], // 状态下拉
      statusType4: [
        { val: 'refundrate asc', label: '正序排列' },
        { val: 'refundrate desc', label: '倒序排列' }
      ],
      statusType5: [
        { val: 'asc', label: '正序排列' },
        { val: 'desc', label: '倒序排列' }
      ],
      type: 'line',
      button3: '折线图',
      button4: '柱状图',
      dom: null,
      line: null,
      problemType: {}, // 问题类型细分
      problemType7: {}, // 问题类型细分
      shippingMethodLevelOpts: [
        // { label: '全部', val: '' },
        { label: '平邮', val: 'M' },
        { label: '挂号', val: 'R' },
        { label: '快递', val: 'E' }
      ],
      args5: { // 查询参数
        loadTimeStart: '', // 	开始日期
        loadTimeEnd: '', // 	结束日期
        shippingMethodLevel: 'R', // 	物流级别
        order: 'desc'
      },
      args7: { // 查询参数
        shippingMethodId: '', // 	物流方式id
        loadTime: '', // 	装车时间 yyyy-mm
        problemTypesInfo: '', // 	问题类型细分,多个英文逗号分割
        processingStatus: '' // 处理状态,0 未解决,1 解决中,2 已解决,多个英文逗号分割
      },
      args7_2: { // 查询参数123
        shippingMethodId: '', // 	物流方式id
        loadTime: '', // 	装车时间 yyyy-mm
        problemTypesInfo: '', // 	问题类型细分,多个英文逗号分割
        processingStatus: '' // 处理状态,0 未解决,1 解决中,2 已解决,多个英文逗号分割
      },
      args: { // 查询参数
        search: {
          shippingCompanyId: '', // 物流商Id Long
          statusType: '',
          claimType: '' // 索赔类型（10：在途超时，20：入库丢失，30：在途丢失）
        },
        pageReqired: true,
        limit: 10,
        offset: 0
      },
      args4_4: {
        search: {
          claimStatus: '10' // 索赔状态（10：进行中，20：已完成，30：已取消）
        },
        pageReqired: true,
        limit: 200,
        offset: 0
      }, // 查询参数
      inforCardData: [
        { title: '昨日发货票量', icon: 'md-trending-up', title1: '暂未上线', count: 0, color: '#2d8cf0' },
        // { title: '前天票均成本', icon: 'ios-briefcase', title1: '暂未上线', count: 0, color: '#19be6b' },
        { title: '待索赔包裹',
          icon: 'md-cart',
          title1: '暂未上线',
          count: 0,
          color: '#ed3f14',
          obj1: [
            { title: '小包待索赔', color: '#9A66E4', count: 0, path: '0' },
            { title: '头程待索赔', color: '#19be6b', count: 0, path: '1' }
          ]
        },
        { title: '昨日新增妥投超时',
          icon: 'md-refresh',
          title1: '暂未上线',
          count: 0,
          color: '#ff9900',
          obj1: [
            { title: '昨日新增妥投超时', color: '#67e0e3', count: 0, path: '0' },
            { title: '今日异常时效数量', color: '#F06292', count: 0, path: '1' }
          ]
        },
        { title: '时效问题数',
          icon: 'md-chatbubbles',
          count: 0,
          color: '#00B0FF',
          obj1: [
            { title: '时效问题数', color: '#4DB6AC', count: 0, path: '0' },
            { title: '退件问题数', color: '#7986CB', count: 0, path: '1' },
            { title: '赔偿问题数', color: '#90A4AE', count: 0, path: '2' }
          ]
        },
        { title: '头程批次管理',
          icon: 'ios-briefcase',
          count: 0,
          color: '#19be6b',
          obj1: [
            { title: '头程待合单数', color: '#EF5350', count: 0, path: '3' },
            { title: '头程待发货数', color: '#00BFA5', count: 0, path: '0' },
            { title: '头程已发货数', color: '#8D6E63', count: 0, path: '1' },
            { title: '头程妥投预警', color: '#2d8cf0', count: 0, path: '2' }
          ]
        }
        // { title: '退件问题数', icon: 'md-chatbubbles', count: 0, color: '#E46CBB' },
        // { title: '赔偿问题数', icon: 'md-map', count: 0, color: '#9A66E4' }
      ]
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'saleChannels', // 平台
      'shippingmethodss', // 物流方式
      'countries' // 国家
    ]),
    onShippingmethodObjs() { // 已启用物流方式
      return this.$store.state.onShippingmethodObjs
    }
  },
  created() {
    console.log('onShippingmethodObjs', this.$cloneDeep(this.onShippingmethodObjs))
    this.getCollectCompanyList()
    this.date1 = [this.$moment(new Date()).subtract(1, 'M').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')]
    this.date5 = [this.$moment(new Date()).subtract(1, 'M').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')] // 妥投率
    this.assignData()
  },
  async mounted() {
    this.getshippingmethodsId = await getshippingmethods.call(this) // 物流商方式下拉选项
    await Promise.all([this.getFindSelectValues(),
      this.getfirstClaim4(), this.getAbnormalAgingList(), this.gettotalProblemManagement2()]) //  物流商下拉选项
    this.getBatchMangementList2()
    this.getDeliverySummary2()
    this.getYesterdayPresc2()
    this.onTabsChange('baseInfo1')
  },
  methods: {
    hasButtonPermission(permission) {
      return this.$store.getters['hasButtonPermission'](permission)
    },
    getTop_1(e) { // 获得顶部与当前位置的距离
      var offset = e.offsetTop
      if (e.offsetParent != null) offset += this.getTop_1(e.offsetParent) - 30
      this.start = offset
      return offset
    },
    trajectoryMethod() { // 跳转之前置顶
      this.back_1(null, 'Top')
    },
    back_1(id, scollTop) { // 返回锚点位置
      const containerEle = document.querySelector('.content-wrapper')
      if (scollTop) {
        scrollTop(containerEle, this.sTop, 0, 2000)
        // 记录上次位置
        this.sTop = 0
      } else {
        const end = document.querySelector('#div' + id)
        scrollTop(containerEle, this.sTop, this.getTop_1(end), 2000)
        // 记录上次位置
        this.sTop = this.getTop_1(end)
      }
    },
    toclaimManagement(val) {
      // console.log('toPrescTime', val)
      if (val === '1') { // 头程待索赔
        this.$router.push({ name: 'claim-management',
          params: {
            status: '0' || -1
          } })
      } else if (val === '0') { // 小包待索赔
        this.$router.push({ name: 'await-claim',
          params: {
            status: '0' || -1
          } })
      }
    },
    toPrescTime(val) { // 首页待索赔包裹对应页面 presc-time toPrescTime
      // console.log('首页待索赔包裹对应页面', val)
      if (val == '0') {
        this.$router.push({
          name: 'presc-time'
        })
      } else if (val == '1') {
        this.$router.push({
          name: 'sbnormal-aging',
          params: {
            status: val || -1
          }
        })
      }
    },
    tobatchManagement(val) { // 首页头程批次对应页面
      // console.log('首页头程批次对应页面', val)
      if (val === '3') { // 单据
        this.$router.push({
          name: 'doc-management',
          params: {
            status: val || -1
          }
        })
      } else { // 批次
        this.$router.push({
          name: 'batch-management',
          params: {
            status: val || -1
          }
        })
      }
    },
    toQuestion(val) { // 首页问题件跳转对应页面
      // console.log('toQuestion', val)
      this.$router.push({
        name: 'question-management',
        params: {
          type: val || -1
        }
      })
    },
    goBack7() { // 快递统计-细分
      if (this.problemStatus7) {
        this.args7.shippingMethodId = ''
        this.args7.problemTypesInfo = ''
        this.args7.processingStatus = ''
        this.typesInfo7 = ''// 问题类型细分
        this.status7 = '' // 处理状态
        this.problemStatus7 = false
        this.getOrderStatistics()
      }
    },
    date7Change(date) { // 选择时间查询
      this.date7 = date != '' ? this.$moment(date).format('YYYY-MM') : ''
      this.args7.loadTime = date != '' ? this.$moment(date).format('YYYY-MM') : ''
      this.getOrderStatistics()
    },

    date5Change(date) {
      this.args5.loadTimeStart = date[0] // 妥投率-开始日期
      this.args5.loadTimeEnd = date[1]
    },
    initAll() {
      this.$nextTick(() => {
        let datas = this.data
        this.initBar5('dom5', { title: '妥投率', data: datas.data5 || [] })
      })
    },
    initAll7() { // 快递异常
      this.$nextTick(() => {
        let datas = this.data
        if (Object.keys(datas.data7).length == 0) {
          this.initBar7lent = true
        } else {
          this.initBar7lent = false
          setTimeout(() => {
            this.initBar7('dom7', { title: '快递异常件分析', data: datas.data7 || {} })
          }, 300)
        }
      })
    },
    initAll7_2() { // 快递异常件分析
      this.$nextTick(() => {
        let datas = this.data
        if (Object.keys(datas.data7_2).length == 0) {
          this.initBar7lent = true
        } else {
          this.initBar7lent = false
          setTimeout(() => {
            this.initBar7_2('dom7', { title: '快递异常件分析', data: datas.data7_2 || {} })
          }, 300)
        }
      })
    },
    initBar5(id, data) { // 横向-柱状图 妥投率
      // console.log('initBar5-val', id, data)
      var chartDom = document.getElementById(id)
      var myChart = echarts.init(chartDom)
      let option = {
        title: {
          left: 'center',
          text: data.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          left: 'right',
          top: 'top'
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            handleSize: 32,
            startValue: 0,
            endValue: 14
          },
          {
            type: 'inside'
          }
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          name: '时间/天',
          type: 'category',
          axisLabel: {
            show: true,
            interval: 0,
            lineHeight: 18,
            formatter: function(params) {
              // console.log('formatter', params, params.length)
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 6// 每行能显示的字的个数
              // 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
              if (paramsNameNumber > provideNumber) {
                newParamsName = params.substring(0, 8) + '..'// 最终拼成的字符串
              } else { // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          },
          data: data.data.map(item => item.shippingMethodCode)
        },
        yAxis: {
          name: '妥投率%',
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#67e0e3'],
        series: [
          {
            name: this.args5.shippingMethodLevel == 'M' ? '平邮' : this.args5.shippingMethodLevel == 'R' ? '挂号' : '快递',
            type: 'bar',
            barMaxWidth: 36, // 柱图宽度
            data: data.data.map(item => {
              if (this.args5.shippingMethodLevel == 'M') {
                return this.toFixed(item.M)
              } else if (this.args5.shippingMethodLevel == 'R') {
                return this.toFixed(item.R)
              } else {
                return this.toFixed(item.E)
              }
            }),
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      if (id == 'dom5') {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      } else {
        this.dom1 = myChart
        this.dom1.setOption(option)
        on(window, 'resize', this.resize1())
      }
      // })
      // option && myChart.setOption(option)
    },
    initBar7(id, data) { // 横向-柱状图 快递统计
      let seriesValue = []
      let chartDom = document.getElementById(id)
      let myChart = echarts.init(chartDom)
      // 想显示成几条那么就把6改成几就可以了，resultarr是横坐标的长度(倒序排列)
      let resultarr = [] // 去重后的物流方式
      let mmm = [] // 月份
      if (data) {
        let temp = data.data
        let arr1 = []
        mmm = []
        if (Object.keys(temp).length == 0) {
          resultarr = []
          arr1 = []
          arr2 = []
          this.initBar7lent = true
          seriesValue = []
          data.data = {}
          this.initBar7data = null
          this.initBar7shortName = []
        } else {
          seriesValue = []
          this.initBar7lent = false
          if (temp.shippingMethod0) {
            mmm = temp.shippingMethod0.map(item => item.loadMonth)
          }
          seriesValue = mmm.map((key, index) => { // 组装数据
            return {
              name: key,
              type: 'bar',
              label: {
                show: true,
                position: 'top'
              },
              barMaxWidth: 36, // 柱图宽度
              data: Object.keys(temp).map(key1 => temp[key1][index].problemCount)
            }
          })
          this.initBar7data = seriesValue
          Object.keys(temp).forEach(function(key) {
            temp[key].forEach(function(item) {
              arr1.push(item.shippingMethodName)
              resultarr = [...new Set(arr1)]
            })
          })
          console.log('seriesValue--777', seriesValue, resultarr, 'temp', temp)
          this.initBar7shortName = resultarr
        }
      } else {
        console.log('seriesValue--else')
      }
      var option = {
        title: {
          top: '0%',
          left: 'center',
          text: data.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            handleSize: 32,
            startValue: 0,
            endValue: 6
          },
          {
            zoomLock: true,
            type: 'inside'
          }
        ],
        legend: {
          top: '4%',
          right: '8%'
        },
        grid: {
          left: '3%',
          right: '6%',
          // bottom: '20%',
          containLabel: true
        },
        xAxis: {
          name: '物流方式',
          type: 'category',
          offset: 7,
          axisLabel: {
            interval: 0,
            rotate: '50',
            lineHeight: 18,
            formatter: function(params) {
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 8// 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
              // 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''// 表示每一次截取的字符串
                  var start = p * provideNumber// 开始截取的位置
                  var end = start + provideNumber// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p == rowNumber - 1) { // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber)
                  } else { // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr// 最终拼成的字符串
                }
              } else { // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          },
          data: resultarr
          // data: data.data.map(item => item.name)
        },
        yAxis: {
          name: '件数',
          type: 'value'
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47'],
        series: seriesValue
      }
      let that = this
      // 1、清除画布
      myChart.clear()
      /// 3、在渲染点击事件之前先清除点击事件
      myChart.off('click')
      myChart.setOption(option)
      myChart.getZr().on('mousemove', param => {
        var pointInPixel = [param.offsetX, param.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          // 若鼠标滑过区域位置在当前图表范围内 鼠标设置为小手
          myChart.getZr().setCursorStyle('pointer')
        } else {
          myChart.getZr().setCursorStyle('default')
        }
      })
      myChart.getZr().on('click', params => {
        var pointInPixel = [params.offsetX, params.offsetY]
        // 判断给定的点是否在指定的坐标系
        if (myChart.containPixel('grid', pointInPixel)) {
          let temp1 = data.data
          let tempStatus7 = that.status7 && that.status7.join(',')
          let tempTypesInfo7 = that.typesInfo7 && that.typesInfo7.join(',')

          let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
          let shippingMethodId1 = temp1[Object.keys(temp1)[xIndex]][0].shippingMethodId // 物流商ID
          console.log('shippingMethodId1', shippingMethodId1, 'xIndex', xIndex, 'temp1', temp1, that.args7.shippingMethodId)
          console.log('Objectkeys', temp1[Object.keys(temp1)[xIndex]], 'xIndex', temp1[Object.keys(temp1)[xIndex]][0])
          if (that.args7.shippingMethodId) {
            that.args7_2.shippingMethodId = that.args7.shippingMethodId// 物流方式id
          } else {
            that.args7_2.shippingMethodId = shippingMethodId1// 物流方式id
          }

          that.args7_2.loadTime = that.date7 // 装车时间 yyyy-mm
          that.args7_2.problemTypesInfo = tempTypesInfo7 // 问题类型细分,多个英文逗号分割
          that.args7_2.processingStatus = tempStatus7 // 处理状态,0 未解决,1 解决中,2 已解决,多个英文逗号分割
          that.problemStatus7 = true

          // 1、清除画布
          myChart.clear()
          // 3、在渲染点击事件之前先清除点击事件
          myChart.off('click')
          myChart.getZr().off('click')
          that.getOrderStatisticsType()
        }
      })
    },
    initBar7_2(id, data) { // 横向-柱状图 问题件统计-细分
      let seriesValue = []
      let chartDom = document.getElementById(id)
      let myChart = echarts.init(chartDom)
      // 想显示成几条那么就把6改成几就可以了，resultarr是横坐标的长度(倒序排列)
      let resultarr = []
      if (data) {
        let temp = data.data
        let arr1 = []
        let mmm = [] // 月份
        if (Object.keys(temp).length == 0) {
          resultarr = []
          arr1 = []
          this.initBar7lent = true
          seriesValue = []
          data.data = {}
          this.initBar7data = null
          this.initBar7shortName = []
        } else {
          seriesValue = []
          this.initBar7lent = false
          if (temp.problemTypesInfo0) {
            mmm = temp.problemTypesInfo0.map(item => item.loadMonth)
          }
          seriesValue = mmm.map((key, index) => { // 组装数据
            return {
              name: key,
              type: 'bar',
              label: {
                show: true,
                position: 'top'
              },
              barMaxWidth: 36, // 柱图宽度
              data: Object.keys(temp).map(key1 => temp[key1][index].problemTypesInfoCount)
            }
          })
          this.initBar7data = seriesValue
          Object.keys(temp).forEach(function(key, idx) {
            temp[key].forEach(function(item) {
              arr1.push(item.problemTypesInfo)
              resultarr = [...new Set(arr1)]
            })
          })
          console.log('seriesValue--777_2', seriesValue, resultarr, 'temp', temp)
          this.initBar7shortName = resultarr
        }
      } else {
        console.log('seriesValue--else')
      }
      var option = {
        title: {
          top: '0%',
          left: 'center',
          text: data.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            handleSize: 32,
            startValue: 0,
            endValue: 6
          },
          {
            zoomLock: true,
            type: 'inside'
          }
        ],
        legend: {
          top: '4%',
          right: '8%'
        },
        grid: {
          left: '3%',
          right: '6%',
          containLabel: true
        },
        xAxis: {
          name: '问题细分',
          type: 'category',
          offset: 7,
          axisLabel: {
            interval: 0,
            rotate: '50',
            lineHeight: 18,
            formatter: function(params) {
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 8// 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
              // 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''// 表示每一次截取的字符串
                  var start = p * provideNumber// 开始截取的位置
                  var end = start + provideNumber// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p == rowNumber - 1) { // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber)
                  } else { // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr// 最终拼成的字符串
                }
              } else { // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          },
          data: resultarr
          // data: data.data.map(item => item.name)
        },
        yAxis: {
          name: '件数',
          type: 'value'
        },
        color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47'],
        series: seriesValue
      }
      myChart.setOption(option)
      // 在渲染点击事件之前先清除点击事件
      myChart.off('click')
      myChart.getZr().off('click')
    },
    toFixed(num) {
      return Number(num).toFixed(2)
    },
    deliveryMethodSon() { // 发货汇总调用子方法
      this.$refs.deliveryEcharts.getDeliverySummary()
    },
    problemMethodSon() { // 问题件统计调用子方法
      this.$refs.problemEcharts.getProblemTypes() // 问题类型细分
      this.$refs.problemEcharts.getProblemStatistics() // 问题件统计
    },
    trajectoryMethodSon() { // 轨迹预警调用子方法
      this.$refs.trajectoryEcharts.getYesterTrajectory() // 轨迹预警
    },
    DeliverEffectMethodSon() { // 头程时效看板调用子方法
      this.$refs.DeliverEffectEcharts.getFirstDeliverEffect() // 头程时效看板
    },
    TicketCostMethodSon() { // 均票成本调用子方法
      this.$refs.TicketCostEcharts.getFindAverage() // 均票成本
    },
    RetuntRateMethodSon() { // 退款率调用子方法
      this.$refs.RetuntRateEcharts.getDeliverOrderInfo() // 退款率
    },
    onTabsChange(name) {
      console.log('name', name)
      if (name === 'baseInfo1') {
        if (!this.$refs.deliveryEcharts.args1.dateFrom) {
          this.$refs.deliveryEcharts.date = [this.$moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')]
          this.$refs.deliveryEcharts.args1.dateFrom = this.$moment(this.$refs.deliveryEcharts.date[0]).format('YYYY-MM-DD') // 发货汇总-开始日期
          this.$refs.deliveryEcharts.args1.dateTo = this.$moment(this.$refs.deliveryEcharts.date[1]).format('YYYY-MM-DD')
        }
        this.deliveryMethodSon()
        if (!this.$refs.problemEcharts.date6) {
          this.$refs.problemEcharts.date6 = this.$moment().format('YYYY-MM')
          this.$refs.problemEcharts.args6.loadTime = this.$moment().format('YYYY-MM')
        }
        this.problemMethodSon() // 问题件统计

        if (!this.date7) {
          this.date7 = this.$moment().format('YYYY-MM')
          this.args7.loadTime = this.$moment().format('YYYY-MM')
        }
        this.getProblemTypes7() // 问题类型细分
        this.getOrderStatistics() // 快递统计
        this.trajectoryMethodSon() // 轨迹预警
        this.DeliverEffectMethodSon() // 头程时效看板
      }
      if (name === 'baseInfo2') { // 均票成本
        if (!this.$refs.TicketCostEcharts.args2.loadDateStart) {
          this.$refs.TicketCostEcharts.date2 = [this.$moment(new Date()).subtract(1, 'M').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')] // 票均成本
          this.$refs.TicketCostEcharts.searForm.loadDateStart = this.$moment(this.$refs.TicketCostEcharts.date2[0]).format('YYYY-MM-DD') // 均票成本-开始日期-旧接口
          this.$refs.TicketCostEcharts.searForm.loadDateEnd = this.$moment(this.$refs.TicketCostEcharts.date2[1]).format('YYYY-MM-DD')
          this.$refs.TicketCostEcharts.args2.loadDateStart = this.$moment(this.$refs.TicketCostEcharts.date2[0]).format('YYYY-MM-DD') // 均票成本-开始日期
          this.$refs.TicketCostEcharts.date2.loadDateEnd = this.$moment(this.$refs.TicketCostEcharts.date2[1]).format('YYYY-MM-DD')
        }
        this.TicketCostMethodSon() // 均票成本
      }
      if (name === 'baseInfo3') { // 头程时效看板 这个版本不需要
        this.DeliverEffectMethodSon()
      }
      if (name === 'baseInfo4') { // 退款率
        this.RetuntRateMethodSon()
      }
      if (name === 'baseInfo5') { // 妥投率
        if (!this.args5.loadTimeStart) {
          this.date5 = [this.$moment(new Date()).subtract(1, 'M').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')] // 妥投率
          this.args5.loadTimeStart = this.$moment(this.date5[0]).format('YYYY-MM-DD') // 妥投率-开始日期
          this.args5.loadTimeEnd = this.$moment(this.date5[1]).format('YYYY-MM-DD')
        }

        if (!this.args5.shippingMethodLevel) {
          this.args5.shippingMethodLevel = 'R' // 默认挂号
        }
        this.getFindPrescRate()
      }
      /** 问题件、快递统计暂时不要删除，防止以后切换回来 */
      if (name === 'baseInfo6') { // 问题件
        if (!this.$refs.problemEcharts.date6) {
          this.$refs.problemEcharts.date6 = this.$moment().format('YYYY-MM')
        }
        this.problemMethodSon() // 问题类型细分-问题件统计
      }
      if (name === 'baseInfo7') { // 快递统计
        if (!this.date7) {
          this.date7 = this.$moment().format('YYYY-MM')
        }
        this.getProblemTypes7() // 问题类型细分
        this.getOrderStatistics() // 快递统计
      }
    },
    getDeliverySummary2() { // 昨日发货票量
      const _this = this
      let args1 = { // 查询参数
        shippingCompanyCode: '', // 物流商代码
        isDate: true,
        dateFrom: this.$moment().subtract(1, 'days').format('YYYY-MM-DD'), // 	开始日期
        dateTo: this.$moment().subtract(1, 'days').format('YYYY-MM-DD') // 	结束日期
      }
      home.getFindDeliverySummary(args1).then(res => {
        if (res.data.success) {
          _this.inforCardData[0].count = (res.data.result.length && res.data.result[0].totalCount) || 0
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取发货汇总数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    getBatchMangementList2() { // 头程代发货、已发货、妥投预警
      let send = {
        search: {
          status: '10' // 状态
        },
        pageReqired: true,
        limit: 10,
        offset: 0
      }
      searchFirstOrder(send).then(res => { // 头程待合单
        if (res.data.success) {
          this.inforCardData[4].obj1[0].count = res.data.total
        } else {
          this.$Message.warning({ content: res.data.errorMsg || '获取头程数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log(err)
      })
      let sendData = { status: '' }
      firstBatOrderGetCountByExample(sendData).then(res => {
        if (res.data.success) {
          let temp = res.data.result
          temp.forEach(item => {
            if (item.status == '10') { // 待发货
              this.inforCardData[4].obj1[1].count = item.count
            }
            if (item.status == '40') { // 已发货
              this.inforCardData[4].obj1[2].count = item.count
            }
            if (item.status == '81') { // 妥投预警
              this.inforCardData[4].obj1[3].count = item.count
            }
          })
        } else {
          this.$Message.warning({ content: res.data.errorMsg || '获取头程数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getFindAverage2() { // 前天票均成本-之前版本需求，有需要直接打开就可以了
      const _this = this
      let args2 = { // 查询参数
        loadDateStart: this.$moment().subtract(2, 'days').format('YYYY-MM-DD'), // 	开始日期
        loadDateEnd: this.$moment().subtract(2, 'days').format('YYYY-MM-DD') // 	结束日期
      }
      home.getFindAverageShippingCostDataSum(args2).then(res => {
        if (res.data.success) {
          if (res.data.result.length) {
            let rowList = JSON.parse(JSON.stringify(res.data.result))
            // 总运费 / 总票数  = 实际票均成本
            let temp1 = rowList.reduce((index, item) => index + item.totalShippingCost, 0)
            let temp2 = rowList.reduce((index, item) => index + item.totalCount, 0)

            _this.inforCardData[1].count = temp1 / temp2
            // console.log('前天票均成本3', temp1, temp2, '票均成本:', temp1 / temp2)
          }
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取均票成本数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    getYesterdayPresc2() { // 昨日新增妥投超时
      const _this = this
      home.getYesterdayPresc().then(res => {
        if (res.data.success) {
          _this.inforCardData[2].obj1[0].count = res.data.result.timeoutCount ? res.data.result.timeoutCount : 0
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取昨日新增妥投超时数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    getfirstClaim4() { // 待索赔包裹
      const _this = this
      let temp = this.$cloneDeep(this.args4_4)// 数据处理
      getfirstClaim(temp).then(res => { // 头程待索赔
        if (res.data.success) {
          if (res.data.rows.length) {
            _this.inforCardData[1].obj1[1].count = res.data.rows.length
          }
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取头程待索赔数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log(err)
      })
      let send = {
        search: { },
        pageReqired: true,
        limit: 20,
        offset: 0
      }
      awaitClaimApi.searchLogisticsPendingClaim(send).then(res => { // 小包待索赔
        if (res.data.success) {
          _this.inforCardData[1].obj1[0].count = (res.data && res.data.total) || 0
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取小包待索赔数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getAbnormalAgingList() { // 今日异常时效
      let send = {
        search: {
          operatorStartTime: '', // 否	操作开始时间 2022-05-04 00:00:00'
          operatorEndTime: '', // 否		操作结束时间 2022-05-04 23:59:59
          status: '' //	否	Integer	时效状态 7,10,15,20,30,40,60,无就是历史数据 单位天
        },
        pageReqired: true,
        limit: 10,
        offset: 0
      }
      const _this = this
      send.search[`operatorStartTime`] = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'// 操作开始时间
      send.search[`operatorEndTime`] = this.$moment().format('YYYY-MM-DD') + ' 23:59:59' //		操作结束时间
      abnormalApi.searchAbnormalAgingList(send).then(res => {
        if (res.data.success) {
          _this.inforCardData[2].obj1[1].count = (res.data && res.data.total) || 0
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取今日异常时效数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    gettotalProblemManagement2() { // 时效问题数-时效、退件、赔偿
      const _this = this
      home.gettotalProblemManagement().then(res => {
        if (res.data.success) {
          _this.inforCardData[3].obj1.forEach(item1 => {
            res.data.result && res.data.result.forEach(item => {
              if (item1.title == '时效问题数' && item.problemTypes == '0') {
                item1.count = item.total
              }
              if (item1.title == '退件问题数' && item.problemTypes == '1') {
                item1.count = item.total
              }
              if (item1.title == '赔偿问题数' && item.problemTypes == '2') {
                item1.count = item.total
              }
            })
          })
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取昨日新增妥投超时数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    getFindPrescRate() { // 首页妥投率
      if (!this.args5.loadTimeStart) {
        return this.$Modal.error({ title: '请选择发货时间！' })
      }
      if (!this.args5.shippingMethodLevel) {
        return this.$Modal.error({ title: '请选择物流级别！' })
      }
      this.data = this.$cloneDeep(this.$options.data().data) // 初始化
      const _this = this
      _this.tableLoading = true
      home.getFindPrescRate(this.args5).then(res => {
        if (res.data.success) {
          if (res.data.result) {
            let arr = []
            let SetArr = []
            res.data.result.forEach(item => {
              arr.push(item.shippingMethodCode)
            })
            SetArr = [...new Set(arr)]
            let arr2 = []
            SetArr.forEach(item1 => {
              let temp = {
                shippingMethodCode: '',
                M: 0, // 平邮
                E: 0, // 快递
                R: 0 // 挂号
              }
              res.data.result.forEach(item2 => {
                if (item1 == item2.shippingMethodCode) {
                  temp.shippingMethodCode = item2.shippingMethodCode
                  if (item2.shippingMethodLevel === 'E') {
                    temp.E = item2.prescRate
                  }
                  if (item2.shippingMethodLevel === 'M') {
                    temp.M = item2.prescRate
                  }
                  if (item2.shippingMethodLevel === 'R') {
                    temp.R = item2.prescRate
                  }
                }
              })
              arr2.push(temp)
            })
            // console.log('首页res.data.result', arr2, SetArr)
            this.data.data5 = arr2
            _this.initAll()
          }
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取妥投率数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(function() {
        _this.tableLoading = false
      })
    },
    getProblemTypes7() { // 快递统计-细分
      const _this = this
      deliveryOrder.findSelectValuesType({ problemTypes: '' }).then(res => {
        if (res.data.success) {
          _this.problemType7 = res.data.result || {}
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取问题件统计数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    getOrderStatistics() { // 首页快递统计细分详情
      if (!this.args7.loadTime) {
        return this.$Modal.error({ title: '请选择时间' })
      }
      let tempStatus7 = this.status7 && this.status7.join(',')
      let tempTypesInfo7 = this.typesInfo7 && this.typesInfo7.join(',')
      this.args7.processingStatus = tempStatus7
      this.args7.problemTypesInfo = tempTypesInfo7
      this.data = this.$options.data().data // 初始化
      const _this = this
      _this.tableLoading = true
      home.getOrderStatistics(this.args7).then(res => {
        if (res.data.success) {
          _this.data.data7 = res.data.result ? res.data.result : {}
          _this.initAll7()
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取快递统计数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(function() {
        _this.tableLoading = false
      })
    },
    getOrderStatisticsType() { // 首页快递订单问题类型统计
      if (!this.args7.loadTime) {
        return this.$Modal.error({ title: '请选择时间' })
      }
      this.data = this.$cloneDeep(this.$options.data().data) // 初始化
      const _this = this
      _this.tableLoading = true
      home.getOrderStatisticsType(this.args7_2).then(res => {
        if (res.data.success) {
          _this.data.data7_2 = res.data.result ? res.data.result : {}
          _this.initAll7_2()
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取快递订单问题类型统计数据失败-500', duration: 4 })
        }
      }).catch(err => {
        console.log('err', err)
      }).finally(function() {
        _this.tableLoading = false
      })
    },
    resize() {
      this.dom.resize()
    },
    resize1() {
      this.dom1.resize()
    },
    // 给数据赋值
    assignData() {
      this.args5.loadTimeStart = this.$moment(this.date5[0]).format('YYYY-MM-DD') // 妥投率-开始日期
      this.args5.loadTimeEnd = this.$moment(this.date5[1]).format('YYYY-MM-DD')
      this.args7.loadTime = this.$moment().format('YYYY-MM') // 问题件统计
      this.date7 = this.$moment().format('YYYY-MM') // 问题件统计
    },
    getCollectCompanyList() { // 获取揽收公司
      const _this = this
      logisticstypeOpr.getCollectCompanyList().then(function(res) {
        if (res.data.success) {
          _this.collectCompanys = Object.keys(res.data.result || {}).map(key => ({
            val: Number(key),
            label: res.data.result[key]
          }))
        } else {
          _this.$Message.warning({ content: res.data.errorMsg || '获取揽收公司数据失败-500', duration: 4 })
        }
      }).catch(function(err) {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
.Anchor {
  position: fixed;
  top: 45%;
  right: 24px;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.Anchor > a {
  text-align: center;
  background-color: rgb(102, 102, 102);
  width: 95px;
  padding: 5px;
  color: aliceblue;
  white-space: wrap;
  line-height: 20px;
  border-top: 1px solid #cccccc;
}
.Anchor > a:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
<style lang="less">
  .count-style{
    font-size: 50px;
  }
  .h_m_t_w_b{
    height: 540px;
    border-radius: 4px;
    margin: 10px 1% 0px 1%;
  }
  .wwww canvas{
    display: none;
  }
  .wwww div{
    display: none;
  }
  .head_box .ivu-select-selection{
    max-height: 40px;
  }
  .table-container {
  max-height: 300px;
  overflow: auto;
  width: 100%;
  table {
    width: 100%;
    border: 1px solid #ccc;
    border-collapse: collapse;
    text-align: center;
  }
  tr,
  th,
  td {
    padding: 0 5px;
    height: 34px;
    border: 1px solid #ccc;
  }
  tr,
  th {
    height: 30px;
  }
}
</style>

<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="任务" name="任务" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-infinite-outline" />
                        任务搜索
                    </p>
                    <Form ref="searchProjectEnvName" :model="searchProjectEnvName" :label-width="80" style="margin-top: 13px;margin-left: -25px">
                        <FormItem label="" prop="name">
                            <Row>
                                <Col span="5" style="padding-right:10px; margin-left: -5%">
                                    <Select v-model="projectSelectModel" placeholder="请选择项目" filterable>
                                        <Option v-for="item in projectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </Col>
                                <Input v-model="searchProjectEnvName.name" style="width: 250px;margin-left: 5%" icon="android-search" placeholder="请输入任务名称"></Input>
                                <!--<Button type="primary" @click="searchCommonCase" style="margin-left: 2%;"-->
                                <!--icon="android-search">搜索-->
                                <!--</Button>-->
                            </Row>
                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        任务信息
                    </p>
                    <Table :loading="loading" :columns="jobsTable" :data="jobsTableData" :border="showBorder"
                           no-data-text="没有数据" height="470" :row-class-name="rowClassName"
                           :stripe="showStripe" style="margin-top: -7px;margin-left: -7px"
                           :show-header="showHeader" showIndex="true"></Table>
                    <i-col span="14" offset="9" style="margin-top: 15px">
                        <Page :total="pageHelp.totalNum" :current="pageHelp.curPage" :page-size="pageHelp.pageSize"
                              @on-change="getJobsPageIndex" @on-page-size-change="getJobsPageSize"
                              :page-size-opts="pageSizeOptions" size="small" show-elevator show-sizer show-total
                              placement="top"></Page>
                    </i-col>
                    <br>
                    <br>
                </Card>
            </TabPane>

        </Tabs>
        <!-- 失败用例详情对话框  -->
        <Modal v-model="jobDetailModal" width="800" :mask-closable="false" :styles="{top: '20px'}">
            <p slot="header" style="color:#f60;text-align:left">
                <Icon type="ios-information-circle"></Icon>
                <span>失败用例列表</span>
            </p>
            <Table :loading="loading" :columns="caseTable" :data="caseTableData" noborder
                   no-data-text="没有数据" height="380"
                   :stripe="showStripe" style="margin-top: -7px;margin-left: -7px" fixedHeader="true"
                   :show-header="showHeader" showIndex="true"></Table>
            <i-col span="14" offset="9" style="margin-top: 15px">
                <Page :total="pageHelp.totalNum" :current="pageHelp.curPage" :page-size="pageHelp.pageSize"
                      @on-change="getJobsPageIndex" @on-page-size-change="getJobsPageSize"
                      :page-size-opts="pageSizeOptions" size="small" show-elevator show-sizer show-total
                      placement="top"></Page>
            </i-col>
            <br>
            <br>
            <div slot="footer">
                <Button type="primary"   @click="exitJobDetailButton">退出</Button>
            </div>
        </Modal>

        <!-- 失败用例步骤详情对话框  -->
        <Modal v-model="stepsDetailModal" width="800" :mask-closable="false" :styles="{top: '20px'}" >
            <p slot="header" style="color:#f60;text-align:left">
                <Icon type="ios-information-circle"></Icon>
                <span>用例步骤</span>
            </p>
            <Table :loading="loading" :columns="stepsTable" :data="stepsTableData" noborder
                   no-data-text="没有数据" height="380"
                   :stripe="showStripe" style="margin-top: -7px;margin-left: -7px" fixedHeader="true"
                   :show-header="showHeader" showIndex="true"></Table>
            <div slot="footer">
                <Button type="primary"   @click="exitStepsDetailButton">退出</Button>
            </div>
        </Modal>

        <!-- 失败用例步骤详情对话框  -->
        <Modal v-model="resultDetailModal" width="600" :mask-closable="false" :styles="{top: '20px'}">
            <p slot="header" style="color:#f60;text-align:left" >
                <Icon type="ios-information-circle"></Icon>
                <span>接口返回信息&&预期信息</span>
            </p>
            <div><label style="color:green;">接口返回:</label></div><br>
            <Monaco
                    theme="vs"
                    language="json"
                    style="border:1px;border-top-color: rgb(238, 238, 238);
                      font-size: xx-small;
                      border-top-style: solid;
                      border-top-width: 1px;
                      border-right-color: rgb(238, 238, 238);
                      border-right-style: solid;
                      border-right-width: 1px;
                      border-bottom-color: rgb(238, 238, 238);
                      border-bottom-style: solid;
                      border-bottom-width: 1px;
                      border-left-color: rgb(238, 238, 238);
                      border-left-style: solid;
                      border-left-width: 1px;
                      border-image-source: initial;
                      border-image-slice: initial;
                      border-image-width: initial;
                      border-image-outset: initial;
                      border-image-repeat: initial;"
                    :code="jsontParam"
                    :editorOptions="options"
                    @mounted="onJsonMounted"
                    @codeChange="onJsonCodeChange"
            >
            </Monaco>
            <br>
            <div><label style="color:red;">错误信息:</label></div><br>
            <Monaco
                    theme="vs"
                    language="plaintext"
                    style="border:1px;border-top-color: rgb(238, 238, 238);
                      font-size: xx-small;
                      border-top-style: solid;
                      border-top-width: 1px;
                      border-right-color: rgb(238, 238, 238);
                      border-right-style: solid;
                      border-right-width: 1px;
                      border-bottom-color: rgb(238, 238, 238);
                      border-bottom-style: solid;
                      border-bottom-width: 1px;
                      border-left-color: rgb(238, 238, 238);
                      border-left-style: solid;
                      border-left-width: 1px;
                      border-image-source: initial;
                      border-image-slice: initial;
                      border-image-width: initial;
                      border-image-outset: initial;
                      border-image-repeat: initial;"
                    :code="plaintextInfo"
                    :editorOptions="options"
                    @mounted="onPlainTextMounted"
                    @codeChange="onPlainTextCodeChange"
            >
            </Monaco>
            <div slot="footer">
                <Button type="primary"   @click="exitResultDetailButton">退出</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Row from 'iview/src/components/grid/row';
    import ICol from 'iview/src/components/grid/col';
    import $ from 'jquery';
    import expandRow from './table-expand-data.vue';
    import Monaco from 'monaco-editor-forvue';

    export default {
        components: {
            ICol,
            Row,
            expandRow,
            Monaco
        },
        name: 'jobs',
        data () {
            return {
                plaintextInfo: '',
                jsontParam: '',
                resultDetailModal: false,
                projectSelectModel: '',
                projectList: [
                    {
                        value: '核心支付',
                        label: '核心支付'
                    },
                    {
                        value: '对账系统',
                        label: '对账系统'
                    },
                    {
                        value: '会计系统',
                        label: '会计系统'
                    },
                    {
                        value: '拦截系统',
                        label: '拦截系统'
                    }
                ],
                searchProjectEnvName: {name: ''},
                pageSizeOptions: [10, 20, 30, 50, 100],
                pageHelp: {
                    totalNum: 0,
                    curPage: 1,
                    pageSize: 10
                },
                loading: false,
                caseTableData: [
                    {
                        name: '工行绑卡',
                        status: '失败',
                        executeTime: '2018-10-08 09:32:50',
                        jobId: '',
                        caseId: '',
                        cellClassName: {
                            status: 'demo-table-info-cell-fail'
                        }
                    },
                    {
                        name: '下单',
                        status: '失败',
                        executeTime: '2018-10-08 09:32:50',
                        jobId: '',
                        caseId: '',
                        cellClassName: {
                            status: 'demo-table-info-cell-fail'
                        }
                    },
                    {
                        name: '批量支付',
                        status: '失败',
                        executeTime: '2018-10-08 09:32:50',
                        jobId: '',
                        caseId: '',
                        cellClassName: {
                            status: 'demo-table-info-cell-fail'
                        }
                    }
                ],
                caseTable: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用例名称',
                        key: 'name',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '执行时间',
                        key: 'executeTime',
                        align: 'center'
                    },
                    {
                        title: '执行结果',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '7px'
                                    },
                                    on: {
                                        click: () => {
                                            this.stepsDetailModal = true;
                                        }
                                    }
                                }, '步骤详情'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '7px'
                                    },
                                    on: {
                                        click: () => {
                                        }
                                    }
                                }, '重新执行')
                            ]);
                        }
                    }
                ],
                stepsTableData: [
                    {
                        name: '搜索订单',
                        status: '成功',
                        stepType: 'http',
                        executeTime: '2018-10-08 09:32:50',
                        jobId: '',
                        caseId: '',
                        cellClassName: {
                            status: 'demo-table-info-cell-success'
                        }
                    },
                    {
                        name: '下单',
                        status: '成功',
                        stepType: 'http',
                        executeTime: '2018-10-08 09:32:50',
                        jobId: '',
                        caseId: '',
                        cellClassName: {
                            status: 'demo-table-info-cell-success'
                        }
                    },
                    {
                        name: '批量支付',
                        status: '失败',
                        stepType: 'sql',
                        executeTime: '2018-10-08 09:32:50',
                        jobId: '',
                        caseId: '',
                        cellClassName: {
                            status: 'demo-table-info-cell-fail'
                        }
                    }
                ],
                stepsTable: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '步骤名称',
                        key: 'name',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '步骤类型',
                        key: 'stepType',
                        align: 'center',
                        width: 90
                    },
                    {
                        title: '执行时间',
                        key: 'executeTime',
                        align: 'center'
                    },
                    {
                        title: '执行结果',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '7px'
                                    },
                                    on: {
                                        click: () => {
                                            this.resultDetailModal = true;
                                        }
                                    }
                                }, '详细信息')
                            ]);
                        }
                    }
                ],
                jobsTable: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            });
                        }
                    },
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '任务名称',
                        key: 'name',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '完成进度',
                        key: 'progress',
                        align: 'center',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('Progress', {
                                    props: {
                                        type: 'Progress',
                                        size: 'small',
                                        percent: parseInt(params.row.progress)
                                    }
                                }, params.row.progress + '%')]);
                        }

                    },
                    {
                        title: '用例总数',
                        key: 'total',
                        align: 'center'
                    },
                    {
                        title: '成功',
                        key: 'successNum',
                        align: 'center'
                    },
                    {
                        title: '失败',
                        key: 'failNum',
                        align: 'center'
                    },
                    {
                        title: '未执行',
                        key: 'noExecute',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.jobDetailModal = true;
                                        }
                                    }
                                }, '详情')
                            ]);
                        }
                    }
                ],
                jobsTableData: [
                    {
                        name: '核心支付2018093001',
                        projectName: '核心支付',
                        noExecute: '3',
                        total: 199,
                        status: 1,
                        failNum: '2',
                        successNum: '194',
                        progress: 100,
                        startTime: '2018-10-10 08:30:23',
                        finishTime: '2018-10-10 08:30:23',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        name: '核心支付2018092201',
                        projectName: '核心支付',
                        noExecute: '3',
                        total: 199,
                        status: 2,
                        failNum: '2',
                        successNum: '194',
                        progress: 80,
                        startTime: '2018-10-10 08:30:23',
                        finishTime: '2018-10-10 08:30:23',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        name: '核心支付2018092021',
                        noExecute: '3',
                        total: 199,
                        projectName: '核心支付',
                        status: 1,
                        failNum: '2',
                        successNum: '194',
                        progress: 60,
                        startTime: '2018-10-10 08:30:23',
                        finishTime: '2018-10-10 08:30:23',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        name: '核心支付2018012001',
                        noExecute: '3',
                        projectName: '核心支付',
                        total: 199,
                        status: 3,
                        failNum: '2',
                        successNum: '194',
                        progress: 0,
                        startTime: '2018-10-10 08:30:23',
                        finishTime: '2018-10-10 08:30:23',
                        create_time: '2018-09-20 12:30:10'
                    }
                ],
                jobDetailModalTitle: 'job详情',
                jobDetailModal: false,
                stepsDetailModal: false,
                commonTablsName: '任务',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                visible: false,
                showBorder: true,
                showStripe: true,
                showHeader: true,
                fixedHeader: true
            };
        },
        methods: {
            onPlainTextMounted (editor) {
                this.texteditor = editor;
                this.texteditor.layout({
                    width: 500,
                    height: 100
                });
                this.texteditor.setValue('');
            },
            onPlainTextCodeChange (editor) {
                // this.queryResult = this.editor.getValue()
            },
            onJsonMounted (editor) {
                this.jsoneditor = editor;
                this.jsoneditor.layout({
                    width: 500,
                    height: 200
                });
                this.jsoneditor.setValue('');
            },
            onJsonCodeChange (editor) {
                // this.queryResult = this.editor.getValue()
            },
            exitJobDetailButton () {
                this.jobDetailModal = false;
            },
            exitStepsDetailButton () {
                this.stepsDetailModal = false;
            },
            exitResultDetailButton () {
                this.resultDetailModal = false;
            },
            upfile () {
                this.upfileModal = true;
            },
            rowClassName (row, index) {
                if (row.status === 1) {
                    return 'demo-table-info-row';
                } else if (row.status === 2) {
                    return 'demo-table-error-row';
                }
                return 'demo-table-info-column';
            },
            searchCommonCase () {
                let url = '/api/getall';
                $.ajax({
                    type: 'GET',
                    async: true,
                    url: url,
                    dataType: 'json',
                    crossDomain: true,
                    success: (result, status) => {
                        this.$Message.success(result.msg);
                        window.ajaxFail.call(this, result);
                        // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                    },
                    error: (errorMsg) => {
                        window.ajaxFail.call(this, errorMsg);
                    }
                });
            },
            getJobsPageSize (size) {
                this.pageHelp.pageSize = size;
            },
            getJobsPageIndex (index) {
                this.pageHelp.curPage = index;
            },
            render (item) {
                return item.label;
            },
            addProjectEnv () {
                this.addProjectEnvModal = true;
                // this.commonTablsName = '多音字标注'
                // this.$set(this.commonTablsName, '项目&版本维护');
            },
            updateProject () {
                this.updateProjectModal = false;
                // this.commonTablsName = '多音字标注'
                // this.$set(this.commonTablsName, '项目&版本维护');
            },
            resetProject () {
            }
        }

    };
</script>

<style >
    .ivu-table .demo-table-info-row td{
        /*background-color: #2db7f5;*/
        color: green;
    }
    .ivu-table .demo-table-error-row td{
        /*background-color: #ff6600;*/
        color: red;
    }
    .ivu-table td.demo-table-info-column{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-name {
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-fail {
        /*background-color: #ff6600;*/
        color: red;
    }
    .ivu-table .demo-table-info-cell-success {
        /*background-color: #ff6600;*/
        color: green;
    }
</style>

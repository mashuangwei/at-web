<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="任务" name="任务" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-infinite-outline" />
                        任务搜索
                    </p>
                    <Form ref="searchProjectEnvName" :model="searchProjectEnvName" :label-width="80" style="margin-top: 13px">
                        <FormItem label="" prop="name">
                            <!--<Input v-model="searchProjectEnvName.name" style="width: 270px;margin-left: -20px" placeholder="请输入搜索的项目名称"></Input>-->
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
                    <Table :loading="loading" :columns="projectTable" :data="projectTableData" :border="showBorder"
                           no-data-text="没有数据" height="470" :row-class-name="rowClassName"
                           :stripe="showStripe" style="margin-top: -7px;margin-left: -7px"
                           :show-header="showHeader" showIndex="true"></Table>
                    <i-col span="14" offset="9" style="margin-top: 15px">
                        <Page :total="pageHelp.totalNum" :current="pageHelp.curPage" :page-size="pageHelp.pageSize"
                              @on-change="getProjectPageIndex" @on-page-size-change="getProjectPageSize"
                              :page-size-opts="pageSizeOptions" size="small" show-elevator show-sizer show-total
                              placement="top"></Page>
                    </i-col>
                    <br>
                    <br>
                </Card>
            </TabPane>
            <TabPane label="用例管理" name="用例管理" icon="ios-paper-outline">
                标签二的内容
            </TabPane>
        </Tabs>
        <!-- 添加项目对话框  -->
        <Modal
                :mask-closable="false"
                width="500"
                :title="projectModalTitle"
                okText="添加"
                v-model="addProjectEnvModal"
                @on-ok="addProjectEnv"
                :styles="{top: '20px'}">

            <!--<Card>-->
            <!--<p slot="title">-->
            <!--<Icon type="android-add"></Icon>-->
            <!--项目添加-->
            <!--</p>-->
            <Form ref="project" :model="caseinfo" :label-width="80">
                <FormItem label="用例名称" prop="name">
                    <Input v-model="caseinfo.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="用例类型" prop="type">
                    <Input v-model="caseinfo.type" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="是否执行" style="width: 350px" prop="execute">
                    <Input v-model="caseinfo.execute"></Input>
                </FormItem>
                <FormItem label="是否分享" style="width: 350px" prop="share">
                    <Input v-model="caseinfo.share"></Input>
                </FormItem>
            </Form>
            <!--</Card>-->
        </Modal>
        <!-- 编辑项目对话框  -->
        <Modal
                :mask-closable="false"
                width="500"
                :title="updateProjectModalTitle"
                okText="保存"
                v-model="updateProjectModal"
                @on-ok="updateProject"
                :styles="{top: '20px'}">
            <Form ref="project" :model="caseinfo" :label-width="80">
                <FormItem label="用例名称" prop="name">
                    <Input v-model="caseinfo.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="用例类型" style="width: 350px" prop="type">
                    <Input v-model="caseinfo.type"></Input>
                </FormItem>
                <FormItem label="是否执行" style="width: 350px" prop="execute">
                    <Input v-model="caseinfo.execute"></Input>
                </FormItem>
                <FormItem label="是否分享" style="width: 350px" prop="share">
                    <Input v-model="caseinfo.share"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import Row from 'iview/src/components/grid/row';
    import ICol from 'iview/src/components/grid/col';
    import $ from 'jquery';

    export default {
        components: {
            ICol,
            Row
        },
        name: 'jobs',
        data () {
            return {
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
                updateProjectModalTitle: '编辑',
                updateProjectModal: false,
                searchProjectEnvName: {name: ''},
                pageSizeOptions: [10, 20, 30, 50, 100],
                pageHelp: {
                    totalNum: 0,
                    curPage: 1,
                    pageSize: 10
                },
                loading: false,
                projectTable: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '任务名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '项目名称',
                        key: 'projectName',
                        align: 'center'
                    },
                    {
                        title: '开始时间',
                        key: 'startTime',
                        align: 'center'
                    },
                    {
                        title: '结束时间',
                        key: 'finishTime',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 1 ? 'green' : row.status === 2 ? 'red' : 'blue';
                            // const color = 'green';
                            const text = row.status === 1 ? '成功' : row.status === 2 ? '失败' : '新建';
                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '完成进度',
                        key: 'progress',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('Progress', {
                                    props: {
                                        type: 'Progress',
                                        size: 'small',
                                        // status: 'wrong',
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
                                            // this.removeMosTemplate(params.index)
                                        }
                                    }
                                }, '详情')
                            ]);
                        }
                    }
                ],
                projectTableData: [
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
                projectModalTitle: '添加',
                addProjectEnvModal: false,
                commonTablsName: '任务',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                caseinfo: {
                    name: '创建购物订单',
                    execute: 'on',
                    status: null,
                    type: 'Http',
                    share: 'y',
                    create_time: ''
                },
                visible: false,
                showBorder: true,
                showStripe: true,
                showHeader: true,
                fixedHeader: true
            };
        },
        methods: {
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
            getProjectPageSize (size) {
                this.pageHelp.pageSize = size;
            },
            getProjectPageIndex (index) {
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
    .ivu-table .demo-table-info-cell-age {
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-address {
        background-color: #187;
        color: #fff;
    }
</style>

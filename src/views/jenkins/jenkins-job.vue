<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="Jenkins项目" name="Jenkins项目" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-infinite-outline" />
                        项目选择
                    </p>
                    <Form ref="searchProjectEnvName" :model="searchProjectEnvName" :label-width="80" style="margin-top: 13px;margin-left: -20px">
                        <FormItem label="" prop="name">
                            <!--<Input v-model="searchProjectEnvName.name" style="width: 270px;margin-left: -20px" placeholder="请输入搜索的项目名称"></Input>-->
                            <Row>
                                <Col span="5" style="padding-right:10px; margin-left: -60px">
                                    <Select v-model="projectSelectModel" filterable>
                                        <Option v-for="item in projectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </Col>
                                <Button type="primary" @click="searchCommonCase" style="margin-left: 10px;padding-right:20px;"
                                        icon="android-search">搜索
                                </Button>

                            </Row>
                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        Jenkins项目列表
                    </p>
                    <Table :loading="loading" :columns="projectTable" :data="projectTableData" :border="showBorder"
                           no-data-text="没有数据" height="351"
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
        </Tabs>
        <Modal v-model="jobsModel" width="800">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>Job 列表</span>
            </p>
            <div style="text-align:center">
                <Table :loading="jobloading" :columns="jobsTable" :data="jobsTableData"
                no-data-text="没有数据" height="351"
                :stripe="showStripe" style="margin-top: -7px;margin-left: -7px"
                :show-header="showHeader" showIndex="true"></Table>
            </div>
            <div slot="footer">
                <Button type="primary"   @click="exitButton">退出</Button>
            </div>
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
        name: 'project',
        data () {
            return {
                projectSelectModel: '',
                projectList: [
                    {
                        value: 'jenkins-msw',
                        label: 'jenkins-msw'
                    },
                    {
                        value: 'jenkins-zhoujielun',
                        label: 'jenkins-zhoujielun'
                    },
                    {
                        value: 'jenkins-gaoyuanyuan',
                        label: 'jenkins-gaoyuanyuan'
                    },
                    {
                        value: 'jenkins-zhangli',
                        label: 'jenkins-zhangli'
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
                jobloading: false,
                jobsTable: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'JobId',
                        key: 'jobid',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center'
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
                        title: '忽略',
                        key: 'ignoreNum',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 200,
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
                                            this.$Message.success('success');
                                        }
                                    }
                                }, '日志'),
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
                                            this.$Message.success('执行');
                                            // this.updateProjectModal = true;
                                        }
                                    }
                                }, '停止'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            // this.removeMosTemplate(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                projectTable: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '项目名称',
                        key: 'projectName',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 200,
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
                                            this.jobsModel = true;
                                        }
                                    }
                                }, 'jobs详情'),
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
                                            // this.updateProjectModal = true;
                                        }
                                    }
                                }, '执行'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            // this.removeMosTemplate(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                jobsTableData: [
                    {
                        jobid: '22',
                        total: 600,
                        successNum: 350,
                        failNum: 2,
                        ignoreNum: 3,
                        status: '执行中',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        jobid: '23',
                        total: 700,
                        successNum: 350,
                        failNum: 2,
                        ignoreNum: 3,
                        status: '执行中',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        jobid: '24',
                        total: 700,
                        successNum: 500,
                        failNum: 1,
                        ignoreNum: 6,
                        status: '失败',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        jobid: '25',
                        total: 800,
                        successNum: 400,
                        failNum: 0,
                        ignoreNum: 1,
                        status: '成功',
                        create_time: '2018-09-20 12:30:10'
                    }
                ],
                projectTableData: [
                    {
                        projectName: '拦截系统',
                        author: 'masw',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        projectName: '对账系统',
                        author: '花好月圆',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        projectName: '计费系统',
                        author: '林志玲',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        projectName: '核心支付',
                        author: '小花',
                        create_time: '2018-09-20 12:30:10'
                    }
                ],
                projectModalTitle: '添加',
                jobModalTitle: 'Job信息',
                addProjectEnvModal: false,
                jobsModel: false,
                commonTablsName: 'Jenkins项目',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                project: {
                    projectName: '线上环境',
                    author: 'masw',
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
            exitButton () {
                this.jobsModel = false;
            },
            upfile () {
                this.upfileModal = true;
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
                this.addProjectEnvModal = true
                // this.commonTablsName = '多音字标注'
                // this.$set(this.commonTablsName, '项目&版本维护');
            },
            updateProject () {
                this.updateProjectModal = false
                // this.commonTablsName = '多音字标注'
                // this.$set(this.commonTablsName, '项目&版本维护');
            },
            resetProject () {
            }
        }

    };
</script>

<style scoped>

</style>

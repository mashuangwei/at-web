<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="调度" name="调度" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-search-strong"></Icon>
                        搜索  &&  <Icon type="ios-plus-empty" style="margin-left: 0px"></Icon>调度添加
                    </p>
                    <Form ref="searchProjectName" :model="searchProjectName" :label-width="80" style="margin-top: 13px;margin-left: -50px">
                        <FormItem label="" prop="name">
                            <Input v-model="searchProjectName.name" style="width: 270px;margin-left: -20px" placeholder="请输入调度名称"></Input>
                            <Button type="primary" @click="searchCommonCase" style="margin-left: 10px"
                                    icon="android-search">搜索
                            </Button>
                            <Button type="primary" @click="addProject" style="margin-left: 3px" icon="plus">
                                调度添加
                            </Button>
                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        调度信息
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
        <!-- 添加调度对话框  -->
        <Modal
                :mask-closable="false"
                width="500"
                :title="projectModalTitle"
                okText="添加"
                v-model="addProjectModal"
                @on-ok="addProject"
                :styles="{top: '20px'}">
            <Form ref="project" :model="project" :label-width="80">
                <FormItem label="调度名称" prop="name">
                    <Input v-model="project.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="项目">
                    <Select v-model="project.projectSelect" style="width: 270px" filterable>
                        <Option value="核心支付">核心支付</Option>
                        <Option value="计费系统">计费系统</Option>
                        <Option value="对账系统">对账系统</Option>
                        <Option value="拦截系统">拦截系统</Option>
                    </Select>
                </FormItem>
                <FormItem label="测试任务">
                    <Select v-model="project.taskname" style="width: 270px" filterable>
                        <Option value="主流程验证">主流程验证</Option>
                        <Option value="核心支付验证">核心支付验证</Option>
                        <Option value="对账系统验证">对账系统验证</Option>
                        <Option value="拦截系统回归">拦截系统回归</Option>
                    </Select>
                </FormItem>

                <FormItem label="Cron表达式" style="width: 350px" prop="cron">
                    <Input v-model="project.cron"></Input>
                </FormItem>
                <FormItem label="执行策略">
                    <RadioGroup v-model="project.type">
                        <Radio label="执行一次">
                            <Icon type="logo-apple"></Icon>
                            <span>执行一次</span>
                        </Radio>
                        <Radio label="按计划执行">
                            <Icon type="logo-windows"></Icon>
                            <span>按计划执行</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>
        <!-- 编辑调度对话框  -->
        <Modal
                :mask-closable="false"
                width="500"
                :title="updateProjectModalTitle"
                okText="保存"
                v-model="updateProjectModal"
                @on-ok="updateProject"
                :styles="{top: '20px'}">

            <Form ref="project" :model="project" :label-width="80">
                <FormItem label="调度名称" prop="name">
                    <Input v-model="project.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="项目">
                    <Select v-model="project.projectSelect" style="width: 270px" filterable>
                        <Option value="核心支付">核心支付</Option>
                        <Option value="计费系统">计费系统</Option>
                        <Option value="对账系统">对账系统</Option>
                        <Option value="拦截系统">拦截系统</Option>
                    </Select>
                </FormItem>
                <FormItem label="测试任务">
                    <Select v-model="project.taskname" style="width: 270px" filterable>
                        <Option value="主流程验证">主流程验证</Option>
                        <Option value="核心支付验证">核心支付验证</Option>
                        <Option value="对账系统验证">对账系统验证</Option>
                        <Option value="拦截系统回归">拦截系统回归</Option>
                    </Select>
                </FormItem>

                <FormItem label="Cron表达式" style="width: 350px" prop="cron">
                    <Input v-model="project.cron"></Input>
                </FormItem>
                <FormItem label="执行策略">
                    <RadioGroup v-model="project.type">
                        <Radio label="执行一次">
                            <Icon type="logo-apple"></Icon>
                            <span>执行一次</span>
                        </Radio>
                        <Radio label="按计划执行">
                            <Icon type="logo-windows"></Icon>
                            <span>按计划执行</span>
                        </Radio>
                    </RadioGroup>
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
        name: 'schedule',
        data () {
            return {
                updateProjectModalTitle: '编辑',
                updateProjectModal: false,
                searchProjectName: {name: ''},
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
                        title: '调度名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: 'Cron',
                        key: 'cron',
                        align: 'center'
                    },
                    {
                        title: '执行策略',
                        key: 'executeType',
                        align: 'center'
                    },
                    {
                        title: '项目名称',
                        key: 'projectName',
                        align: 'center'
                    },
                    {
                        title: '计划名称',
                        key: 'scheduleName',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
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
                        width: 300,
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
                                            this.updateProjectModal = true;
                                        }
                                    }
                                }, '编辑'),
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
                                }, '执行'),
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
                                }, '详情'),
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
                                            this.updateProjectModal = true;
                                        }
                                    }
                                }, '关闭'),
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
                projectTableData: [
                    {
                        name: '每天回归测试',
                        cron: '0 0 0-2 * * ? *',
                        scheduleName: '主流程验证',
                        projectName: '核心支付',
                        executeType: '一次执行',
                        create_time: '2018-09-20 12:30:10',
                        status: '生效中'
                    },
                    {
                        name: '每天回归测试',
                        cron: '0 0 0-2 * * ? *',
                        scheduleName: '基础功能验证',
                        projectName: '收单系统',
                        executeType: '一次执行',
                        create_time: '2018-09-20 12:30:10',
                        status: '生效中'
                    },
                    {
                        name: '每天集成测试',
                        cron: '0 0 0-2 * * ? *',
                        scheduleName: '主流程验证',
                        projectName: '计费系统',
                        executeType: '按计划执行',
                        create_time: '2018-09-20 12:30:10',
                        status: '生效中'
                    },
                    {
                        name: '每天回归测试',
                        cron: '0 0 0-2 * * ? *',
                        scheduleName: '主流程验证',
                        projectName: '核心支付',
                        executeType: '一次执行',
                        create_time: '2018-09-20 12:30:10',
                        status: '关闭'
                    }
                ],
                projectModalTitle: '添加',
                addProjectModal: false,
                commonTablsName: '调度',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                project: {
                    name: '主流程验证',
                    cron: '0 0 0-2 * * ? *',
                    projectid: '主流程验证',
                    type: '执行一次',
                    taskname: '主流程验证',
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
            addProject () {
                this.addProjectModal = true
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

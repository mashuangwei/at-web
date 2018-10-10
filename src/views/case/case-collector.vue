<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="用例集" name="用例集" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-search-strong"></Icon>
                        搜索  &&  <Icon type="ios-plus-empty" style="margin-left: 0px"></Icon>用例集添加
                    </p>
                    <Form ref="searchProjectName" :model="searchProjectName" :label-width="80" style="margin-top: 13px;margin-left: -55px">
                        <FormItem label="" prop="name">
                            <Input v-model="searchProjectName.name" style="width: 270px;margin-left: -20px" placeholder="请输入搜索的用例集"></Input>
                            <Button type="primary" @click="searchCommonCase" style="margin-left: 10px"
                                    icon="android-search">搜索
                            </Button>
                            <Button type="primary" @click="addProject" style="margin-left: 3px" icon="plus">
                                用例集添加
                            </Button>
                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        用例集信息
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
            <!--<TabPane label="缺陷" name="缺陷" icon="ios-paper-outline">-->
            <!--标签二的内容-->
            <!--</TabPane>-->
            <!--<TabPane label="执行记录" icon="ios-compose-outline">-->
            <!--标签三的内容-->
            <!--</TabPane>-->
        </Tabs>
        <!-- 添加数据库对话框  -->
        <Modal
                :mask-closable="false"
                width="800"
                :title="projectModalTitle"
                okText="添加"
                v-model="addProjectModal"
                @on-ok="addProject"
                :styles="{top: '20px'}">
            <Form ref="project" :model="project" :label-width="80">
                <FormItem label="用例集" prop="name">
                    <Input v-model="project.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="描述" prop="address">
                    <Input v-model="project.desc" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="项目">
                    <Select v-model="project.projectId" style="width: 270px" filterable>
                        <Option value="核心支付">核心支付</Option>
                        <Option value="计费系统">计费系统</Option>
                        <Option value="对账系统">对账系统</Option>
                        <Option value="拦截系统">拦截系统</Option>
                    </Select>
                </FormItem>
                <FormItem label="用例" prop="caselist">
                    <Transfer
                            :data="data3"
                            :target-keys="targetKeys3"
                            :list-style="listStyle"
                            :render-format="render3"
                            :operations="['左移','右移']"
                            filterable
                            :titles="['基础用例','测试集']"
                            @on-change="handleChange3">
                        <div :style="{float: 'right', margin: '5px'}">
                            <Button size="small" @click="reloadMockData">Refresh</Button>
                        </div>
                    </Transfer>
                </FormItem>

            </Form>
        </Modal>
        <!-- 编辑数据库对话框  -->
        <Modal
                :mask-closable="false"
                width="800"
                :title="updateProjectModalTitle"
                okText="保存"
                v-model="updateProjectModal"
                @on-ok="updateProject"
                :styles="{top: '20px'}">
            <Form ref="project" :model="project" :label-width="80">
                <FormItem label="用例集" prop="name">
                    <Input v-model="project.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="描述" prop="address">
                    <Input v-model="project.desc" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="项目">
                    <Select v-model="project.projectId" style="width: 270px" filterable>
                        <Option value="核心支付">核心支付</Option>
                        <Option value="计费系统">计费系统</Option>
                        <Option value="对账系统">对账系统</Option>
                        <Option value="拦截系统">拦截系统</Option>
                    </Select>
                </FormItem>
                <FormItem label="用例" prop="caselist">
                    <!--<Input v-model="project.caselist" style="width: 270px"></Input>-->
                    <Transfer
                            :data="data3"
                            :target-keys="targetKeys3"
                            :list-style="listStyle"
                            :render-format="render3"
                            :operations="['左移','右移']"
                            filterable
                            :titles="['基础用例','测试集']"
                            @on-change="handleChange3">
                        <div :style="{float: 'right', margin: '5px'}">
                            <Button size="small" @click="reloadMockData">Refresh</Button>
                        </div>
                    </Transfer>
                </FormItem>
            </Form>
            <!--</Card>-->
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
        name: 'casecollector',
        data () {
            return {
                data3: this.getMockData(),
                targetKeys3: this.getTargetKeys(),
                listStyle: {
                    width: '250px',
                    height: '400px'
                },
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
                        title: '用例集',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '描述',
                        key: 'desc',
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
                        width: 170,
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
                                            // this.editTemplateParam = Object.assign({}, this.editTemplateParam, this.templateData[params.index])
                                            // if (this.editTemplateParam.dim.length > 0) {
                                            //   this.editdim = this.editTemplateParam.dim.split(',')
                                            // }
                                            // this.editTemplateModal = true
                                            this.updateProjectModal = true;
                                        }
                                    }
                                }, '编辑'),
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
                        name: '冒烟测试集',
                        desc: '简单冒烟测试',
                        caselist: [],
                        create_time: '2018-09-20 12:30:10',
                        author: ''
                    },
                    {
                        name: '收银台模块测试',
                        desc: '收银台模块测试',
                        caselist: [],
                        create_time: '2018-09-20 12:30:10',
                        author: ''
                    },
                    {
                        name: '支付模块测试',
                        desc: '支付模块测试',
                        caselist: [],
                        create_time: '2018-10-10 12:30:10',
                        author: ''
                    },
                    {
                        name: '回归测试集',
                        desc: '查询功能回归测试',
                        caselist: [],
                        create_time: '2018-09-20 12:30:10',
                        author: ''
                    }
                ],
                projectModalTitle: '添加',
                addProjectModal: false,
                commonTablsName: '用例集',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                project: {
                    name: '',
                    caselist: [],
                    desc: '',
                    projectId: '',
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
                this.addProjectModal = true;
                // this.commonTablsName = '多音字标注'
                // this.$set(this.commonTablsName, '项目&版本维护');
            },
            updateProject () {
                this.updateProjectModal = false;
                // this.commonTablsName = '多音字标注'
                // this.$set(this.commonTablsName, '项目&版本维护');
            },
            resetProject () {
            },
            getMockData () {
                let mockData = [];
                for (let i = 1; i <= 20; i++) {
                    mockData.push({
                        key: i.toString(),
                        label: '用例 ' + i,
                        description: '支付模块测试' + i
                        // disabled: Math.random() * 3 < 1
                    });
                }
                return mockData;
            },
            getTargetKeys () {
                return this.getMockData()
                    .filter(() => Math.random() * 2 > 1)
                    .map(item => item.key);
            },
            handleChange3 (newTargetKeys) {
                this.targetKeys3 = newTargetKeys;
            },
            render3 (item) {
                return item.label + ' - ' + item.description;
            },
            reloadMockData () {
                this.data3 = this.getMockData();
                this.targetKeys3 = this.getTargetKeys();
            }
        }

    };
</script>

<style scoped>

</style>

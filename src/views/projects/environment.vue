<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="环境" name="环境" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-infinite-outline" />
                        项目选择  &&  <Icon type="ios-plus-empty" style="margin-left: 0px"></Icon> 环境添加
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
                                <Button type="primary" @click="addProjectEnv" style="margin-left: 12px" icon="plus">
                                    环境添加
                                </Button>
                            </Row>
                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        环境信息
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
            <Form ref="project" :model="project" :label-width="80">
                <FormItem label="环境名称" prop="name">
                    <Input v-model="project.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="环境地址" style="width: 350px" prop="desc">
                    <Input v-model="project.address"></Input>
                </FormItem>
                <FormItem label="环境描述" style="width: 350px" prop="desc">
                    <Input v-model="project.desc"></Input>
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
            <Form ref="project" :model="project" :label-width="80">
                <FormItem label="环境名称" prop="name">
                    <Input v-model="project.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="环境地址" style="width: 350px" prop="desc">
                    <Input v-model="project.address"></Input>
                </FormItem>
                <FormItem label="环境描述" style="width: 350px" prop="desc">
                    <Input v-model="project.desc"></Input>
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
        name: 'project',
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
                        title: '环境名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '环境地址',
                        key: 'address',
                        align: 'center'
                    },
                    {
                        title: '环境描述',
                        key: 'desc',
                        align: 'center'
                    },
                    {
                        title: '创建人员',
                        key: 'author',
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
                                            this.updateProjectModal = true
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
                        name: '拦截系统',
                        desc: '拦截系统',
                        address: 'http://www.baidu.com',
                        author: 'masw',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        name: '对账系统',
                        desc: '对账系统',
                        author: '花好月圆',
                        create_time: '2018-09-20 12:30:10',
                        address: 'http://www.baidu.com'
                    },
                    {
                        name: '计费系统',
                        desc: '计费系统',
                        author: '林志玲',
                        create_time: '2018-09-20 12:30:10',
                        address: 'http://www.baidu.com'
                    },
                    {
                        name: '核心支付',
                        desc: '核心支付',
                        author: '小花',
                        create_time: '2018-09-20 12:30:10',
                        address: 'http://www.baidu.com'
                    }
                ],
                projectModalTitle: '添加',
                addProjectEnvModal: false,
                commonTablsName: '环境',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                project: {
                    name: '线上环境',
                    desc: '线上测试',
                    address: 'http://',
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

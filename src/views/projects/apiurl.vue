<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="接口" name="接口" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-search-strong"></Icon>
                        搜索  &&  <Icon type="ios-plus-empty" style="margin-left: 0px"></Icon>接口添加
                    </p>
                    <Form ref="searchProjectName" :model="searchProjectName" :label-width="80" style="margin-top: 13px;margin-left: -55px">
                        <FormItem label="" prop="name">
                            <Input v-model="searchProjectName.name" style="width: 270px;margin-left: -20px" placeholder="请输入接口名称"></Input>
                            <Button type="primary" @click="searchCommonCase" style="margin-left: 10px"
                                    icon="android-search">搜索
                            </Button>
                            <Button type="primary" @click="addProject" style="margin-left: 3px" icon="plus">
                                接口添加
                            </Button>
                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        接口信息
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
                v-model="addProjectModal"
                @on-ok="addProject"
                :styles="{top: '20px'}">
                <Form ref="project" :model="project" :label-width="80">
                    <FormItem label="项目">
                        <Select v-model="project.projectSelect" style="width: 270px" filterable>
                            <Option value="核心支付">核心支付</Option>
                            <Option value="计费系统">计费系统</Option>
                            <Option value="对账系统">对账系统</Option>
                            <Option value="拦截系统">拦截系统</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="接口" prop="url">
                        <Input v-model="project.name" style="width: 270px"></Input>
                    </FormItem>
                    <FormItem label="描述" style="width: 350px" prop="desc">
                        <Input v-model="project.desc"></Input>
                    </FormItem>
                    <FormItem label="请求类型">
                        <Select v-model="project.httpType" style="width: 270px" filterable>
                            <Option value="get">get</Option>
                            <Option value="post">post</Option>
                            <Option value="put">put</Option>
                            <Option value="delete">delete</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="参数类型">
                        <Select v-model="project.paramType" style="width: 270px" filterable>
                            <Option value="empty">empty</Option>
                            <Option value="json">json</Option>
                            <Option value="form">form</Option>
                            <Option value="data">data</Option>
                        </Select>
                    </FormItem>
                </Form>
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
                <FormItem label="项目">
                    <Select v-model="project.projectSelect" style="width: 270px" filterable>
                        <Option value="核心支付">核心支付</Option>
                        <Option value="计费系统">计费系统</Option>
                        <Option value="对账系统">对账系统</Option>
                        <Option value="拦截系统">拦截系统</Option>
                    </Select>
                </FormItem>

                <FormItem label="接口" prop="url">
                    <Input v-model="project.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="描述" style="width: 350px" prop="desc">
                    <Input v-model="project.desc"></Input>
                </FormItem>
                <FormItem label="请求类型">
                    <Select v-model="project.httpType" style="width: 270px" filterable>
                        <Option value="get">get</Option>
                        <Option value="post">post</Option>
                        <Option value="put">put</Option>
                        <Option value="delete">delete</Option>
                    </Select>
                </FormItem>
                <FormItem label="参数类型">
                    <Select v-model="project.paramType" style="width: 270px" filterable>
                        <Option value="empty">empty</Option>
                        <Option value="json">json</Option>
                        <Option value="form">form</Option>
                        <Option value="data">data</Option>
                    </Select>
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
        name: 'apiurl',
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
                        title: '接口',
                        key: 'url',
                        align: 'center'
                    },
                    {
                        title: '描述',
                        key: 'desc',
                        align: 'center'
                    },
                    {
                        title: '请求类型',
                        key: 'httpType',
                        align: 'center'
                    },
                    {
                        title: '参数类型',
                        key: 'paramType',
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
                                }, '测试'),
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
                        url: '/user/query',
                        desc: '用户查询',
                        author: 'masw',
                        httpType: 'get',
                        paramType: '',
                        create_time: '2018-09-20 12:30:10',
                        case_num: 400
                    },
                    {
                        url: '/account/withdraw',
                        desc: '退款',
                        httpType: 'post',
                        paramType: 'json',
                        author: 'gaoyuanyuan',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        url: '/feerate/set',
                        desc: '费率设置',
                        httpType: 'post',
                        paramType: 'json',
                        author: 'linzhiling',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        url: '/order/pay',
                        desc: '订单支付',
                        httpType: 'post',
                        paramType: 'json',
                        author: 'lili',
                        create_time: '2018-09-20 12:30:10'
                    }
                ],
                projectModalTitle: '添加',
                addProjectModal: false,
                commonTablsName: '接口',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                project: {
                    url: '/usr/add',
                    desc: '用户添加',
                    httpType: 'get',
                    paramType: 'json',
                    projectSelect: '会计系统',
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

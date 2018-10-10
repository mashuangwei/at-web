<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="项目&版本维护" name="项目&版本维护" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-search-strong"></Icon>
                        搜索
                    </p>
                    <Form ref="searchProjectName" :model="searchProjectName" :label-width="80" style="margin-top: 13px;margin-left: -65px">
                        <FormItem label="" prop="name">
                            <Input v-model="searchProjectName.name" style="width: 270px" placeholder="请输入搜索的文本内容"></Input>
                            <Button type="primary" @click="searchCommonCase" style="margin-left: 10px"
                                    icon="android-search">搜索
                            </Button>
                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-plus-empty" style="margin-left: 0px"></Icon>
                        项目&版本添加
                    </p>
                    <Form ref="searchProjectName" :model="searchProjectName" :label-width="80" style="margin-top: 13px">
                        <FormItem label="">
                            <row>
                                <i-col span="2">
                                    <Button type="primary" @click="addProject" style="margin-left: 3px" icon="plus">
                                        项目添加
                                    </Button>
                                </i-col>
                                <i-col span="2" style="margin-left: 90px">
                                    <Button type="primary" icon="ios-cloud-upload-outline" @click="upfile">版本添加</Button>
                                </i-col>
                            </row>

                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        项目信息
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
            <TabPane label="缺陷" name="缺陷" icon="ios-paper-outline">
                标签二的内容
            </TabPane>
            <TabPane label="执行记录" icon="ios-compose-outline">
                标签三的内容
            </TabPane>
        </Tabs>
        <!-- 添加项目对话框  -->
        <Modal
                :mask-closable="false"
                width="900"
                :title="projectModalTitle"
                okText="确定"
                v-model="addProjectModal"
                :styles="{top: '20px'}">

            <Card>
                <p slot="title">
                    <Icon type="android-add"></Icon>
                    项目添加
                </p>
                <Form ref="project" :model="project" :label-width="80">
                    <FormItem label="项目名称" prop="name">
                        <Input v-model="project.name" style="width: 270px"></Input>
                    </FormItem>
                    <FormItem label="项目描述" style="width: 350px" prop="desc">
                        <Input v-model="project.desc"></Input>
                    </FormItem>
                    <FormItem label="用例数" style="width: 350px" prop="case_num">
                        <Input v-model="project.case_num"></Input>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="addProject">添加</Button>
                        <Button type="ghost" @click="resetProject" style="margin-left: 10px">Reset</Button>
                    </FormItem>
                </Form>
            </Card>
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
        name: 'base-case',
        data () {
            return {
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
                        title: '项目名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '项目描述',
                        key: 'desc',
                        align: 'center'
                    },
                    {
                        title: '用例数',
                        key: 'case_num',
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
                        name: '测试平台',
                        desc: '测试云平台',
                        author: 'masw',
                        create_time: '',
                        case_num: 400
                    },
                    {
                        name: 'UI测试平台',
                        desc: 'UI测试平台',
                        author: 'gaoyuanyuan',
                        create_time: '',
                        case_num: 110
                    },
                    {
                        name: '自动化测试平台',
                        desc: '测试平台',
                        author: 'masw',
                        create_time: '',
                        case_num: 320
                    },
                    {
                        name: '性能测试平台',
                        desc: '性能测试平台',
                        author: 'lili',
                        create_time: '',
                        case_num: 330
                    }
                ],
                projectModalTitle: '添加',
                addProjectModal: false,
                commonTablsName: '项目&版本维护',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                project: {
                    name: '欧拉空间',
                    desc: '欧拉空间云平台',
                    author: 'masw',
                    create_time: '',
                    case_num: 400
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
            resetProject () {
            }
        }

    };
</script>

<style scoped>

</style>

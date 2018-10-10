<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="Sonar" name="Sonar" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-search-strong"></Icon>
                        搜索  &&  <Icon type="ios-plus-empty" style="margin-left: 0px"></Icon>Server添加
                    </p>
                    <Form ref="searchProjectName" :model="searchProjectName" :label-width="80" style="margin-top: 13px;margin-left: -55px">
                        <FormItem label="" prop="name">
                            <Input v-model="searchProjectName.name" style="width: 270px;margin-left: -20px" placeholder="请输入Sonar名称"></Input>
                            <Button type="primary" @click="searchCommonCase" style="margin-left: 10px"
                                    icon="android-search">搜索
                            </Button>
                            <Button type="primary" @click="addProject" style="margin-left: 3px" icon="plus">
                                Server添加
                            </Button>
                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        Sonar信息
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
                <FormItem label="主机名称" prop="name" style="width: 350px">
                    <Input v-model="project.name" ></Input>
                </FormItem>
                <FormItem label="描述" style="width: 350px" prop="desc">
                    <Input v-model="project.desc"></Input>
                </FormItem>
                <FormItem label="用户名" style="width: 350px">
                    <Input v-model="project.name"></Input>
                </FormItem>
                <FormItem label="密码" style="width: 350px">
                    <Input v-model="project.password"></Input>
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
                <FormItem label="主机名称" prop="name" style="width: 350px">
                    <Input v-model="project.name" ></Input>
                </FormItem>
                <FormItem label="描述" style="width: 350px" prop="desc">
                    <Input v-model="project.desc"></Input>
                </FormItem>
                <FormItem label="用户名" style="width: 350px">
                    <Input v-model="project.name"></Input>
                </FormItem>
                <FormItem label="密码" style="width: 350px">
                    <Input v-model="project.password"></Input>
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
        name: 'sonarserver',
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
                        title: 'name',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '描述',
                        key: 'desc',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '地址',
                        key: 'address',
                        align: 'center'
                    },
                    {
                        title: '用户名',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '密码',
                        key: 'password',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        align: 'center',
                        width: 150
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
                        name: 'Sonar-msw',
                        desc: '个人测试集成服务器',
                        username: 'root',
                        password: '123456',
                        address: '123.34.42.20',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        name: 'Sonar-msw',
                        desc: '个人测试集成服务器',
                        username: 'root',
                        password: '123456',
                        address: '123.34.42.20',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        name: 'Sonar-msw',
                        desc: '个人测试集成服务器',
                        username: 'root',
                        password: '123456',
                        address: '123.34.42.20',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        name: 'Sonar-msw',
                        desc: '个人测试集成服务器',
                        username: 'root',
                        password: '123456',
                        address: '123.34.42.20',
                        create_time: '2018-09-20 12:30:10'
                    }
                ],
                projectModalTitle: '添加',
                addProjectModal: false,
                commonTablsName: 'Sonar',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                project: {
                    name: '',
                    desc: '',
                    username: '',
                    password: '',
                    address: '',
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

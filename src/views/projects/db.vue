<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="数据库" name="数据库" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-search-strong"></Icon>
                        搜索  &&  <Icon type="ios-plus-empty" style="margin-left: 0px"></Icon>数据库添加
                    </p>
                    <Form ref="searchProjectName" :model="searchProjectName" :label-width="80" style="margin-top: 13px;margin-left: -50px">
                        <FormItem label="" prop="name">
                            <Input v-model="searchProjectName.name" style="width: 270px;margin-left: -20px" placeholder="请输入项目名称"></Input>
                            <Button type="primary" @click="searchCommonCase" style="margin-left: 10px"
                                    icon="android-search">搜索
                            </Button>
                            <Button type="primary" @click="addProject" style="margin-left: 3px" icon="plus">
                                数据库添加
                            </Button>
                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        数据库信息
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
                width="550"
                :title="projectModalTitle"
                okText="添加"
                v-model="addProjectModal"
                @on-ok="addProject"
                :styles="{top: '20px'}">
                <Form ref="project" :model="project" :label-width="80">
                    <FormItem label="数据库" prop="name">
                        <Input v-model="project.name" style="width: 270px"></Input>
                    </FormItem>

                    <FormItem label="地址" prop="address">
                        <Input v-model="project.address" style="width: 270px"></Input>
                    </FormItem>
                    <FormItem label="用户名" prop="username">
                        <Input v-model="project.username" style="width: 270px"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input v-model="project.password" style="width: 270px"></Input>
                    </FormItem>
                    <FormItem label="端口" prop="port">
                        <Input v-model="project.port" style="width: 270px"></Input>
                    </FormItem>
                    <FormItem label="数据库类型">
                        <Select v-model="project.sqlType" style="width: 270px" filterable>
                            <Option value="mysql">mysql</Option>
                            <Option value="oracle">oracle</Option>
                            <Option value="redis">redis</Option>
                            <Option value="mongodb">mongodb</Option>
                        </Select>
                    </FormItem>
                </Form>
        </Modal>
        <!-- 编辑数据库对话框  -->
        <Modal
                :mask-closable="false"
                width="550"
                :title="updateProjectModalTitle"
                okText="保存"
                v-model="updateProjectModal"
                @on-ok="updateProject"
                :styles="{top: '20px'}">
            <Form ref="project" :model="project" :label-width="80">
                <FormItem label="数据库" prop="name">
                    <Input v-model="project.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="地址" prop="address">
                    <Input v-model="project.address" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="用户名" prop="username">
                    <Input v-model="project.username" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input v-model="project.password" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="端口" prop="port">
                    <Input v-model="project.port" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="数据库类型">
                    <Select v-model="project.sqlType" style="width: 270px" filterable>
                        <Option value="mysql">mysql</Option>
                        <Option value="oracle">oracle</Option>
                        <Option value="redis">redis</Option>
                        <Option value="mongodb">mongodb</Option>
                    </Select>
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
        name: 'db',
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
                        title: '数据库',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '地址',
                        key: 'address',
                        align: 'center',
                        width: 150
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
                        title: '端口',
                        key: 'port',
                        align: 'center'
                    },
                    {
                        title: '类型',
                        key: 'sqlType',
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
                        name: 'dbfund',
                        username: 'root',
                        password: 'root',
                        sqlType: 'mysql',
                        address: '192.168.32.88',
                        create_time: '2018-09-20 12:30:10',
                        port: 3306
                    },
                    {
                        name: 'dbcheck',
                        username: 'admin',
                        password: 'admin',
                        sqlType: 'oracle',
                        address: '192.168.42.28',
                        create_time: '2018-03-20 11:30:10',
                        port: 1521
                    },
                    {
                        name: 'dbrisk',
                        username: 'root',
                        password: '123456',
                        sqlType: 'monogodb',
                        address: '192.168.2.123',
                        create_time: '2018-09-10 08:30:10',
                        port: 23791
                    },
                    {
                        name: 'account',
                        username: 'root',
                        password: 'root',
                        sqlType: 'redis',
                        address: '192.22.66.99',
                        create_time: '2018-05-15 06:25:48',
                        port: 6379
                    }
                ],
                projectModalTitle: '添加',
                addProjectModal: false,
                commonTablsName: '数据库',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                project: {
                    name: 'dbcheck',
                    address: '127.0.0.1',
                    username: 'root',
                    password: 'root',
                    desc: '会计系统',
                    author: 'masw',
                    sqlType: 'mysql',
                    create_time: '',
                    port: 400
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

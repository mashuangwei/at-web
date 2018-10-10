<template>
    <div>
        <Tabs :value="commonTablsName">
            <TabPane label="基础用例管理" name="基础用例管理" icon="ios-paper-outline">
                <Card>
                    <p slot="title">
                        <Icon type="ios-infinite-outline"/>
                        项目选择 &&
                        <Icon type="ios-plus-empty" style="margin-left: 0px"></Icon>
                        用例添加
                    </p>
                    <Form ref="searchProjectEnvName" :model="searchProjectEnvName" :label-width="80"
                          style="margin-top: 13px;margin-left: -20px">
                        <FormItem label="" prop="name">
                            <Row>
                                <Col span="5" style="padding-right:10px; margin-left: -5%;width:150px">
                                    <Select v-model="projectSelectModel" placeholder="请选择项目" filterable>
                                        <Option v-for="item in projectList" :value="item.value" :key="item.value">{{
                                            item.label }}
                                        </Option>
                                    </Select>
                                </Col>
                                <Input v-model="searchProjectEnvName.name" style="width: 250px;margin-left: 2%"
                                       icon="android-search" placeholder="请输入搜索的用例名称"></Input>
                                <Button type="primary" style="margin-left: 40px" @click="addCase">
                                    <Icon type="ios-plus-empty" style="margin-right: 4px"></Icon>
                                    Add
                                </Button>
                            </Row>
                        </FormItem>
                    </Form>
                </Card>

                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        用例信息
                    </p>

                    <Table :loading="loading" :columns="caseTable" :data="caseTableData" :border="showBorder"
                           no-data-text="没有数据" height="470"
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
            <!--<TabPane label="用例管理" name="用例管理" icon="ios-paper-outline">-->
                <!--标签二的内容-->
            <!--</TabPane>-->
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
            <Form ref="project" :model="updateCaseInfo" :label-width="80">
                <FormItem label="用例名称" prop="name">
                    <Input v-model="updateCaseInfo.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="用例类型" prop="type">
                    <Input v-model="updateCaseInfo.type" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="是否执行" style="width: 350px" prop="execute">
                    <Input v-model="updateCaseInfo.execute"></Input>
                </FormItem>
                <FormItem label="是否分享" style="width: 350px" prop="share">
                    <Input v-model="updateCaseInfo.share"></Input>
                </FormItem>
            </Form>
            <!--</Card>-->
        </Modal>

        <!-- 添加case对话框  -->
        <Modal
                :mask-closable="false"
                width="950"
                :title="addTitle"
                okText="添加"
                height="450"
                v-model="addCaseModal"
                @on-ok="addCaseOk"
                :styles="{top: '20px', left: '100px'}">
            <Form ref="project" :model="addCaseInfo" :label-width="80">
                <FormItem label="用例名称" prop="name">
                    <Input v-model="addCaseInfo.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="用例类型" style="width: 350px">
                    <Select v-model="addCaseInfo.type">
                        <Option value="Http">Http</Option>
                        <Option value="Ui">Ui</Option>
                        <Option value="Dubbo">Dubbo</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否执行">
                    <i-switch size="large" v-model="this.addCaseInfo.execute === 'y'">
                        <span slot="y">开启</span>
                        <span slot="n">关闭</span>
                    </i-switch>
                </FormItem>
                <FormItem label="是否分享">
                    <i-switch size="large" v-model="this.addCaseInfo.share === 'y'">
                        <span slot="y">开启</span>
                        <span slot="n">关闭</span>
                    </i-switch>
                </FormItem>
            </Form>
            <div class="my_divider">用例步骤</div>
            <div style="margin-bottom: 12px;margin-top: -12px">
                <Row>
                    <i-col span="4">
                        <Select v-model="stepsType" placeholder="请选择步骤类型" @on-change="stepTypeChange">
                            <Option value="Http">Http</Option>
                            <Option value="Sql">Sql</Option>
                        </Select>
                    </i-col>
                    <i-col span="6" style="margin-left: 25px">
                        <Button type="primary" style="margin-right: 6px" @click="addSteps">新增</Button>
                        <Button type="primary">执行</Button>
                    </i-col>

                </Row>

            </div>

            <Table :loading="loading" :columns="stepsTable" :data="stepsTableData" :border="showBorder"
                   no-data-text="没有数据" height="350"
                   :stripe="showStripe" style="margin-top: -7px;margin-left: -7px"
                   :show-header="showHeader" showIndex="true"></Table>

        </Modal>

        <!-- 编辑case对话框  -->
        <Modal
                :mask-closable="false"
                width="950"
                :title="updateCaseModalTitle"
                okText="保存"
                height="450"
                v-model="updateCaseModal"
                @on-ok="updateCase"
                :styles="{top: '20px', left: '100px'}">
            <Form ref="project" :model="updateCaseInfo" :label-width="80">
                <FormItem label="用例名称" prop="name">
                    <Input v-model="updateCaseInfo.name" style="width: 270px"></Input>
                </FormItem>
                <FormItem label="用例类型" style="width: 350px">
                    <Select v-model="updateCaseInfo.type">
                        <Option value="Http">Http</Option>
                        <Option value="Ui">Ui</Option>
                        <Option value="Dubbo">Dubbo</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否执行">
                    <i-switch size="large" v-model="this.updateCaseInfo.execute === 'y'">
                        <span slot="y">开启</span>
                        <span slot="n">关闭</span>
                    </i-switch>
                </FormItem>
                <FormItem label="是否分享">
                    <i-switch size="large" v-model="this.updateCaseInfo.share === 'y'">
                        <span slot="y">开启</span>
                        <span slot="n">关闭</span>
                    </i-switch>
                </FormItem>
            </Form>
            <div class="my_divider">用例步骤</div>
            <div style="margin-bottom: 12px;margin-top: -12px">
                <Row>
                    <i-col span="4">
                        <Select v-model="stepsType" placeholder="请选择步骤类型" @on-change="stepTypeChange">
                            <Option value="Http">Http</Option>
                            <Option value="Sql">Sql</Option>
                        </Select>
                    </i-col>
                    <i-col span="6" style="margin-left: 25px">
                        <Button type="primary" style="margin-right: 6px" @click="addSteps">新增</Button>
                        <Button type="primary">执行</Button>
                    </i-col>

                </Row>

            </div>

            <Table :loading="loading" :columns="stepsTable" :data="stepsTableData" :border="showBorder"
                   no-data-text="没有数据" height="350"
                   :stripe="showStripe" style="margin-top: -7px;margin-left: -7px"
                   :show-header="showHeader" showIndex="true"></Table>

        </Modal>

        <!-- 添加Http步骤 -->
        <Modal
                :mask-closable="false"
                width="850"
                :title="stepsModalTitle"
                okText="添加"
                v-model="addStepsModal"
                @on-ok="addStepsOk"
                :styles="{top: '20px'}">
            <Form ref="project" :model="addStepInfo" :label-width="80" style="margin-left: -14px">
                <FormItem label="接口路径" prop="Url">
                    <Row>
                        <Col span="8" style="padding-right:10px;">
                            <Select v-model="apiHost" filterable>
                                <Option v-for="item in apiHostList" :value="item.value" :key="item.value">{{ item.label
                                    }}
                                </Option>
                            </Select>
                        </Col>
                        <Col span="8" style="padding-right:10px;">
                            <Select v-model="apiUrl" filterable>
                                <Option v-for="item in apiUrlList" :value="item.value" :key="item.value">{{ item.label
                                    }}
                                </Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="httpType">
                                <Option value="get">get</Option>
                                <Option value="post">post</Option>
                                <Option value="put">put</Option>
                                <Option value="delete">put</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <Form ref="project" :model="addStepInfo" :label-width="80" style="margin-left: -14px">
                <FormItem label="步骤名称" prop="name">
                    <Input v-model="addStepInfo.name" style="width: 240px"></Input>
                </FormItem>
                <FormItem label="是否执行" v-model="this.addStepInfo.execute === 'y'">
                    <i-switch size="large">
                        <span slot="y">开启</span>
                        <span slot="n">关闭</span>
                    </i-switch>
                </FormItem>

            </Form>
            <Tabs :value="stepsTablsName">
                <TabPane label="header" name="header" icon="ios-paper-outline">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-plus-empty"></Icon>
                            添加header
                        </p>
                        <Form ref="formDynamic" :model="formDynamic" :label-width="10" style="width: 450px">
                            <FormItem
                                    v-for="(item, index) in formDynamic.items"
                                    v-if="item.status"
                                    :key="index"
                                    :prop="'items.' + index + '.value'"
                                    :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                                <Row>
                                    <Col span="8" style="margin-left: -20px">
                                        <!--<Input type="text" v-model="item.value" placeholder="Enter something..."></Input>-->
                                        <Select v-model="headerKeyList" filterable>
                                            <Option v-for="item in headerKeySelectList" :value="item.value"
                                                    :key="item.value">{{ item.label }}
                                            </Option>
                                        </Select>
                                    </Col>
                                    <Col span="12" style="margin-left: 10px">
                                        <Select v-model="headerValueList">
                                            <Option value="application/x-www-form-urlencoded">
                                                application/x-www-form-urlencoded
                                            </Option>
                                            <Option value="application/json">application/json</Option>
                                            <Option value="application/xml">application/xml</Option>
                                            <Option value="multipart/form-data">multipart/form-data</Option>
                                        </Select>
                                    </Col>
                                    <Col span="4" offset="0" style="margin-left: 10px">
                                        <Button @click="handleRemove(index)">Delete</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <Row>
                                    <Col span="12">
                                        <Button type="dashed" long @click="handleAdd" icon="md-add">Add item</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                            <!--<FormItem>-->
                            <!--<Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>-->
                            <!--<Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>-->
                            <!--</FormItem>-->
                        </Form>
                    </Card>

                </TabPane>
                <TabPane label="请求参数" name="请求参数" icon="ios-paper-outline">
                    <Form :model="formItem" :label-width="80">
                        <FormItem label="参数类型：">
                            <RadioGroup v-model="formItem.radio" @on-change="paramTypeSelect">
                                <Radio label="form-data">form-data</Radio>
                                <Radio label="json">json</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Form>
                    <Form ref="formDynamic" :model="formBodyDynamic" :label-width="10" style="width: 720px"
                          v-show="formParamShow">
                        <FormItem
                                v-for="(item, index) in formBodyDynamic.items"
                                v-if="item.status"
                                :key="index"
                                :prop="'items.' + index + '.value'"
                                :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                            <Row>
                                <Col span="4" style="margin-left: 0px">
                                    <Input type="text" v-model="item.key" placeholder="请输入参数名..."></Input>
                                </Col>
                                <Col span="4" style="margin-left: 5px">
                                    <Input type="text" v-model="item.value" placeholder="请输入参数值..."></Input>
                                </Col>
                                <Col span="4" style="margin-left: 5px">
                                    <Select v-model="bodyValueList" :transfer="transferMethodSelect">
                                        <Option value="MD5">MD5</Option>
                                        <Option value="RSA">RSA</Option>
                                        <Option value="RandomStr">RandomStr</Option>
                                        <Option value="UUID">UUID</Option>
                                    </Select>

                                </Col>
                                <Col span="2" style="margin-left: -0.5px">
                                    <Input type="text" v-model="item.args" placeholder="args..."></Input>
                                </Col>
                                <Col span="4" offset="0" style="margin-left: 5px">
                                    <Button @click="handleRemoveBodyParam(index)">Delete</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="12">
                                    <Button type="dashed" long @click="handleAddBodyParam" icon="md-add">Add item
                                    </Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <!--<FormItem>-->
                        <!--<Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>-->
                        <!--<Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>-->
                        <!--</FormItem>-->
                    </Form>
                    <Monaco
                            theme="vs"
                            language="json"
                            style="border:1px;border-top-color: rgb(238, 238, 238);
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
                            :code="queryResult"
                            :editorOptions="options"
                            @mounted="onMounted"
                            @codeChange="onCodeChange"
                            v-show="jsonParamShow"
                    >
                    </Monaco>
                </TabPane>
                <TabPane label="结果校验" icon="ios-compose-outline">
                    <Form :model="formItemResult" :label-width="80">
                        <FormItem label="返回类型：">
                            <RadioGroup v-model="formItemResult.radio" @on-change="resultTypeSelect">
                                <Radio label="String">String</Radio>
                                <Radio label="Json">Json</Radio>
                                <Radio label="Xml">Xml</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Form>
                    <Form :model="assertItemResult" :label-width="80">
                        <FormItem label="校验方式：">
                            <RadioGroup v-model="assertItemResult.radio" @on-change="assertTypeSelect">
                                <Radio label="Json">Json</Radio>
                                <Radio label="Form">Form</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Form>
                    <Monaco
                            theme="vs"
                            language="json"
                            style="border:1px;border-top-color: rgb(238, 238, 238);
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
                            :code="jsonResultParam"
                            :editorOptions="options"
                            @mounted="onJsonMounted"
                            @codeChange="onJsonCodeChange"
                            v-show="formJsonShow"
                    >
                    </Monaco>
                    <Form ref="formDynamic" :model="formResultDynamic" :label-width="10" style="width: 850px"
                          v-show="formXmlShow">
                        <FormItem
                                v-for="(item, index) in formResultDynamic.items"
                                v-if="item.status"
                                :key="index"
                                :prop="'items.' + index + '.value'"
                                :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                            <Row>
                                <Col span="6" style="margin-left: 0px">
                                    <Input type="text" v-model="item.key" placeholder="请输入参数名..."></Input>
                                </Col>
                                <Col span="3" style="margin-left: 5px">
                                    <Select v-model="assertType" :transfer="transferMethodSelect">
                                        <Option value="=">=</Option>
                                        <Option value=">"></Option>
                                        <Option value=">=">>=</Option>
                                        <Option value="<"><</Option>
                                        <Option value="<="><=</Option>
                                        <Option value="!=">!=</Option>
                                        <Option value="contains">contains</Option>
                                    </Select>
                                </Col>
                                <Col span="8" style="margin-left: 5px">
                                    <!--<Input type="text" v-model="item.value" placeholder="请输入参数值..."></Input>-->
                                    <Input v-model="item.value">
                                        <Select v-model="item.args" slot="append" style="width: 80px"
                                                :transfer="transferMethodSelect" @on-change="sqlSelect">
                                            <Option value="文本">文本</Option>
                                            <Option value="MySQL">MySQL</Option>
                                            <Option value="Oracle">Oracle</Option>
                                        </Select>
                                    </Input>
                                </Col>
                                <!--<Col span="2" style="margin-left: -0.5px">-->
                                <!--<Input type="text" v-model="item.args" placeholder="args..."></Input>-->
                                <!--</Col>-->
                                <Col span="2" offset="0" style="margin-left: 5px">
                                    <Button @click="handleRemoveResultParam(index)">Delete</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="12">
                                    <Button type="dashed" long @click="handleAddResultParam" icon="md-add">Add item
                                    </Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <!--<FormItem>-->
                        <!--<Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>-->
                        <!--<Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>-->
                        <!--</FormItem>-->
                    </Form>
                </TabPane>
            </Tabs>
        </Modal>

        <!-- 编辑Http步骤 -->
        <Modal
                :mask-closable="false"
                width="850"
                :title="httpStepsModalTitle"
                okText="添加"
                v-model="updateHttpStepModal"
                @on-ok="updateHttpStepsOk"
                :styles="{top: '20px'}">
            <Form ref="project" :model="updateStepInfo" :label-width="80" style="margin-left: -14px">
                <FormItem label="接口路径" prop="Url">
                    <Row>
                        <Col span="8" style="padding-right:10px;">
                            <Select v-model="apiHost" filterable>
                                <Option v-for="item in apiHostList" :value="item.value" :key="item.value">{{ item.label
                                    }}
                                </Option>
                            </Select>
                        </Col>
                        <Col span="8" style="padding-right:10px;">
                            <Select v-model="apiUrl" filterable>
                                <Option v-for="item in apiUrlList" :value="item.value" :key="item.value">{{ item.label
                                    }}
                                </Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="httpType">
                                <Option value="get">get</Option>
                                <Option value="post">post</Option>
                                <Option value="put">put</Option>
                                <Option value="delete">put</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <Form ref="project" :model="updateStepInfo" :label-width="80" style="margin-left: -14px">
                <FormItem label="步骤名称" prop="name">
                    <Input v-model="updateStepInfo.name" style="width: 240px"></Input>
                </FormItem>
                <FormItem label="是否执行">
                    <i-switch size="large" v-model="updateStepInfo.execute === 'y'">
                        <span slot="y">开启</span>
                        <span slot="n">关闭</span>
                    </i-switch>
                </FormItem>

            </Form>
            <Tabs :value="stepsTablsName">
                <TabPane label="header" name="header" icon="ios-paper-outline">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-plus-empty"></Icon>
                            添加header
                        </p>
                        <Form ref="formDynamic" :model="formDynamic" :label-width="10" style="width: 450px">
                            <FormItem
                                    v-for="(item, index) in formDynamic.items"
                                    v-if="item.status"
                                    :key="index"
                                    :prop="'items.' + index + '.value'"
                                    :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                                <Row>
                                    <Col span="8" style="margin-left: -20px">
                                        <!--<Input type="text" v-model="item.value" placeholder="Enter something..."></Input>-->
                                        <Select v-model="headerKeyList" filterable>
                                            <Option v-for="item in headerKeySelectList" :value="item.value"
                                                    :key="item.value">{{ item.label }}
                                            </Option>
                                        </Select>
                                    </Col>
                                    <Col span="12" style="margin-left: 10px">
                                        <Select v-model="headerValueList">
                                            <Option value="application/x-www-form-urlencoded">
                                                application/x-www-form-urlencoded
                                            </Option>
                                            <Option value="application/json">application/json</Option>
                                            <Option value="application/xml">application/xml</Option>
                                            <Option value="multipart/form-data">multipart/form-data</Option>
                                        </Select>
                                    </Col>
                                    <Col span="4" offset="0" style="margin-left: 10px">
                                        <Button @click="handleRemove(index)">Delete</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <Row>
                                    <Col span="12">
                                        <Button type="dashed" long @click="handleAdd" icon="md-add">Add item</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                            <!--<FormItem>-->
                            <!--<Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>-->
                            <!--<Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>-->
                            <!--</FormItem>-->
                        </Form>
                    </Card>

                </TabPane>
                <TabPane label="请求参数" name="请求参数" icon="ios-paper-outline">
                    <Form :model="formItem" :label-width="80">
                        <FormItem label="参数类型：">
                            <RadioGroup v-model="formItem.radio" @on-change="paramTypeSelect">
                                <Radio label="form-data">form-data</Radio>
                                <Radio label="json">json</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Form>
                    <Form ref="formDynamic" :model="formBodyDynamic" :label-width="10" style="width: 720px"
                          v-show="formParamShow">
                        <FormItem
                                v-for="(item, index) in formBodyDynamic.items"
                                v-if="item.status"
                                :key="index"
                                :prop="'items.' + index + '.value'"
                                :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                            <Row>
                                <Col span="4" style="margin-left: 0px">
                                    <Input type="text" v-model="item.key" placeholder="请输入参数名..."></Input>
                                </Col>
                                <Col span="4" style="margin-left: 5px">
                                    <Input type="text" v-model="item.value" placeholder="请输入参数值..."></Input>
                                </Col>
                                <Col span="4" style="margin-left: 5px">
                                    <Select v-model="bodyValueList" :transfer="transferMethodSelect">
                                        <Option value="MD5">MD5</Option>
                                        <Option value="RSA">RSA</Option>
                                        <Option value="RandomStr">RandomStr</Option>
                                        <Option value="UUID">UUID</Option>
                                    </Select>

                                </Col>
                                <Col span="2" style="margin-left: -0.5px">
                                    <Input type="text" v-model="item.args" placeholder="args..."></Input>
                                </Col>
                                <Col span="4" offset="0" style="margin-left: 5px">
                                    <Button @click="handleRemoveBodyParam(index)">Delete</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="12">
                                    <Button type="dashed" long @click="handleAddBodyParam" icon="md-add">Add item
                                    </Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <!--<FormItem>-->
                        <!--<Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>-->
                        <!--<Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>-->
                        <!--</FormItem>-->
                    </Form>
                    <Monaco
                            theme="vs"
                            language="json"
                            style="border:1px;border-top-color: rgb(238, 238, 238);
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
                            :code="queryResult"
                            :editorOptions="options"
                            @mounted="onMounted"
                            @codeChange="onCodeChange"
                            v-show="jsonParamShow"
                    >
                    </Monaco>
                </TabPane>
                <TabPane label="结果校验" icon="ios-compose-outline">
                    <Form :model="formItemResult" :label-width="80">
                        <FormItem label="返回类型：">
                            <RadioGroup v-model="formItemResult.radio" @on-change="resultTypeSelect">
                                <Radio label="String">String</Radio>
                                <Radio label="Json">Json</Radio>
                                <Radio label="Xml">Xml</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Form>
                    <Form :model="assertItemResult" :label-width="80">
                        <FormItem label="校验方式：">
                            <RadioGroup v-model="assertItemResult.radio" @on-change="assertTypeSelect">
                                <Radio label="Json">Json</Radio>
                                <Radio label="Form">Form</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Form>
                    <Monaco
                            theme="vs"
                            language="json"
                            style="border:1px;border-top-color: rgb(238, 238, 238);
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
                            :code="jsonResultParam"
                            :editorOptions="options"
                            @mounted="onJsonMounted"
                            @codeChange="onJsonCodeChange"
                            v-show="formJsonShow"
                    >
                    </Monaco>
                    <Form ref="formDynamic" :model="formResultDynamic" :label-width="10" style="width: 850px"
                          v-show="formXmlShow">
                        <FormItem
                                v-for="(item, index) in formResultDynamic.items"
                                v-if="item.status"
                                :key="index"
                                :prop="'items.' + index + '.value'"
                                :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
                            <Row>
                                <Col span="6" style="margin-left: 0px">
                                    <Input type="text" v-model="item.key" placeholder="请输入参数名..."></Input>
                                </Col>
                                <Col span="3" style="margin-left: 5px">
                                    <Select v-model="assertType" :transfer="transferMethodSelect">
                                        <Option value="=">=</Option>
                                        <Option value=">"></Option>
                                        <Option value=">=">>=</Option>
                                        <Option value="<"><</Option>
                                        <Option value="<="><=</Option>
                                        <Option value="!=">!=</Option>
                                        <Option value="contains">contains</Option>
                                    </Select>
                                </Col>
                                <Col span="8" style="margin-left: 5px">
                                    <!--<Input type="text" v-model="item.value" placeholder="请输入参数值..."></Input>-->
                                    <Input v-model="item.value">
                                        <Select v-model="item.args" slot="append" style="width: 80px"
                                                :transfer="transferMethodSelect" @on-change="sqlSelect">
                                            <Option value="文本">文本</Option>
                                            <Option value="MySQL">MySQL</Option>
                                            <Option value="Oracle">Oracle</Option>
                                        </Select>
                                    </Input>

                                </Col>
                                <!--<Col span="2" style="margin-left: -0.5px">-->
                                <!--<Input type="text" v-model="item.args" placeholder="args..."></Input>-->
                                <!--</Col>-->
                                <Col span="2" offset="0" style="margin-left: 5px">
                                    <Button @click="handleRemoveResultParam(index)">Delete</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="12">
                                    <Button type="dashed" long @click="handleAddResultParam" icon="md-add">Add item
                                    </Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <!--<FormItem>-->
                        <!--<Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>-->
                        <!--<Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>-->
                        <!--</FormItem>-->
                    </Form>

                </TabPane>
            </Tabs>
        </Modal>
        <!-- 结果校验引用sql -->
        <Modal
                :mask-closable="false"
                width="700"
                :title="sqlResultModalTitle"
                okText="添加"
                v-model="sqlResultModal"
                @on-ok="addSqlResultEnv"
                :styles="{top: '20px'}">
            <Monaco
                    theme="vs"
                    language="sql"
                    style="border:1px;border-top-color: rgb(238, 238, 238);
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
                    :code="sqlResultParam"
                    :editorOptions="options"
                    @mounted="onSqlMounted"
                    @codeChange="onSqlCodeChange"
            >
            </Monaco>
            <!--</Card>-->
        </Modal>
        <!-- 添加Sql步骤 -->
        <Modal
                :mask-closable="false"
                width="850"
                :title="stepsSqlModalTitle"
                okText="添加"
                v-model="sqlStepsModal"
                @on-ok="addSqlStepsOk"
                :styles="{top: '20px'}">
            <Form ref="project" :model="addStepInfo" :label-width="80" style="margin-left: -14px">
                <FormItem label="步骤名称" prop="name">
                    <Input v-model="addStepInfo.name" style="width: 240px"></Input>
                </FormItem>
                <FormItem label="数据选择">
                    <Select v-model="sqlEnv" filterable style="width:240px" :transfer="transferMethodSelect">
                        <Option v-for="item in sqlEnvList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="是否执行">
                    <i-switch size="large" v-model="addStepInfo.execute === 'y'">
                        <span slot="y">开启</span>
                        <span slot="n">关闭</span>
                    </i-switch>
                </FormItem>
            </Form>

            <br><br>
            <Monaco
                    theme="vs"
                    language="sql"
                    style="border:1px;border-top-color: rgb(238, 238, 238);
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
                    :code="sqlParamStep"
                    :editorOptions="options"
                    @mounted="onSqlStepsMounted"
                    @codeChange="onSqlStepCodeChange"
            ></Monaco>
        </Modal>

        <!-- 编辑Sql步骤 -->
        <Modal
                :mask-closable="false"
                width="850"
                :title="updateStepsSqlModalTitle"
                okText="添加"
                v-model="updateSqlStepsModal"
                @on-ok="updateSqlStepsOk"
                :styles="{top: '20px'}">
            <Form ref="project" :model="updateStepInfo" :label-width="80" style="margin-left: -14px">
                <FormItem label="步骤名称" prop="name">
                    <Input v-model="updateStepInfo.name" style="width: 240px"></Input>
                </FormItem>
                <FormItem label="数据选择">
                    <Select v-model="sqlEnv" filterable style="width:240px" :transfer="transferMethodSelect">
                        <Option v-for="item in sqlEnvList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="是否执行">
                    <i-switch size="large" v-model="updateStepInfo.execute === 'y'">
                        <span slot="y">开启</span>
                        <span slot="n">关闭</span>
                    </i-switch>
                    <!--<RadioGroup v-model="updateStepInfo.execute">-->
                    <!--<Radio label="y">-->
                    <!--<Icon type="logo-apple"></Icon>-->
                    <!--<span>开启</span>-->
                    <!--</Radio>-->
                    <!--<Radio label="n">-->
                    <!--<Icon type="logo-android"></Icon>-->
                    <!--<span>关闭</span>-->
                    <!--</Radio>-->
                    <!--</RadioGroup>-->
                </FormItem>
            </Form>

            <br><br>
            <Monaco
                    theme="vs"
                    language="sql"
                    style="border:1px;border-top-color: rgb(238, 238, 238);
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
                    :code="sqlParamStep"
                    :editorOptions="options"
                    @mounted="onSqlStepsMounted"
                    @codeChange="onSqlStepCodeChange"
            ></Monaco>
        </Modal>

    </div>
</template>

<script>
    import Row from 'iview/src/components/grid/row';
    import ICol from 'iview/src/components/grid/col';
    import $ from 'jquery';
    import Monaco from 'monaco-editor-forvue';

    export default {
        components: {
            ICol,
            Row,
            Monaco
        },
        name: 'basecase',
        data () {
            return {
                updateHttpStepModal: false,
                updateSqlStepsModal: false,
                sqlEnv: '',
                sqlEnvList: [
                    {
                        value: 'shiro',
                        label: 'shiro'
                    },
                    {
                        value: 'dbfund',
                        label: 'dbfund'
                    }],
                options: {
                    selectOnLineNumbers: false
                },
                queryResult: '',
                sqlParamStep: '',
                sqlResultParam: '',
                jsonResultParam: '',
                formParamShow: true,
                formXmlShow: false,
                formJsonShow: true,
                jsonParamShow: false,
                value12: '',
                value13: '',
                select12: '',
                transferMethodSelect: true,
                formItem: {
                    input: '',
                    radio: 'form-data'
                },
                formItemResult: {
                    input: '',
                    radio: 'Json'
                },
                assertItemResult: {
                    input: '',
                    radio: 'Json'
                },
                headerValueList: [],
                bodyValueList: [],
                assertType: '=',
                headerKeyList: [],
                bodyKeyList: [],
                bodyKeySelectList: [
                    {
                        value: 'Content-Type',
                        label: 'Content-Type'
                    },
                    {
                        value: 'Cookie',
                        label: 'Cookie'
                    },
                    {
                        value: 'Accept-Charset',
                        label: 'Accept-Charset'
                    }
                ],
                headerKeySelectList: [
                    {
                        value: 'Content-Type',
                        label: 'Content-Type'
                    },
                    {
                        value: 'Cookie',
                        label: 'Cookie'
                    },
                    {
                        value: 'Accept-Charset',
                        label: 'Accept-Charset'
                    }
                ],
                index: 1,
                formDynamic: {
                    items: [
                        {
                            value: '',
                            index: 1,
                            status: 1
                        }
                    ]
                },
                formBodyDynamic: {
                    items: [
                        {
                            value: '',
                            key: '',
                            index: 1,
                            args: '',
                            status: 1
                        }
                    ]
                },
                formResultDynamic: {
                    items: [
                        {
                            value: '',
                            key: '',
                            index: 1,
                            args: '',
                            status: 1
                        }
                    ]
                },
                formStringDynamic: {
                    items: [
                        {
                            value: '',
                            key: '',
                            index: 1,
                            args: '',
                            status: 1
                        }
                    ]
                },
                apiUrl: '',
                apiUrlList: [
                    {
                        value: '/info/wangli',
                        label: '/info/wangli'
                    },
                    {
                        value: '/user/add',
                        label: '/user/add'
                    },
                    {
                        value: '/user/query/1',
                        label: '/user/query/1'
                    }
                ],
                apiHostList: [
                    {
                        value: 'http://www.lianlian.com',
                        label: 'http://www.lianlian.com'
                    },
                    {
                        value: 'http://www.huiji.com',
                        label: 'http://www.huiji.com'
                    },
                    {
                        value: 'http://www.pay.com',
                        label: 'http://www.pay.com'
                    },
                    {
                        value: 'http://www.order.com',
                        label: 'http://www.order.com'
                    }
                ],
                apiHost: '',
                httpType: 'get',
                stepsTablsName: 'header',
                stepsType: 'Http',
                stepsModalTitle: '添加',
                httpStepsModalTitle: 'Http步骤编辑',
                stepsSqlModalTitle: 'SQL步骤添加',
                updateStepsSqlModalTitle: 'SQL步骤编辑',
                addStepsModal: false,
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
                updateCaseModalTitle: '编辑',
                addTitle: '添加',
                updateCaseModal: false,
                addCaseModal: false,
                searchProjectEnvName: {name: ''},
                pageSizeOptions: [10, 20, 30, 50, 100],
                pageHelp: {
                    totalNum: 0,
                    curPage: 1,
                    pageSize: 10
                },
                loading: false,
                stepsTable: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '步骤名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '步骤类型',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '执行结果',
                        key: 'status',
                        align: 'center',
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
                        title: '是否执行',
                        key: 'execute',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 350,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    attrs: {
                                        icon: 'ios-book-outline'
                                    },
                                    style: {
                                        marginRight: '7px'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(this.stepsTableData[params.index].type);
                                            if (this.stepsTableData[params.index].type === 'Http') {
                                                this.updateHttpStepModal = true;
                                            } else {
                                                this.updateSqlStepsModal = true;
                                            }
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
                                            // this.removeMosTemplate(params.index)
                                        }
                                    }
                                }, '日志'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    attrs: {
                                        icon: 'ios-arrow-up'
                                    },
                                    style: {
                                        marginRight: '7px'
                                    },
                                    on: {
                                        click: () => {
                                            // this.removeMosTemplate(params.index)
                                        }
                                    }
                                }, '上移'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    attrs: {
                                        icon: 'ios-arrow-down'
                                    },
                                    style: {
                                        marginRight: '7px'
                                    },
                                    on: {
                                        click: () => {
                                            // this.removeMosTemplate(params.index)
                                        }
                                    }
                                }, '下移'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        placement: 'top-start',
                                        title: '确定要删除吗！',
                                        type: 'error',
                                        size: 'small',
                                        width: '250',
                                        vModel: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.$Message.success('删除成功');
                                        },
                                        'on-cancel': () => {
                                            this.$Message.info('取消成功');
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '7px'
                                        },
                                        attrs: {
                                            icon: 'ios-trash'
                                        },
                                        on: {
                                            click: () => {
                                                // this.removeMosTemplate(params.index)
                                            }
                                        }
                                    }, '删除')
                                ])
                            ]);
                        }
                    }
                ],
                stepsTableData: [],
                stepsTableData: [
                    {
                        name: '创建订单',
                        execute: 'y',
                        status: 1,
                        share: 'n',
                        type: 'Http',
                        create_time: '2018-09-20 12:30:10'
                    },
                    {
                        name: '退款',
                        execute: 'n',
                        share: 'y',
                        type: 'Sql',
                        create_time: '2018-09-20 12:30:10',
                        status: 2
                    },
                    {
                        name: '工行银行卡绑定',
                        execute: 'y',
                        share: 'y',
                        type: 'Sql',
                        create_time: '2018-09-20 12:30:10',
                        status: 0
                    },
                    {
                        name: '批量下单',
                        execute: 'y',
                        share: 'y',
                        type: 'Http',
                        create_time: '2018-09-20 12:30:10',
                        status: 1
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
                        align: 'center'
                    },
                    {
                        title: '用例类型',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '执行结果',
                        key: 'status',
                        align: 'center',
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
                        title: '是否执行',
                        key: 'execute',
                        align: 'center'
                    },
                    {
                        title: '分享状态',
                        key: 'share',
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
                        width: 240,
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
                                            this.updateCaseModal = true;
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
                                            // this.removeMosTemplate(params.index)
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
                                            // this.removeMosTemplate(params.index)
                                        }
                                    }
                                }, '分享'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        placement: 'top-start',
                                        title: '确定要删除吗！',
                                        type: 'error',
                                        size: 'small',
                                        width: '250',
                                        vModel: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.$Message.info('删除成功');
                                        },
                                        'on-cancel': () => {
                                            this.$Message.info('取消成功');
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '7px'
                                        },
                                        attrs: {
                                            icon: 'ios-trash'
                                        },
                                        on: {
                                            click: () => {
                                                // this.removeMosTemplate(params.index)
                                            }
                                        }
                                    }, '删除')
                                ])
                            ]);
                        }
                    }
                ],
                caseTableData: [
                    {
                        name: '创建订单',
                        execute: 'y',
                        status: 1,
                        share: 'n',
                        type: 'Http',
                        steps: [],
                        create_time: '2018-09-23 9:30:10'
                    },
                    {
                        name: '退款',
                        execute: 'n',
                        share: 'y',
                        type: 'Ui',
                        steps: [],
                        create_time: '2018-09-20 11:30:40',
                        status: 2
                    },
                    {
                        name: '工行银行卡绑定',
                        execute: 'y',
                        share: 'y',
                        type: 'Dubbo',
                        steps: [],
                        create_time: '2018-09-20 02:10:10',
                        status: 0
                    },
                    {
                        name: '批量下单',
                        execute: 'y',
                        share: 'y',
                        type: 'Http',
                        steps: [],
                        create_time: '2018-09-28 08:09:10',
                        status: 1
                    }
                ],
                projectModalTitle: '添加',
                sqlResultModalTitle: 'SQL',
                addProjectEnvModal: false,
                sqlResultModal: false,
                commonTablsName: '基础用例管理',
                listStyle: {
                    width: '270px',
                    height: '200px'
                },
                loadingStatus: false,
                updateCaseInfo: {
                    name: '创建购物订单',
                    execute: 'y',
                    status: null,
                    type: 'Http',
                    share: 'y',
                    steps: [],
                    create_time: ''
                },
                addCaseInfo: {
                    name: '',
                    execute: 'y',
                    status: null,
                    type: 'Http',
                    share: 'y',
                    steps: [],
                    create_time: ''
                },
                updateStepInfo: {
                    name: '退汇',
                    execute: 'y',
                    status: null,
                    type: 'Sql',
                    create_time: '',
                    httpParam: {
                        host: '',
                        apiUrl: '',
                        httpType: 'get',
                        stepName: '',
                        execute: 'y',
                        headers: [],
                        body: {
                            formParamsList: [
                                {
                                    key: '',
                                    value: '',
                                    method: '',
                                    args: ''
                                }
                            ],
                            jsonBody: null
                        },
                        assertResult: {
                            resType: 'json',
                            assertType: 'json',
                            formParams: [],
                            jsonParams: null
                        }
                    },
                    sqlParam: {
                        dbSource: '',
                        stepName: '',
                        execute: 'y',
                        sqlStr: '',
                        res: ''
                    }
                },
                addStepInfo: {
                    httpParam: {
                        host: '',
                        apiUrl: '',
                        httpType: 'get',
                        stepName: '',
                        execute: 'y',
                        headers: [],
                        body: {
                            formParamsList: [
                                {
                                    key: '',
                                    value: '',
                                    method: '',
                                    args: ''
                                }
                            ],
                            jsonBody: null
                        },
                        assertResult: {
                            resType: 'json',
                            assertType: 'json',
                            formParams: [],
                            jsonParams: null
                        }
                    },
                    sqlParam: {
                        dbSource: '',
                        stepName: '',
                        execute: 'y',
                        sqlStr: '',
                        res: ''
                    },
                    name: '',
                    execute: 'y',
                    status: null,
                    type: 'Sql',
                    create_time: ''
                },
                visible: false,
                showBorder: true,
                showStripe: true,
                showHeader: true,
                fixedHeader: true,
                sqlStepsModal: false
            };
        },
        methods: {
            addCase() {
                this.addCaseModal = true;
            },
            stepTypeChange(type) {
                this.stepsType = type;
            },
            onMounted(editor) {
                this.editor = editor;
                this.editor.layout({
                    width: 800,
                    height: 200
                });
                this.editor.setValue('{\n' +
                    '    "key":"#{res}.age.name",\n' +
                    `    "order":"${Math.random() * 10 + 1}"\n` +
                    '}');
            },
            onSqlMounted(editor) {
                this.sqleditor = editor;
                this.sqleditor.layout({
                    width: 600,
                    height: 300
                });
                this.sqleditor.setValue('select * from tb_case;');
            },
            onSqlStepsMounted(editor) {
                this.sqlStepeditor = editor;
                this.sqlStepeditor.layout({
                    width: 700,
                    height: 300
                });
                this.sqlStepeditor.setValue('select * from tb_case;');
            },
            onJsonMounted(editor) {
                this.jsoneditor = editor;
                this.jsoneditor.layout({
                    width: 700,
                    height: 200
                });
                this.jsoneditor.setValue('');
            },
            sqlSelect(sqlType) {
                console.log(sqlType);
                if (sqlType !== '文本') {
                    this.sqlResultModal = true;
                }
            },
            onCodeChange(editor) {
                // this.queryResult = this.editor.getValue()
            },
            onSqlStepCodeChange(editor) {
                // this.queryResult = this.editor.getValue()
            },
            onSqlCodeChange(editor) {
                // this.queryResult = this.editor.getValue()
            },
            onJsonCodeChange(editor) {
                // this.queryResult = this.editor.getValue()
            },
            paramTypeSelect() {
                if (this.formItem.radio === 'form-data') {
                    this.formParamShow = true;
                    this.jsonParamShow = false;
                } else {
                    console.log(this.formItem.radio);
                    this.formParamShow = false;
                    this.jsonParamShow = true;
                }
            },
            assertTypeSelect() {
                if (this.assertItemResult.radio === 'Json') {
                    this.formJsonShow = true;
                    this.formXmlShow = false;
                } else {
                    this.formJsonShow = false;
                    this.formXmlShow = true;
                }
            },
            resultTypeSelect() {
            },
            addStepsOk() {
            },
            updateHttpStepsOk() {
            },
            addSqlStepsOk() {
            },
            updateSqlStepsOk() {
            },
            addSteps() {
                if (this.stepsType === 'Http') {
                    this.addStepsModal = true;
                } else if (this.stepsType === 'Sql') {
                    this.sqlStepsModal = true;
                } else {
                    this.$Message.error('请选择步骤类型！');
                }
            },
            upfile() {
                this.upfileModal = true;
            },
            searchCommonCase() {
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
            getProjectPageSize(size) {
                this.pageHelp.pageSize = size;
            },
            getProjectPageIndex(index) {
                this.pageHelp.curPage = index;
            },
            render(item) {
                return item.label;
            },
            addProjectEnv() {
                this.addProjectEnvModal = true;
                // this.commonTablsName = '多音字标注'
                // this.$set(this.commonTablsName, '项目&版本维护');
            },
            addSqlResultEnv() {
                // this.addSqlResultModal = true;
                // this.commonTablsName = '多音字标注'
                // this.$set(this.commonTablsName, '项目&版本维护');
            },
            updateCase() {
                this.updateCaseModal = false;
                // this.commonTablsName = '多音字标注'
                // this.$set(this.commonTablsName, '项目&版本维护');
            },
            addCaseOk() {
            },
            resetProject() {
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                });
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },
            handleAdd() {
                this.index++;
                this.formDynamic.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            handleAddBodyParam() {
                this.index++;
                this.formBodyDynamic.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            handleAddResultParam() {
                this.index++;
                this.formResultDynamic.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            handleRemove(index) {
                this.formDynamic.items[index].status = 0;
            },
            handleRemoveBodyParam(index) {
                this.formBodyDynamic.items[index].status = 0;
            },
            handleRemoveResultParam(index) {
                this.formResultDynamic.items[index].status = 0;
            },
            handleRemoveStringParam(index) {
                this.formStringDynamic.items[index].status = 0;
            }
        }

    };
</script>

<style scoped>
    .my_divider {
        padding: 0 20px 0;
        margin: 20px 0;
        line-height: 1px;
        border-left: 410px solid #ddd;
        border-right: 410px solid #ddd;
        text-align: center
    }

</style>

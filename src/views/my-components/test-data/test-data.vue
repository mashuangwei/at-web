<style lang="less" xmlns="http://www.w3.org/1999/html">
</style>
<template>
    <div>
        <Row>
            <Col span="12">
                <Card style="width:97%">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        缺陷统计
                    </p>
                    <div>
                        <Row>
                            <Col span="12">
                                <bugrate></bugrate>
                                <br/>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
            <Col span="12">
                <Card style="width:97%">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        各模块缺陷分布统计
                    </p>
                    <div>
                        <Row>
                            <Col span="12">
                                <buganalyse></buganalyse>
                                <br/>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <Card style="width:97%">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        各版本缺陷数统计
                    </p>
                    <div>
                        <Row>
                            <Col span="12">
                                <bugnumber></bugnumber>
                                <br/>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
            <Col span="12">
                <Card style="width:97%">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        用例执行数统计
                    </p>
                    <div>
                        <Row>
                            <Col span="12">
                                <casetotal></casetotal>
                                <br/>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>

    </div>

</template>
<script>
    import buganalyse from './buganalyse.vue';
    import bugrate from './bugrate';
    import bugnumber from './bugnumber';
    import casetotal from './casetotal';

    export default {
        name: 'test-data',
        components: {bugrate, buganalyse, bugnumber, casetotal},
        data () {
            return {
                versionList: ['1.0.0', '1.0.1', '1.0.2', '2.0.0'],
                oula_version: '1.0.1',
                id: 'test'
            };
        },
        mounted () {
            // this.bugCharts = HighCharts.chart(document.getElementById('bugcharts'), this.option);
            // this.bugAnalyseCharts = HighCharts.chart(document.getElementById('analysecharts'), this.buganalyseOption);
        },
        methods: {
            // drawGraph (id) {
            // }
        }
    };
</script>


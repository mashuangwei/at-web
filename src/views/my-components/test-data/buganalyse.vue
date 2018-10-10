<template>
    <div>
        <Row>
            <Col span="4" style="padding-right:10px;min-width: 140px" >
                <Select v-model="oula_version" filterable>
                    <Option v-for="(item, index) in versionList" :value="item" :key="index">{{ item }}</Option>
                </Select>
            </Col>
        </Row>
        <br>
        <div id="bugAnalyseCharts" style="height:300px;width: 200%"></div>
    </div>

</template>

<script>
    import HighCharts from 'highcharts';
    import Exporting from 'highcharts/modules/exporting';

    // 初始化导出模块
    Exporting(HighCharts);

    export default {
        name: 'buganalyse',
        data () {
            return {
                versionList: ['1.0.0', '1.0.1', '1.0.2', '2.0.0'],
                oula_version: '1.0.1',
                bugAnalyseCharts: null,
                buganalyseOption: {
                    chart: {
                        type: 'column'
                    },
                    // 版权信息是否展示,false：不展示d
                    credits: {
                        text: 'zhiquplus',
                        enabled: false,
                        href: 'https://www.baidu.com/#/'
                    },
                    title: {
                        text: 'v1.0.1版本各模块缺陷统计'
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: '各模块缺陷所占比例'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:.1f}%'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                    },
                    series: [{
                        name: '模块',
                        colorByPoint: true,
                        data: [{
                            name: '数据中心',
                            y: 56.33
                        }, {
                            name: '首页',
                            y: 24.03
                        }, {
                            name: '我的模型',
                            y: 10.38
                        }, {
                            name: '用户管理',
                            y: 4.77
                        }, {
                            name: '算法',
                            y: 0.91
                        }, {
                            name: '任务中心',
                            y: 0.2
                        }]
                    }]
                }
            };
        },
        mounted () {
            this.bugAnalyseCharts = HighCharts.chart(document.getElementById('bugAnalyseCharts'), this.buganalyseOption);
        }
    };
</script>

<style scoped>

</style>
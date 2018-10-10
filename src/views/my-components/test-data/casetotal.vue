<template>
    <div>
        <Row>
            <Col span="4" style="padding-right:10px;min-width: 140px" >
                <Select v-model="latestVersion" filterable>
                    <Option v-for="(item, index) in latestVersionList" :value="item" :key="index">{{ item }}</Option>
                </Select>
            </Col>
        </Row>
        <br>
        <div id="casecharts" style="height:300px;width: 200%"></div>

    </div>
</template>

<script>
    import HighCharts from 'highcharts';
    import Exporting from 'highcharts/modules/exporting';

    // 初始化导出模块
    Exporting(HighCharts);

    export default {
        name: 'casetotal',
        data () {
            return {
                latestVersion: '最近12个版本',
                latestVersionList: ['最近12个版本', '最近24个版本'],
                caseCharts: null,
                option: {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '历史执行用例数统计'
                    },
                    // 版权信息是否展示,false：不展示
                    credits: {
                        text: 'zhiquplus',
                        enabled: false,
                        href: 'https://www.baidu.com/#/'
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: 0
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '个'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: '用例执行数: <b>{point.y:.0f} 个</b>'
                    },
                    series: [{
                        name: '用例执行总数',
                        data: [
                            ['v1.0.0', 525],
                            ['v1.0.1', 150],
                            ['v1.0.2', 151],
                            ['v1.0.3', 178],
                            ['v1.0.4', 106],
                            ['v1.0.5', 420],
                            ['v1.0.6', 116],
                            ['v1.0.7', 251],
                            ['v1.0.8', 218],
                            ['v1.0.9', 214],
                            ['v2.0.0', 319]
                        ],
                        dataLabels: {
                            enabled: true,
                            rotation: -90,
                            color: '#FFFFFF',
                            align: 'right',
                            format: '{point.y:.0f}', // :.1f 为保留 1 位小数
                            y: 10
                        }
                    }]
                }
            };
        },
        mounted () {
            this.caseCharts = HighCharts.chart(document.getElementById('casecharts'), this.option);
        }
    };
</script>

<style scoped>

</style>
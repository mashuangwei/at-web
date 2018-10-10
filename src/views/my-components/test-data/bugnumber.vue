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
        <div id="bugnumber" style="height:300px;width: 200%"></div>
    </div>
</template>
<script>
    import HighCharts from 'highcharts';
    import Exporting from 'highcharts/modules/exporting';

    // 初始化导出模块
    Exporting(HighCharts);

    export default {
        name: 'bugnumber',
        data () {
            return {
                versionList: ['1.0.0', '1.0.1', '1.0.2', '2.0.0'],
                oula_version: '1.0.1',
                bugAnalyseCharts: null,
                buganalyseOption: {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'bug数'
                    },
                    // 版权信息是否展示,false：不展示
                    credits: {
                        text: 'zhiquplus',
                        enabled: false,
                        href: 'https://www.baidu.com/#/'
                    },
                    xAxis: {
                        categories: [
                            'v1.0.0', 'v1.0.1', 'v1.0.2', 'v1.0.3', 'v1.0.4', 'v1.0.5', 'v1.0.6', 'v1.0.7', 'v1.0.8', 'v1.0.9', 'v1.0.', 'v1.1.0'
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'bug数'
                        }
                    },
                    tooltip: {
                        // head + 每个 point + footer 拼接成完整的 table
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.0f} 个</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: '严重',
                        data: [59, 3, 8, 23, 34, 55, 5, 7, 9, 2, 8, 10]
                    }, {
                        name: '高',
                        data: [39, 3, 15, 23, 45, 55, 5, 7, 49, 5, 8, 20]
                    }, {
                        name: '中',
                        data: [49, 23, 5, 3, 7, 33, 5, 3, 9, 40, 8, 50]
                    }, {
                        name: '低',
                        data: [29, 53, 5, 7, 14, 55, 5, 2, 29, 12, 8, 30]
                    }, {
                        name: '优化',
                        data: [9, 13, 5, 9, 16, 26, 5, 1, 9, 12, 8, 20]}
                    ]
                }
            };
        },
        mounted () {
            this.bugAnalyseCharts = HighCharts.chart(document.getElementById('bugnumber'), this.buganalyseOption);
        }
    };
</script>


<style scoped>

</style>
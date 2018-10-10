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
        <div id="bugcharts" style="height:300px;width: 200%"></div>
    </div>

</template>

<script>
    import HighCharts from 'highcharts';
    import Exporting from 'highcharts/modules/exporting';

    // 初始化导出模块
    Exporting(HighCharts);

    export default {
        name: 'bugrate',
        data () {
            return {
                versionList: ['1.0.0', '1.0.1', '1.0.2', '2.0.0'],
                oula_version: '1.0.1',
                bugCharts: null,
                option: {
                    title: {
                        text: 'v1.0.2版本缺陷统计'
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br>',
                        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (HighCharts.theme && HighCharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    // 版权信息是否展示,false：不展示
                    credits: {
                        text: 'zhiquplus',
                        enabled: false,
                        href: 'https://www.baidu.com/#/'
                    },
                    series: [{
                        type: 'pie',
                        name: 'v1.0.2版本',
                        data: [
                            ['低', 35.0],
                            ['中', 26.8],
                            ['高', 2.3],
                            ['优化', 16.2],
                            ['未解决', 6.2],
                            ['严重', 0.7]
                        ]
                    }]
                }
            };
        },
        mounted () {
            this.bugCharts = HighCharts.chart(document.getElementById('bugcharts'), this.option);
        }
    };
</script>

<style scoped>

</style>
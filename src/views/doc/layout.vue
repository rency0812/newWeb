<template>
    <div class="ivu-article wrapper-container">
        <article>
            <h1>框架页</h1>
            <Row>
                <Col :span="24">
                    <Divider/>
                    <h2>页面使用注意:</h2>
                    <Split v-model="splitValue">
                        <div slot="left">
                            <h3>页面默认程序池</h3>
                            <Input v-model="DataSet" type="textarea" :rows="10" readonly/>
                            <Divider/>
                            <h3>页面使用的组件</h3>
                            <div>
                                <Button to="/doc/components/common/handlescreen">头部全屏按钮</Button>
                            </div>
                        </div>
                        <div slot="right">
                        </div>
                    </Split>
                </Col>
            </Row>
        </article>
    </div>
</template>
<script>/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */

export default {
    data() {
        return {
            DataSet:null,
            splitValue: 0.55
        }
    },
    mounted() {
        let self = this
        self.$nextTick(function () {

            self.DataSet = 'data() {\n' +
                '        return {\n' +
                '            //平台配置\n' +
                '            platformState: {\n' +
                '                "platformName": null,\n' +
                '                "platformId": null,\n' +
                '                "platformTheme": null,\n' +
                '                "platformLogo": null,\n' +
                '                "platformSplash": null\n' +
                '\n' +
                '            }\n' +
                '        }\n' +
                '    },'


            self.platformState = '{\n' +
                '  "code": 1,\n' +
                '  "detail": {\n' +
                '    "platformName": "平台名称",\n' +
                '    "platformId": "平台ID",\n' +
                '    "platformTheme": "平台主题名",\n' +
                '    "platformLogo": "平台LOGO地址,建议用绝对路径",\n' +
                '    "platformSplash": "平台背景图地址，建议用绝对路径",\n' +
                '    "platformSideMenu": true （平台是否使用侧边菜单栏）,\n' +
                '    "platformCopyright": "版权说明，可使用html代码"\n' +
                '  },\n' +
                '  "msg": "获取成功"\n' +
                '}'

        })
    }
}

</script>

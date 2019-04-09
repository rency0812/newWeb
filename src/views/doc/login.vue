<template>
    <div class="ivu-article wrapper-container">
        <article>
            <h1>登录页</h1>
            <Row>
                <Col :span="24">
                    <Divider/>
                    <h2>页面使用注意:</h2>
                    <Split v-model="splitValue">
                        <div slot="left">
                            <h3>登录流程逻辑</h3>
                            <img src="/assets/img/doc/progress_login.png">
                            <Divider/>
                            <h3>页面使用的组件</h3>
                            <div>
                                <Button to="/doc/components/common/handlescreen">全屏按钮</Button>
                                <Button to="/doc/components/window/loginbox">登录框</Button>
                            </div>
                        </div>
                        <div slot="right">
                            <h3>JSON</h3>
                            <br/>
                            <h4><strong>GetPlatUrl：获取平台配置,页面初始化时调用</strong></h4>
                            <Input v-model="platformState" type="textarea" :rows="10"/>
                        </div>
                    </Split>
                </Col>
            </Row>
        </article>
    </div>
</template>
<script>/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */

import instruction from '../monitor/instruction/index';


export default {
    data() {
        return {
            DataSet:null,
            platformState: null,
            splitValue: 0.55
        }
    },
    mounted() {
        // instruction.callForCarPosition('012011113333', '粤A111111');
        // instruction.takePhoto('012011113333', '粤A22222');
        // instruction.sendText('012011113333', '粤A22222');
        // instruction.setListener('012011113333', '粤A22222');
        instruction.setParamsConfig();

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

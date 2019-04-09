<template>
    <div class="ivu-article wrapper-container">
        <article>
            <h1>全屏按钮组件 Components</h1>
            <Row>
                <Col :span="24">
                    <Divider/>
                    <h2>组件使用注意:</h2>
                    <Split v-model="splitValue">
                        <div slot="left">

                            <h3>组件样式</h3>
                            <img src="/assets/img/doc/componets_handlescreen.png">
                            <Divider/>
                            <h3>组件建议名称</h3>
                            <Input v-model="ComponetsName" type="textarea" :rows="3" readonly/>
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
            ComponetsName:null,
            DataSet: null,
            splitValue: 0.55
        }
    },
    mounted() {
        let self = this
        self.$nextTick(function () {
            self.ComponetsName ='<handleScreen/>'
        })
    }
}
</script>
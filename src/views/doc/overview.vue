<template>
    <div class="ivu-article wrapper-container">
        <article>
            <h1>特殊页面示例</h1>
            <Row>
                <Col :span="24">
                    <Split v-model="splitValue">
                        <div slot="left">
                            <h3>页面示例</h3>
                            <div>
                                <Button to="/map/mapMonitor">实时监控</Button>
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
            DataSet: null,
            platformState: null,
            splitValue: 0.55
        }
    }
}


</script>
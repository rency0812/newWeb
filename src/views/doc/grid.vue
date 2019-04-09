<template>
    <div class="ivu-article wrapper-container">
        <article>
            <h1>报表页面示例</h1>
            <Row>
                <Col :span="24">
                    <Split v-model="splitValue">
                        <div slot="left">
                            <h3>页面示例</h3>
                            <div>
                                <Button to="/table/dataRoleManage">角色管理</Button>
                                <Button @click="model1 = true">弹窗1</Button>
                            </div>
                        </div>
                        <div slot="right">
                        </div>
                    </Split>
                </Col>
            </Row>
        </article>
        <Modal v-model="model1" title="特殊弹窗" @on-ok="ok" @on-cancel="cancel">
            <Form
                ref="formValidate"
                :model="cForm.formValidate"
                :rules="cForm.ruleValidate"
                :label-width="80">
                <Form-item label="父类" prop="title">
                    <Row>
                        <Col span="20">
                            xxxxx
                        </Col>
                    </Row>
                </Form-item>
                <Form-item v-for="(val,key) in cForm.label" :label="val" prop="title" :key="key">
                    <Row>
                        <Col span="20">
                            <Input v-model="cForm.formValidate[key]" placeholder="请输入" />
                        </Col>
                    </Row>
                </Form-item>
            </Form>
        </Modal>
    </div>

</template>
<script>/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */

export default {
    data() {
        return {
            DataSet: null,
            platformState: null,
            splitValue: 0.55,
            model1: false,
            cForm: {
                id: 0,
                modal: false,
                label: {
                    title: '标题',
                    description: '描述'
                },
                formValidate: {
                    title: '',
                    description: '',
                },
                ruleValidate: {
                    title: [
                        {
                        required: true,
                        message: '标题不能为空'
                        }
                    ]
                }
            }
        }
    },
    methods: {
        ok () {
            console.log(this.cForm.formValidate)
        },
        cancel () {}
    }
}


</script>
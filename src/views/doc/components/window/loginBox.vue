<template>
    <div class="ivu-article wrapper-container">
        <article>
            <h1>登录框组件 Components</h1>
            <Row>
                <Col :span="24">
                    <Divider/>
                    <h2>组件使用注意:</h2>
                    <Split v-model="splitValue">
                        <div slot="left">
                            <h3>组件样式</h3>
                            <img src="/assets/img/doc/componets_loginbox.png">
                            <Divider/>
                            <h3>组件建议名称</h3>
                            <Input v-model="ComponetsName" type="textarea" :rows="3" readonly/>
                            <Divider/>
                            <h3>组件默认程序池</h3>
                            <Input v-model="DataSet" type="textarea" :rows="10" readonly/>
                        </div>
                        <div slot="right">
                            <h3>JSON</h3>
                            <br/>
                            <h4><strong>GetLoginUrl：登录后获取的用户信息</strong></h4>
                            <Input v-model="userState" type="textarea" :rows="10" readonly/>
                            <Divider/>
                            <h4><strong>GetMenuUrl：登录后根据角色权限获取菜单</strong></h4>
                            <Input v-model="menuData" type="textarea" :rows="10" readonly/>
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
            DataSet:null,
            userState: null,
            menuData: null,
            splitValue: 0.55
        }
    },
    mounted() {
        let self = this
        self.$nextTick(function () {
            self.ComponetsName ='<loginBox/>'
            self.DataSet = ' data() {\n' +
                '        return {\n' +
                '            //登录表单验证\n' +
                '            ruleInline: {\n' +
                '                Account: [\n' +
                '                    {required: true, message: \'用户名不能为空\', trigger: \'blur\'},\n' +
                '                ],\n' +
                '                Password: [\n' +
                '                    {required: true, message: \'密码不能为空\', trigger: \'blur\'},\n' +
                '                    {type: \'string\', min: 4, message: \'密码长度不能小于4位\', trigger: \'blur\'}\n' +
                '                ]\n' +
                '            },\n' +
                '            errorTip: null,\n' +
                '            loading: false\n' +
                '        }\n' +
                '    }'

            self.userState = '{\n' +
                '  "code": 1,\n' +
                '  "detail": {\n' +
                '    "id": 用户ID,\n' +
                '    "account": "用户名/手机号",\n' +
                '    "name": "昵称",\n' +
                '    "sex": 性别,\n' +
                '    "email": 电子邮箱,\n' +
                '    "token": "获取的token",\n' +
                '    "userGuid": "获取的token",\n' +
                '    "spell": null,\n' +
                '    "deptId": 权限ID,\n' +
                '    "deptName": "数据权限名",\n' +
                '    "roleName": "角色名",\n' +
                '    "roleId": 5,\n' +
                '    "phone": 联系手机号,\n' +
                '    "isAdmin": 是否是管理员\n' +
                '  },\n' +
                '  "msg": "登录成功"\n' +
                '}'

            self.menuData = '{\n' +
                '    "code": 1,\n' +
                '    "detail": [{\n' +
                '        "id": 菜单ID,\n' +
                '        "text": "一级菜单名称",\n' +
                '        "pid": 父菜单ID,\n' +
                '        "opened": true,\n' +
                '        "data": {\n' +
                '            "url": "一级菜单地址",\n' +
                '            "iconClass": 一级菜单附带图标,\n' +
                '            "target": 是否弹出新页面(_blank)\n' +
                '        },\n' +
                '        "children": [{\n' +
                '            "id": 菜单ID,\n' +
                '            "text": "二级菜单名称",\n' +
                '            "pid": 父ID,\n' +
                '            "opened": false,\n' +
                '            "data": {\n' +
                '                "url": "二级菜单地址",\n' +
                '                "iconClass": 二级菜单附带图标,\n' +
                '                "target": 是否弹出新页面(_blank)\n' +
                '            },\n' +
                '            "children": [{\n' +
                '            "id": 菜单ID,\n' +
                '            "text": "三级菜单名称",\n' +
                '            "pid": 1,\n' +
                '            "opened": false,\n' +
                '            "data": {\n' +
                '                "url": "三级菜单地址",\n' +
                '                "iconClass": 三级菜单附带图标,\n' +
                '                "target": 是否弹出新页面(_blank)\n' +
                '            },\n' +
                '            "children": null,\n' +
                '            "selected": false,\n' +
                '            "icon": "tree-node tree-icon Department"\n' +
                '        }],\n' +
                '            "selected": false,\n' +
                '            "icon": "tree-node tree-icon Department"\n' +
                '        }],\n' +
                '        "selected": false,\n' +
                '        "icon": "tree-node tree-icon Department"\n' +
                '    }],\n' +
                '    "msg": "加载菜单成功"\n' +
                '}'
        })
    }
}

</script>
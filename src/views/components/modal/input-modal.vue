<template>
    <Modal v-model="modalCfg.show" :draggable="false" :mask-closable="true" width="55%" class="layou-modal-input">
        <p slot="header">
            <Icon type="information-circled"></Icon>
            <span>{{modalCfg.title}}</span>
        </p>
        <div class="layout-modal-content" :class="{'full':inputFull}">
            <div class="layout-modal-content-input">
                <Form v-model="inputData" inline label-position="right" :label-width="100" aria-disabled="true">
                    <FormItem :label="item.title+':'" v-for="item in modalData" :key="item.id"
                              :style="{width:item.width}">
                        <!--输入框-->
                        <Input type="text" :placeholder="'请输入'+item.title+'...'" size="small"
                               v-model="inputData[item.name]" v-if="item.type == 'input'"></Input>
                        输入框
                        <Input type="textarea" :rows="4" :placeholder="'请输入'+item.title+'...'" size="small"
                               v-model="inputData[item.name]" v-if="item.type == 'textarea'"
                               style="width: 100%"></Input>
                        <!--时间日期选择器-->
                        <DatePicker type="datetime" size="small"
                                    v-model="inputData[item.name]" :placeholder="'请输入'+item.title+'...'"
                                    v-if="item.type == 'datepicker'"></DatePicker>
                        <!--选择下拉-->
                        <Select v-model="inputData[item.name]" clearable filterable v-if="item.type == 'select'"
                                size="small">
                            <Option :value="i.value" v-for="i in item.option" :key="i.label">{{i.label}}</Option>
                        </Select>
                    </FormItem>
                </Form>
                <div class="layout-modal-button" v-if="NewSave">
                    <Button type="success" icon="checkmark-round" size="small" :loading="modal_loading"
                            @click="handleSave">
                        保 存
                    </Button>
                    <Button size="small" @click="handleCancel"> 取 消 </Button>
                </div>
            </div>
            <div class="layout-modal-content-grid" v-if="modalGrid">
                <Spin size="large" fix v-if="spinShow" style="height: 450px;">
                    <Icon type="ios-loading" size='32' class="spin-icon-load"></Icon>
                    <div>加载中...</div>
                </Spin>
                <Table height="490" :columns="columns" :data="tableData" highlight-row border
                       @on-row-click="handleRowData"></Table>
                <Page :style="{height:'40px','margin-top':'10px'}" :total="PageTotal" size="small" :page-size="PageSize"
                      class="fr"
                      @on-change="handleTableData"></Page>
            </div>
        </div>
        <div slot="footer"></div>
    </Modal>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase */
export default {
    props: ['modalCfg', 'tableData', 'PageTotal', 'PageSize', 'spinShow', 'inputData', 'NewSave', 'inputFull', 'modalGrid'],
    data() {
        return {
            'modal_loading': false,
            columns: [
                {
                    title: '企业名称',
                    key: 'name'
                },
                {
                    title: '企业简称',
                    key: 'short_name'
                }],
            modalData: this.$props.modalCfg.Cfg,
            edit: false
        }
    },
    methods: {
        handleSave() {
            var self = this
            self.modal_loading = true
            setTimeout(() => {
                self.modalCfg.show = false
                self.modal_loading = false
            }, 2000)
        },
        handleCancel() {
            var self = this
            self.modalCfg.show = false
            self.NewSave = true
        },
        handleRowData(res) {
            var self = this
            if (self.NewSave) {
                self.$Modal.confirm({
                    title: '编辑',
                    content: '是否修改该条目？',
                    onOk: () => {
                        self.edit = true
                        let inputData = self.inputData
                        for (var ikey in inputData) {
                            for (var key in res) {
                                if (key === ikey) {
                                    inputData[ikey] = res[key]
                                }
                            }
                        }
                        self.inputData = inputData
                        self.modalCfg.title = '编辑' + inputData.name
                        self.$Modal.remove()
                    }
                });
            } else {
                self.edit = false
                let inputData = self.inputData
                for (var ikey in inputData) {
                    for (var key in res) {
                        if (key === ikey) {
                            inputData[ikey] = res[key]
                        }
                    }
                }
                self.inputData = inputData
            }
        },
        handleTableData(e) {
            console.log(e)
            this.$emit('refreshtable', e)
        }
    },
    watch: {
        NewSave(c) {
            console.log(c)
            var self = this
            if (c) {
                // let inputData = self.inputData
                // for (var key in inputData) {
                //     inputData[key] = ''
                // }
                // self.inputData = inputData
            }
        },
        modalCfg(n, o){
            console.log('n:' + n)
            console.log('o:' + o)
        }
    },
    mounted() {
    },
    computed: {}
}
</script>
<style scoped>
    .modal-tree {
        max-height: 400px;
        overflow-y: scroll
    }
</style>
<template>
    <Modal v-model="modalState"
           :draggable="true"
           :mask-closable="false">
        <p slot="header">
            <Icon type="information-circled"></Icon>
            <span>{{modelTree.title}}</span>
        </p>
        <Row justify="center">
            <Col span="22" :xs="{ offset: 1 }">
            <Input search enter-button placeholder="输入关键字"/>
            </Col>
            <Col span="22" :xs="{ offset: 1 }" style="margin-top: 5px">
            <v-jstree :data='treeModalData' :whole-row="true" :loading-text="'loading....'" :collapse="false"
                      :allow-batch="true" :show-checkbox="true" :multiple="true"
                      @item-click="treeNodeClick" class="modal-tree"></v-jstree>
            </Col>
        </Row>
        <div slot="footer">
            <div class="layout-modal-button">
                <Button type="success" icon="md-checkmark-circle" :loading="loading"
                        @click="handleSave('tableModal')">
                    {{saveBtn}}
                </Button>
                <Button @click="handleCancel('tableModal')"> 取 消 </Button>
            </div>
        </div>
    </Modal>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase,no-dupe-keys */

import VJstree from 'vue-jstree'
import Util from '../../../libs/util'

const PostDeptTreeUrl = require('../../../libs/api').PostDeptTreeUrl
const PostSettingPermisionUrl = require('../../../libs/api').PostSettingPermisionUrl

export default {
    components: {
        VJstree
    },
    props: ['modelTree'],
    data() {
        return {
            saveBtn: '保存',
            treeModalData: [],
            loading: false,





            modalState: false
        }
    },
    mounted() {
        console.log(this.modalState)
//        this.modalState.show = false
    },
    methods: {
        handleSave() {
            let self = this
            let postValue = {
                roleId: self.modelTree.roleId,
                data: self.treeModalData
            }

            self.loading= true

            Util.ojax.post(PostSettingPermisionUrl, postValue).then(function (response) {
                if (response.data.code == 0) {
                    self.modelTree.show = false
                    self.$Notice.success({
                        title: '提交成功！',
                        desc: '提交成功！',
                        duration: 5
                    })
                } else {
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: response.data.msg,
                        duration: 5
                    })
                }
                self.loading= false
            }).catch(function (error) {
                console.log(error)
            })
        },
        handleCancel() {
            var self = this
            self.modelTree.show = false
        },
        getTreeData() {
            let self = this
            if (self.modalData.tree) {
                let treeType = self.modalData.tree
                Util.ojax.post(PostDeptTreeUrl, {tree: treeType}).then(function (response) {
                    console.log(response)
                    if (response.data.code == 0) {
                        self.treeModalData = response.data.detail
                    } else {
                        self.$Notice.error({
                            title: '错误提示！',
                            desc: response.data.msg,
                            duration: 5
                        })
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
        treeNodeClick(data, node) {
            console.log(node)
            if (node.data.selected) {
                data.$parent.data.selected = true
            } else {
                let cIds = data.$parent.data.children
                let cV = []
                if (cIds && cIds.length > 0) {
                    $.each(cIds, function (v, i) {
                        cV.push(i.data.selected)
                    })
                    if (cV.indexOf('true') < 0) {
                        data.$parent.data.selected = false
                    }
                } else {
                    data.$parent.data.selected = false
                }
            }
        }
    },
    watch: {
        modelTree: {
            handler(n, o) {
                console.log(n)
                this.modalState = n.show
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style>

</style>
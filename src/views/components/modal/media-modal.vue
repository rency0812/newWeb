<template>
    <Modal v-model="modalCfg.showModal" :draggable="false" :mask-closable="false" width="55%" class="layou-modal-input">
        <p slot="header">
            <Icon type="information-circled"></Icon>
            <span>{{modalCfg.title}}</span>
        </p>
        <div class="layout-modal-content">
            <Row>
                <Col span="24">
                    <img :src='modalCfg.resourceUrl' alt="" v-if="modalCfg.type == 1" class="layout-media-resource">

                    <video :src="modalCfg.resourceUrl" autoplay controls v-if="modalCfg.type == 3" class="layout-media-resource"></video>

                </Col>
            </Row>

        </div>
        <div slot="footer">
            <div class="layout-modal-button">
                <Button type="success" icon="md-checkmark-circle" @click="handleSave">确定</Button>
            </div>
        </div>
    </Modal>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase */
export default {
    props: ['modalCfg'],
    data() {
        return {}
    },
    methods: {
        handleSave() {
            this.modalCfg.showModal = false
            this.modalCfg.resourceUrl = null
            this.modalCfg.type = null
        }
    },
    watch: {
        modalCfg: {
            handler(n) {
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {},
    computed: {}
}
</script>
<style>
    .layout-media-resource{height: 100%; width: 100%; overflow: hidden}
</style>
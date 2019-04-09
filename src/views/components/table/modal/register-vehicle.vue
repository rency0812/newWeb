<template>
    <!--新增菜单弹窗-->
    <div class="extra-button-container">

        <Button type="success" size="small" icon="md-add" class="adv-search-btn"
                @click="handlePlus">注册
        </Button>


        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input" :z-index="123">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>车辆注册</span>
            </p>
            <div class="modal-form">
                <Form ref="formInline" inline label-position="right" :label-width="100">
                    <FormItem label="*注册平台">
                        <Input type="text" v-model="platformName" placeholder="省运管" size="small" readonly style="width: 40%"/>
                    </FormItem>
                    <FormItem label="车牌号">
                        <Input type="text" v-model="vehNo" placeholder="请输入..." size="small" style="width: 40%"/>
                        <Button size="small" @click=""> 查询 </Button>
                        <Button size="small" @click="addVehicle"> 添加 </Button>
                        <Button size="small" @click="deleteVehicle"> 删除 </Button>
                    </FormItem>
                </Form>
                <Table :columns="tableColumns"
                       ref="table"
                       :data="gridData"
                       :height="400"
                       :loading="loadingValue"
                       highlight-row
                       border stripe
                       @on-select-cancel="handleSelectionCancel"
                       @on-select-all-cancel="handleSelectionCancel"
                       @on-select-all="handleSelection"
                       @on-select="handleSelection" style="border: 1px solid #dfdfdf;">
                </Table>
            </div>


            <div slot="footer" class="layout-modal-button">
                <Button @click="handleCancel"> 取 消</Button>
                <Button type="success" icon="checkmark-round" :loading="buttonLoading" @click="handleSave"> 注 册</Button>
            </div>
        </Modal>

        <choose-vehicle :show="showChooseVehicle" @selectedVehicle="selectedVehicle"></choose-vehicle>

    </div>
</template>


<script>
    //调用依赖库
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    import Util from '../../../../libs/util'
    import chooseVehicle from './choose-vehicle'

    //调用组件
    import formExt from '../formExt'

    export default {
        props: ['api'],

        components: {
            formExt,
            chooseVehicle
        },

        data() {
            return {
                loadingValue: false,
                showChooseVehicle: false,
                modalShow: false,
                buttonLoading: false,
                saveModal: {},
                platformName: '省运管',
                platformId: '1',
                vehNo: null,
                tableColumns: [
                    {type: 'selection', width: 30, align: 'center'},
                    {title: '车牌号', key: 'vehNo',align:'center'},
                    {title: '组织机构', key: 'deptName',align:'center'},
                    {title: '设备号', key: 'devNo',align:'center'}
                ],
                gridData:[],
                selectedVehicles: []

            }
        },
        methods: {
            addVehicle(){
                this.showChooseVehicle = true
            },
            deleteVehicle(){

                let len = this.gridData.length
                for(let i =0;i<len;i++){
                    let v = this.gridData[i]
                    for(let j = 0; j<this.selectedVehicles.length;j++){
                        if(this.gridData[i].id == this.selectedVehicles[j].id){
                            this.gridData.splice(i, 1)
                            this.selectedVehicles.splice(j, 1)
                        }
                    }
                }
            },
            // 取消勾选
            handleSelectionCancel(v,row){
                for(let i in this.selectedVehicles){
                    if(this.selectedVehicles[i].id == row.id){
                        this.selectedVehicles.splice(i, 1)
                    }
                }
            },

            // 从选择车辆弹窗传过来的车辆值
            selectedVehicle(v){
                this.gridData = this.gridData.concat(v)
                this.showChooseVehicle = false
            },

            // 只要选中项发生变化时就会触发，返回值为 selection，已选项
            handleSelection(v){
                this.selectedVehicles = v
            },

            // 点击按钮事件,弹出窗体
            handlePlus(e) {
                this.modalShow = true
            },

            // 保存
            handleSave() {
                const self = this
                if(self.selectedVehicles.length == 0){
                    self.$Notice.error({
                        title: '提示',
                        desc: '请选择车辆!',
                        duration: 3
                    })
                    return
                }
                const saveMenuModel = {
                    platformId: self.platformId,
                    baseVehicleInfos: self.selectedVehicles
                }
                this.buttonLoading = true
                Util.ojax.post(self.api, saveMenuModel).then(function (res) {
                    if (res.data.code == 0) {
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!',
                            duration: 3
                        })
                        self.handleCancel()
                        self.$emit('handleSearch')
                    }
                    self.buttonLoading = false
                }).catch(function (error) {
                    console.log(error)
                })
            },

            // 取消
            handleCancel() {
                var self = this
                self.gridData = []
                self.selectedVehicles = []
                self.buttonLoading = false
                self.modalShow = false
            }
        }
    }
</script>
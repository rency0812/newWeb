<template>
    <Table :style="{'max-height':tableHeight+'px'}" style="overflow-y:auto; overflow-x:hidden" :columns="columns"
           :data="tableData" highlight-row border @on-current-change="handleTable"></Table>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style */
export default {
    props: ['tableData', 'columns', 'tableHeight', 'dataType'],
    data() {
        return {}
    },
    methods: {
        handleTable(e, o) {
            let dataType = this.dataType
            switch (dataType) {
                case 0 :
                    this.$parent.siteValue = e
                    this.$parent.siteValue.show = false
                    break
                case 1 :
                    this.$parent.downloadValue = e
                    this.$parent.downloadValue.show = false
                    break
                case 2 :
                    this.$parent.lineValue = e
                    this.$parent.lineValue.show = false
                    break
                case 3 :
                    this.$parent.poiValue = e
                    this.$parent.poiValue.show = false
                    break
            }
        }
    },
    computed: {}
}
</script>
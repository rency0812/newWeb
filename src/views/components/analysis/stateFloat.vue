<template>
    <div class="layout-analysis-spoilMigrate-select" @mouseover="handleSelect(true)" @mouseout="handleSelect(false)">
        gdf
    </div>
</template>

<script>/* eslint-disable indent,no-undef,init-declarations,linebreak-style,no-unused-vars,camelcase,no-var,quotes,comma-spacing,comma-dangle,semi,no-console */


export default {
    data() {
        return {
        }
    },
    methods: {
        handleSelect(b) {
            var self = this
            if (b) {
                self.showRegion = true
            } else {
                self.showRegion = false
            }
        },
        handleAreaCode(e) {
            var self = this
            var areaCode = e.target.dataset.code
            var areaName = e.target.innerHTML
            self.$emit('handleRegionSelect', areaCode,areaName)
        }
    }
}
</script>
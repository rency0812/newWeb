<template>
    <div>

    </div>
</template>

<script>
    export default {
        props:['mapObj'],
        data() {
            return {
                mouseTool:null
            }
        },
        mounted() {
            this.initTool()
        },
        methods: {

            initTool() {
                let self = this
                self.mouseTool = new AMap.MouseTool(self.mapObj);
            },


            drawRule(){
                let self = this
                self.mouseTool.rule({
                    startMarkerOptions: { //可缺省
                        icon: new AMap.Icon({
                            size: new AMap.Size(19, 31), //图标大小
                            imageSize: new AMap.Size(19, 31),
                            image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
                        })
                    },
                    endMarkerOptions: { //可缺省
                        icon: new AMap.Icon({
                            size: new AMap.Size(19, 31), //图标大小
                            imageSize: new AMap.Size(19, 31),
                            image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
                        }),
                        offset: new AMap.Pixel(-9, -31)
                    },
                    midMarkerOptions: { //可缺省
                        icon: new AMap.Icon({
                            size: new AMap.Size(19, 31), //图标大小
                            imageSize: new AMap.Size(19, 31),
                            image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
                        }),
                        offset: new AMap.Pixel(-9, -31)
                    },
                    lineOptions: { //可缺省
                        strokeStyle: "solid",
                        strokeColor: "#FF33FF",
                        strokeOpacity: 1,
                        strokeWeight: 2
                    }
                });
            }
        }




    }
</script>

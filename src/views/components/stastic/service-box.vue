<template>
    <ul class="service-box">
        <li v-for="(item,index) in serviceData" :style="{width:liWidth}" :key="index">
            <a :href="item.url">
                <i class="ex-icon" :class="item.iconName"></i>
                <p>{{item.label}}</p>
            </a>
        </li>
        <li :style="{width:liWidth}" @click="exportsExcle">
            <a href="javascript:void(0);" class="service-btn-export">
                <i class="ex-icon ex-icon-icon-numbers"></i>
                <p>导出统计报表</p>
            </a>
        </li>

        <table id="tableExcel" width="100%" border="1" cellspacing="0" cellpadding="0" style="display: none">
            <tr v-for="(item,index) in stasticTopData" :key="index">
                <td>{{item.label}}</td>
                <td>{{item.value}}</td>
            </tr>

        </table>


    </ul>
</template>

<script>
    export default {
        props: ['serviceData', 'stasticTopData'],
        data() {
            return {
                liWidth: null
            }
        },
        beforeMount() {
            this.liWidth = '106px'
        },
        methods: {
            exportsExcle(e) {
                var idTmr;
                var tableid = 'tableExcel'
                var tableToExcel = (function () {
                    var uri = 'data:application/vnd.ms-excel;base64,',
                        template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
                        base64 = function (s) {
                            return window.btoa(unescape(encodeURIComponent(s)))
                        },
                        format = function (s, c) {
                            return s.replace(/{(\w+)}/g,
                                function (m, p) {
                                    return c[p];
                                })
                        }
                    return function (table, name) {
                        if (!table.nodeType) table = document.getElementById(table)
                        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
                        window.location.href = uri + base64(format(template, ctx))
                    }
                })()


                if (getExplorer() == 'ie') {
                    var curTbl = document.getElementById(tableid);
                    var oXL = new ActiveXObject("Excel.Application");
                    var oWB = oXL.Workbooks.Add();
                    var xlsheet = oWB.Worksheets(1);
                    var sel = document.body.createTextRange();
                    sel.moveToElementText(curTbl);
                    sel.select();
                    sel.execCommand("Copy");
                    xlsheet.Paste();
                    oXL.Visible = true;
                    try {
                        var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
                    } catch (e) {
                        print("Nested catch caught " + e);
                    } finally {
                        oWB.SaveAs(fname);
                        oWB.Close(savechanges = false);
                        oXL.Quit();
                        oXL = null;
                        idTmr = window.setInterval("Cleanup();", 1);
                    }
                }
                else {
                    tableToExcel(tableid)
                }


                function getExplorer() {
                    var explorer = window.navigator.userAgent;
                    //ie
                    if (explorer.indexOf("MSIE") >= 0) {
                        return 'ie';
                    }
                    //firefox
                    else if (explorer.indexOf("Firefox") >= 0) {
                        return 'Firefox';
                    }
                    //Chrome
                    else if (explorer.indexOf("Chrome") >= 0) {
                        return 'Chrome';
                    }
                    //Opera
                    else if (explorer.indexOf("Opera") >= 0) {
                        return 'Opera';
                    }
                    //Safari
                    else if (explorer.indexOf("Safari") >= 0) {
                        return 'Safari';
                    }
                }


                function Cleanup() {
                    window.clearInterval(idTmr);
                    CollectGarbage();
                }




            }
        }
    }
</script>

<style>
    .service-btn-export {
        background-color: #28d300 !important;
    }

    .service-btn-export i {
        font-size: 32px !important;
        line-height: 46px;
    }
</style>
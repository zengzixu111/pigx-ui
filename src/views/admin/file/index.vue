<!--
  -    Copyright (c) 2018-2025, znyw All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: znyw
  -->
<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        :upload-after="uploadAfter"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-del="rowDel">
        <template
          slot="menu"
          slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-download"
            @click="download(scope.row,scope.index)">下载
          </el-button>
        </template>

      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { delObj, fetchList } from '@/api/admin/sys-file'
import { tableOption } from '@/const/crud/admin/sys-file'
import { mapGetters } from 'vuex'
import { handleDown } from '@/util/util'


export default {
  name: 'sys-file',
  data() {
    return {
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.sys_file_add, true),
        delBtn: this.vaildData(this.permissions.sys_file_del, true),
        editBtn: this.vaildData(this.permissions.sys_file_edit, false)
      }
    }
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        descs: 'create_time',
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    rowDel: function(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delObj(row.id)
      }).then(data => {
        _this.$message.success('删除成功')
        this.getList(this.page)
      })
    },
    searchChange(form, done) {
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    refreshChange() {
      this.searchForm = this.form
      this.getList(this.page)
    },
    sizeChange(pageSize){
      this.page.pageSize = pageSize
    },
    currentChange(current){
      this.page.currentPage = current
    },
    download: function(row, index) {
      handleDown(row.fileName, row.bucketName)
    },
    uploadAfter(res, done, loading) {
        this.$message.success('上传成功')
        done()
        this.getList(this.page)
    },
  }
}
</script>


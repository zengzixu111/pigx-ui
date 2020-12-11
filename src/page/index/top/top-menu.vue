<template>
  <div class="top-menu">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      text-color="#333">
      <template v-for="(item,index) in items">
        <el-menu-item
          :index="item.parentId+''"
          :key="index"
          @click.native="openMenu(item)">
          <template slot="title">
            <i :class="item.icon"/>
            <span>{{ item.label }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopMenu',
  inject: ["Index"],
  data() {
    return {
      activeIndex: '0',
      items: []
    }
  },
  created() {
    this.getTopMenu()
  },
  computed: {
    ...mapGetters(['menu'])
  },
  methods: {
    getTopMenu() {
      this.$store.dispatch("GetTopMenu").then(res => {
          this.items = res;
      });
    },
    openMenu(item) {
      this.Index.openMenu(item)
    }
  }
}
</script>

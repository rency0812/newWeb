<template>
  <div>
    <CustomIviewTree ref="tree"
                     :data="data"
                     show-checkbox
                     @created="handleTreeCreated"
                     @on-check-change="onTreeCheckChange"></CustomIviewTree>
    <!--
    <button @click="setCheckedNodes([16466, 16506])">选择指定节点</button>
    <button @click="setCheckedNodes([16506], false)">反选指定节点</button>
    <button @click="setExpandedNode([16466, 16506])">展开指定节点</button>
    -->
  </div>
</template>
<script>
import service from '../../service';
import Tree from './tree';

export default {
  created() {
    this.getTreeData();
  },
  mounted() {
  },

  components: {
    CustomIviewTree: Tree,
  },
  data() {
    return {
      data: [],
    };
  },

  methods: {
    handleTreeCreated() {
      this.$emit('created');
    },

    getLeafCount() {
      let count = 0;

      this.getCheckedNodes();

      this.$refs.tree.flatState.forEach((item) => {
        if (item.isLeaf) {
          count += 1;
        }
      });

      return count;
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    /**
     * 设置勾选的节点
     * @param nodeIds {array} id 的节点列表
     * @param isNodeChecked {boolean?} true 为选中
     */
    setCheckedNodes(nodeIds = [], isNodeChecked = true) {
      if (nodeIds.length === 0) {
        return;
      }

      // 遍历 tree，并设置 node 被选中（或不选中）
      const traverseTree = (tree, tmp) => {
        const { nodeIdList, vm, isChecked } = tmp;

        tree.some((item) => {
          const { id, isLeaf, children } = item;

          if (nodeIdList.length === 0) {
            return true;
          }

          if (nodeIdList.includes(id)) {
            vm.$set(item, 'checked', isChecked);
            nodeIdList.splice(nodeIdList.indexOf(id), 1);
            tmp.lastNode = item;
            return false;
          }

          if (isLeaf) {
            return false;
          }

          if (!children) {
            return false;
          }

          return traverseTree(children, tmp);
        });
      };

      const tmp = {
        nodeIdList: [...nodeIds],
        isChecked: isNodeChecked,
        vm: this,
        lastNode: null,
      };

      traverseTree(this.data, tmp);
      this.$refs.tree.handleCheck(tmp.lastNode);
    },

    /**
     * 展开指定的节点（及其所有父节点）
     * @param nodeIds {array} id 的节点列表
     */
    setExpandedNode(nodeIds = []) {
      const nodeIdList = [...nodeIds];
      const keyList = [];
      const nodeList = [];

      // 获取每个 nodeId 对应的 nodeKey
      this.$refs.tree.flatState.some((item) => {
        const { nodeKey, node: { id } } = item;

        if (nodeIdList.length === 0) {
          return true;
        }


        if (nodeIdList.includes(id)) {
          keyList.push(nodeKey);
          nodeIdList.splice(nodeIdList.indexOf(id), 1);
          return true;
        }
        return false;
      });

      // 获取所有的父节点
      const findParentNodes = (key) => {
        const { node, parent } = this.$refs.tree.flatState[key];

        if (!nodeList.includes(node)) {
          nodeList.unshift(node);
        }

        if (parent === undefined) {
          return false;
        }

        return findParentNodes(parent);
      };

      keyList.forEach(key => findParentNodes(key));

      nodeList.forEach((item) => { this.$set(item, 'expand', true); });
    },

    getTreeData() {
      service.getVehicleTree()
        .then((tree) => {
          this.fmtTreeData(tree);
          this.data = tree;
        });
    },

    fmtTreeData(list, deptName = '') {
      list.forEach((item) => {
        const { text, children, data } = item;

        item.title = text;

        // 汽车
        if (data) {
          item.isLeaf = true;
          item.deptName = deptName;
          item.devNo = data.devNo;
          return;
        }

        // 组织结构
        if (children) {
          this.fmtTreeData(children, text);
        }
      });
    },

    onTreeCheckChange(selections, row) {
      // console.log(selections, row);
    },
  },
};
</script>

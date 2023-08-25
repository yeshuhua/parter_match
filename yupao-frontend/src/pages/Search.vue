<template>
  <form action="/">
    <van-search v-model="searchText" show-action placeholder="请选择搜索标签" @search="onSearch" @cancel="onCancel" />
  </form>
  <van-divider content-position="left">已选择标签</van-divider>
  <div v-if="activeId.length === 0">暂无数据</div>
  <van-row gutter="20">
    <van-col v-for="tag in activeId">
      <van-tag closeable size="medium" type="primary" @close="closeHandler(tag)">
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>

  <van-divider content-position="left">请选择标签</van-divider>
  <van-tree-select v-model:active-id="activeId" v-model:main-active-index="activeIndex" :items="tagList" />

  <div style="padding: 12px">
    <van-button type="primary" @click="searchHandler" block>搜索</van-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    // 搜索框文本
    const searchText = ref("");
    // 右侧选中项id
    const activeId = ref([]);
    // 左侧选择中项索引
    const activeIndex = ref(0);
    // 原始标签数据，不要改变，否则过滤后，原数组发生改变。
    const originTagList = [
      {
        text: "性别",
        children: [
          { text: "男", id: "男" },
          { text: "女", id: "女" }
        ]
      },
      {
        text: "方向",
        children: [
          { text: "Java", id: "Java" },
          { text: "C++", id: "C++" },
          { text: "js", id: "js" }
        ]
      }
    ];
    const tagList = ref(originTagList);
    // 移除标签
    const closeHandler = (tag) => {
      // 记得引用类型要返回新数据
      activeId.value = activeId.value.filter((item) => {
        return item !== tag;
      });
    };
    // 标签过滤
    const onSearch = () => {
      // 通过原始标签数组过滤，而不是响应式的tagList，否则越过滤数据越少
      tagList.value = originTagList.map((parentTag) => {
        // 都是通过副本操作，不改变原数据originTagList
        const tempChildren = [...parentTag.children];
        const tempParentTag = { ...parentTag };
        tempParentTag.children = tempChildren.filter((item) =>
          item.text.includes(searchText.value)
        );
        return tempParentTag;
      });
    };
    const onCancel = () => {
      searchText.value = "";
      // 恢复原始未过滤标签数组
      tagList.value = originTagList;
    };

    // 搜索按钮点击事件
    const searchHandler = () => {
      router.push({
        path: "/user/list",
        query: {
          tags: activeId.value
        }
      });
    };
    return {
      searchText,
      activeId,
      activeIndex,
      tagList,
      closeHandler,
      onSearch,
      onCancel,
      searchHandler
    };
  }
});
</script>

<style scoped></style>

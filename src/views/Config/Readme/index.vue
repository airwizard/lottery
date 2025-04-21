<script setup lang="ts">
import i18n from "@/locales/i18n";
import markdownit from "markdown-it";
import { onMounted, ref } from "vue";

const md = markdownit();
const readmeHtml = ref("");
const error = ref("");

function readMd() {
  const fileName = i18n.global.t("data.readmeName") || "readme.md";
  const baseUrl = import.meta.env.BASE_URL || "/"; // 获取 base 路径
  const filePath = `${baseUrl}${fileName}`.replace(/^\/\//, "/"); // 避免双斜杠
  fetch(filePath)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${fileName}: ${res.status}`);
      }
      return res.text();
    })
    .then((res) => {
      readmeHtml.value = md.render(res);
    })
    .catch((err) => {
      error.value = err.message;
      console.error(err);
    });
}

onMounted(() => {
  readMd();
});
</script>

<template>
  <div class="w-3/4 mb-10 ml-3">
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else v-dompurify-html="readmeHtml" class="markdown-body" />
  </div>
</template>

<style scoped>
.error {
  color: red;
  padding: 10px;
}
</style>

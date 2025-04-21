<script setup lang="ts">
import i18n from "@/locales/i18n";
import markdownit from "markdown-it";
import { onMounted, ref } from "vue";

const md = markdownit();
const readmeHtml = ref("");
const error = ref("");

function readMd() {
  const fileName = i18n.global.t("data.readmeName") || "readme.md";
  const baseUrl = import.meta.env.BASE_URL || "/";
  const filePath = `${baseUrl}${fileName}`.replace(/^\/\//, "/");
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

.markdown-body {
  color: white;
  background-color: #1a1a1a;
  padding: 20px;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6),
.markdown-body :deep(p),
.markdown-body :deep(li),
.markdown-body :deep(a) {
  color: white;
}

.markdown-body :deep(pre),
.markdown-body :deep(code) {
  background-color: #2d2d2d;
  color: #e0e0e0;
}

.markdown-body :deep(a:hover) {
  color: #87cefa;
}
</style>

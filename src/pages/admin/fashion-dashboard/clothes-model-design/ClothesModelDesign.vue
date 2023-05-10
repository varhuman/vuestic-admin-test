<template>
  <div class="progress-bars">
    <div class="flex xs12">
      <va-card>
        <va-card-title>{{ t('fileUpload.advancedMediaGallery') }}</va-card-title>
        <va-card-content>
          <va-file-upload v-model="advancedGallery" type="gallery" file-types=".png, .jpg, .jpeg, .gif" dropzone />
        </va-card-content>
      </va-card>
    </div>
    <div class="flex xs12 md6">
      <va-card>
        <va-card-title>{{ t('popovers.popoverStyle') }}</va-card-title>
        <va-card-content>
          <va-select v-model="selectedTemplateFolder" class="mb-4" label="Template Folder" :options="templateFolders.map(folder => folder.title)" />
          <va-select v-model="selectedTemplateName" class="mb-4" label="Template Name" :options="templateNames" />
          <va-button class="mr-2 mb-2" @click="submitRequest"> {{ t('buttons.submit') }}</va-button>
        </va-card-content>
      </va-card>
    </div>
    <div class="image-set" v-for="(imageSet, index) in imageSets" :key="index">
      <h2>{{ imageSet.label }}</h2>
      <div class="image-list">
        <img v-for="(image, imageIndex) in imageSet.images" :key="imageIndex" :src="image.src" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { getTemplateName, submit } from '@/apis/dashboard'
const { t } = useI18n()

const advancedGallery = ref([])
const templateFolders = ref([])
const selectedTemplateFolder = ref("")
const selectedTemplateName = ref("")
const templateNames = ref([])
const imageSets = ref<Array<{ label: string, images: HTMLImageElement[] }>>([]);

const submitRequest = async () => {
  const folderName = selectedTemplateFolder.value;
  const templateName = selectedTemplateName.value;
  console.log("submitRequest", advancedGallery.value);

  // 使用Array.map遍历advancedGallery数组，并为每个元素创建一个对submit函数的调用
  const promises = advancedGallery.value.map((file, index) =>
    submit(folderName, templateName, file).then(images => ({ label: `Submission ${index + 1}`, images }))
  );

  // 使用Promise.all来等待所有的异步操作完成
  const results = (await Promise.all(promises)).filter(Boolean) as { label: string, images: HTMLImageElement[] }[];

  // 将结果存储在imageSets数组中
  imageSets.value = results;
}

onMounted(async () => {
  try {
    const response = await getTemplateName()
    templateFolders.value = response
    // 默认选择第一个文件夹
    if(response.length > 0){
      selectedTemplateFolder.value = response[0].title
      templateNames.value = response[0].template_names
    }
  } catch (error) {
    console.error('Error fetching template names:', error)
  }
})
watchEffect(() => {
  const folder = templateFolders.value.find(f => f.title === selectedTemplateFolder.value);
  if(folder){
    templateNames.value = folder.template_names;
  }
});
</script>

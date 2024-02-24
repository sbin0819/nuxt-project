<script setup lang="ts">
import type { PostType } from 'types';

const allPosts = ref<PostType[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await fetch('https://koreanjson.com/posts');
    if (response.ok) {
      allPosts.value = await response.json();
    } else {
      throw new Error('Failed to fetch all posts');
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="isLoading" class="mt-10 mx-4">
      <div class="skeleton-box" v-for="n in 100" :key="n">
        <div class="skeleton"></div>
      </div>
    </div>

    <div v-else>
      <div v-for="post in allPosts" :key="post.id" class="m-4">
        <div class="flex flex-col gap-6 mx-auto max-w-[1200px]">
          <Post :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-box {
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: shimmer 1.5s infinite linear;
  margin-bottom: 16px;
}

@keyframes shimmer {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #c0c0c0;
  }
  100% {
    background-color: #e0e0e0;
  }
}

.skeleton {
  width: 70%;
  height: 20px;
  margin: 12px 0;
}
</style>

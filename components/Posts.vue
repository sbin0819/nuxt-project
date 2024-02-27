<script setup lang="ts">
import type { PostType } from 'types';

const allPosts = ref<PostType[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    const res = await fetch('https://koreanjson.com/posts');
    if (res.ok) {
      allPosts.value = await res.json();
    } else {
      throw new Error('Failed to fetch all posts');
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="w-[calc(100%_-_100px)] mx-auto">
    <div v-if="isLoading" class="mt-10">
      <div class="skeleton-box" v-for="n in 100" :key="n">
        <div class="skeleton"></div>
      </div>
    </div>

    <div v-else>
      <h2 class="my-10 text-3xl font-bold">Posts</h2>
      <div v-for="post in allPosts" :key="post.id" class="my-2">
        <div class="flex flex-col gap-6">
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

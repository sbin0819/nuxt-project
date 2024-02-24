<script setup lang="ts">
import type { PostType } from 'types';

const props = defineProps<{
  post: PostType;
}>();
</script>

<template>
  <router-link :to="`/${post.id}`" class="block">
    <div class="rounded-md overflow-hidden shadow-lg bg-white">
      <div class="px-6 py-12">
        <div
          class="font-bold text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis"
        >
          {{ post.title }}
        </div>
        <div>
          <p class="text-gray-700 text-right">
            작성일: {{ new Date(post.createdAt).toLocaleDateString() }}
          </p>
          <p class="text-gray-700 text-right">
            수정일: {{ new Date(post.updatedAt).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </router-link>
</template>

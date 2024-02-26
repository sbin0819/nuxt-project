<script setup lang="ts">
import type { PostType } from 'types';

const props = defineProps<{
  post: PostType;
}>();
</script>

<template>
  <router-link :to="`/${post.id}`">
    <div class="rounded-md">
      <div class="px-6 py-16">
        <div
          class="font-bold text-gray-300 text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis"
        >
          {{ post.title }}
        </div>
        <div class="text-gray-300">
          <p class="text-right">
            작성일: {{ new Date(post.createdAt).toLocaleDateString() }}
          </p>
          <p class="text-right">
            수정일: {{ new Date(post.updatedAt).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </router-link>
</template>

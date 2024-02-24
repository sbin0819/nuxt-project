<script setup lang="ts">
import { formatDate } from '../utils';
import type { PostType } from 'types';

const props = defineProps<{
  post: PostType;
}>();
</script>

<template>
  <router-link :to="`/${post.id}`" class="block">
    <div class="p-6 flex flex-col bg-white shadow-lg rounded-xl">
      <h2 class="text-lg">
        {{ post.title }}
      </h2>
      <p class="my-4 text-sm">
        {{ post.content }}
      </p>
      <p class="text-right">작성자: {{ post.UserId }}</p>
      <p class="text-right">작성일: {{ formatDate(post.createdAt) }}</p>
    </div>
  </router-link>
</template>

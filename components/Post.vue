<script setup lang="ts">
import type { PostType } from 'types';

const props = defineProps<{
  post: PostType;
}>();

const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month.toString().padStart(2, '0')}/${day
    .toString()
    .padStart(2, '0')}`;
};
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

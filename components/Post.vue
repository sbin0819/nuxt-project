<script setup lang="ts">
import { formatDate } from '../utils';
import type { PostType } from 'types';

const props = defineProps<{
  post: PostType;
}>();
</script>

<template>
  <router-link :to="`/${post.id}`" class="block">
    <div
      class="group p-10 flex flex-col shadow-lg rounded-xl border border-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-300 ease-in-out hover:scale-105"
    >
      <h2
        class="text-lg text-gray-300 hover:text-teal-400 group-hover:text-2xl"
      >
        {{ post.title }}
      </h2>
      <p class="text-gray-400 text-right">작성자: {{ post.UserId }}</p>
      <p class="text-gray-400 text-right">
        작성일: {{ formatDate(post.createdAt) }}
      </p>
    </div>
  </router-link>
</template>

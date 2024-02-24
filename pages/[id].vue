<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

type Post = {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  UserId: number;
};

const post = ref<Post | null>(null);
const route = useRoute();

const updateRecentPosts = (postId: number) => {
  const maxRecentPosts = 5;
  const recentPosts = JSON.parse(localStorage.getItem('recentPosts') || '[]');
  const updatedRecentPosts = [
    postId,
    ...recentPosts.filter((id: number) => id !== postId),
  ].slice(0, maxRecentPosts);
  localStorage.setItem('recentPosts', JSON.stringify(updatedRecentPosts));
};

onMounted(async () => {
  const postId = route.params.id;
  if (postId) {
    try {
      const res = await fetch(`https://koreanjson.com/posts/${postId}`);
      const data = await res.json();
      post.value = data;
      updateRecentPosts(Number(postId));
    } catch (e) {
      console.error(e);
    }
  }
});
</script>

<template>
  <div v-if="post">
    <h2>{{ post.title }}</h2>
    <p>Created at: {{ new Date(post.createdAt).toLocaleDateString() }}</p>
    <p>Last updated: {{ new Date(post.updatedAt).toLocaleDateString() }}</p>
    <p>User ID: {{ post.UserId }}</p>
  </div>
  <div v-else>Loading post...</div>
</template>

<script setup lang="ts">
import type { PostType, CommentType, UserType } from 'types';
import { useRoute } from 'vue-router';
import { formatDate } from '../utils';

const post = ref<PostType | null>(null);
const comments = ref<CommentType[]>([]);
const users = ref<{ [key: number]: UserType }>({});
const postUser = ref<UserType | null>(null);
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

const fetchUserData = async (userId: number) => {
  const res = await fetch(`https://koreanjson.com/users/${userId}`);
  return res.json();
};

onMounted(async () => {
  const postId = route.params.id;
  if (postId) {
    try {
      const postResPromise = fetch(`https://koreanjson.com/posts/${postId}`);
      const commentsResPromise = fetch(
        `https://koreanjson.com/comments?postId=${postId}`,
      );

      const [postRes, commentsRes] = await Promise.all([
        postResPromise,
        commentsResPromise,
      ]);
      const postData = await postRes.json();
      const commentsData = await commentsRes.json();

      post.value = postData;
      comments.value = commentsData;

      if (postData.UserId) {
        const postUserRes = await fetchUserData(postData.UserId);
        postUser.value = postUserRes;
        users.value[postData.UserId] = postUserRes;
      }

      const userPromises = commentsData.map((comment: CommentType) =>
        fetchUserData(comment.UserId),
      );
      const usersData = await Promise.all(userPromises);

      usersData.forEach((user) => {
        users.value[user.id] = user;
      });

      updateRecentPosts(Number(postId));
    } catch (e) {
      console.error(e);
    }
  }
});
</script>

<template>
  <div class="max-w-[880px] mx-auto">
    <div v-if="post">
      <div class="my-10">
        <p class="text-center mb-4 text-xl">{{ formatDate(post.createdAt) }}</p>
        <h1 class="text-3xl font-bold">{{ post.title }}</h1>
        <div class="mt-6 flex items-center justify-center gap-4">
          <div class="flex items-center gap-2">
            <img src="~assets/pencil.png" alt="words" />
            <p class="text-lg">{{ post.content.length }} 글자</p>
          </div>
          <div class="flex items-center gap-2">
            <img src="~assets/clock.png" alt="clock" />
            <p class="text-lg">{{ timeToRead(post.content.length) }} 분</p>
          </div>
          <div class="flex items-center gap-2">
            <img src="~assets/view.png" alt="eyes" />
            <p class="text-lg">{{ 0 }} 명</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-right text-lg text-blue-500">
            userId: {{ post?.UserId }}
          </p>
          <p class="text-right text-lg">
            {{ postUser?.username }}_{{ postUser?.name }}
          </p>
        </div>
      </div>
      <hr class="border-1 my-10 border-slate-400" />
      <div class="">
        <p class="text-lg">
          {{ post.content }}
        </p>
      </div>
      <hr class="border-1 my-10 border-slate-400" />
      <div class="mt-10">
        <h2 class="text-2xl">댓글:</h2>
        <ul>
          <li v-for="comment in comments" :key="comment.id" class="mt-2">
            <p>{{ comment.content }}</p>
            <p>User Name: {{ users[comment.UserId]?.name }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>Loading post...</div>
  </div>
</template>

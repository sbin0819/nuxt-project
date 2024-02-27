<!-- CommentsSection.vue -->
<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue';
import type { CommentType, UserType } from 'types';

const props = defineProps<{
  postId: Number;
  openModal: (uid: number) => void;
}>();

const comments = ref<CommentType[]>([]);
const users = ref<{ [key: number]: UserType }>({});

const fetchUserData = async (userId: number) => {
  const res = await fetch(`https://koreanjson.com/users/${userId}`);
  return res.json();
};

const fetchComments = async () => {
  if (props.postId) {
    try {
      const commentsRes = await fetch(
        `https://koreanjson.com/comments?postId=${props.postId}`,
      );
      const commentsData = await commentsRes.json();
      comments.value = commentsData;

      const userPromises = commentsData.map((comment: CommentType) =>
        fetchUserData(comment.UserId),
      );
      const usersData = await Promise.all(userPromises);
      usersData.forEach((user) => {
        users.value[user.id] = user;
      });
    } catch (e) {
      console.error(e);
    }
  }
};

onMounted(fetchComments);
</script>

<template>
  <div class="mt-10 text-gray-200">
    <h2 class="text-2xl">댓글: {{ comments.length }}</h2>
    <ul>
      <li v-for="comment in comments" :key="comment.id" class="mt-6 pb-2">
        <p
          class="pb-2 cursor-pointer hover:text-teal-300"
          @click="openModal(comment.UserId)"
        >
          작성자: {{ users[comment.UserId]?.name }}
        </p>
        <p>{{ comment.content }}</p>
      </li>
    </ul>
  </div>
</template>

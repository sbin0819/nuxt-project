<script setup lang="ts">
import type { PostType, UserType } from 'types';
import { useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { formatDate } from '../utils';

const post = ref<PostType | null>(null);
const postUser = ref<UserType | null>(null);
const modalUid = ref<number | null>(null);
const route = useRoute();
const showModal = ref(false);
const commentsVisible = ref(false);

const openModal = (uid: number) => {
  showModal.value = true;
  modalUid.value = uid;
};

const closeModal = () => {
  showModal.value = false;
  modalUid.value = null;
};

const fetchUserData = async (userId: number) => {
  const res = await fetch(`https://koreanjson.com/users/${userId}`);
  return res.json();
};

let observer: IntersectionObserver;

onMounted(async () => {
  const postId = route.params.id;
  if (postId) {
    try {
      const postRes = await fetch(
        `https://koreanjson.com/posts/${postId}`,
      ).then((res) => res.json());
      post.value = postRes;

      if (postRes.UserId) {
        const postUserRes = await fetchUserData(postRes.UserId);
        postUser.value = postUserRes;
      }
    } catch (e) {
      console.error(e);
    }
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        commentsVisible.value = true;
      }
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    },
  );

  const target = document.querySelector('#commentsTrigger');
  if (target) {
    observer.observe(target);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <div class="max-w-[880px] mx-auto pb-20">
    <div v-if="post">
      <Modal
        :userId="modalUid"
        :showModal="showModal"
        :closeModal="closeModal"
      />
      <div class="my-20">
        <p class="text-center mb-4 text-2xl text-gray-300">
          {{ formatDate(post.createdAt) }}
        </p>
        <h1 class="mt-10 text-3xl font-bold text-center text-gray-200">
          {{ post.title }}
        </h1>
        <div class="mt-20 flex items-center justify-center gap-4 text-gray-300">
          <p class="text-2xl">{{ post.content.length }} 글자</p>
          <p class="text-2xl">{{ timeToRead(post.content.length) }} 분</p>
        </div>
        <div class="mt-20 flex flex-col gap-4 text-gray-200">
          <p
            class="text-right text-xl text-blue-500 cursor-pointer hover:opacity-65"
            @click="openModal(post.UserId)"
          >
            userId: {{ post.UserId }}
          </p>
          <p class="text-right text-xl">
            {{ postUser?.username }}_{{ postUser?.name }}
          </p>
        </div>
      </div>
      <hr class="border-1 my-[100px] border-slate-400" />
      <div class="text-xl text-gray-200 leading-loose">
        <p>{{ post.content }}</p>
      </div>
      <hr id="commentsTrigger" class="border-1 my-[100px] border-slate-400" />
      <Comments
        v-if="commentsVisible"
        :postId="post.id"
        :openModal="openModal"
      />
    </div>
    <div v-else>Loading post...</div>
  </div>
</template>

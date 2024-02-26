<template>
  <div class="my-10">
    <div v-if="isLoadingRecentPosts" class="mx-4">
      <div class="flex overflow-x-scroll scrollbar-hide">
        <div class="flex-none m-2 skeleton-card skeleton w-full"></div>
      </div>
    </div>
    <div v-else>
      <div
        v-if="recentPosts.length > 0"
        class="flex items-center justify-center relative overflow-hidden"
      >
        <button
          class="absolute left-0 z-10 cursor-pointer bg-gray-500 bg-opacity-80 text-white hover:bg-opacity-100 flex items-center justify-center disabled:opacity-50"
          style="
            width: 40px;
            height: 40px;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 50%;
          "
          @click="scrollLeft"
          :disabled="isAtStart"
        >
          ‹
        </button>
        <div
          ref="carouselRef"
          class="flex overflow-x-scroll scrollbar-hide scroll-smooth border border-teal-300 overflow-hidden shadow-lg rounded-xl hover:bg-teal-500 transition-all duration-300 ease-in-out"
          style="white-space: nowrap; width: calc(100% - 100px)"
          @scroll="updateScrollButtons"
        >
          <div
            v-for="post in recentPosts"
            :key="post.id"
            class="flex-none"
            style="width: 100%; height: 100%"
          >
            <CarouselCard :post="post" />
          </div>
        </div>
        <button
          class="absolute right-0 z-10 cursor-pointer bg-gray-500 bg-opacity-80 text-white hover:bg-opacity-100 flex items-center justify-center disabled:opacity-50"
          style="
            width: 40px;
            height: 40px;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 50%;
          "
          @click="scrollRight"
          :disabled="isAtEnd"
        >
          ›
        </button>
      </div>
      <div v-else class="text-center">최근 본 글이 없습니다.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostType } from 'types';

const recentPosts = ref<PostType[]>([]);
const isLoadingRecentPosts = ref(true);

const carouselRef = ref<HTMLDivElement | null>(null);
const cardWidth = ref(0);
const isAtStart = ref(true);
const isAtEnd = ref(false);

function getRecentPostIds(): number[] {
  const ids = localStorage.getItem('recentPosts');
  return ids ? JSON.parse(ids) : [];
}

async function fetchPostsByIds(ids: number[]): Promise<PostType[]> {
  const posts: PostType[] = [];
  for (const id of ids) {
    const response = await fetch(`https://koreanjson.com/posts/${id}`);
    const post: PostType = await response.json();
    posts.push(post);
  }
  return posts;
}

onMounted(async () => {
  const recentPostIds = getRecentPostIds();
  if (recentPostIds.length > 0) {
    recentPosts.value = await fetchPostsByIds(recentPostIds);
  }
  isLoadingRecentPosts.value = false;

  nextTick(() => {
    computeCardWidth();
    updateScrollButtons();
  });
});

const updateScrollButtons = () => {
  if (carouselRef.value) {
    isAtStart.value = carouselRef.value.scrollLeft <= 0;
    isAtEnd.value =
      carouselRef.value.scrollLeft + carouselRef.value.clientWidth >=
      carouselRef.value.scrollWidth;
  }
};

const computeCardWidth = () => {
  if (carouselRef.value) {
    cardWidth.value = carouselRef.value.offsetWidth;
  }
};

const scrollLeft = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: -cardWidth.value, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: cardWidth.value, behavior: 'smooth' });
  }
};
</script>

<style scoped>
.skeleton {
  background-color: #ddd;
  border-radius: 4px;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-text {
  height: 20px;
  margin: 10px 0;
}

.skeleton-card {
  height: 200px;
  width: calc(100% - 100px);
  margin-inline: auto;
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
</style>

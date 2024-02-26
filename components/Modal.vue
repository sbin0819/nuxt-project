<script setup lang="ts">
import type { UserType } from 'types';

const props = defineProps<{
  user: UserType | null;
  showModal: boolean;
  closeModal: () => void;
}>();

const showPopup = ref(false);

onBeforeRouteLeave((to, from, next) => {
  if (showPopup.value === true) {
    next(false);
    showPopup.value = false;
  } else {
    next();
  }
});
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div
      class="bg-white px-4 pt-2 pb-4 rounded-md max-w-md w-full text-black shadow-xl shadow-teal-400"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">유저 정보</h3>
        <button @click="closeModal">✖</button>
      </div>
      <div v-if="user">
        <div>
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Name:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Phone:</strong> {{ user.phone }}</p>
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>

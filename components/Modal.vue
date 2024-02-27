<script setup lang="ts">
import { watch, onMounted, onUnmounted, ref } from 'vue';
import type { UserType } from 'types';

const props = defineProps<{
  userId: number | null;
  showModal: boolean;
  closeModal: () => void;
}>();

const user = ref<UserType | null>(null);
const router = useRouter();
const route = useRoute();

const fetchUserData = async (userId: number) => {
  try {
    const res = await fetch(`https://koreanjson.com/users/${userId}`);
    user.value = await res.json();
  } catch (e) {
    console.error(e);
    user.value = null;
  }
};

watch(
  () => props.showModal,
  (newVal) => {
    if (newVal) {
      history.pushState({ modal: true }, '');
    }
  },
);

const closeModalAndPopState = () => {
  props.closeModal();
  if (history.state?.modal) {
    history.back();
  }
};

const handlePopstate = (event: PopStateEvent) => {
  if (props.showModal) {
    closeModalAndPopState();
  }
};

onMounted(() => {
  window.addEventListener('popstate', handlePopstate);
});

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopstate);
});

watch(
  () => props.userId,
  (newUserId, oldUserId) => {
    if (newUserId !== null && newUserId !== oldUserId) {
      fetchUserData(newUserId);
    }
  },
  { immediate: true },
);

const onBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModalAndPopState();
  }
};
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    @click="onBackdropClick"
  >
    <div
      class="mx-2 bg-white px-4 pt-2 pb-4 rounded-md max-w-md w-full text-black shadow-xl shadow-teal-400"
      @click.stop
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

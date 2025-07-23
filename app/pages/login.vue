<template>
  <UForm
    :schema="schema"
    :state="state"
    :validate-on="['change']"
    @submit="login"
    class="text-center py-10"
  >
    <UFormField name="password">
      <UInput
        v-model="state.password"
        type="password"
        placeholder="password"
        size="xl"
        class="w-xxs"
      />
      <UButton
        type="submit"
        size="xl"
        :disabled="!state.password.length"
        class="ml-2 font-bold disabled:bg-neutral-400 dark:disabled:bg-neutral-600"
      >
        login
        <PhKey weight="bold" />
      </UButton>
    </UFormField>
  </UForm>
</template>

<script setup lang="ts">
import { PhKey } from '@phosphor-icons/vue';
import { string as zodString, object as zodObject, type output as ZodOutput } from 'zod/v4';

const schema = zodObject({
  password: zodString().trim().min(1, { error: 'password is required' }),
});
type Schema = ZodOutput<typeof schema>;

const state = reactive<Schema>({
  password: '',
});

const { fetch: refreshSession } = useUserSession();

const toast = useToast();

async function login() {
  try {
    const { session } = await $fetch('/api/login', {
      method: 'POST',
      body: state,
    });

    // Refresh the session on client-side and redirect to the home page
    toast.add({
      title: 'welcome!',
      color: 'success',
    });

    await refreshSession();
    await navigateTo('/');
  } catch (error) {
    toast.add({
      title: (error as any).statusMessage,
      color: 'error',
    });
  }
}
</script>

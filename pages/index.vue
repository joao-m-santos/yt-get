<template>
  <UContainer>
    <div class="text-center">
      <h1 class="text-2xl font-black mb-2">yt-get</h1>
      <p class="mb-4">download YouTube videos as .webm files</p>

      <UForm :schema="schema" :state="state" :validate-on="['change']" @submit="onSubmit">
        <UFormField name="url">
          <UInput
            v-model="state.url"
            :disabled="isLoading"
            placeholder="paste a YouTube url"
            size="xl"
            class="md:w-md"
          />
          <UButton
            type="submit"
            size="xl"
            :disabled="isGetDisabled"
            class="ml-2 font-bold disabled:bg-neutral-400 dark:disabled:bg-neutral-600"
          >
            get
            <PhArrowRight weight="bold" />
          </UButton>
        </UFormField>
      </UForm>
    </div>

    <div v-if="videoInfo" class="grid md:grid-cols-2 gap-4 items-start mt-8">
      <VideoPreview
        :title="videoInfo.title"
        :author="videoInfo.author"
        :thumbnail="videoInfo.thumbnail"
      />

      <div>
        <h3 class="font-bold">select quality</h3>

        <div class="mt-4">
          <UButton
            color="primary"
            variant="outline"
            size="lg"
            class="gap-1"
            :disabled="isLoading"
            @click="onDownloadClick('best')"
          >
            download
            <span class="font-bold">best quality</span>
            <PhSparkle weight="bold" />
          </UButton>
        </div>
        <UButtonGroup orientation="horizontal" size="lg" class="mt-2">
          <UButton
            v-for="quality in qualities.sort((a, b) => b - a)"
            :key="quality"
            color="neutral"
            variant="outline"
            :disabled="isLoading"
            @click="onDownloadClick(quality)"
          >
            <span class="font-bold">{{ quality }}p</span>
          </UButton>
        </UButtonGroup>
      </div>
    </div>

    <div class="text-center mx-auto mt-8 w-xs">
      <p v-if="showProgress">{{ downloadStatus }}</p>
      <UProgress v-if="showProgress" v-model="downloadProgress" status color="secondary" />
      <p v-if="downloadError" class="text-error">downloadError</p>

      <UButton v-if="downloadStatus === 'completed'" size="xl" @click="downloadVideo">
        get video
        <PhDownloadSimple weight="bold" />
      </UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { PhArrowRight, PhDownloadSimple, PhSparkle } from '@phosphor-icons/vue';
import * as z from 'zod/v4';

const schema = z.object({
  url: z.url({
    hostname: VALID_DOMAINS_REGEX,
    error: 'must be a valid YouTube URL',
  }),
});
type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  url: '',
});

const isLoading = ref(false);

const isGetDisabled = computed(
  () => !state.url || !schema.safeParse(state).success || isLoading.value
);

const url = ref<string | null>(null);
const videoInfo = ref<YouTubeVideoInfo | null>(null);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { url: videoUrl } = event.data;
  url.value = videoUrl;
  isLoading.value = true;
  try {
    videoInfo.value = await getVideoInfo(videoUrl);
  } catch (err) {
    const is401 = (err as Error).message === '401';
    const toast = useToast();
    toast.add({
      title: 'something went wrong',
      description: is401
        ? "couldn't fetch video info, but download is available"
        : "couldn't fetch video info. please double-check the url",
      color: is401 ? 'info' : 'error',
    });

    if (is401) {
      videoInfo.value = UNKNOWN_VIDEO_INFO;
    }
  } finally {
    isLoading.value = false;
  }
}

const qualities = [240, 360, 480, 720, 1080];

const { downloadProgress, downloadStatus, downloadError, downloadUrl, startDownload } =
  useYoutubeDownload();

async function onDownloadClick(quality: 'best' | number) {
  if (!url.value) {
    return;
  }

  const id = extractVideoId(url.value);

  if (!id) {
    return;
  }

  await startDownload(id, quality);
}

watch(downloadStatus, (status) => {
  if (['starting', 'downloading'].includes(status)) isLoading.value = true;
  else isLoading.value = false;
});

const showProgress = computed(() => !['idle', 'error', 'completed'].includes(downloadStatus.value));

async function downloadVideo() {
  if (downloadUrl.value) {
    const link = document.createElement('a');
    link.href = downloadUrl.value;
    link.download = sanitizeFilename(videoInfo.value?.title || 'video');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, getLocale } from '@/i18n'
import Card from '@/components/ui/Card.vue'

const { t } = useI18n()

const currentLocale = ref(getLocale())

function changeLocale(locale: 'de' | 'en') {
  setLocale(locale)
  currentLocale.value = locale
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Title -->
    <h1 class="text-2xl font-bold text-white">{{ t('settings.title') }}</h1>

    <!-- Language Settings -->
    <Card :title="t('settings.language')">
      <div class="flex gap-4">
        <button
          @click="changeLocale('de')"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all',
            currentLocale === 'de'
              ? 'border-hytale-orange bg-hytale-orange/10'
              : 'border-dark-50 hover:border-gray-600'
          ]"
        >
          <span class="text-2xl">🇩🇪</span>
          <div class="text-left">
            <p class="font-medium text-white">{{ t('settings.german') }}</p>
            <p class="text-sm text-gray-400">Deutsch</p>
          </div>
          <svg
            v-if="currentLocale === 'de'"
            class="w-5 h-5 text-hytale-orange ml-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <button
          @click="changeLocale('en')"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all',
            currentLocale === 'en'
              ? 'border-hytale-orange bg-hytale-orange/10'
              : 'border-dark-50 hover:border-gray-600'
          ]"
        >
          <span class="text-2xl">🇬🇧</span>
          <div class="text-left">
            <p class="font-medium text-white">{{ t('settings.english') }}</p>
            <p class="text-sm text-gray-400">English</p>
          </div>
          <svg
            v-if="currentLocale === 'en'"
            class="w-5 h-5 text-hytale-orange ml-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </Card>

    <!-- About -->
    <Card :title="t('settings.about')">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-hytale-orange to-hytale-yellow rounded-2xl flex items-center justify-center">
            <span class="text-dark font-bold text-3xl">H</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Hytale Server Manager</h3>
            <p class="text-gray-400">{{ t('settings.version') }}: 1.0.0</p>
          </div>
        </div>

        <div class="pt-4 border-t border-dark-50">
          <p class="text-gray-400 text-sm">
            Web-based management tool for Hytale dedicated servers.
            Provides server control, live console, backup management, and player administration.
          </p>
        </div>

        <div class="pt-4 border-t border-dark-50">
          <div class="flex gap-4">
            <div class="flex-1">
              <p class="text-sm text-gray-500 mb-1">Backend</p>
              <p class="text-white">Python + FastAPI</p>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500 mb-1">Frontend</p>
              <p class="text-white">Vue.js 3 + Tailwind CSS</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

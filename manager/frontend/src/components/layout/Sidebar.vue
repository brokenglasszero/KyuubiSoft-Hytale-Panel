<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const { t } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  { name: 'dashboard', path: '/', icon: 'dashboard', label: t('nav.dashboard') },
  { name: 'console', path: '/console', icon: 'console', label: t('nav.console') },
  { name: 'backups', path: '/backups', icon: 'backup', label: t('nav.backups') },
  { name: 'players', path: '/players', icon: 'players', label: t('nav.players') },
  { name: 'settings', path: '/settings', icon: 'settings', label: t('nav.settings') },
])

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <aside class="w-64 bg-dark-200 border-r border-dark-50/50 flex flex-col">
    <!-- Logo -->
    <div class="h-16 flex items-center px-6 border-b border-dark-50/50">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gradient-to-br from-hytale-orange to-hytale-yellow rounded-lg flex items-center justify-center">
          <span class="text-dark font-bold text-lg">H</span>
        </div>
        <span class="text-lg font-semibold text-white">Hytale Manager</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 px-3 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        :class="[
          'sidebar-link',
          isActive(item.path) ? 'active' : ''
        ]"
      >
        <!-- Dashboard Icon -->
        <svg v-if="item.icon === 'dashboard'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>

        <!-- Console Icon -->
        <svg v-else-if="item.icon === 'console'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>

        <!-- Backup Icon -->
        <svg v-else-if="item.icon === 'backup'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>

        <!-- Players Icon -->
        <svg v-else-if="item.icon === 'players'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>

        <!-- Settings Icon -->
        <svg v-else-if="item.icon === 'settings'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>

        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-dark-50/50">
      <p class="text-xs text-gray-500 text-center">Hytale Server Manager v1.0</p>
    </div>
  </aside>
</template>

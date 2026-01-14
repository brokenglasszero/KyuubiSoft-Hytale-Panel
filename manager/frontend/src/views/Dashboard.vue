<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServerStats } from '@/composables/useServerStats'
import StatusCard from '@/components/dashboard/StatusCard.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'

const { t } = useI18n()
const { status, stats, playerCount, loading, error, refresh } = useServerStats()

const serverStatusText = computed(() => {
  if (!status.value) return t('common.loading')
  if (status.value.running) return t('dashboard.online')
  return t('dashboard.offline')
})

const serverStatusType = computed((): 'success' | 'error' => {
  return status.value?.running ? 'success' : 'error'
})

const cpuValue = computed(() => {
  if (!stats.value?.cpu_percent) return '0%'
  return `${stats.value.cpu_percent.toFixed(1)}%`
})

const memoryValue = computed(() => {
  if (!stats.value?.memory_mb) return '0 MB'
  return `${stats.value.memory_mb.toFixed(0)} / ${stats.value.memory_limit_mb?.toFixed(0) || '?'} MB`
})

const uptimeValue = computed(() => {
  if (!status.value?.started_at) return '-'
  const started = new Date(status.value.started_at)
  const now = new Date()
  const diff = now.getTime() - started.getTime()

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  return `${hours}h ${minutes}m`
})

function handleAction(type: string, success: boolean) {
  if (success) {
    // Refresh stats after action
    setTimeout(refresh, 2000)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Title -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">{{ t('dashboard.title') }}</h1>
      <button
        @click="refresh"
        class="text-gray-400 hover:text-white transition-colors"
        :class="{ 'animate-spin': loading }"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="p-4 bg-status-error/10 border border-status-error/20 rounded-lg">
      <p class="text-status-error">{{ error }}</p>
    </div>

    <!-- Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard
        :title="t('dashboard.serverStatus')"
        :value="serverStatusText"
        :status="serverStatusType"
        icon="server"
      />

      <StatusCard
        :title="t('dashboard.cpu')"
        :value="cpuValue"
        :status="(stats?.cpu_percent || 0) > 80 ? 'warning' : 'info'"
        icon="cpu"
      />

      <StatusCard
        :title="t('dashboard.memory')"
        :value="memoryValue"
        :status="(stats?.memory_percent || 0) > 80 ? 'warning' : 'info'"
        icon="memory"
      />

      <StatusCard
        :title="t('dashboard.players')"
        :value="playerCount.toString()"
        status="info"
        icon="players"
      />
    </div>

    <!-- Quick Actions -->
    <QuickActions @action="handleAction" />

    <!-- Additional Info -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Uptime Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-white">{{ t('dashboard.uptime') }}</h3>
        </div>
        <div class="card-body">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-hytale-orange/20 flex items-center justify-center">
              <svg class="w-8 h-8 text-hytale-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">{{ uptimeValue }}</p>
              <p v-if="status?.started_at" class="text-sm text-gray-400">
                {{ t('dashboard.serverStatus') }}: {{ new Date(status.started_at).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Server Info Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-white">Server Info</h3>
        </div>
        <div class="card-body">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-400">Container</span>
              <span class="text-white font-mono">{{ status?.name || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Container ID</span>
              <span class="text-white font-mono">{{ status?.id || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Status</span>
              <span :class="status?.running ? 'text-status-success' : 'text-status-error'">
                {{ status?.status || '-' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

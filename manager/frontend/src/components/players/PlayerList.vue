<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { PlayerInfo } from '@/api/players'
import Button from '@/components/ui/Button.vue'

const { t } = useI18n()

defineProps<{
  players: PlayerInfo[]
  loading?: boolean
}>()

const emit = defineEmits<{
  kick: [name: string]
  ban: [name: string]
}>()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>{{ t('players.name') }}</th>
          <th>{{ t('players.sessionTime') }}</th>
          <th class="text-right">{{ t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="players.length === 0">
          <td colspan="3" class="text-center text-gray-500 py-8">
            {{ t('players.noPlayers') }}
          </td>
        </tr>
        <tr v-for="player in players" :key="player.name">
          <td>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-hytale-orange/20 flex items-center justify-center">
                <span class="text-hytale-orange font-medium text-sm">
                  {{ player.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="font-medium">{{ player.name }}</span>
            </div>
          </td>
          <td class="text-gray-400">{{ player.session_duration }}</td>
          <td>
            <div class="flex justify-end gap-2">
              <Button
                size="sm"
                variant="secondary"
                @click="emit('kick', player.name)"
              >
                {{ t('players.kick') }}
              </Button>
              <Button
                size="sm"
                variant="danger"
                @click="emit('ban', player.name)"
              >
                {{ t('players.ban') }}
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

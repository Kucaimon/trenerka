import { describe, expect, it } from 'vitest'
import {
  buildProgramShareUrl,
  buildVkShareUrl,
  estimateWorkoutMinutes,
} from './program-share'

describe('program-share', () => {
  it('builds landing URL with UTM params', () => {
    expect(buildProgramShareUrl('landing')).toBe(
      'https://trenerka-fit.ru/?utm_source=vk&utm_medium=trainer_share',
    )
  })

  it('builds app URL with UTM params', () => {
    expect(buildProgramShareUrl('app')).toBe(
      'https://app.trenerka-fit.ru/?utm_source=vk&utm_medium=trainer_share',
    )
  })

  it('estimates minutes from exercise count', () => {
    expect(estimateWorkoutMinutes(0)).toBe(0)
    expect(estimateWorkoutMinutes(5)).toBe(57)
  })

  it('builds VK share URL with encoded params', () => {
    const url = buildVkShareUrl(
      'https://trenerka-fit.ru/?utm_source=vk&utm_medium=trainer_share',
      'Силовая A',
      'Пн · 5 упражнений · ~57 мин',
    )
    expect(url).toContain('https://vk.com/share.php?')
    expect(url).toContain('title=%D0%A1%D0%B8%D0%BB%D0%BE%D0%B2%D0%B0%D1%8F+A')
    expect(url).toContain('description=')
  })
})

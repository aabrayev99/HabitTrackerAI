import { calculateStreak } from './streak'

describe('calculateStreak', () => {
  it('должен вычислять текущий streak правильно', () => {
    const today = new Date('2024-02-13')
    const entries = [
      { date: new Date('2024-02-13'), completed: true },
      { date: new Date('2024-02-12'), completed: true },
      { date: new Date('2024-02-11'), completed: true },
      { date: new Date('2024-02-10'), completed: false },
      { date: new Date('2024-02-09'), completed: true },
    ]

    const streak = calculateStreak(entries, today)
    expect(streak).toBe(3)
  })

  it('должен возвращать 0 если сегодня не выполнено и вчера не выполнено', () => {
    const today = new Date('2024-02-13')
    const entries = [
      { date: new Date('2024-02-13'), completed: false },
      { date: new Date('2024-02-12'), completed: false },
    ]

    const streak = calculateStreak(entries, today)
    expect(streak).toBe(0)
  })

  it('должен учитывать что сегодня еще можно выполнить', () => {
    const today = new Date('2024-02-13')
    const entries = [
      { date: new Date('2024-02-12'), completed: true },
      { date: new Date('2024-02-11'), completed: true },
    ]

    const streak = calculateStreak(entries, today)
    expect(streak).toBe(0) // Сегодня не выполнено, вчера выполнено - streak еще может продолжиться
  })
})
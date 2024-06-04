import { expect, test } from 'vitest'
import { t } from '../../src/util/i18n'

test('Prints out app name in Finnish', () => {
    expect(t('app:title')).toBe('Pelilauta 2 - Versio 16 - Alfajulkaisu')
})

test('Prints out app name in English', () => {
    expect(t('app:title', 'en')).toBe('Pelilauta 2 -  Version 16 – Alpha release')
})

test('Prints out the app name in Finnish, if we ask for spanish', () => {
    expect(t('app:title', 'es')).toBe('Pelilauta 2 - Versio 16 - Alfajulkaisu')
})

test('Prints out the key if not found', () => {
    expect(t('app:missing')).toBe('app:missing')
})
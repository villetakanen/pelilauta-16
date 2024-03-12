import type { Component } from 'solid-js'
import { t } from 'i18next'

export const CharacterSheetNameField: Component<{
  name: string
  characterId: string
}> = (props) => {
  function handleBlur(event: Event) {
    const newName = (event.target as HTMLInputElement).value
    fetch(`/api/characters/${props.characterId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: newName }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return (
    <input
      type="text"
      name={t('character:name')}
      value={props.name}
      placeholder={t('character:namePlaceholder')}
      onBlur={handleBlur}
    />
  )
}

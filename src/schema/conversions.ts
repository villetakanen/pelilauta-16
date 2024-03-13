export function topicToNoun(topic: string|undefined): string {
  switch (topic) {
    case 'Roolipelit':
      return 'd20'
    case 'Yleinen':
      return 'discussion'
    default:
      return 'fox'
  }
}

export function systemToNoun(system: string|undefined): string {
  switch (system) {
    case'll':
      return 'll-ampersand'
    case 'dd':
      return 'dd5'
    case 'quick':
      return 'thequick'
    default:
      return 'mekanismi'
  }
}

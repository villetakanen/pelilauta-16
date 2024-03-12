import { createSignal, type Component, onMount } from 'solid-js'
import type { Thread } from '../../../../schema/Thread'
import { marked } from 'marked'
import { topicToNoun } from '../../../../schema/conversions'

export const ThreadCard: Component<Thread> = (props) => {
  const [extract, setExtract] = createSignal('')

  onMount(async () => {
    const rawHTML = props.markdownContent
      ? await marked(props.markdownContent)
      : props.htmlContent

    const domNodes = new DOMParser().parseFromString(rawHTML || '', 'text/html')
      .body.childNodes
    let e = ''
    for (let i = 0; i < domNodes.length; i++) {
      const node = domNodes[i]
      if (node.textContent) {
        let text = node.textContent
        if (e.length + text.length > 277) {
          text = text.substring(0, 277 - e.length) + '...'
        }
        e += text + ' '
      }
      if (e.length > 277) {
        break
      }
    }
    setExtract(e)
  })

  return (
    <cn-card
      noun={topicToNoun(props.topic)}
      title={props.title}
      description={extract()}
    ></cn-card>
  )
}

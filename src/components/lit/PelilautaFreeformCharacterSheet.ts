import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { CharacterSchema } from '../../schema/Character';


@customElement('pelilauta-freeform-character-sheet')
export class PelilautaFreeformCharacterSheet extends LitElement implements PelilautaFreeformCharacterSheetElement {
  @property({ type: Object, reflect: true}) character = {}

  get characterTyped() {
    if (!this.character || !Object.keys(this.character).length) {
      return undefined;
    }
    return CharacterSchema.parse(this.character);
  }

  render(){
    return html`<p>Hello ${this.characterTyped?.name}</p>`;
  }
}

export interface PelilautaFreeformCharacterSheetElement {
  character: Object;
}
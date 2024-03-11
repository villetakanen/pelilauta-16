import { Component } from 'solid-js';
import type { Character } from '../../../schema/Character';

interface CharacterSheetProps {
    character: Character;
    // Define your component props here
}

const CharacterSheet: Component<CharacterSheetProps> = (props) => {
    // Add your component logic here

    return (
        <h4>
            {props.character.name}
        </h4>
    );
};

export default CharacterSheet;
import type { Component } from 'solid-js';
import type { Character } from '../../../schema/Character';
import { t } from 'i18next';

interface CharacterSheetProps {
    character: Character;
    // Define your component props here
}

const CharacterSheet: Component<CharacterSheetProps> = (props) => {
    // Add your component logic here

    return (
        <div>
        <h4>
            {props.character.name}
        </h4>
        <div class="flex">
        {/* Iterate through stat blocks */}
        {props.character.statBlocks && 
          props.character.statBlocks.map((statBlock) => (
            <div data-key={statBlock.name}> 
                <h4>{t(`stats:${statBlock.name}`)}</h4> {/* Localized stat block title */}

                {/* Iterate through attributes in the block */}
                <ul>
                    {statBlock.attributes && Object.entries(statBlock.attributes).map(([attrName, attrValue]) => (
                        <li data-key={attrName}>
                            <strong>{t(`stats:${attrName}`)}: </strong> {attrValue} {/* Localized attribute */}
                        </li>
                    ))}
                </ul>
            </div>
        ))}
        </div>
    </div>
    );
};

export default CharacterSheet;
<script lang="ts">
import {
  type CharacterBuilder,
  CharacterFeatureSchema,
} from '@schemas/CharacterBuilderSchema';
import { updateStep } from '@stores/characters/sheetStore';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';

// The LlssStatArrayStep replaces a BuilderStep when the step type is
// 'LLSS_STAT_ARRAY'. It allows users to select stats from a predefined
// array of stats, which is useful for games that use the LLSS array system.
//
// The step expects the builder to have a step with the key 'LLSS_STAT_ARRAY',
// with 6 named stats. If the step does not have the named stats, we'll use
// numbers 1-6 as the default stats insteas for all of the missing stats.
//
// The step recorded to a builder will contain:
// step: {
//   ...,
//   features: [
//     {
//       ...
//       modifiers: [
//         {
//           type: 'BASE_STAT'
//           target: _stat_name_
//           value:  _stat_value_,
//         },
//       _for each stat in the LLSS_ARRAY_
//     },
//

export interface Props {
  builder: CharacterBuilder;
  step: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

const { builder, step: stepKey, onNext, onPrevious }: Props = $props();

// These values will be used to update the character sheet stats
const LLSS_ARRAY = [3, 2, 1, 0, 0, -1];
let chosenStats = $state<number[]>([-1, -1, -1, -1, -1, -1]);

// Get the step from the builder using the stepKey
const step = $derived.by(() => {
  const step = builder.steps[stepKey];
  if (!step) {
    throw new Error(`Step "${stepKey}" not found in builder.`);
  }
  return step;
});

const statNames = $derived.by(() => {
  // Get the stats from the step, or use the LLSS_ARRAY as default
  const feature = step.features.find((f) => f.name === 'SET_BASE_STATS');
  const modifiers = feature?.modifiers || [];
  if (modifiers.length === 0) {
    return ['# 1', '# 2', '# 3', '# 4', '# 5', '# 6'];
  }
  return modifiers.map((mod, index) =>
    mod.target ? mod.target : `# ${index + 1}`,
  );
});

const allOptions = $derived.by(() => {
  return LLSS_ARRAY.map((value, index) => ({
    value: index,
    label: value >= 0 ? `+${value}` : `${value}`,
  }));
});

function getOptionsForStat(statIndex: number) {
  const currentChoice = chosenStats[statIndex];
  const usedByOthers = chosenStats.filter(
    (c, i) => i !== statIndex && c !== -1,
  );

  const availableOptions = allOptions.filter(
    (opt) => !usedByOthers.includes(opt.value),
  );

  const placeholder = {
    value: -1,
    label: t('characters:builder.step.select_stat'),
  };

  if (currentChoice === -1) {
    return [placeholder, ...availableOptions];
  }

  const currentOption = allOptions.find((opt) => opt.value === currentChoice);
  return [
    placeholder,
    currentOption,
    ...availableOptions.filter((opt) => opt.value !== currentChoice),
  ];
}

function onselect(e: Event, statIndex: number) {
  const select = e.target as HTMLSelectElement;
  const llss_array_index = Number.parseInt(select.value);

  logDebug('LlssStatArrayStep', 'onselect', {
    value: llss_array_index,
    statIndex,
  });

  const chosen = [...chosenStats];
  chosen[statIndex] = llss_array_index;
  chosenStats = chosen;

  const feature = CharacterFeatureSchema.parse({
    key: 'SET_BASE_STATS',
    name: 'SET_BASE_STATS',
    modifiers: chosen.map((value, index) => ({
      type: 'BASE_STAT',
      target: statNames[index],
      value: value === -1 ? 0 : LLSS_ARRAY[value],
    })),
  });
  updateStep(stepKey, [feature]);
}
</script>
{#if step}
<div class="surface p-2">
  <h2>{step.name}</h2>
  <p>{step.description}</p>
  <p class="text-caption">
    {t("characters:builder.step.chosen",
      { chosen: chosenStats.filter(c => c !== -1).map(c => LLSS_ARRAY[c]).join(', ') }
    )}
  </p>
  <fieldset>
    {#each statNames as statName, statIndex}
      <label class="flex-none">{statName}
        <select 
          class="grow"
          onchange={(e) => onselect(e, statIndex)}
        >
          {#each getOptionsForStat(statIndex) as option}
            <option 
              value={option?.value} 
              selected={chosenStats[statIndex] === option?.value}
            >
              {option?.label}
            </option>
          {/each}
        </select>
      </label>
    {/each}
    
  </fieldset>
</div>
{/if}
import { createListCollection, Portal, Select } from '@chakra-ui/react';
import { GroupByOptions } from '../../util/types';

export const GroupDropDown = ({
  options,
  value,
  onValueChange,
}: {
  options: { label: string; value: GroupByOptions }[];
  value: GroupByOptions;
  onValueChange: (value: GroupByOptions) => void;
}) => {
  const frameworks = createListCollection({ items: options });

  return (
    <Select.Root
      size={'xs'}
      collection={frameworks}
      value={[value]}
      onValueChange={details =>
        onValueChange(details.value[0] as GroupByOptions)
      }
      style={{ width: '100px' }}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger style={{ backgroundColor: 'white', color: 'black' }}>
          <Select.ValueText placeholder="Select Grouping" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {frameworks.items.map(framework => (
              <Select.Item item={framework} key={framework.value}>
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

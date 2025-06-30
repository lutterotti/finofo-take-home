import { createListCollection, Portal, Select } from "@chakra-ui/react"

export const GroupDropDown = ({options, value, onValueChange }: {options: {label: string, value: string}[], value: string, onValueChange: (value: string) => void }) => {

    const frameworks = createListCollection({items: options});

  return (
    <Select.Root size={'sm'} collection={frameworks} value={[value]} onValueChange={(details) => onValueChange(details.value[0])} style={{ width: '200px' }}>
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder='Select Grouping' />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {frameworks.items.map((framework) => (
              <Select.Item item={framework} key={framework.value}>
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}
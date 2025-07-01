import {
  Accordion,
  Card,
  Checkbox,
  Flex,
  Icon,
  Span,
  Table,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { GroupDropDown } from './GroupDropDown';
import { BsCheckCircle, BsCircle } from 'react-icons/bs';
import { Fruit, GroupByOptions } from '../../util/types';
import { ToggleView } from './ToggleView';

enum viewModes {
  LIST = 'list',
  GRID = 'grid',
}

const filterOptions = [
  { label: 'None', value: GroupByOptions.NONE },
  { label: 'Family', value: GroupByOptions.FAMILY },
  { label: 'Order', value: GroupByOptions.ORDER },
  { label: 'Genus', value: GroupByOptions.GENUS },
];

const FruitTable = ({
  fruits,
  jar,
  onAddToJar,
}: {
  fruits: Fruit[];
  jar: { fruit: Fruit; count: number }[];
  onAddToJar: (fruit: Fruit[]) => void;
}) => {
  return (
    <Table.Root size="sm" interactive>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader></Table.ColumnHeader>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Family</Table.ColumnHeader>
          <Table.ColumnHeader>Order</Table.ColumnHeader>
          <Table.ColumnHeader>Genus</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Calories</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {fruits.map((fruit: Fruit) => {
          const isInJar = jar.some(item => item.fruit.id === fruit.id);
          return (
            <Table.Row key={fruit.id}>
              <Table.Cell>
                <Checkbox.Root
                  size="sm"
                  aria-label="Select row"
                  checked={isInJar}
                  onClick={e => {
                    e.preventDefault();
                    onAddToJar([fruit]);
                  }}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.Cell>
              <Table.Cell>{fruit.name}</Table.Cell>
              <Table.Cell>{fruit.family}</Table.Cell>
              <Table.Cell>{fruit.order}</Table.Cell>
              <Table.Cell>{fruit.genus}</Table.Cell>
              <Table.Cell textAlign="end">
                {fruit.nutritions.calories}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};

export const AvaliableFruits = ({
  fruits,
  groupBy,
  onGroupByChange,
  onAddToJar,
  jar,
}: {
  fruits: Fruit[];
  groupBy: GroupByOptions;
  onGroupByChange: (value: GroupByOptions) => void;
  onAddToJar: (fruit: Fruit[]) => void;
  onRemoveFromJar: (fruit: Fruit) => void;
  jar: { fruit: Fruit; count: number }[];
}) => {
  const [viewMode, setViewMode] = useState<viewModes.LIST | viewModes.GRID>(
    viewModes.LIST
  );

  const viewOptions = [
    { value: viewModes.LIST, label: 'List' },
    { value: viewModes.GRID, label: 'Table' },
  ];

  // Group fruits based on the selected grouping
  const groupedFruits = useMemo(() => {
    if (groupBy === GroupByOptions.NONE || !fruits.length) {
      return [{ title: 'All Fruits', fruits: fruits }];
    }

    const groups: { [key: string]: Fruit[] } = {};

    fruits.forEach(fruit => {
      const groupKey = fruit[groupBy] || 'Unknown';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(fruit);
    });

    return Object.entries(groups).map(([groupName, groupFruits]) => ({
      title: groupName,
      fruits: groupFruits,
    }));
  }, [fruits, groupBy]);

  return (
    <Card.Root variant="elevated" className="fruit-card">
      <Card.Header className="fruit-card-header">
        <Flex
          alignItems="flex-start"
          flexDirection="column"
          gap="1"
          justifyContent={'space-between'}
        >
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            <Text fontWeight="bold">Fruits In-Stock</Text>
            <ToggleView
              value={viewMode}
              onValueChange={value =>
                setViewMode(value as viewModes.LIST | viewModes.GRID)
              }
              options={viewOptions}
              size="sm"
            />
          </Flex>
          <GroupDropDown
            options={filterOptions}
            value={groupBy}
            onValueChange={onGroupByChange}
          />
        </Flex>
      </Card.Header>
      <Card.Body style={{ overflowY: 'scroll' }}>
        <Accordion.Root
          multiple
          defaultValue={groupBy === GroupByOptions.NONE ? ['group-0'] : []}
        >
          {groupedFruits.map((group, index) => (
            <Accordion.Item key={index} value={`group-${index}`}>
              <Accordion.ItemTrigger>
                <Flex
                  flex="1"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Span>
                    <b>{group.title}</b> ({group.fruits.length})
                  </Span>
                  {groupBy !== GroupByOptions.NONE && (
                    <div
                      className="custom-button"
                      onClick={e => {
                        e.stopPropagation();
                        onAddToJar(group.fruits);
                      }}
                    >
                      Add All
                    </div>
                  )}
                </Flex>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  {viewMode === viewModes.GRID ? (
                    <FruitTable
                      fruits={group.fruits}
                      jar={jar}
                      onAddToJar={onAddToJar}
                    />
                  ) : (
                    group.fruits.map((fruit, fruitIndex) => {
                      const isInJar = jar.some(
                        item => item.fruit.id === fruit.id
                      );
                      return (
                        <Flex
                          key={fruitIndex}
                          gap="8"
                          alignItems="center"
                          justifyContent="space-between"
                          className="fruit-item"
                        >
                          <Flex flexDirection="column" alignItems="flex-start">
                            <Text textStyle="md" fontWeight="semibold">
                              {fruit.name}
                            </Text>
                            {fruit.nutritions.calories && (
                              <Text
                                marginEnd="auto"
                                fontSize="xs"
                                color="gray.600"
                              >
                                Calories: {fruit.nutritions.calories}
                              </Text>
                            )}
                          </Flex>
                          <Icon
                            size="sm"
                            className="fruit-icon"
                            onClick={() => onAddToJar([fruit])}
                            style={{ cursor: 'pointer' }}
                          >
                            {isInJar ? (
                              <BsCheckCircle style={{ color: 'green' }} />
                            ) : (
                              <BsCircle />
                            )}
                          </Icon>
                        </Flex>
                      );
                    })
                  )}
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Card.Body>
    </Card.Root>
  );
};

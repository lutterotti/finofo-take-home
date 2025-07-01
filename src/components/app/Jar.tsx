import { useState } from 'react';
import { Chart, useChart } from '@chakra-ui/charts';
import { Card, Flex, Text, Icon } from '@chakra-ui/react';
import { BsDashCircle } from 'react-icons/bs';
import { Cell, Pie, PieChart } from 'recharts';
import { removeOneFromJar } from '../../store/fruitJar';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { ToggleView } from './ToggleView';

enum viewModes {
  LIST = 'list',
  CHART = 'chart',
}

const viewOptions = [
  { value: viewModes.LIST, label: 'List' },
  { value: viewModes.CHART, label: 'Chart' },
];

const JarChartView = () => {
  const { jar } = useAppSelector(state => state.fruitJar);

  // Transform jar data into chart data
  const chartData = jar.map((item, index) => {
    const totalCalories = (item.fruit.nutritions?.calories || 0) * item.count;
    return {
      name: item.fruit.name,
      value: totalCalories,
      color: `hsl(${(index * 137.508) % 360}, 70%, 60%)`, // Generate distinct colors
    };
  });

  const chart = useChart({
    data: chartData,
  });

  return (
    <>
      {/* Pie Chart */}
      <Chart.Root boxSize="200px" mx="auto" chart={chart}>
        <PieChart>
          <Pie
            isAnimationActive={false}
            data={chart.data}
            dataKey={chart.key('value')}
          >
            {chart.data.map(item => (
              <Cell key={item.name} fill={item.color} />
            ))}
          </Pie>
        </PieChart>
      </Chart.Root>
      {/* Legend */}
      <Flex
        direction="column"
        gap="1"
        mt="4"
        className="chart-legend-scrollable"
      >
        {chartData.map(item => (
          <Flex key={item.name} alignItems="center" gap="2" fontSize="sm">
            <div
              className="chart-legend-indicator"
              style={{
                backgroundColor: item.color,
              }}
            />
            <Text flex="1">{item.name}</Text>
            <Text fontWeight="medium">{item.value} cal</Text>
          </Flex>
        ))}
      </Flex>
    </>
  );
};

const JarListView = () => {
  const { jar } = useAppSelector(state => state.fruitJar);
  const dispatch = useAppDispatch();

  const handleRemoveOne = (fruit: any) => {
    dispatch(removeOneFromJar(fruit));
  };

  return (
    <>
      {jar.map((item, index) => (
        <Flex
          key={index}
          gap="8"
          alignItems="center"
          justifyContent="space-between"
          className="fruit-item-hoverable"
        >
          <Flex flexDirection="column" alignItems="flex-start">
            <Text textStyle="md" fontWeight="semibold">
              {item.fruit.name}
            </Text>
            {item.fruit.nutritions?.calories && (
              <Text marginEnd="auto" fontSize="xs" color="gray.600">
                Calories: {item.fruit.nutritions.calories} × {item.count} ={' '}
                {item.fruit.nutritions.calories * item.count}
              </Text>
            )}
          </Flex>
          <Flex alignItems="center" gap="2">
            <Text fontSize="sm" fontWeight="medium">
              ×{item.count}
            </Text>
            <Icon
              size="sm"
              className="fruit-icon remove-icon jar-remove-icon"
              onClick={() => handleRemoveOne(item.fruit)}
            >
              <BsDashCircle />
            </Icon>
          </Flex>
        </Flex>
      ))}
    </>
  );
};

export const Jar = () => {
  const [viewMode, setViewMode] = useState<viewModes.LIST | viewModes.CHART>(
    viewModes.LIST
  );
  const { jar } = useAppSelector(state => state.fruitJar);

  return (
    <Card.Root variant="elevated" className="jar-card">
      <Card.Header className="custom-card-header">
        <Flex
          alignItems="flex-start"
          flexDirection="column"
          gap="1"
          justifyContent="space-between"
        >
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            <Text fontWeight="bold">Your Jar</Text>
            {jar.length > 0 && (
              <ToggleView
                value={viewMode}
                onValueChange={value =>
                  setViewMode(value as viewModes.LIST | viewModes.CHART)
                }
                options={viewOptions}
                size="sm"
              />
            )}
          </Flex>
          <Text textStyle="sm" fontWeight="light">
            Total Calories:{' '}
            {jar.reduce((total, item) => {
              const fruitCalories = item.fruit.nutritions?.calories || 0;
              return total + fruitCalories * item.count;
            }, 0)}
          </Text>
        </Flex>
      </Card.Header>
      <Card.Body className="scroll-body">
        {jar.length === 0 ? (
          <Text color="gray.500" textAlign="center" padding="4">
            Your jar is empty. Add some fruits!
          </Text>
        ) : viewMode === viewModes.LIST ? (
          <JarListView />
        ) : (
          <JarChartView />
        )}
      </Card.Body>
    </Card.Root>
  );
};

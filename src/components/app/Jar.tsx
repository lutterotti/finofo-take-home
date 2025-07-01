import { Card, Flex, Text, Icon } from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts"
import { Cell, Pie, PieChart } from "recharts"
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { BsDashCircle } from "react-icons/bs";
import { removeOneFromJar } from "../../store/fruitJar";
import { useState } from "react";
import { ToggleView } from "./ToggleView";

const JarChartView = () => {
    const { jar } = useAppSelector(state => state.fruitJar);
    
    // Transform jar data into chart data
    const chartData = jar.map((item, index) => {
        const totalCalories = (item.fruit.nutritions?.calories || 0) * item.count;
        return {
            name: item.fruit.name,
            value: totalCalories,
            color: `hsl(${(index * 137.508) % 360}, 70%, 60%)` // Generate distinct colors
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
                        dataKey={chart.key("value")}
                    >
                        {chart.data.map((item) => (
                            <Cell key={item.name} fill={item.color} />
                        ))}
                    </Pie>
                </PieChart>
            </Chart.Root>
            {/* Legend */}
            <Flex direction="column" gap="1" mt="4">
                {chartData.map((item) => (
                    <Flex key={item.name} alignItems="center" gap="2" fontSize="sm">
                        <div 
                            style={{ 
                                width: '12px', 
                                height: '12px', 
                                backgroundColor: item.color,
                                borderRadius: '2px'
                            }} 
                        />
                        <Text flex="1">{item.name}</Text>
                        <Text fontWeight="medium">{item.value} cal</Text>
                    </Flex>
                ))}
            </Flex>
        </>
    );
}

const JarListView = () => {
    const { jar } = useAppSelector(state => state.fruitJar);
    const dispatch = useAppDispatch();
    
    const handleRemoveOne = (fruit: any) => {
        dispatch(removeOneFromJar(fruit));
    };

    return (
        <>
            {jar.map((item, index) => (
                <Flex key={index} gap='8' alignItems='center' justifyContent='space-between' className="fruit-item-hoverable">
                    <Flex flexDirection='column' alignItems='flex-start'>
                        <Text textStyle='md' fontWeight='semibold'>{item.fruit.name}</Text>   
                        {item.fruit.nutritions?.calories && (
                            <Text marginEnd='auto' fontSize='xs' color='gray.600'>
                                Calories: {item.fruit.nutritions.calories} × {item.count} = {item.fruit.nutritions.calories * item.count}
                            </Text>
                        )}
                    </Flex>
                    <Flex alignItems='center' gap='2'>
                        <Text fontSize='sm' fontWeight='medium'>×{item.count}</Text>
                        <Icon 
                            size='sm' 
                            className="fruit-icon remove-icon" 
                            style={{ color: 'red', cursor: 'pointer' }}
                            onClick={() => handleRemoveOne(item.fruit)}
                        >
                            <BsDashCircle />
                        </Icon>
                    </Flex>
                </Flex>
            ))}
        </>
    );
}

export const Jar = () => {
    const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
    const { jar } = useAppSelector(state => state.fruitJar);

    const viewOptions = [
        { value: 'list', label: 'List' },
        { value: 'chart', label: 'Chart' }
    ];

    return (
        <Card.Root variant='elevated' className="fruit-card">
            <Card.Header className="fruit-card-header">
                <Flex alignItems='flex-start' justifyContent='space-between'>
                    <Flex alignItems='flex-start' flexDirection='column' gap='1'>
                        <Text fontWeight='bold'>Your Jar</Text>
                        {jar.length > 0 && (
                            <ToggleView
                                value={viewMode}
                                onValueChange={(value) => setViewMode(value as 'list' | 'chart')}
                                options={viewOptions}
                                size="sm"
                            />
                        )}
                    </Flex>
                    <Text textStyle='sm' fontWeight='light'>
                        Total Calories: {jar.reduce((total, item) => {
                            const fruitCalories = item.fruit.nutritions?.calories || 0;
                            return total + (fruitCalories * item.count);
                        }, 0)}
                    </Text>
                </Flex>
            </Card.Header>
            <Card.Body style={{overflowY: 'scroll'}}>
                {jar.length === 0 ? (
                    <Text color="gray.500" textAlign="center" padding="4">
                        Your jar is empty. Add some fruits!
                    </Text>
                ) : viewMode === 'list' ? (
                    <JarListView />
                ) : (
                    <JarChartView />
                )}
            </Card.Body>
        </Card.Root>
    );
}
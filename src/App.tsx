import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchFruits, addToJar } from './store/fruitJar';
import { Accordion, Card, Flex, Icon, Span, Text } from '@chakra-ui/react';
import { BsCircle, BsCheckCircle } from "react-icons/bs";
import { GroupDropDown } from './components/app/GroupDropDown';

const filterOptions = [{label: 'None', value: 'none'}, {label: 'Family', value: 'family'}, {label: 'Order', value: 'order'}, {label: 'Genus', value: 'genus'}];



const Accordian = ({ fruits, groupBy, onGroupByChange, onAddToJar, jar }: { fruits: any[], groupBy: string, onGroupByChange: (value: string) => void, onAddToJar: (fruit: any) => void, jar: { fruit: any; count: number }[] }) => {
  // Group fruits based on the selected grouping
  const groupedFruits = React.useMemo(() => {
    if (groupBy === 'none' || !fruits.length) {
      return [{ title: 'All Fruits', fruits: fruits }];
    }

    const groups: { [key: string]: any[] } = {};
    
    fruits.forEach(fruit => {
      const groupKey = fruit[groupBy] || 'Unknown';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(fruit);
    });

    return Object.entries(groups).map(([groupName, groupFruits]) => ({
      title: groupName,
      fruits: groupFruits
    }));
  }, [fruits, groupBy]);

  return (
    <Card.Root variant='elevated' className="fruit-card">
      <Card.Header className="fruit-card-header">
        <Flex alignItems='center' justifyContent={'space-between'}>
          <Text fontWeight='bold'>Fruits</Text>
          <GroupDropDown options={filterOptions} value={groupBy} onValueChange={onGroupByChange} />
        </Flex>
      </Card.Header>
      <Card.Body>
        <Accordion.Root multiple defaultValue={groupBy === 'none' ? ['group-0'] : []}>
        {groupedFruits.map((group, index) => (
          <Accordion.Item key={index} value={`group-${index}`}>
            <Accordion.ItemTrigger>
              <Span flex='1'><b>{group.title}</b> ({group.fruits.length})</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                {group.fruits.map((fruit, fruitIndex) => {
                  const isInJar = jar.some(item => item.fruit.id === fruit.id);
                  return (
                    <Flex key={fruitIndex} gap='8' alignItems='center' justifyContent='space-between' className="fruit-item">
                      <Flex flexDirection='column' alignItems='flex-start'>
                        <Text textStyle='md' fontWeight='semibold'>{fruit.name}</Text>   
                        {fruit.nutritions.calories && <Text marginEnd='auto' fontSize='xs' color='gray.600'>Calories: {fruit.nutritions.calories}</Text>}
                      </Flex>
                      <Icon 
                        size='sm' 
                        className="fruit-icon"
                        onClick={() => onAddToJar(fruit)}
                        style={{ cursor: 'pointer' }}
                      >
                         {isInJar ? <BsCheckCircle /> : <BsCircle />}
                      </Icon>
                    </Flex>
                  );
                })}
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      </Card.Body>
    </Card.Root>
  )
}

export const App = () => {
  const dispatch = useAppDispatch();
  const { loading, fruits, jar } = useAppSelector(state => state.fruitJar);
  const hasFetched = useRef(false);
  const [groupBy, setGroupBy] = useState('none');

  const handleAddToJar = (fruit: any) => {
    dispatch(addToJar(fruit));
  };

  useEffect(() => {
    // Only fetch if we haven't already fetched and don't have fruits yet
    if (!hasFetched.current && !loading) {
      hasFetched.current = true;
      dispatch(fetchFruits());
    }
  }, [dispatch, loading, fruits.length]);

  return (
    <div className='App'>
      <header className='App-header'>
        <Flex direction='column' alignItems='center' gap={4}>
          <Accordian fruits={fruits} groupBy={groupBy} onGroupByChange={setGroupBy} onAddToJar={handleAddToJar} jar={jar} />
        </Flex>
      </header>
    </div>
  );
};

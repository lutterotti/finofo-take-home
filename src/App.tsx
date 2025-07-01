import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchFruits, addToJar, removeFromJar } from './store/fruitJar';
import { Jar } from './components/app/Jar';
import { AvaliableFruits } from './components/app/AvaliableFruits';
import { Flex } from '@chakra-ui/react';
import { GroupByOptions } from './util/types';

export const App = () => {
  const dispatch = useAppDispatch();
  const { loading, fruits, jar } = useAppSelector(state => state.fruitJar);
  const hasFetched = useRef(false);
  const [groupBy, setGroupBy] = useState<GroupByOptions>(GroupByOptions.NONE);

  const handleAddToJar = (fruit: any) => {
    dispatch(addToJar(fruit));
  };

  const handleRemoveFromJar = (fruit: any) => {
    dispatch(removeFromJar(fruit));
  };

  useEffect(() => {
    // Only fetch if we haven't already fetched and don't have fruits yet
    if (!hasFetched.current && !loading) {
      hasFetched.current = true;
      dispatch(fetchFruits());
    }
  }, [dispatch, loading, fruits.length]);

  return (
    <div className="App">
      <Flex direction="row" alignItems="center" gap={4}>
        <AvaliableFruits
          fruits={fruits}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          onAddToJar={handleAddToJar}
          onRemoveFromJar={handleRemoveFromJar}
          jar={jar}
        />
        <Jar />
      </Flex>
    </div>
  );
};

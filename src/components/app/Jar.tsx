import { Card, Flex, Text, Icon } from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { BsDashCircle } from "react-icons/bs";
import { removeOneFromJar } from "../../store/fruitJar";

const JarContainer = () => {
    const { jar } = useAppSelector(state => state.fruitJar);
    const dispatch = useAppDispatch();
    
    const handleRemoveOne = (fruit: any) => {
        dispatch(removeOneFromJar(fruit));
    };
    
    // Calculate total calories
    const totalCalories = jar.reduce((total, item) => {
        const fruitCalories = item.fruit.nutritions?.calories || 0;
        return total + (fruitCalories * item.count);
    }, 0);

    return (
        <Card.Root variant='elevated' className="fruit-card">
              <Card.Header className="fruit-card-header">
                <Flex alignItems='flex-start' flexDirection='column' gap='1' justifyContent={'space-between'}>
                  <Text fontWeight='bold'>Your Jar</Text>
                  <Text fontWeight='light'>Total Calories: {totalCalories}</Text>
                </Flex>
              </Card.Header>
              <Card.Body style={{overflowY: 'scroll'}}>
                {jar.length === 0 ? (
                    <Text color="gray.500" textAlign="center" padding="4">
                        Your jar is empty. Add some fruits!
                    </Text>
                ) : (
                    jar.map((item, index) => (
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
                    ))
                )}
              </Card.Body>
            </Card.Root>
    );
}

export const Jar = () => {

    return (
        <>
            <JarContainer />
        </>
    );
}
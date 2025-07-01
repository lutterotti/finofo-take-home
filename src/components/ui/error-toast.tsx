import { useEffect } from 'react';
import { Alert, Button, Flex, Text } from '@chakra-ui/react';
import { clearError } from '../../store/fruitJar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export const ErrorToast = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector(state => state.fruitJar);

  const handleDismiss = () => {
    dispatch(clearError());
  };

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  if (!error) {
    return null;
  }

  const getErrorTitle = (status?: number) => {
    if (!status) return 'Connection Error';
    if (status >= 500) return 'Server Error';
    if (status >= 400) return 'Request Error';
    return 'Error';
  };

  const getErrorSeverity = (status?: number) => {
    if (!status || status >= 500) return 'error';
    if (status >= 400) return 'warning';
    return 'info';
  };

  return (
    <Alert.Root
      status={getErrorSeverity(error.status)}
      variant="subtle"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        maxWidth: '400px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Alert.Indicator />
      <Flex direction="column" flex="1" gap="2">
        <Alert.Title>{getErrorTitle(error.status)}</Alert.Title>
        <Alert.Description>
          <Text fontSize="sm">{error.message}</Text>
          {error.status && (
            <Text fontSize="xs" color="gray.600" mt="1">
              Status: {error.status}{' '}
              {error.statusText && `(${error.statusText})`}
            </Text>
          )}
        </Alert.Description>
        <Flex justifyContent="flex-end" mt="2">
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            Dismiss
          </Button>
        </Flex>
      </Flex>
    </Alert.Root>
  );
};

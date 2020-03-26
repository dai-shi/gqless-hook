import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import {
  Accessor,
  Client,
  accessorInterceptors,
} from 'gqless';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { wrapMutableObject, notifyMutation } from './wrapMutableObject';
import { useCleanup } from './useCleanup';

/**
 * useQuery
 *
 * This hook returns query from gqless.
 *
 * @example
 * import { useQuery } from 'gqless-hook';
 * import { client } from '../graphql'; // generated by @gqless/cli
 *
 * const Component = () => {
 *   const query = useQuery(client);
 *   return (
 *     <div>{query.foo}</div>
 *   );
 * };
 */
export const useQuery = <Data extends object>(client: Client<Data>): Data => {
  const addCleanup = useCleanup();

  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  const fetching = useRef(false);
  if (fetching.current) {
    throw new Promise((resolve) => {
      client.scheduler.commit.onFetched.then(() => {
        fetching.current = false;
        resolve();
      });
    });
  }
  useIsomorphicLayoutEffect(() => {
    if (client.scheduler.commit.accessors.size > 0) {
      fetching.current = true;
      forceUpdate();
    }
  });

  type Callback = (prevData: unknown) => void;
  const dataChangeCallbacks = useRef(new Map<Accessor, Callback>());
  const onAccessor = useCallback((accessor: Accessor) => {
    let callback = dataChangeCallbacks.current.get(accessor);
    if (!callback) {
      callback = () => {
        notifyMutation(accessor);
        if (!fetching.current) {
          forceUpdate();
        }
      };
      dataChangeCallbacks.current.set(accessor, callback);
    }
    addCleanup(accessor.onDataChange(callback));
  }, [addCleanup]);
  accessorInterceptors.add(onAccessor);
  const deleteInterceptorTimer = setTimeout(() => {
    accessorInterceptors.delete(onAccessor);
  }, 5 * 1000);
  useEffect(() => {
    clearTimeout(deleteInterceptorTimer);
    accessorInterceptors.delete(onAccessor);
  });

  return wrapMutableObject(client.query);
};

import {
  useCallback,
  useLayoutEffect,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import {
  Accessor,
  Client,
  accessorInterceptors,
} from 'gqless';

const isSSR = (
  typeof window === 'undefined'
  || /ServerSideRendering/.test(window.navigator && window.navigator.userAgent)
);

const useIsomorphicLayoutEffect = isSSR ? (cb: () => void) => cb() : useLayoutEffect;

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
export const useQuery = <Data>(client: Client<Data>): Data => {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  const fetching = useRef(false);
  if (fetching.current) {
    throw new Promise((resolve) => {
      client.scheduler.commit.onFetched.then(resolve);
    });
  }

  const onActive = useCallback(() => {
    fetching.current = true;
  }, []);
  const onFetched = useCallback(() => {
    fetching.current = false;
  }, []);
  client.scheduler.commit.onActive.then(onActive);
  client.scheduler.commit.onFetched.then(onFetched);
  useIsomorphicLayoutEffect(() => {
    if (fetching.current) {
      forceUpdate();
    } else if (client.scheduler.commit.accessors.size > 0) {
      fetching.current = true;
      forceUpdate();
    }
  });

  const updateUnlessFetching = useCallback(() => {
    if (!fetching.current) {
      forceUpdate();
    }
  }, []);
  const onAccessor = useCallback((accessor: Accessor) => {
    accessor.onDataChange.then(updateUnlessFetching);
  }, [updateUnlessFetching]);
  accessorInterceptors.add(onAccessor);
  const timer = setTimeout(() => {
    accessorInterceptors.delete(onAccessor);
  }, 5 * 1000);
  useEffect(() => {
    clearTimeout(timer);
    accessorInterceptors.delete(onAccessor);
  });

  return client.query;
};

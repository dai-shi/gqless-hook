import React, { Suspense } from 'react';
import { update } from 'gqless';

import TopStories from './TopStories';
import { query } from './graphql';

setTimeout(() => {
  update(query.hn?.topStories({ limit: 25 })?.[0]?.score, -1);
}, 6000);

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <TopStories />
  </Suspense>
);

export default App;

import React, { Suspense } from 'react';

import TopStories from './TopStories';

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <TopStories />
  </Suspense>
);

export default App;

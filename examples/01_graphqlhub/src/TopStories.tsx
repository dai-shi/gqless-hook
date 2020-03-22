import React from 'react';

import { useQuery } from 'gqless-hook';

import { client } from './graphql';
import Story from './Story';

const TopStories: React.FC = () => {
  const query = useQuery(client);
  return (
    <div>
      {query.hn?.topStories({ limit: 25 })?.map((story) => (
        story && <Story key={story.id} story={story} />
      ))}
    </div>
  );
};

export default TopStories;

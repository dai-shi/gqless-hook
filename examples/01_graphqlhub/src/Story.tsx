import React from 'react';
import { HackerNewsItem } from './graphql';

type Props = {
  story: HackerNewsItem;
};

const Story: React.FC<Props> = ({ story }) => (
  <article>
    <h2>
      <a href={story.url || ''}>{story.title}</a>
    </h2>
    <div>
      <span>{story.score} points</span>
      <a href={`https://news.ycombinator.com/user?id=${story.by.id}`}>
        {story.by.id}
      </a>
      <a href={`https://news.ycombinator.com/item?id=${story.id}`}>
        {story.descendants} comments
      </a>
    </div>
  </article>
);

export default Story;

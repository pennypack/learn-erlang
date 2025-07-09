import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort((a, b) => a.data.postNumber - b.data.postNumber);
  
  return rss({
    title: 'Learn Erlang Step-By-Step',
    description: 'Build a real-time WebSocket chat server from scratch using pure Erlang',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: `Post ${post.data.postNumber}: ${post.data.title}`,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
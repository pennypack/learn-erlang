import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');
  
  const postsData = posts.map(post => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    postNumber: post.data.postNumber,
    tags: post.data.tags,
    difficulty: post.data.difficulty,
  }));
  
  return new Response(JSON.stringify(postsData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
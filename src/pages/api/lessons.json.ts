import { getCollection } from 'astro:content';

export async function GET() {
  const lessons = await getCollection('lessons');
  
  const lessonsData = lessons.map(lesson => ({
    slug: lesson.slug,
    title: lesson.data.title,
    description: lesson.data.description,
    postNumber: lesson.data.postNumber,
    tags: lesson.data.tags,
    difficulty: lesson.data.difficulty,
  }));
  
  return new Response(JSON.stringify(lessonsData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
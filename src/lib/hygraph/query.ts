async function runQuery(QUERY: string) {
  try {
    const response = await fetch(process.env.HYGRAPH_URL || "", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'gcms-stage': 'PUBLISHED',
      },
      body: JSON.stringify({
        query: QUERY
      })
    });

    if(!response.ok) {
        console.log(await response.json())
        throw new Error("Seems like something is wrong.")
    }
    const { data } = await response.json()
    return data
  } catch (error) {
    throw new Error("Server closed.")
  }
}
export interface ChapterDetail {
  chapter: number;
  description: string;
  slug: string;
  novel: {
      title: string;
      slug: string
  }
  published?: Date;
  createdAt: Date;
  title: string;
  volume: {
      number: number;
  };
}

export interface LatestPosts {
  chapters : ChapterDetail[]
  chaptersConnection: {
      aggregate: {
          count: number;
      }
  }
}

export async function getLatestPosts({ last=25, premium=false, skip=0 }): Promise<LatestPosts> {
  const QUERY = `query LastChapters {
    chapters(first: ${last}, skip: ${skip}, where: {premium: ${premium}}, orderBy: ${premium? "createdAt_DESC": "published_DESC"}) {
      chapter
      description
      slug
      novel {
        title
        slug
      }
      title
      published
      createdAt
      volume {
        number
      }
    }
    chaptersConnection(where: {premium: ${premium}}) {
        aggregate {
          count
        }
      }
  }`
  try {
      console.log("Request made for last chapters.")
      const data = await runQuery(QUERY);

      return data

  } catch (error) {
      console.error(error)
      throw error;
  }
}

export type ChapterSlug = {
  slug: string;
  novel: {
      slug: string
  }
}

export async function getChapterSlug(id: string):Promise<ChapterSlug> {
  const QUERY = `query Chapter {
    chapter(where: {id: "${id}"}) {
      slug
      novel {
        slug
      }
    }
  }`
  try {
      console.log("Request made for chapter: ", id)
      const data = await runQuery(QUERY);
      return data.chapter
  } catch (error) {
      console.error(error)
      throw error
  }
}

export interface FullChapter {
  chapter: number;
  content: {
    html: string;
  }
  createdAt: Date;
  premium: boolean;
  title: string;
  updatedAt: Date;
  volume: {
    number: number;
    title: string | null;
  };
  novel: {
    id: string;
    title: string;
    slug: string
  }
  next?: {
    slug: string;
  }
  previous?: {
    slug: string;
  }
}

export async function getChapter(slug: string): Promise<FullChapter> {
  const QUERY = `query Chapter {
    chapter(where: {slug: "${slug}"}) {
      chapter
      content {
        html
      }
      createdAt
      premium
      title
      updatedAt
      volume {
        number
        title
      }
      novel {
        id
        title
        slug
      }
      next {
        slug
      }
      previous {
        slug
      }
    }
  }`
  try {
      console.log("Request made for chapter: ", slug)
      const { chapter } = await runQuery(QUERY);
      return chapter

  } catch (error) {
    console.error(error)
    throw error
  }
}

export interface NovelIndex {
  id: string;
  title: string;
  slug: string;
}

export async function getNovels({ last = 25 }): Promise<NovelIndex[]> {
  const QUERY = `query Novels {
    novels(first: ${last}, orderBy: title_ASC) {
      id
      title
      slug
    }
  }`
  try {
      console.log("Request made for novels")
      const { novels } = await runQuery(QUERY);
      
      return novels
  } catch (error) {
      console.error(error)
      throw error
  }
}
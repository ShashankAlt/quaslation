import H3 from '@/components/typography/h3';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getChapter } from '@/lib/actions'
import { Protect } from '@clerk/nextjs';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default async function ChapterPage({ params }: { params: { id: string }}) {
  const chapter = await getChapter(params.id);
  
  return (
    <div className='p-4'>
      <H3 className='mb-4'>Chapter {chapter.chapter}: {chapter.title}</H3>
      {(chapter.premium) ? 
      <Protect role='org:member'
      fallback={
        (
          <Alert variant={"destructive"}>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Premium Content</AlertTitle>
            <AlertDescription>
            We apologize, but this content is exclusive to our premium subscribers. However, we&apos;re pleased to inform you that it will be made available to all users free of charge in the near future. Thank you for your patience and continued interest in the novel.
            </AlertDescription>
          </Alert>
        )}
      >
        <div className='space-y-2 prose lg:prose-xl dark:prose-invert' dangerouslySetInnerHTML={{__html: chapter.content.html}} />
      </Protect>
      :(
        <div className='space-y-2 prose lg:prose-xl dark:prose-invert' dangerouslySetInnerHTML={{__html: chapter.content.html}} />
      )}
      <div className='flex justify-between mt-4'>
        {chapter.previous ? (
          <Link href={`/chapter/${chapter.previous.id}`}><Button>Previous</Button></Link>
        ):(
          <Button disabled>Previous</Button>
        )}
        <Link href={`/novels/${chapter.novel.novel_slug.slug}`}>
          <Button variant={"secondary"}>
            Index
          </Button>
        </Link>
        {chapter.next ? (
          <Link href={`/chapter/${chapter.next.id}`}><Button>Next</Button></Link>
        ):(
          <Button disabled>Next</Button>
        )}
      </div>
    </div>
  )
}

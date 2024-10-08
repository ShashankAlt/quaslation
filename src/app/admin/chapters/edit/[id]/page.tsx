import React from 'react'
import { getChapter } from './actions'
import H2 from '@/components/typography/h2';
import { EditChapterForm } from './form';

const EditChapter = async({ params }:{ params: { id: string }}) => {
  const chapter = await getChapter(parseInt(params.id));
  return (
    <div>
      <H2>Chapter {chapter.number}: {chapter.title}</H2>
      <EditChapterForm data={chapter} />
    </div>
  )
}

export default EditChapter
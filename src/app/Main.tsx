import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import AuthorLayout from '@/layouts/AuthorLayout'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { allAuthors, Authors } from 'contentlayer/generated'
import { coreContent } from 'pliny/utils/contentlayer'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
      {/* {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 transition-all hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )} */}
      {/*{siteMetadata.newsletter?.provider && (*/}
      {/*  <div className="flex items-center justify-center pt-4">*/}
      {/*    <NewsletterForm />*/}
      {/*  </div>*/}
      {/*)}*/}
    </>
  )
}

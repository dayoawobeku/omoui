import type {NextPage} from 'next';
import Head from 'next/head';
import PagesCard from '../../components/PagesCard';
import {useWebpages} from '../../hooks';

interface Pages {
  page_name: string;
  attributes: {
    pages: string[];
  };
}

const Webpages: NextPage = () => {
  const {data: webpages} = useWebpages();

  const pagesArray = webpages?.data?.map(
    (page: Pages) => page.attributes.pages,
  );
  const flattenedPages = pagesArray?.flat();

  // get the unique pages
  const uniquePages = flattenedPages?.filter((page: Pages, index: number) => {
    return (
      flattenedPages?.findIndex(
        (p: Pages) => p.page_name === page.page_name,
      ) === index
    );
  });

  console.log(uniquePages);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-16">
        <h1 className="text-xl font-medium text-grey">Webpages</h1>
      </section>

      <section>
        <PagesCard pages={uniquePages} />
      </section>
    </>
  );
};

export default Webpages;

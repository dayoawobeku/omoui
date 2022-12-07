import type {NextPage} from 'next';
import Head from 'next/head';
import {useState} from 'react';
import {useRouter} from 'next/router';
import Image, {StaticImageData} from 'next/image';
import {useQuery} from '@tanstack/react-query';
import {slugify} from '../../helpers';
import {getWebpages} from '../../queryfns';
import Card from '../../components/Card';
import {HeadingOne, Modal} from '../../components';
import {closeIc, nextIc, prevIc} from '../../assets/images/images';

interface Pages {
  page_name: string;
  attributes: {
    pages: string[];
    name: string;
  };
  company_name: string;
  image_url: StaticImageData;
}

const IndividualWebpages: NextPage = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {data: webpages} = useQuery(['webpages'], getWebpages);

  const pagesArray = webpages?.data?.map(
    (page: Pages) => page.attributes.pages,
  );

  const flattenedPages = pagesArray?.flat();

  const specificPages = flattenedPages?.filter(
    (page: Pages) => slugify(page.page_name) === router.query.id,
  );

  // get the company that is currently active
  const activePage = specificPages?.find(
    (page: Pages) => slugify(page.company_name) === router.query.company,
  );

  // get the index of the active company
  const activePageIndex = specificPages?.findIndex(
    (page: Pages) => page.company_name === activePage?.company_name,
  );

  // get the next company
  function getNextCompany() {
    if (activePageIndex === specificPages?.length - 1) {
      const firstCompany = specificPages?.find(
        (page: Pages, index: number) => index === 0,
      );
      const firstCompanyName = slugify(firstCompany?.company_name);

      router.push(
        `/webpages/${router.query.id}?company=${firstCompanyName}`,
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      );
      return;
    } else {
      const nextCompany = specificPages?.find(
        (page: Pages, index: number) => index === activePageIndex + 1,
      );
      const nextCompanyName = slugify(nextCompany?.company_name);
      router.push(
        `/webpages/${router.query.id}?company=${nextCompanyName}`,
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      );
      return nextCompany;
    }
  }

  // get the previous company
  function getPrevCompany() {
    if (activePageIndex === 0) {
      const lastCompany = specificPages?.find(
        (page: Pages, index: number) => index === specificPages?.length - 1,
      );
      const lastCompanyName = slugify(lastCompany?.company_name);
      router.push(
        `/webpages/${router.query.id}?company=${lastCompanyName}`,
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      );
      return;
    } else {
      const prevCompany = specificPages?.find(
        (page: Pages, index: number) => index === activePageIndex - 1,
      );
      const prevCompanyName = slugify(prevCompany?.company_name);
      router.push(
        `/webpages/${router.query.id}?company=${prevCompanyName}`,
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      );
      return prevCompany;
    }
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeadingOne text={specificPages?.[0]?.page_name} />

      <Modal
        className="h-full max-w-[1199px] bg-white"
        transitionParentClassName="p-4"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          router.push(`/webpages/${router.query.id}`, undefined, {
            shallow: true,
            scroll: false,
          });
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 p-4 sm:flex-nowrap sm:justify-between sm:gap-0 sm:py-8 sm:px-12">
          <p className="font-medium text-body">
            {specificPages?.[0]?.page_name}
          </p>
          <p className="font-medium text-body">
            {activePage?.company_name ?? '-'}
          </p>
          <div className="flex items-center gap-6">
            <button onClick={getPrevCompany} className="h-6 w-6">
              <Image alt="prev" src={prevIc} width={24} height={24} />
            </button>
            <button onClick={getNextCompany} className="h-6 w-6">
              <Image alt="next" src={nextIc} width={24} height={24} />
            </button>
            <div className="h-4 w-[1px] bg-[#D6D1CA]" />
            <button
              onClick={() => {
                setIsOpen(false);
                router.push(`/webpages/${router.query.id}`, undefined, {
                  shallow: true,
                  scroll: false,
                });
              }}
              className="h-6 w-6"
            >
              <Image alt="close" src={closeIc} width={24} height={24} />
            </button>
          </div>
        </div>
        <div className="full-width-img relative h-full w-full">
          {activePage ? (
            <Image
              alt={activePage?.page_name}
              src={activePage?.image_url}
              layout="fill"
              objectFit="cover"
              objectPosition="top"
            />
          ) : null}
        </div>
      </Modal>

      <section>
        <div className="card lg:px-3">
          {specificPages?.map((page: Pages, index: number) => (
            <article key={index} className="flex flex-col gap-5 py-0 lg:py-14">
              <h2 className="text-md font-medium text-grey">
                {page.company_name}
              </h2>
              <Card
                src={page.image_url}
                alt={page.company_name}
                image_data={page.image_url}
                onClick={() => {
                  setIsOpen(true);
                  router.push(
                    `/webpages/${router.query.id}?company=${slugify(
                      page.company_name,
                    )}`,
                    undefined,
                    {
                      shallow: true,
                      scroll: false,
                    },
                  );
                }}
              />
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default IndividualWebpages;

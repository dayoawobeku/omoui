import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import CompanyCard from '../components/CompanyCard';
import {getPaginatedCompanies} from '../queryfns';

const Homepage: NextPage = () => {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(
    router.query.page ? Number(router.query.page) : 1,
  );

  useEffect(() => {
    if (router.query.page) {
      setPageIndex(Number(router.query.page));
    }
  }, [router.query]);

  const {data: companies} = useQuery(
    ['companies', router.query.page ? Number(router.query.page) : 1],
    () =>
      getPaginatedCompanies(router.query.page ? Number(router.query.page) : 1),
  );

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="mx-auto my-6 max-w-[922px] py-4 text-center lg:my-0 lg:py-20">
        <h1 className="text-[1.875rem] font-bold text-grey lg:text-2xl">
          Find your favorite sites in one place, then learn from the greats.
        </h1>
        <p className="mx-auto mt-6 mb-2 max-w-[852px] text-base font-medium text-body lg:text-md">
          We track each of these sites and update our collection regularly to
          include the latest designs.
        </p>
        <p className="text-base font-medium text-blue lg:text-md">
          *No account needed
        </p>
      </section>

      <section>
        <CompanyCard companies={companies?.data} />

        <div className="mt-10 flex items-end justify-center gap-7">
          <div className="flex gap-3">
            <button
              className="text-body"
              onClick={() => {
                setPageIndex(pageIndex - 1);
                router.push(`/?page=${pageIndex - 1}`, undefined, {
                  scroll: false,
                });
              }}
              disabled={companies?.meta?.pagination?.page === 1}
            >
              Previous
            </button>
            <button
              className="text-body"
              onClick={() => {
                setPageIndex(pageIndex + 1);
                router.push(`/?page=${pageIndex + 1}`, undefined, {
                  scroll: false,
                });
              }}
              disabled={
                companies?.meta?.pagination?.page ===
                companies?.meta?.pagination?.pageCount
              }
            >
              Next
            </button>
          </div>
          <p className="text-sm">
            Page {companies?.meta?.pagination?.page} of{' '}
            {companies?.meta?.pagination?.pageCount}
          </p>
        </div>
      </section>
    </>
  );
};

export default Homepage;

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['companies', 1], () =>
    getPaginatedCompanies(1),
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

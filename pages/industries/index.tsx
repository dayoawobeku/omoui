import type {NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query';
import {plainCard} from '../../assets/images/images';
import {getCompanies} from '../../queryfns/getCompanies';
import {slugify} from '../../helpers';

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['companiess'], getCompanies);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

interface Company {
  id: string;
  attributes: {
    industry: string;
    name: string;
    slug: string;
  };
}

const Industries: NextPage = () => {
  const {data: companies} = useQuery(['companies'], getCompanies);

  const uniqueIndustries = [
    ...new Set(
      companies?.data?.map((company: Company) => company.attributes.industry),
    ),
  ];

  // first set of company that has those industries
  const firstCompanies = uniqueIndustries.map(industry => {
    const firstCompany = companies?.data?.find(
      (company: Company) => company.attributes.industry === industry,
    );

    return firstCompany;
  });

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-16">
        <h1 className="text-xl font-medium text-grey">Industries</h1>
      </section>

      <article className="grid grid-cols-2 gap-x-12 px-3">
        {firstCompanies?.map(company => (
          <Link
            key={company.id}
            href={`/industries/${slugify(company?.attributes?.industry)}`}
          >
            <a className="flex flex-col gap-5 py-14">
              <h2 className="text-lg font-medium text-grey">
                {company?.attributes?.industry}
              </h2>
              <div className="relative">
                {company?.attributes?.pages[0] ? (
                  <Image
                    alt=""
                    src={company?.attributes?.pages[0].image_url}
                    width={620}
                    height={411}
                    layout="responsive"
                    placeholder="blur"
                    objectFit="cover"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
                    className="rounded-2xl"
                  />
                ) : (
                  <Image
                    alt=""
                    src={plainCard}
                    width={620}
                    height={411}
                    layout="responsive"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
                    className="rounded-2xl"
                  />
                )}
              </div>
            </a>
          </Link>
        ))}
      </article>
    </>
  );
};

export default Industries;

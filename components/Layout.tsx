import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import Fuse from 'fuse.js';
const _debounce = require('lodash.debounce');
import {coffee, search} from '../assets/images/images';
import Modal from './Modal';
import {useCategories, useCompanies, usePages} from '../hooks';

interface Company {
  title: string;
  attributes: {
    industry: string;
    name: string;
    pages: [
      {
        page_name: string;
      },
    ];
  };
  id: number;
}

interface Pages {
  attributes: {
    pages: string[];
  };
}

interface Category {
  attributes: {
    industry: string;
  };
}

interface LayoutProps {
  children: React.ReactNode;
}

interface Options {
  keys: string[];
  isCaseSensitive: boolean;
  includeScore: boolean;
  shouldSort: boolean;
  includeMatches: boolean;
  findAllMatches: boolean;
  minMatchCharLength: number;
  location: number;
  threshold: number;
  distance: number;
  useExtendedSearch: boolean;
  ignoreLocation: boolean;
  ignoreFieldNorm: boolean;
  fieldNormWeight: number;
  title: string;
}

const options: Fuse.IFuseOptions<Options> = {
  keys: ['title', 'industry', 'pages'],
  threshold: 0.3,
};

export default function Layout({children}: LayoutProps) {
  const {pathname} = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [OS, setOS] = useState('');

  const {data: companies} = useCompanies();
  const {data: pages} = usePages();
  const {data: categories} = useCategories();
  const pagesArray = pages?.data?.map((page: Pages) => page.attributes.pages);
  const industries = categories?.data?.map(
    (category: Category) => category?.attributes?.industry,
  );
  const industryCount = industries?.reduce(
    (acc: {[x: string]: number}, cat: string | number) => {
      acc[cat] = ++acc[cat] || 1;
      return acc;
    },
    {},
  );
  const pageCount = pagesArray?.reduce(
    (acc: {[x: string]: number}, cat: string | number) => {
      acc[cat] = ++acc[cat] || 1;
      return acc;
    },
    {},
  );

  // search implemetation with fuse.js
  const [searchTerm, setSearchTerm] = useState('');

  const changeHandler = (e: {
    target: {value: React.SetStateAction<string>};
  }) => {
    setSearchTerm(e.target.value);
  };

  const companyItems = companies?.data?.map((company: Company) => {
    return {
      title: company?.attributes?.name,
      industry: company?.attributes?.industry,
      pages: company?.attributes?.pages.map(page => page.page_name),
    };
  });

  const fuse = new Fuse(companyItems, options);
  const results = companyItems ? fuse.search(searchTerm || '') : [];

  const debouncedChangeHandler = _debounce(changeHandler, 1000);

  // open search dialog on ctrl + k/⌘ + k
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.metaKey && e.code === 'KeyK') ||
        (e.ctrlKey && e.code === 'KeyK')
      ) {
        e.preventDefault();
        setIsOpen(true);
        document.getElementById('search-btn')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname]);

  // detect OS
  useEffect(() => {
    if (navigator.platform === 'MacIntel') {
      setOS('Cmd');
    } else {
      setOS('Ctrl');
    }
  }, []);

  const companyTab =
    pathname === '/companies' ? 'text-blue hover:text-blue' : 'text-body';
  const industryTab =
    pathname === '/industries' ? 'text-blue hover:text-blue' : 'text-body';
  const webpagesTab =
    pathname === '/webpages' ? 'text-blue hover:text-blue' : 'text-body';

  return (
    <div className="mx-auto max-w-[1345px] px-4">
      <nav className="py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <a className="text-md font-medium text-blue">omoui.design</a>
            </Link>
            <ul className="nav-ul flex items-center gap-4 font-medium">
              <li className={companyTab}>
                <Link href="/companies">
                  <a>Companies ({companies?.data.length ?? '-'})</a>
                </Link>
              </li>
              <li className={industryTab}>
                <Link href="/industries">
                  <a>
                    Industries (
                    {industryCount ? Object.keys(industryCount).length : '-'})
                  </a>
                </Link>
              </li>
              <li className={webpagesTab}>
                <Link href="/webpages">
                  <a>
                    Webpages ({pageCount ? Object.keys(pageCount).length : '-'})
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          <Modal
            className={`max-w-[832px] gap-6 rounded-2xl ${
              results?.length > 0 ? 'h-full' : 'h-fit'
            }`}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          >
            <label
              htmlFor="search"
              className="relative flex h-[4.25rem] w-full max-w-[832px] items-center justify-between"
            >
              <div className="absolute left-4 h-5 w-5">
                <Image alt="" src={search} width={20} height={20} />
              </div>
              <input
                id="search"
                className="h-[4.25rem] w-full max-w-[832px] pl-11 pr-4"
                placeholder="Search"
                onChange={debouncedChangeHandler}
              />
            </label>

            {searchTerm !== '' && results.length > 0 ? (
              <div className="flex h-fit w-full max-w-full flex-col gap-2 overflow-y-auto rounded-lg bg-white-200 p-6 text-blue shadow-lg">
                {results?.map(result => (
                  <div key={result.item.title}>
                    <Link
                      href={`/companies/${result.item.title
                        .toLowerCase()
                        .replace(/ /g, '-')}`}
                    >
                      <a
                        onClick={() => {
                          setIsOpen(false);
                          setSearchTerm('');
                        }}
                        className="group flex items-center gap-2 rounded-md bg-white py-4 pl-6 text-grey hover:bg-blue hover:text-white focus:bg-blue focus:text-white"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_206_419)">
                            <path
                              d="M0 8C0 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 0 8 0C5.87897 0.00229405 3.84547 0.845886 2.34568 2.34568C0.845886 3.84547 0.00229405 5.87897 0 8H0ZM10.276 7.05733C10.526 7.30737 10.6664 7.64645 10.6664 8C10.6664 8.35355 10.526 8.69263 10.276 8.94267L7.16067 12.058L6.218 11.1153L9.33333 8L6.19267 4.85867L7.13333 3.916L10.276 7.05733Z"
                              className="group-hover:fill-white group-focus:fill-white"
                              fill="#1D1C1A"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_206_419">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        {result.item.title}
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            ) : searchTerm !== '' && results.length === 0 ? (
              <div className="h-fit w-full max-w-full overflow-y-auto rounded-lg bg-white-200 p-6 text-blue shadow-lg">
                <a className="flex py-1">No results</a>
              </div>
            ) : null}
          </Modal>
          <button
            onClick={() => setIsOpen(true)}
            id="search-btn"
            className="flex h-13 w-full max-w-[648px] items-center justify-between rounded-lg bg-white-200 px-4 font-medium text-body"
          >
            <div className="flex items-center gap-2">
              <Image alt="" src={search} width={20} height={20} />
              <span>Search companies, industries, webpages</span>
            </div>
            <span className="text-sm">{OS} + K</span>
          </button>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="px-5 py-6">
        <button className="mx-auto flex h-13 items-center gap-2 rounded-lg bg-blue px-4">
          <Image alt="" src={coffee} width={20} height={20} />
          <span className="font-medium text-white">buy me coffee</span>
        </button>
        <p className="mt-8 text-body">
          All product and company names are trademarks™ or registered®
          trademarks (including logos, screenshots and icons) remain the
          property of their respective owners.
        </p>
      </footer>
    </div>
  );
}

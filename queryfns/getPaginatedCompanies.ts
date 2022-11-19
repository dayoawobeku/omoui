import axios from 'axios';

export function getPaginatedCompanies(pageIndex = 1) {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?pagination[page]=${pageIndex}&pagination[pageSize]=2&sort=createdAt:DESC`,
    )
    .then(res => res.data);
}

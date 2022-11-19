import axios from 'axios';

export function getCategories() {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?fields=industry&sort=createdAt:DESC`,
    )
    .then(res => res.data);
}

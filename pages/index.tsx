import React from "react";
import Default from '@layout/Default';
import HeadMetaTags from "@module/headMetaTags";
import Home from "@template/Home";
import { getActiveCategories } from "@services/category";

const HomeWrapper = ({ categories }) => {
  return (
    <Default>
      <Home categories={categories} />
    </Default>
  );
}
export async function getStaticProps() {
  const categories = await getActiveCategories();
  return {
    props: {
      categories
    },
  }
}
export default HomeWrapper;
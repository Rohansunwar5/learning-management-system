import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";

type Props = {};

const EditCategories = (props: Props) => {
  const { data, isLoading } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: LayoutSuccess, error }] =
    useEditLayoutMutation();
  const [categories, setCategories] = useState<any>([]);

  return (
    <>
    {
      isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}}`></h1>

        </div>
      )
    }
    </>
  )
};

export default EditCategories;

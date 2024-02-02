import React, { memo, useEffect } from "react";
import DetailPictures from "./components/detail-pictures";
import { DetailWrapper } from "./style";
import { useDispatch } from "react-redux";
import { changeHeaderConfig } from "@/store/modules/main";

const Detail = memo(() => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      changeHeaderConfig({
        isFixed: false,
        topAlpha: false,
      })
    );
  }, [dispatch]);
  return (
    <DetailWrapper>
      <DetailPictures />
    </DetailWrapper>
  );
});

Detail.propTypes = {};

export default Detail;

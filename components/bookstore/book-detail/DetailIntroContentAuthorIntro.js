import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";

const DetailIntroContentAuthorIntro = ({ active, content_item }) => {
  const [foldIntroAuthor, setFoldIntroAuthor] = useState(true);
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setHeight(ref.current.clientHeight);
  }, []);

  const handleChangeFold = () => {
    setFoldIntroAuthor(!foldIntroAuthor);
  };

  return (
    <ContentArea>
      <p ref={ref} className={foldIntroAuthor ? "Folded" : "Unfolded"}>
        {content_item}
      </p>
      {height < 175 ? null : (
        <button onClick={handleChangeFold}>
          {foldIntroAuthor ? (
            <>
              {" "}
              더보기 <CaretDownFilled />
            </>
          ) : (
            <>
              {" "}
              접기 <CaretUpFilled />
            </>
          )}
        </button>
      )}
    </ContentArea>
  );
};

export default DetailIntroContentAuthorIntro;

const ContentArea = styled.div`
  padding: 15px 15px 20px 15px;

  & p {
    padding: 0;
    margin: 0;
    color: #303538;
    line-height: 1.5em;
    font-size: 15px !important;
    word-break: keep-all;
    word-wrap: break-word;
    max-height: 999999px;
  }
  & .Folded {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: keep-all;
    white-space: normal;
    max-height: 800px;
  }

  & button {
    display: block;
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    text-align: center;
    -webkit-appearance: none;
    border: 2px solid #d1d5d9;
    background: 0 0;
    font-weight: 700;
    font-size: 14px;
    color: #808991;
    border-radius: 4px;
    box-sizing: border-box !important;
  }
`;

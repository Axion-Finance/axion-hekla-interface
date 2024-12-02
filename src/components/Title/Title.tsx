import React from "react";
import styled from "styled-components";

type TitleWithImageProps = {
  title: string;
};

const TitleImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title1 = styled.div`
  color: #1f2024;
  font-size: 35px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

const Image = styled.img`
  align-self: stretch;
  height: 4px;
`;

const Title: React.FC<TitleWithImageProps> = ({ title }) => {
  return (
    <TitleImageContainer>
      <Title1>{title}</Title1>
    </TitleImageContainer>
  );
};

export default Title;

import Light_Logo from "img/landingpage/logos/logo-light.svg";
import DiscordIcon from "img/landingpage/social/discord.svg";
import MediumIcon from "img/landingpage/social/medium.svg";
import TelegramIcon from "img/landingpage/social/telegram.svg";
import TwitterIcon from "img/landingpage/social/twitter.svg";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Divider from "../../components/Divider";
import { Column, Row } from "../../components/Layout";
import { AutoRow } from "../../components/Layout/Row";
import { Text } from "../../components/Text";
import { SOCIAL_INFO } from "../../config/constant";
import useMatchBreakPoints from "../../utils/useMatchBreakPoints";

const FooterWrapper = styled.div`
  width: 100%;
  height: 230px;
  @media (max-width: 1200px) {
    height: 240px;
  }
  margin: 20px 0px;
`;

// const SocialIcons = styled.div`
//   display: flex;
//   align-items: center;
//   padding: 10px 54px;
// `;

// const SocialIcon = styled.img`
//   height: 25px;
//   margin-left: 10px;
// `;

// export const SocialView = () => {
//   return (
//     <SocialIcons>
//       <a href={SOCIAL_INFO.twitter} target="_blank">
//         <SocialIcon src="" alt="Twitter" />
//       </a>
//       <a href={SOCIAL_INFO.telegram} target="_blank">
//         <SocialIcon src="" alt="Telegram" />
//       </a>
//     </SocialIcons>
//   );
// };

function Footer() {
  const { isTablet } = useMatchBreakPoints();
  return (
    <FooterWrapper>
      <Divider />
      <AutoRow
        width="100%"
        height="100%"
        justify="center"
        align={isTablet ? "center" : "start"}
        gap="35px"
        marginTop={isTablet ? "10px" : "50px"}
      >
        <Column align="start" padding="0% 5%" marginLeft="40px">
          <img src={Light_Logo} width="96px" height="48px" />
          {!isTablet && (
            <Text
              fontSize="10px"
              textAlign="center"
              fontFamily="Neue Haas Grotesk Display Pro"
              fontWeight={400}
              lineHeight="28px"
            >
              Copyright © AXION , 2024. All rights reserved
            </Text>
          )}
        </Column>
        <Column padding="0% 5%" marginLeft="40px">
          <Row gap="20px" justify={isTablet ? "flex-start" : "flex-end"}>
            {[
              {
                icon: TelegramIcon,
                url: SOCIAL_INFO.telegram,
              },
              {
                icon: MediumIcon,
                url: SOCIAL_INFO.medium,
              },
              {
                icon: TwitterIcon,
                url: SOCIAL_INFO.twitter,
              },
              {
                icon: DiscordIcon,
                url: SOCIAL_INFO.discord,
              },
            ].map((element) => {
              return (
                <a href={element.url} target="_blank">
                  <img src={element.icon} />
                </a>
              );
            })}
          </Row>
          <Row gap="20px" justify={isTablet ? "flex-start" : "flex-end"}>
            {[
              {
                label: "Terms and Conditions",
                url: "#",
              },
              {
                label: "Referral",
                url: "#",
              },
              {
                label: "Terms",
                url: "#",
              },
              {
                label: "Docs",
                url: "#",
              },
            ].map((element) => {
              return (
                <Link to={element.url} style={{ textDecoration: "none" }}>
                  <Text
                    fontSize="10px"
                    textAlign="center"
                    fontFamily="Neue Haas Grotesk Display Pro"
                    fontWeight={400}
                    lineHeight={isTablet ? "36px" : "36px"}
                  >
                    {element.label}
                  </Text>
                </Link>
              );
            })}
          </Row>
        </Column>

        {isTablet && (
          <Text
            fontSize="10px"
            textAlign="center"
            fontFamily="Neue Haas Grotesk Display Pro"
            fontWeight={400}
            lineHeight="24px"
          >
            Copyright © AXION , 2024. All rights reserved
          </Text>
        )}
      </AutoRow>
    </FooterWrapper>
  );
}

export default Footer;

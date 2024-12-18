import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import AppRouter from "./AppRouter";
import { Loader } from "./components/Loader";
import { auth } from "./firebase";
import { WalletProvider } from "./WalletContext";

// 전체 화면
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.05);
`;

// 앱 화면
const Container = styled.div`
  /* 박스의 너비와 높이 설정 */
  width: 100vw;
  max-width: 600px; // 최대 width는 600이고, 그 이하에선 화면 너비에 맞춤
  height: 100vh;
  background-color: white; /* 박스 배경 색상 */
  /* overflow: hidden; */
  overflow-x: hidden;
`;

const LoaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

function App() {
  const GlobalStyle = createGlobalStyle`
  // style 초기화
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

@font-face {
  font-family: "Noto Sans KR";
  src: url("/fonts/NotoSansKR-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}
body {
  font-family: "Noto Sans KR";
	/* 화면을 중앙에 배치하기 위한 스타일 */
	margin: 0;
	padding: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background-color: white;
	/* overflow: hidden; */
}
 `;
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady(); // 로그인 여부 확인하고 인증이 완료되면 promise를 리턴
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <WalletProvider>
      <PageContainer>
        <GlobalStyle />
        <Container>
          {isLoading ? (
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          ) : (
            <AppRouter />
          )}
        </Container>
      </PageContainer>
    </WalletProvider>
  );
}

export default App;

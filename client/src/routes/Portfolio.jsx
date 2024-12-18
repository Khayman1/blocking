import axios from "axios"; // Axios 사용
import React, { useEffect, useState } from "react";
import { FaCertificate, FaLock, FaLockOpen } from "react-icons/fa"; // 아이콘 불러오기
import styled from "styled-components";
import Modal from "../components/Modal"; // Modal 컴포넌트 불러오기
import NotifyIcon from "../components/NotifyIcon";
import { Loader } from "../components/Loader";

// 스타일링
const ModalContent = styled.div`
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eaeaea;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  strong {
    font-weight: 600;
    color: #333;
  }

  span {
    font-size: 14px;
    color: #666;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  @media (min-width: 600px) {
    padding-left: 60px;
    padding-right: 60px;
  }
`;

const Header = styled.div`
  position: relative;
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-left: 0; /* 왼쪽에 붙이기 */
  text-align: left;
  padding: 10px;
  width: 100%;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 한 줄에 3개의 박스 */
  gap: 30px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 20px; /* 전체 컨테이너 여백 */
  border-radius: 12px;
`;

const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 11px;
  color: #333;
  padding: 10px 20px;
  background: linear-gradient(0deg, #a7e1e3,#ffffff, #ffffff); /* 부드럽고 밝은 그라디언트 */
  box-shadow: 0px 2px 4px #50c2c9;
  background-color: white;
  border-radius: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  /* 호버 효과 */
  &:hover {
    transform: translateY(-5px); /* 약간 위로 이동 */
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08); /* 호버 시 그림자 강화 */
  }

  h3 {
    margin: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #50c2c9; /* 어두운 텍스트 */
    white-space: nowrap;
  }

  p {
    margin: 10px 0px 0;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280; /* 부드러운 회색 텍스트 */
    white-space: nowrap; /* 줄바꿈 방지 */  
    }
`;


const SbtContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;
const DeleteButton = styled.button`
  display: block;
  width: 100%;
  max-width: 180px;
  margin: 20px auto 0;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #e74c3c;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0392b;
  }
`;

const LockIcon = styled.div`
  margin-left: 5px;
  cursor: pointer;
  color: #50c2c9;
`;
const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
  text-align: center;
`;

const GuideContainer = styled.div`
  padding: 24px 50px;
  margin-top: 15px;
  border-radius: 12px;
  box-shadow: 0px 2px 4px #50c2c9;
  background-color: white;
  h3 {
    font-size: 18px;
    color: #34495e; /* 약간 어두운 블루-그레이 */
    margin-bottom: 12px;
    font-weight: 500;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 10px;
      font-size: 15px;
      color: #576574; /* 중간 톤의 블루-그레이 */
      line-height: 1.6;
      display: flex;
      align-items: center;

      &:before {
        content: "✔";
        margin-right: 8px;
        color: #5eba7d; /* 밝은 초록색 */
        font-size: 16px;
      }
    }
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 40vh;
  color: #535353;
`;

const Portfolio = () => {
  const [lockState, setLockState] = useState([]);
  const [sbtData, setSbtData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAddress, setUserAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSbt, setSelectedSbt] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const getUserAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setUserAddress(accounts[0]);
        return accounts[0];
      } catch (error) {
        console.error("MetaMask 연결 실패:", error);
        setErrorMessage("MetaMask 연결에 실패했습니다. 다시 시도해 주세요.");
        return null;
      }
    } else {
      console.error("MetaMask가 설치되지 않았습니다.");
      setErrorMessage("MetaMask를 설치해주세요.");
      return null;
    }
  };

  const fetchSBTs = async () => {
    try {
      const address = await getUserAddress();
      if (!address) {
        console.error("지갑 주소를 가져오지 못했습니다.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`https://pscs.store/api/sbtmint/getSBTData?userAddress=${address}`);
      const sbtDetails = response.data.sbtDetails;
      if (sbtDetails.length === 0) {
        setErrorMessage("포트폴리오 정보가 존재하지 않습니다. 자격증을 추가해 보세요.");
      }
      setSbtData(sbtDetails);
      console.log(sbtDetails);
      setLockState(sbtDetails.map(() => true));
      setIsLoading(false);
    } catch (error) {
      console.error("SBT 조회 실패:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSBTs();
  }, []);

  const toggleLock = (index) => {
    const newLockState = [...lockState];
    newLockState[index] = !newLockState[index];
    setLockState(newLockState);
  };

  const openModal = (sbt) => {
    setSelectedSbt(sbt);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSbt(null);
  };

  if (isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>자격증</Title>
        <NotifyIcon />
      </Header>
      <GuideContainer>
        <h3>SBT 발급 가이드</h3>
        <ul>
          <li>1. 자격증 발급 요청 '+' 버튼을 클릭하세요.</li>
          <li>2. 요청 후 검토 상태가 업데이트됩니다.</li>
          <li>3. 검토 완료 후 자격증이 발급됩니다.</li>
        </ul>
      </GuideContainer>
      {errorMessage ? (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      ) : (
        <GridContainer>
          {sbtData.map((sbt, index) => (
            <div
              key={sbt.tokenId}
              onClick={() => openModal(sbt)}
            >
              <Card>
                <FaCertificate size={15} color="#50c2c9" />
                <h3>{sbt.metadata.status || `자격증 ${index + 1}`}</h3>
                <p>{`학번: ${sbt.metadata.studentId}`}</p>
                <p>{`학교: ${sbt.metadata.university}`}</p>
              </Card>
              <SbtContainer>
                {`Token ID: ${sbt.tokenId}`}
                <LockIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(index);
                  }}
                >
                  {lockState[index] ? <FaLock /> : <FaLockOpen />}
                </LockIcon>
              </SbtContainer>
            </div>
          ))}
        </GridContainer>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {selectedSbt && (
          <ModalContent>
            <ModalTitle>자격증 상세 정보</ModalTitle>

            <Section>
              <InfoRow>
                <strong>상태</strong>
                <span>{selectedSbt.metadata.status}</span>
              </InfoRow>
              <InfoRow>
                <strong>학번</strong>
                <span>{selectedSbt.metadata.studentId}</span>
              </InfoRow>
              <InfoRow>
                <strong>학교</strong>
                <span>{selectedSbt.metadata.university}</span>
              </InfoRow>
              <InfoRow>
                <strong>Token ID</strong>
                <span>{selectedSbt.tokenId}</span>
              </InfoRow>
            </Section>

            <Section>
              <InfoRow>
                <strong>설명</strong>
                <span>{selectedSbt.metadata.description}</span>
              </InfoRow>
              <InfoRow>
                <strong>발급일</strong>
                <span>{selectedSbt.metadata.issuedDate}</span>
              </InfoRow>
            </Section>

            {selectedSbt.metadata.extraDetails && (
              <Section>
                <InfoRow>
                  <strong>동아리 이름</strong>
                  <span>{selectedSbt.metadata.extraDetails.clubName}</span>
                </InfoRow>
                <InfoRow>
                  <strong>역할</strong>
                  <span>{selectedSbt.metadata.extraDetails.role}</span>
                </InfoRow>
                <InfoRow>
                  <strong>활동 기간</strong>
                  <span>{selectedSbt.metadata.extraDetails.activityDuration}</span>
                </InfoRow>
              </Section>
            )}

            {/* 삭제 버튼 추가 */}
            <DeleteButton
              onClick={async () => {
                try {
                  const response = await axios.post("https://pscs.store/api/sbtmint/deleteSBT", {
                    tokenId: selectedSbt.tokenId,
                  });
                  alert("SBT가 성공적으로 삭제되었습니다!");
                  closeModal(); // 모달 닫기
                  window.location.reload(); // 데이터 갱신
                } catch (error) {
                  console.error("삭제 실패:", error);
                  alert("SBT 삭제 중 오류가 발생했습니다.");
                }
              }}
            >
              삭제하기
            </DeleteButton>
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
};

export default Portfolio;

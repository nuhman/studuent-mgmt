import React from 'react';
import styled from 'styled-components/macro';

export function NotFoundPage() {
  return (
    <>
      <Wrapper>
        <Title>Sorry! Page not found.</Title>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 320px;
`;

const Title = styled.div`
  margin-top: -8vh;
  font-weight: bold;
  color: black;
  font-size: 1.375rem;

  span {
    font-size: 3.125rem;
  }
`;

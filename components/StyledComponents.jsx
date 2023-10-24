import styled from "styled-components";

export const Splitter = styled.hr`
  margin: 0.5em 0 1em 0;
`;

export const Button = styled.button`
  width: fit-content;
  padding: 0.5cqw 1cqw;

  border: solid var(--coral-1) 1px;
  border-radius: 4px;

  color: var(--coral-1);
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;

  transition: all 150ms ease;

  &:hover {
    color: var(--white-2);
    background-color: var(--coral-1);
  }

  ${(props) =>
    props.$filled &&
    `
      color: var(--white-2) !important;
      background-color: var(--coral-1);
      border: none !important;

      svg { color: var(--white-2) !important; }

      &:hover { background-color: var(--coral-2) !important; }
    `}
`;

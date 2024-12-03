import { NavigationOutlined } from "@mui/icons-material";
import { Fab, Stack } from "@mui/material";
import styled from "styled-components";
import intakeBkg from "../../../../assets/daniel-gonzalez-KeiUIl9Lzo4-unsplash.jpg";
import useFlow from "../../../../hooks/useFlow";

const MiddleOfScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: top;
  height: 80vh;
  width: 100%;
  background-image: url(${intakeBkg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.9;
`;

const LargeQuote = styled.h1`
  font-size: 3rem;
  font-weight: 400;
  color: #fff;
  text-align: center;

  > i {
    font-style: italic;
  }
`;

export default function IntakeCard(props) {
  const { next } = useFlow();
  return (
    <MiddleOfScreen>
      <Stack>
        <LargeQuote>
          Welcome to <i>CHART</i>
        </LargeQuote>
        <Fab variant="extended" onClick={next}>
          <NavigationOutlined sx={{ mr: 1 }} />
          Proceed
        </Fab>
      </Stack>
    </MiddleOfScreen>
  );
}

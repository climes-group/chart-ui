import { NavigationOutlined } from "@mui/icons-material";
import { Button, Fab, Stack } from "@mui/material";
import styled from "styled-components";
import { THEME } from "../../../../utils";

const MiddleOfScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
`;

const LargeQuote = styled.h1`
  font-size: 3rem;
  font-weight: 400;
  color: #333;
  text-align: center;

  > i {
    font-style: italic;
    color: ${THEME.PRIMARY}}
  }
`;

const LargeProceed = styled(Button)`
  font-size: 2rem;
  color: #333;
  text-align: center;
  font-style: italic;
`;

export default function IntakeCard(props) {
  const { next } = useFlow();
  return (
    <MiddleOfScreen>
      <Stack>
        <LargeQuote>
          Welcome <i>to CHART</i>
        </LargeQuote>
        <Fab variant="extended" onClick={next}>
          <NavigationOutlined sx={{ mr: 1 }} />
          Proceed
        </Fab>
      </Stack>
    </MiddleOfScreen>
  );
}

import styled from "styled-components";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  text-align: left;
  margin: 1rem;
`;

function ContactInfo() {
  return (
    <Root>
      <h3>Contact</h3>
      <div>Robert Lepage | PhD., P.Eng</div>
      <div>
        <a href="mailto: rob@climesgroup.ca">rob (at) climesgroup.ca</a>
      </div>
      <div>
        <a>226 868 9865</a>
      </div>
    </Root>
  );
}

export default ContactInfo;

import { render } from "@testing-library/react";
import { describe } from "vitest";
import Async from "..";

const MockFallback = () => {
  return <div>Please wait...</div>;
};

const MockError = () => {
  return <em>Oops!</em>;
};

const MockChild = () => {
  return <p>Lorem ipsum</p>;
};

const MockChildBad = () => {
  throw new Error("Oops!");
};

describe("Async component unit tests", () => {
  function fetchPromiseResolver() {
    return new Promise((resolve, reject) => {
      setTimeout(resolve({ items: [] }), 1000);
    });
  }
  function fetchPromiseRejector() {
    return new Promise((resolve, reject) => {
      setTimeout(reject("An eror has occured"), 1000);
    });
  }

  it("should render default fallback (not specified) while fetchPromise pending", async () => {
    const screen = render(
      <Async error={<MockError />} fetchPromise={fetchPromiseResolver()}>
        <MockChild />
      </Async>,
    );

    await screen.findByText("Loading...");
  });

  it("should render fallback while fetchPromise pending", async () => {
    const screen = render(
      <Async
        fallback={<MockFallback />}
        error={<MockError />}
        fetchPromise={fetchPromiseResolver()}
      >
        <MockChild />
      </Async>,
    );

    await screen.findByText("Please wait...");
  });

  it("should render children when fetchPromise fulfilled", async () => {
    const screen = render(
      <Async
        fallback={<MockFallback />}
        error={<MockError />}
        fetchPromise={fetchPromiseResolver()}
      >
        <MockChild />
      </Async>,
    );
    await screen.findByText("Lorem ipsum");
  });

  it("should render default error (not specified) if fetchPromise throws", async () => {
    const screen = render(
      <Async fallback={<MockFallback />} fetchPromise={fetchPromiseRejector()}>
        <MockChild />
      </Async>,
    );
    await screen.findByText("Oops! Something went wrong.");
  });

  it("should render error if fetchPromise throws", async () => {
    const screen = render(
      <Async
        fallback={<MockFallback />}
        error={<MockError />}
        fetchPromise={fetchPromiseRejector()}
      >
        <MockChild />
      </Async>,
    );
    await screen.findByText("Oops!");
  });

  it("should render error if children throws", async () => {
    const screen = render(
      <Async
        fallback={<MockFallback />}
        error={<MockError />}
        fetchPromise={fetchPromiseResolver()}
      >
        <MockChildBad />
      </Async>,
    );
    await screen.findByText("Oops!");
  });
});

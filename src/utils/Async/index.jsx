import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import DefaultError from "./DefaultError";
import DefaultFallback from "./DefaultFallback";
import ErrorBoundary from "./ErrorBoundary";

/**
 * A Suspense-inspired component wrapper that will show a *fallback* component while *fetchPromise* is unfulfilled.
 * Once fulfilled, *children* will be rendered.
 * If *fetchPromise* or *children* throw, error component is shown instead
 */
function Async({ children, fallback, error, fetchPromise }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchData, setFetchData] = useState(undefined);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchPromise
      .then((data) => {
        setFetchData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [children, fallback, error, fetchPromise]);

  if (isLoading) {
    return fallback;
  }
  if (isError) {
    return error;
  }
  return (
    <ErrorBoundary error={error}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { data: fetchData }),
      )}
    </ErrorBoundary>
  );
}

Async.propTypes = {
  fallback: PropTypes.node,
  error: PropTypes.node,
  fetchPromise: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Async.defaultProps = {
  error: <DefaultError />,
  fallback: <DefaultFallback />,
};

export default Async;

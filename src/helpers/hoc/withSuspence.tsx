import React, { FC, LazyExoticComponent, Suspense, SuspenseProps } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import CustomBackdrop from "../../components/ui/CustomBackdrop";

const withSuspense = (
  LazyComponent: LazyExoticComponent<FC<RouteConfigComponentProps>>,
  FallbackComponent: SuspenseProps["fallback"] = <CustomBackdrop />
) => {
  return (props: RouteConfigComponentProps) => (
    <Suspense fallback={FallbackComponent}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default withSuspense;

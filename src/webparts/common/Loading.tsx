/*
 * This file contains a functional component for loading screen (A loading spinner).
*/


import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

type LoaderProps = {
  message: string
};

export const Loader = (props: LoaderProps) => {
  return (
    <div>
      <Spinner size={SpinnerSize.large} label={props.message} />
    </div>
  );
}

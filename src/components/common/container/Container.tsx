import React, { PropsWithChildren } from 'react';

export interface IContainer {
  gutter?: number;
}

export function Container(props: PropsWithChildren<IContainer>) {
  const divStyle = {
    width: '100 %',
    'marginRight': 'auto',
    'marginLeft': 'auto',
  };

  if (!!props.gutter) {
    divStyle['padding'] = `0 ${props.gutter / 2}px`;
  }

  return (
    <div className="container" style={divStyle}>
      {props.children}
    </div>
  );
}

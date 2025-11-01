import './Sandbox.css';
import React, {JSX} from 'react';

import {WebCodecs} from '../../../src';

type IProps = Record<string, never>;
type IState = Record<string, never>;

class Sandbox extends React.Component<IProps, IState> {
  private webCodecs: WebCodecs;

  constructor(props: IProps) {
    super(props);
    this.webCodecs = new WebCodecs();
  }

  render(): JSX.Element {
    const sum: number = this.webCodecs.sum(1, 2);

    return (
      <div className="sandbox">
        <h1>Sandbox</h1>
        <p>The sum is: {sum}</p>
      </div>
    );
  }
}

export default Sandbox;

import './Sandbox.css';
import React, {JSX} from 'react';

import {WebCodecs} from '../../../src';

type IProps = Record<string, never>;
type IState = {
  status: string;
};

class Sandbox extends React.Component<IProps, IState> {
  #webCodecs: WebCodecs;

  constructor(props: IProps) {
    super(props);

    this.#webCodecs = new WebCodecs();

    this.state = {
      status: 'Not started'
    };
  }

  render(): JSX.Element {
    return (
      <div className="sandbox">
        <h1>Sandbox</h1>
        <button disabled={this.state.status !== 'Not started'} onClick={this.#handleClick}>
          START
        </button>
        <p>Status: {this.state.status}</p>
        <canvas id="canvas"></canvas>
      </div>
    );
  }

  #handleClick = async (): Promise<void> => {
    this.setState({status: 'Doing'});
    await this.#webCodecs.do();
    this.setState({status: 'Done'});
  };
}

export default Sandbox;

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
      status: 'Idle'
    };
  }

  render(): JSX.Element {
    return (
      <div className="sandbox">
        <h1>Sandbox</h1>
        <button disabled={this.state.status !== 'Idle'} onClick={this.#handleStart}>
          START
        </button>
        <button disabled={this.state.status !== 'Running'} onClick={this.#handleStop}>
          STOP
        </button>
        <p>Status: {this.state.status}</p>
        <canvas id="canvas" width="640" height="480"></canvas>
      </div>
    );
  }

  #handleStart = async (): Promise<void> => {
    this.setState({status: 'Running'});
    await this.#webCodecs.start();
  };

  #handleStop = (): void => {
    this.#webCodecs.stop();
    this.setState({status: 'Idle'});
  };
}

export default Sandbox;

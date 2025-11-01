import './Sandbox.css';
import React, {JSX} from 'react';

type IProps = Record<string, never>;
type IState = Record<string, never>;

class Sandbox extends React.Component<IProps, IState> {
  render(): JSX.Element {
    return (
      <div className="sandbox">
        <h1>Sandbox</h1>
      </div>
    );
  }
}

export default Sandbox;

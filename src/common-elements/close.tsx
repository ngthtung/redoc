import * as React from 'react';
import styled from '../styled-components';

class IntCloseIcon extends React.PureComponent<{
  className?: string;
  float?: 'left' | 'right';
  size?: string;
  color?: string;
  style?: React.CSSProperties;
  handleClick: () => void;
}> {
  render() {
    return (
      <svg
        className={this.props.className}
        style={this.props.style}
        onClick={this.props.handleClick}
        color={this.props.color || ''}
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 15 15"
      >
        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
      </svg>
    );
  }
}

export const CloseIcon = styled(IntCloseIcon)`
  height: ${props => props.size || '15px'};
  width: ${props => props.size || '15px'};
  vertical-align: middle;
  float: ${props => props.float || ''};
  transition: transform 0.2s ease-out;

  polygon {
    fill: ${props =>
      (props.color && props.theme.colors[props.color] && props.theme.colors[props.color].main) ||
      props.color};
  }
`;

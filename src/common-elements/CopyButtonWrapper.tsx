import * as React from 'react';
import { Tooltip } from '../common-elements/Tooltip';

import { ClipboardService } from '../services/ClipboardService';
import { RedocNormalizedOptions } from '../services';

export interface CopyButtonWrapperProps {
  data: any;
  options?: RedocNormalizedOptions;
  children: (props: {
    renderCopyButton: () => React.ReactNode;
    data: any;
    eventChange(data: any): void;
    onSaved(): void;
  }) => React.ReactNode;
}

export class CopyButtonWrapper extends React.PureComponent<
  CopyButtonWrapperProps,
  { tooltipShown: boolean; data: any }
> {
  constructor(props) {
    super(props);
    this.state = {
      tooltipShown: false,
      data: this.props.data,
    };
  }

  eventChange = (data: any) => {
    this.setState({
      data,
    });
  };

  onSaved = () => {
    this.props?.options?.onSaved(this.state.data);
  };

  render() {
    return this.props.children({
      renderCopyButton: this.renderCopyButton,
      data: this.state.data,
      eventChange: this.eventChange,
      onSaved: this.onSaved,
    });
  }

  copy = () => {
    const content =
      typeof this.props.data === 'string'
        ? this.props.data
        : JSON.stringify(this.props.data, null, 2);
    ClipboardService.copyCustom(content);
    this.showTooltip();
  };

  renderCopyButton = () => {
    return (
      <button onClick={this.copy}>
        <Tooltip
          title={ClipboardService.isSupported() ? 'Copied' : 'Not supported in your browser'}
          open={this.state.tooltipShown}
        >
          Copy
        </Tooltip>
      </button>
    );
  };

  showTooltip() {
    this.setState({
      tooltipShown: true,
    });

    setTimeout(() => {
      this.setState({
        tooltipShown: false,
      });
    }, 1500);
  }
}

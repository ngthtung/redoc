import * as React from 'react';
import styled from '../../styled-components';

import { SampleControls } from '../../common-elements';
import { CopyButtonWrapper } from '../../common-elements/CopyButtonWrapper';
import { jsonStyles } from './style';
import ReactJson from 'react-json-view';
import { RedocNormalizedOptions, OperationModel } from '../../services';

export interface JsonProps {
  data: any;
  options?: RedocNormalizedOptions;
  operation: OperationModel;
  className?: string;
  type?: string | number; // type === 1 ? 'Request samples' : Response samples
}

const JsonViewerWrap = styled.div`
  &:hover > ${SampleControls} {
    opacity: 1;
  }
`;

class Json extends React.PureComponent<JsonProps, any> {
  node: HTMLDivElement;

  constructor(props: any) {
    super(props);
    this.state = {
      data: this.props.data,
      options: this.props.options,
    };
  }

  render() {
    return (
      <React.Fragment>
        <CopyButtonWrapper
          data={this.state.data}
          options={this.state.options}
          operation={this.props.operation}
          type={this.props.type}
        >
          {this.renderInner}
        </CopyButtonWrapper>
      </React.Fragment>
    );
  }

  renderInner = ({ renderCopyButton, data, eventChange, onSaved, options }) => {
    let canSaved = options?.canSaved || false;

    return (
      <JsonViewerWrap>
        <SampleControls>
          {renderCopyButton()}
          {canSaved && <button onClick={() => onSaved()}> Save all </button>}
        </SampleControls>
        <div>
          <ReactJson
            src={data}
            collapsed={false}
            theme={'bright'}
            displayDataTypes={false}
            enableClipboard={false}
            groupArraysAfterLength={5}
            iconStyle={'square'}
            collapseStringsAfterLength={20}
            name={false}
            {...(canSaved && {
              onEdit: e => {
                eventChange(e!.updated_src);
              },
            })}
            {...(canSaved && {
              onAdd: e => {
                eventChange(e!.updated_src);
              },
            })}
            {...(canSaved && {
              onDelete: e => {
                eventChange(e!.updated_src);
              },
            })}
          />
        </div>
      </JsonViewerWrap>
    );
  };

  expandAll = () => {
    const elements = this.node.getElementsByClassName('collapsible');
    for (const collapsed of Array.prototype.slice.call(elements)) {
      (collapsed.parentNode as Element)!.classList.remove('collapsed');
    }
  };

  collapseAll = () => {
    const elements = this.node.getElementsByClassName('collapsible');
    // skip first item to avoid collapsing whole object/array
    const elementsArr = Array.prototype.slice.call(elements, 1);

    for (const expanded of elementsArr) {
      (expanded.parentNode as Element)!.classList.add('collapsed');
    }
  };

  clickListener = (event: MouseEvent) => {
    let collapsed;
    const target = event.target as HTMLElement;
    if (target.className === 'collapser') {
      collapsed = target.parentElement!.getElementsByClassName('collapsible')[0];
      if (collapsed.parentElement.classList.contains('collapsed')) {
        collapsed.parentElement.classList.remove('collapsed');
      } else {
        collapsed.parentElement.classList.add('collapsed');
      }
    }
  };

  componentDidMount() {
    // this.node!.addEventListener('click', this.clickListener);
  }

  componentWillUnmount() {
    // this.node!.removeEventListener('click', this.clickListener);
  }
}

export const JsonViewer = styled(Json)`
  ${jsonStyles};
`;

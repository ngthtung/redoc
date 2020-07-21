import * as React from 'react';
import styled from '../../styled-components';

import { SampleControls } from '../../common-elements';
import { CopyButtonWrapper } from '../../common-elements/CopyButtonWrapper';
import { jsonStyles } from './style';
import ReactJson from 'react-json-view';

export interface JsonProps {
  data: any;
  className?: string;
}

const JsonViewerWrap = styled.div`
  &:hover > ${SampleControls} {
    opacity: 1;
  }
`;

class Json extends React.PureComponent<JsonProps> {
  node: HTMLDivElement;

  render() {
    return <CopyButtonWrapper data={this.props.data}>{this.renderInner}</CopyButtonWrapper>;
  }

  renderInner = ({ renderCopyButton }) => (
    <JsonViewerWrap>
      <SampleControls>
        {renderCopyButton()}
        <button onClick={this.saveAll}> Save all </button>
      </SampleControls>
      <div>
        <ReactJson
          src={this.props.data}
          collapsed={false}
          theme={'bright'}
          displayDataTypes={false}
          enableClipboard={false}
          groupArraysAfterLength={5}
          iconStyle={'square'}
          collapseStringsAfterLength={20}
          name={false}
          onEdit={e => {
            console.log(e, this.props);
          }}
          onAdd={e => {
            console.log(e);
          }}
          onDelete={e => {
            console.log(e);
          }}
        />
      </div>
    </JsonViewerWrap>
  );

  saveAll = () => {
    // const elements = this.node.getElementsByClassName('collapsible');
    // for (const collapsed of Array.prototype.slice.call(elements)) {
    //   console.log(elements);
    // }
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

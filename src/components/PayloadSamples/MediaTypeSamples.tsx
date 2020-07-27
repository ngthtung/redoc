import * as React from 'react';
import * as _ from 'lodash';
import styled from '../../styled-components';

import { DropdownProps } from '../../common-elements';
import { MediaTypeModel } from '../../services/models';
import { Markdown } from '../Markdown/Markdown';
import { Example } from './Example';
import { DropdownLabel, DropdownWrapper, NoSampleLabel } from './styled.elements';
import { RedocNormalizedOptions, OperationModel } from '../../services';
import { TypeSample } from '../../services/utils';

export interface PayloadSamplesProps {
  mediaType: MediaTypeModel;
  options: RedocNormalizedOptions;
  operation: OperationModel;
  renderDropdown: (props: DropdownProps) => JSX.Element;
  type: TypeSample;
}

interface MediaTypeSamplesState {
  activeIdx: number;
}

export class MediaTypeSamples extends React.Component<PayloadSamplesProps, MediaTypeSamplesState> {
  state = {
    activeIdx: 0,
  };
  switchMedia = ({ idx }) => {
    this.setState({
      activeIdx: idx,
    });
  };

  removeEmpty = obj => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') this.removeEmpty(obj[key]);
      // recurse
      else if (obj[key] == null) delete obj[key]; // delete
    });
  };

  render() {
    const { activeIdx } = this.state;
    const examples = this.props.mediaType.examples || {};
    const mimeType = this.props.mediaType.name;

    const noSample = <NoSampleLabel>No sample</NoSampleLabel>;

    const examplesNames = Object.keys(examples);
    if (examplesNames.length === 0) {
      return noSample;
    }

    if (examplesNames.length > 1) {
      const options = examplesNames.map((name, idx) => {
        return {
          value: examples[name].summary || name,
          idx,
        };
      });

      let example = examples[examplesNames[activeIdx]];
      this.removeEmpty(example);
      const description = example.description;

      return (
        <SamplesWrapper>
          <DropdownWrapper>
            <DropdownLabel>Example</DropdownLabel>
            {this.props.renderDropdown({
              value: options[activeIdx].value,
              options,
              onChange: this.switchMedia,
              ariaLabel: 'Example',
            })}
          </DropdownWrapper>
          <div>
            {description && <Markdown source={description} />}
            <Example
              example={example}
              mimeType={mimeType}
              options={this.props.options}
              operation={this.props.operation}
              type={this.props.type}
            />
          </div>
        </SamplesWrapper>
      );
    } else {
      let example = examples[examplesNames[0]];
      // remove value is null
      this.removeEmpty(example);
      return (
        <SamplesWrapper>
          {example.description && <Markdown source={example.description} />}
          <Example
            example={example}
            mimeType={mimeType}
            options={this.props.options}
            operation={this.props.operation}
            type={this.props.type}
          />
        </SamplesWrapper>
      );
    }
  }
}

const SamplesWrapper = styled.div`
  margin-top: 15px;
`;

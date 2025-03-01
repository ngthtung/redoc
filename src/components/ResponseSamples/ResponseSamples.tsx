import { observer } from 'mobx-react';
import * as React from 'react';

import { OperationModel } from '../../services/models';

import { RightPanelHeader, Tab, TabList, TabPanel, Tabs } from '../../common-elements';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';

export interface ResponseSamplesProps {
  operation: OperationModel;
}

@observer
export class ResponseSamples extends React.Component<ResponseSamplesProps> {
  operation: OperationModel;

  render() {
    const { operation } = this.props;
    const responses = operation.responses.filter(response => {
      return response.content && response.content.hasSample;
    });

    return (
      (responses.length > 0 && (
        <div>
          <RightPanelHeader> Response samples </RightPanelHeader>

          <Tabs defaultIndex={0}>
            <TabList>
              {responses.map(response => (
                <Tab className={'tab-' + response.type} key={response.code}>
                  {response.code}
                </Tab>
              ))}
            </TabList>
            {responses.map(response => {
              return (
                <TabPanel key={response.code}>
                  <div>
                    <PayloadSamples
                      content={response.content!}
                      options={operation.options}
                      operation={operation}
                      type={{
                        code: 2,
                        data: response,
                      }}
                    />
                  </div>
                </TabPanel>
              );
            })}
          </Tabs>
        </div>
      )) ||
      null
    );
  }
}

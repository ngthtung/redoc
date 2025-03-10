import * as React from 'react';

import { isJsonLike, langFromMime } from '../../utils/openapi';
import { JsonViewer } from '../JsonViewer/JsonViewer';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';
import { RedocNormalizedOptions, OperationModel } from '../../services';
import { TypeSample } from '../../services/utils';

export interface ExampleValueProps {
  value: any;
  options?: RedocNormalizedOptions;
  operation: OperationModel;
  mimeType: string;
  type?: TypeSample;
}

export function ExampleValue({ value, mimeType, options, operation, type }: ExampleValueProps) {
  if (isJsonLike(mimeType)) {
    return <JsonViewer data={value} options={options} operation={operation} type={type} />;
  } else {
    if (typeof value === 'object') {
      // just in case example was cached as json but used as non-json
      value = JSON.stringify(value, null, 2);
    }
    return <SourceCodeWithCopy lang={langFromMime(mimeType)} source={value} />;
  }
}

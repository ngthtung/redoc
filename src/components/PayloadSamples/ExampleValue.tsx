import * as React from 'react';

import { isJsonLike, langFromMime } from '../../utils/openapi';
import { JsonViewer } from '../JsonViewer/JsonViewer';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';
import { RedocNormalizedOptions } from '../../services';

export interface ExampleValueProps {
  value: any;
  options?: RedocNormalizedOptions;
  mimeType: string;
}

export function ExampleValue({ value, mimeType, options }: ExampleValueProps) {
  if (isJsonLike(mimeType)) {
    return <JsonViewer data={value} options={options} />;
  } else {
    if (typeof value === 'object') {
      // just in case example was cached as json but used as non-json
      value = JSON.stringify(value, null, 2);
    }
    return <SourceCodeWithCopy lang={langFromMime(mimeType)} source={value} />;
  }
}

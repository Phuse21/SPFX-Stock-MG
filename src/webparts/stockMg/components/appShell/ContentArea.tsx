import * as React from 'react';
import NavigationStore from '../layout/navigationStore';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Stack } from '@fluentui/react/lib/Stack';
import { css } from '@fluentui/react/lib/Utilities';

const containerClasses = mergeStyleSets({
  content: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    paddingLeft: 20,
  },
  pageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});

export const ContentArea: React.FC = () => {
  const { stack } = NavigationStore.useStoreState(state => state);

  return (
    <Stack.Item className={containerClasses.content}>
      {stack.map((item, index) => (
        <div
          key={item.key}
          className={css(containerClasses.pageContainer)}
          style={{
            zIndex: index,
            visibility: index === stack.length - 1 ? 'visible' : 'hidden',
          }}
        >
          {item.component}
        </div>
      ))}
    </Stack.Item>
  );
};

import * as React from "react";
import NavigationStore from "../layout/navigationStore";
import { ContentArea } from "./ContentArea";
import { NavWrapper } from "./NavWrapper";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
import { Stack } from "@fluentui/react/lib/Stack";

const styles = mergeStyleSets({
  root: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  }
});

export const AppLayout: React.FC = () => {

  return (
      <NavigationStore.Provider>
        <Stack className={styles.root} horizontal>
          <NavWrapper />
          <ContentArea />
        </Stack>
      </NavigationStore.Provider>
  );
};
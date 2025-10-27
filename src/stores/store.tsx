import { createStore, Provider } from "jotai";
import type { ReactNode } from "react";

export const store = createStore();

export function withProvider(children: ReactNode) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
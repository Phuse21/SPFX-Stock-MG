import { Action, action, computed, Computed, createContextStore } from "easy-peasy";


export type NavigationStackItem = {
    component: React.ReactNode;
    key: string;
    title?: string;
    onActive?: () => void;
};

export interface NavigationContext {
    stack: NavigationStackItem[];
}
export interface NavigationContextType extends NavigationContext {
    push: Action<NavigationContext, NavigationStackItem>;
    replace: Action<NavigationContext, NavigationStackItem>;
    pop: Action<NavigationContext>;
    reset: Action<NavigationContext, NavigationStackItem>;
    getCurrentTitle: Computed<NavigationContext, string>;
}

const navigationModel: NavigationContextType = {
    stack: [],
    push: action((state, payload) => {
        const existingIndex: number = state.stack.findIndex((item: NavigationStackItem) => item.key === payload.key);
        if (existingIndex !== -1) {
            state.stack.splice(existingIndex, 1);
        }
        state.stack.push(payload);
    }),
    replace: action((state, payload) => {
        const newStack = state.stack.slice(0, -1);
        state.stack = [...newStack, payload];
    }),
    reset: action((state, payload) => {
        state.stack = [payload];
    }),
    pop: action((state) => {
        if (state.stack.length <= 1) {
            return;
        }
        const newStack = state.stack.slice(0, -1);
        const topItem = newStack[newStack.length - 1];
        if (topItem && topItem.onActive) {
            topItem.onActive();
        }
        state.stack = newStack;
    }),
    getCurrentTitle: computed((state) => {
        if (state.stack.length === 0) {
            return '';
        }
        const currentItem = state.stack[state.stack.length - 1];
        return currentItem.title ?? "";
    })
}

const NavigationStore = createContextStore(navigationModel);

export default NavigationStore;
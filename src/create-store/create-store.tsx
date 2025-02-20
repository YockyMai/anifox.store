import { produce } from 'immer'
import { create, useStore } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  Actions,
  ActionsResponse,
  Config,
  Selectors,
  Store
} from './create-store.interface'

export const createStore = <S extends object, A extends Actions<S>>(
  initialState: S,
  actions?: A,
  config?: Config<S>
): Store<S, A> => {
  const persistConfig = config?.persist

  const store = persistConfig
    ? create<S>()(
        persist(
          (set) => ({
            ...initialState,
            // @ts-ignore
            setState: (fn: (state: S) => void) => set(produce(fn))
          }),
          persistConfig
        )
      )
    : create(() => initialState)

  const boundActions: ActionsResponse<S, A> = {} as ActionsResponse<S, A>

  if (actions) {
    for (const [action, fn] of Object.entries(actions)) {
      boundActions[action as keyof A] = (payload?: any) =>
        store.setState(produce((state) => fn(state, payload)))
    }
  }

  const selectors = {} as Selectors<S>

  for (const k of Object.keys(store.getState())) {
    ;(selectors as any)[k] = () =>
      useStore(store, (s) => s[k as keyof typeof s])
  }

  return { store, actions: boundActions, selectors }
}

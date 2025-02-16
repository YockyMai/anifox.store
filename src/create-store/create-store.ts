import { produce } from 'immer'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  Actions,
  ActionsResponse,
  Config,
  Store
} from './create-store.interface'

export const createStore = <S, A extends Actions<S>>(
  initialState: S,
  actions: A,
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

  for (const [action, fn] of Object.entries(actions)) {
    boundActions[action as keyof A] = (payload: any) =>
      store.setState(produce((state) => fn(state, payload)))
  }

  return { store, actions: boundActions }
}

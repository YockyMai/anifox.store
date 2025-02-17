/* eslint-disable @typescript-eslint/no-explicit-any */
import { StoreApi, UseBoundStore } from 'zustand'
import { PersistOptions } from 'zustand/middleware'

export type Actions<S> = {
  [K: string]: (state: S, payload: any) => void
}

export type ActionsResponse<S, A extends Actions<S>> = {
  [K in keyof A]: (payload: Parameters<A[K]>[1]) => void
}

export type Selectors<S> = {
  [K in keyof S]: () => S[K]
}

export type Store<S, A extends Actions<S>> = {
  store: UseBoundStore<StoreApi<S>>
  actions: ActionsResponse<S, A>
  selectors: Selectors<S>
}

export type Config<S> = {
  persist?: PersistOptions<S>
}

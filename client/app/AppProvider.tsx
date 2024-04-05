import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../redux/store';

interface AppProviderProps {
  children: any;
}

export function AppProvider({ children }: AppProviderProps) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}

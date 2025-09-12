// src/navigation/AppNavigator.tsx
import React, { memo, ReactElement } from 'react';
import Navigation from './Navigation';
import type { ShowToast } from '../types/toast';

interface AppNavigatorProps {
  showToast: ShowToast;
}

const AppNavigator = ({ showToast }: AppNavigatorProps): ReactElement => {
  return <Navigation showToast={showToast} />;
};

export default memo(AppNavigator);

// src/navigation/AppNavigator.tsx
import React, { memo, ReactElement } from 'react';
import Navigation from './Navigation';

const AppNavigator = (): ReactElement => {
  return <Navigation />;
};

export default memo(AppNavigator);

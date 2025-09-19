import React from 'react';
import BottomSheet from './BottomSheet';
import { ROLE_OPTIONS } from '../strings';

/**
 * RoleBottomSheet
 *
 * Thin wrapper around the generic BottomSheet that is preconfigured
 * with role selection options. Keeps SetProfile and other screens clean.
 */
interface RoleBottomSheetProps {
  /** Controls visibility */
  visible: boolean;
  /** Called with the selected role value */
  onSelect: (value: string) => void;
  /** Close handler */
  onClose: () => void;
}

const RoleBottomSheet: React.FC<RoleBottomSheetProps> = ({ visible, onSelect, onClose }) => {
  return (
    <BottomSheet
      visible={visible}
      title=""
      options={ROLE_OPTIONS}
      onSelect={onSelect}
      onClose={onClose}
      optionAlignment="left"
    />
  );
};

export default RoleBottomSheet;



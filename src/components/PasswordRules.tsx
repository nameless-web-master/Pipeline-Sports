import React, { memo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { aliasTokens } from '../theme/alias';

type Props = {
  hasMinLength: boolean;
  hasLetterAndNumber: boolean;
  hasSpecialChar: boolean;
  containerStyle?: ViewStyle;
};

const PasswordRules = ({ hasMinLength, hasLetterAndNumber, hasSpecialChar, containerStyle }: Props) => {
  return (
    <View style={containerStyle}>
      <Text style={styles.rulesHeader}>Your password must have:</Text>
      <Rule met={hasMinLength} label="8 characters minimum" />
      <Rule met={hasLetterAndNumber} label="1 letter and 1 number" />
      <Rule met={hasSpecialChar} label="1 special character (Example: # ? $ & @)" />
    </View>
  );
};

const Rule = memo(({ met, label }: { met: boolean; label: string }) => (
  <View style={styles.ruleRow}>
    <MaterialIcons
      name={met ? 'task-alt' : 'radio-button-unchecked'}
      size={18}
      color={met ? aliasTokens.color.semantic.success.Default : aliasTokens.color.text.Tertiary}
      style={{ marginRight: aliasTokens.spacing.XSmall }}
    />
    <Text style={[styles.ruleText, met ? styles.ruleTextMet : styles.ruleTextUnmet]}>{label}</Text>
  </View>
));

const styles = StyleSheet.create({
  rulesHeader: {
    ...aliasTokens.typography.labelText.Small,
    color: aliasTokens.color.text.Black,
    marginBottom: aliasTokens.spacing.XXSmall,
  },
  ruleRow: { flexDirection: 'row', alignItems: 'center', marginTop: aliasTokens.spacing.XXSmall },
  ruleText: { ...aliasTokens.typography.body.XSmall, color: aliasTokens.color.text.Tertiary },
  ruleTextMet: { color: aliasTokens.color.text.Success },
  ruleTextUnmet: { color: aliasTokens.color.text.Secondary },
});

export default memo(PasswordRules);



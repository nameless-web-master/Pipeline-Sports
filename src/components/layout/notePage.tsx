import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../Button';
import CircleIcon from '../CircleIcon';
import { aliasTokens } from '../../theme/alias';
import type { NotePage as NotePageScreenProps } from '../../types/navigation';

// ----------------------------------------------------------------------------
// NotePage Screen
// ----------------------------------------------------------------------------
// This is a React Navigation screen that reads its display data from
// route.params and navigates to a provided route on button press.
// ----------------------------------------------------------------------------

const NotePage: React.FC<NotePageScreenProps> = ({ navigation, route }) => {
  // Resolve concrete values from optional route params
  const params = route.params ?? {};
  const titleText: string = params.title ?? 'Your passwrd is reset';
  const contentText: string = params.content ?? 'You’re all set. Navigate back to the login page and tryout your new password.';
  const buttonTitleText: string = params.buttonTitle ?? 'Login';
  const navigateToRoute = (params.navigateTo ?? 'Login') as keyof import('../../types/navigation').RootStackParamList;

  const handleNavigate = () => {
    // Navigate without params. If the target route requires params,
    // supply them where you push this screen.
    navigation.navigate(navigateToRoute as never);
  };

  return (
    <View style={styles.container}>
      {/* Success mark inside a soft green circle (vector icon) */}
      <CircleIcon
        type="icon"
        iconLibrary="FontAwesome5"
        iconName="check-circle"
        iconSize={40}
        iconColor={aliasTokens.color.semantic.success.Special}
        circleSize={100}
        backgroundColor={aliasTokens.color.semantic.success.Light}
        containerStyle={{ marginBottom: aliasTokens.spacing.Medium }}
      />

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {titleText}
      </Text>

      {/* Content paragraph */}
      <Text style={styles.content}>
        {contentText}
      </Text>

      {/* Single navigation button */}
      <View style={styles.buttonWrap}>
        <Button title={buttonTitleText} onPress={handleNavigate} variant="primary" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: aliasTokens.spacing.Large,
    backgroundColor:aliasTokens.color.background.Primary
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: aliasTokens.color.semantic.success.Light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...aliasTokens.typography.labelText.Medium,
    color: aliasTokens.color.text.Primary,
    textAlign: 'center',
    marginBottom: aliasTokens.spacing.XSmall,
    fontSize: 16
  },
  content: {
    ...aliasTokens.typography.body.Small,
    color: aliasTokens.color.text.Secondary,
    textAlign: 'center',
    marginBottom: aliasTokens.spacing.XLarge,
  },
  buttonWrap: {
    width: '100%',
  },
});

export default NotePage;



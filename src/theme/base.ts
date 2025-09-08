// Everything Travelball - Base Design Tokens

export const designTokens = {
  // =============================================================================
  // COLOR TOKENS
  // =============================================================================

  colors: {
    // Gray Scale
    gray: {
      20: '#FBFBF8',
      40: '#F3F5F5',
      60: '#ECEFF1',
      80: '#CFD8DC',
      100: '#B0BEC5',
      200: '#90A4AE',
      300: '#78909C',
      400: '#607D8B',
      500: '#546E7A',
      600: '#455A64',
      700: '#37474F',
      800: '#263238',
      900: '#1C2529',
      920: '#141D21',
      940: '#0F161A'
    },

    // White
    white: '#FFFFFF',

    // Blue Primary
    blue: {
      50: '#E8EFFE',
      100: '#B6CEFB',
      200: '#9386F9',
      300: '#6294F6',
      400: '#4480F5',
      500: '#1660F2',
      600: '#1357DC',
      700: '#0F44AC',
      800: '#0C3585',
      900: '#092866'
    },

    // Red
    red: {
      50: '#FCEBEB',
      100: '#F5C2BF',
      200: '#F0A4A1',
      300: '#EA7A76',
      400: '#E5615B',
      500: '#DF3932',
      600: '#CB342E',
      700: '#9E2824',
      800: '#7B1F1C',
      900: '#5E1815'
    },

    // Green
    green: {
      50: '#F1FAEE',
      100: '#D4EFCA',
      200: '#C0E7B0',
      300: '#A3DB8C',
      400: '#91D576',
      500: '#75CA54',
      600: '#6AB84C',
      700: '#538F3C',
      800: '#406F2E',
      900: '#315523'
    }
  },

  // =============================================================================
  // TYPOGRAPHY BASE TOKENS
  // =============================================================================

  typography: {
    display: {
      Medium: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 28,
        lineHeight: 36,
        letterSpacing: -0.25,
      },
      Small: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 22,
        lineHeight: 32,
        letterSpacing: -0.25,
      },
    },
    body: {
      XLarge: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 18,
        lineHeight: 28,
        letterSpacing: 0,
      },
      Large: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0,
      },
      Medium: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        lineHeight: 24,
        letterSpacing: 0,
      },
      Small: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        lineHeight: 20,
        letterSpacing: 0,
      },
      XSmall: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        lineHeight: 18,
        letterSpacing: 0.2,
      },
    },
    title: {
      Large: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        lineHeight: 30,
      },
      Medium: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        lineHeight: 22,
      },
      Small: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        lineHeight: 20,
      },
      XSmall: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        lineHeight: 18,
      },
      XXSmall: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
        lineHeight: 16,
      },
    },
    buttonText: {
      Medium: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        lineHeight: 26,
        letterSpacing: 0,
      },
      Default: {
        fontFamily: 'Poppins_500SemiBold',
        fontSize: 14,
        lineHeight: 26,
        letterSpacing: 0,
      },
      Small: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 13,
        lineHeight: 24,
        letterSpacing: 0,
      },
    },
    labelText: {
      Medium: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0,
      },
      Small: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        lineHeight: 18,
        letterSpacing: 0.1,
      },
    },
    inputText: {
      Medium: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0,
      },
    },
    entryText: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 15,
      lineHeight: 20,
      letterSpacing: 0,
    }
  },


  // =============================================================================
  // SIZE BASE TOKENS
  // =============================================================================

  sizes: {
    8: 8,
    14: 14,
    18: 18,
    24: 24,
    32: 32,
    42: 42,
    50: 50,
    58: 58,
    64: 64,
    full: '100%',
    half: '50%',
    third: '33.33333%',
    quarter: '25%',
  },

  // =============================================================================
  // SPACE BASE TOKENS
  // =============================================================================

  spacing: {
    0: 0,
    2: 2,
    4: 4,
    8: 8,
    12: 12,
    20: 20,
    32: 32,
    52: 52,
    58: 58,
    72: 72
  },

  // =============================================================================
  // BORDER RADIUS BASE TOKENS
  // =============================================================================
  borderRadius: {
    8: 8,
    12: 12,
    100: 100,
  },

  // =============================================================================
  // BORDER WIDTH BASE TOKENS
  // =============================================================================
  borderWidth: {
    1: 1,
    2: 2,
  },

  // =============================================================================
  // Basic Stylesheet
  // =============================================================================

  basic: {

    // Display

    dFlex: { flexDirection: 'row' },

    // Justify-content

    justifyCenter: { justifyContent: 'center' },
    justifyStart: { justifyContent: 'flex-start' },
    justifyEnd: { justifyContent: 'flex-end' },
    justifyBetween: { justifyContent: 'space-between' },

    //Align-items

    alignCenter: { alignItems: 'center' },
    alignStart: { alignItems: 'flex-start' },
    alignEnd: { alignItems: 'flex-end' },

  },

  // =============================================================================
  // MOTION BASE TOKENS
  // =============================================================================
  motion: {
    duration: {
      base: 150,
    },
    easing: {
      easeInOut: 'ease-in-out',
    },
    transition: {
      base: '150ms ease-in',
    },
  }
} as const;

// Type definitions
export type DesignTokens = typeof designTokens;

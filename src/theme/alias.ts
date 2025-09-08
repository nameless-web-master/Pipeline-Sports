// Everything Travelball - Alias Design Tokens
import { designTokens } from './base';

export const aliasTokens = {
  // =============================================================================
  // SPACE ALIAS TOKENS
  // =============================================================================
  
  spacing: {
    None: designTokens.spacing[0] ?? 0,
    Tiny: designTokens.spacing[2] ?? 2,
    XXSmall: designTokens.spacing[4] ?? 4,
    XSmall: designTokens.spacing[8] ?? 8,
    Small: designTokens.spacing[12] ?? 12,
    Medium: designTokens.spacing[20] ?? 20,
    Large: designTokens.spacing[32] ?? 32,
    XLarge: designTokens.spacing[52] ?? 52,
    XXLarge: designTokens.spacing[72] ?? 72,
  },

  // =============================================================================
  // SIZE ALIAS TOKENS
  // =============================================================================
  sizes: {
    XTiny: designTokens.sizes[14],
    Tiny: designTokens.sizes[18],
    XXSmall: designTokens.sizes[24],
    XSmall: designTokens.sizes[32],
    Small: designTokens.sizes[42],
    Medium: designTokens.sizes[50],
    Large: designTokens.sizes[58],
    XLarge: designTokens.sizes[64],
  },

  // =============================================================================
  // COLOR ALIAS TOKENS
  // =============================================================================
  color: {
    text: {
      Primary: designTokens.colors.gray[940],
      Secondary: designTokens.colors.gray[700],
      Tertiary: designTokens.colors.gray[500],
      InversePrimary: designTokens.colors.white,
      Brand: designTokens.colors.blue[500],
      Error: designTokens.colors.red[500],
      Success: designTokens.colors.green[700],
      Disabled: designTokens.colors.gray[100],
    },
    brand: {
      Primary: designTokens.colors.blue[500],
    },
    border: {
      Light: designTokens.colors.gray[60],
      Default: designTokens.colors.gray[80],
      Dark: designTokens.colors.gray[100]
    },
      background: {
    Primary: designTokens.colors.white,
    Secondary: designTokens.colors.gray[40],
    Tertiary: designTokens.colors.gray[60],
    Inverse: designTokens.colors.gray[920],
  },
    semantic: {
      success: {
        Light: designTokens.colors.green[50],
        Default: designTokens.colors.green[700],
      },
      danger: {
        Light: designTokens.colors.red[50],
        Default: designTokens.colors.red[700],
      },
      info: {
        Light: designTokens.colors.gray[40],
        Default: designTokens.colors.gray[900],
      },
    }
  },

  // =============================================================================
  // INPUT ALIAS TOKENS
  // =============================================================================
  input: {
    FillEnabled: designTokens.colors.gray[40],
    BorderEnabled: designTokens.colors.gray[40],
    FillActive: designTokens.colors.gray[40],
    BorderActive: designTokens.colors.blue[500],
    FillError: designTokens.colors.gray[40],
    BorderError: designTokens.colors.red[500],
    FillDisabled: designTokens.colors.gray[40],
    BorderDisabled: designTokens.colors.gray[40],
    PlaceHolder: designTokens.colors.gray[200],
  },

  // =============================================================================
  // BUTTON ALIAS TOKENS
  // =============================================================================
  button: {
    primary: {
      fillEnabled: designTokens.colors.blue[500], // Brand/Primary
      borderEnabled: designTokens.colors.blue[500],
      fillPressed: designTokens.colors.blue[700],
      borderPressed: designTokens.colors.blue[700],
      fillDisabled: designTokens.colors.gray[60], // uses base token
      borderDisabled: designTokens.colors.gray[60], // uses base token
      textDisabled: designTokens.colors.gray[100], // uses base token
    },
    secondary: {
      fillEnabled: designTokens.colors.blue[50],
      borderEnabled: designTokens.colors.blue[50],
      fillPressed: designTokens.colors.blue[100],
      borderPressed: designTokens.colors.blue[100],
      fillDisabled: designTokens.colors.gray[60], // uses base token
      borderDisabled: designTokens.colors.gray[60], // uses base token
      textDisabled: designTokens.colors.gray[100], // uses base token
    },
    tertiary: {
      fillEnabled: designTokens.colors.gray[40],
      borderEnabled: designTokens.colors.gray[40],
      fillPressed: designTokens.colors.gray[80],
      borderPressed: designTokens.colors.gray[80],
      fillDisabled: designTokens.colors.gray[60], // uses base token
      borderDisabled: designTokens.colors.gray[60], // uses base token
      textDisabled: designTokens.colors.gray[100], // uses base token
    },
    outline: {
      fillEnabled: designTokens.colors.white,
      borderEnabled: designTokens.colors.gray[80],
      fillPressed: designTokens.colors.gray[40],
      borderPressed: designTokens.colors.gray[80],
      fillDisabled: designTokens.colors.gray[60], // uses base token
      borderDisabled: designTokens.colors.gray[60], // uses base token
      textDisabled: designTokens.colors.gray[100], // uses base token
    },
    ghost: {
      fillEnabled: 'transparent',
      borderEnabled: 'transparent',
      fillPressed: designTokens.colors.gray[40],
      borderPressed: designTokens.colors.gray[40],
      fillDisabled: designTokens.colors.gray[60], // uses base token
      borderDisabled: designTokens.colors.gray[60], // uses base token
      textDisabled: designTokens.colors.gray[100], // uses base token
    },
  },
  // =============================================================================
  // BORDER RADIUS ALIAS TOKENS
  // =============================================================================
  borderRadius: {
    Small: designTokens.borderRadius[8],
    Default: designTokens.borderRadius[12],
    Full: designTokens.borderRadius[100],
  },

    // =============================================================================
  // MENU LINK ALIAS TOKENS
  // =============================================================================
  menuLink: {
    fillEnabled: designTokens.colors.blue[50],
    fillActive: 'transparent',
  },

  // =============================================================================
  // TYPOGRAPHY ALIAS TOKENS
  // =============================================================================
  typography: {
    display: {
      Medium: {
        ...designTokens.typography.display.Medium,
      },
      Small: {
        ...designTokens.typography.display.Small,
      },
    },
    title: {
      Large: {
        ...designTokens.typography.title.Large,
      },
      Medium: {
        ...designTokens.typography.title.Medium,
      },
      Small: {
        ...designTokens.typography.title.Small,
      },
      XSmall: {
        ...designTokens.typography.title.XSmall,
      },
      XXSmall: {
        ...designTokens.typography.title.XXSmall,
      },
    },
    buttonText: {
      Medium: {
        ...designTokens.typography.buttonText.Medium,
      },
      Small: {
        ...designTokens.typography.buttonText.Small,
      },
    },
    labelText: {
      Medium: {
        ...designTokens.typography.labelText.Medium,
      },
      Small: {
        ...designTokens.typography.labelText.Small,
      },
    },
    inputText: {
      Medium: {
        ...designTokens.typography.inputText.Medium,
      },
    },
    body: {
      XLarge: {
        ...designTokens.typography.body.XLarge,
      },
      Large: {
        ...designTokens.typography.body.Large,
      },
      Medium: {
        ...designTokens.typography.body.Medium,
      },
      Small: {
        ...designTokens.typography.body.Small,
      },
      XSmall: {
        ...designTokens.typography.body.XSmall,
      },
    },
  },

  // =============================================================================
  // BORDER WIDTH ALIAS TOKENS
  // =============================================================================
  borderWidth: {
    Default: designTokens.borderWidth[1],
  },

  // =============================================================================
  // MOTION ALIAS TOKENS
  // =============================================================================
  motion: {
    duration: {
      Base: designTokens.motion.duration.base,
    },
    easing: {
      EaseInOut: designTokens.motion.easing.easeInOut,
    },
    transition: {
      Base: designTokens.motion.transition.base,
    },
  }
} as const;

// Type definitions
export type AliasTokens = typeof aliasTokens;

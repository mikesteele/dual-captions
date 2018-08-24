import config from './config';

// FIXME - This should all come from the config module
const initialState = {
  currentTab: 0,
  DC: true,
  detectedSite: 'none',
  hasError: false,
  errorType: '',
  isOn: false,
  secondLanguage: config.defaultSecondLanguage,
  uiLanguage: config.defaultUILanguage,
  settings: config.defaultSettings
};
// TODO - ^ Update reducer tests w/ config module?

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_SECOND_LANGUAGE':
      const selectedSecondLanguage = action.payload || state.secondLanguage;
      return {...state,
        secondLanguage: selectedSecondLanguage
      };
    case 'CHANGE_DC_ON':
      const isOn = action.payload;
      return {...state,
        isOn: isOn
      };
    case 'CHANGE_CURRENT_TAB':
      return {...state,
        currentTab: action.payload
      };
    case 'CHANGE_ERROR':
      return {...state,
        hasError: action.payload.hasError,
        errorType: action.payload.errorType || ''
      }
    case 'CHANGE_SETTINGS':
      return {...state,
        settings: {...state.settings,
          ...action.payload
        }
      };
    case 'CHANGE_UI_LANGUAGE':
      const selectedUILanguage = action.payload || state.uiLanguage;
      return {...state,
        uiLanguage: selectedUILanguage
      };
    case 'CHANGE_DETECTED_SITE':
      const detectedSite = action.payload || state.detectSite;
      return {...state,
        detectedSite: detectedSite
      };
    case 'HYDRATE_STORE':
      return {...state,
        ...action.payload
      };
    default:
      return state;
  }
}

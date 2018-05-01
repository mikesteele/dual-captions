const initialState = {
  currentTab: 0,
  DC: true,
  isOn: false,
  secondLanguage: 'en',
  uiLanguage: 'en'
};

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
    case 'CHANGE_UI_LANGUAGE':
      const selectedUILanguage = action.payload || state.uiLanguage;
      return {...state,
        uiLanguage: selectedUILanguage
      };
    case 'HYDRATE_STORE':
      return {...state,
        ...action.payload
      };
    default:
      return state;
  }
}

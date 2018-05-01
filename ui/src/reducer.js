const initialState = {
  DC: true,
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

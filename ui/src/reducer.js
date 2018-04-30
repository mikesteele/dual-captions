const initialState = {
  'secondLanguage': 'en' 
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_SECOND_LANGUAGE':
      const selectedLanguage = action.payload || state.secondLanguage
      return {...state,
        secondLanguage: selectedLanguage
      }
    default:
      return state
  }
}

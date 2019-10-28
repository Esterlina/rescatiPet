const initialState = {
    id:'',
    nombre: '',
    email: '',
    telefono: '',
    tipo: '',
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        ...state,
        id: action.userReducer.id,
        nombre: action.userReducer.nombre,
        email: action.userReducer.email,
        telefono: action.userReducer.telefono,
        tipo: action.userReducer.tipo
      };
    default:
      return state;
  }
};

export default userReducer;
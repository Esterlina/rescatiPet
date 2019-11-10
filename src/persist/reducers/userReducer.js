const initialState = {
    id:'',
    nombre: '',
    email: '',
    telefono: '',
    tipo: '',
    perfil: ''
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
        tipo: action.userReducer.tipo,
        perfil: action.userReducer.perfil
      };
    default:
      return state;
  }
};

export default userReducer;
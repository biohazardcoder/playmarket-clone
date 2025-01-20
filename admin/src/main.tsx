import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit';
import UserReducer from "./toolkits/UserSlicer.tsx"
import AdminReducer from "./toolkits/AdminsSlicer.tsx"
import GamesReducer from "./toolkits/ProductSlicer.tsx"
const store = configureStore({
  reducer: {
    user: UserReducer,
    admins: AdminReducer,
    products: GamesReducer,
  },
});
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)

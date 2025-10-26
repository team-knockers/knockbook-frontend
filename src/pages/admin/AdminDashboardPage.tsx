import { Admin, defaultTheme, Resource } from 'react-admin';
import { adminDataProvider } from './adminDataProvider';
import { AdminBookList } from './AdminBookList';
import { AdminProductList } from './AdminProductList';
import { PATHS } from '../../routes/paths';
import { createTheme } from '@mui/material/styles';
import { AdminBookCreate, AdminBookEdit } from './AdminBookForm';
import { AdminProductCreate, AdminProductEdit } from './AdminProductForm';
import { AdminOrderList } from './AdminOrderList';

const lightTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'light',
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    text: {
      primary: '#1e1e1e',
      secondary: '#555',
    },
  },
});

export default function AdminDashboardPage() {

  return (
    <main>
      <Admin 
        dataProvider={adminDataProvider}
        basename={PATHS.admin}
        theme={lightTheme}>
        <Resource 
          name="books"
          list={AdminBookList}
          create={AdminBookCreate}
          edit={AdminBookEdit}/>
        <Resource 
          name="products" 
          list={AdminProductList}
          create={AdminProductCreate}
          edit={AdminProductEdit}/>
        <Resource
          name="orders"
          list={AdminOrderList}/>
      </Admin>
    </main>
  );
}
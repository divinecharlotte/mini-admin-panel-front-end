import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { UsersPage } from './pages/UsersPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UserManagementPage } from './pages/UserManagementPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<UsersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="user-management" element={<UserManagementPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
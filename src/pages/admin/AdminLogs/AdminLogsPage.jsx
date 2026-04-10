import Container from 'react-bootstrap/Container';
import './AdminLogsPage.css';
import AdminLogsViewer from '@/components/admin/AdminLogs/AdminLogsViewer';


const AdminLogsPage = () => {
    return (
        <div className="admin-logs-page">
            <Container fluid className="p-0">
                <AdminLogsViewer />
            </Container>
        </div>
    );
};

export default AdminLogsPage;
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dashboard } from '../services/api';
import { 
  LayoutGrid, Users, Anchor, Router, Shield, UserCircle, 
  ClipboardList, CreditCard, UserCog, LogOut
} from 'lucide-react';

interface DashboardData {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalRequests: number;
  };
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboard.getData();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a192f]">
      {/* Rest of your existing Dashboard JSX */}
    </div>
  );
}
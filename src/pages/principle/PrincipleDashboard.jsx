import { Menu } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  getAllLeaves,
  deleteLeave,
  acceptLeave,
  rejectLeave,
} from '../../services/leaveService';
import {
  getCurrentUser,
  isAuthenticated,
  signout,
} from '../../services/authService';
import { getTeachersAndStudents, deleteUser } from '../../services/userService';

const PrincipleDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('leaves');
  const [userFilter, setUserFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    const user = getCurrentUser();
    if (!user || user.role !== 'principle') {
      navigate('/');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchLeaves();
    fetchUsers();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await getAllLeaves();
      const leavesArray = Array.isArray(data) ? data : [];
      setLeaves(leavesArray);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setLeaves([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getTeachersAndStudents();
      const usersArray = Array.isArray(data) ? data : [];
      setUsers(usersArray);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من استعادة الإجازة بعد حذفها!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذفها',
      cancelButtonText: 'إلغاء',
    });

    if (confirm.isConfirmed) {
      await deleteLeave(id);
      Swal.fire('تم الحذف', 'تم حذف الإجازة بنجاح', 'success');
      fetchLeaves();
    }
  };

  const handleDeleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من استعادة المستخدم بعد حذفه!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذفه',
      cancelButtonText: 'إلغاء',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire('تم الحذف', 'تم حذف المستخدم بنجاح', 'success');
        fetchUsers();
      } catch (error) {
        console.error('Delete user error:', error);
        Swal.fire('خطأ', 'فشل في حذف المستخدم', 'error');
      }
    }
  };

  const handleAcceptLeave = async (id) => {
    try {
      await acceptLeave(id);
      Swal.fire('تم القبول', 'تم قبول الإجازة بنجاح', 'success');
      fetchLeaves();
    } catch (error) {
      console.error('Accept leave error:', error);
      Swal.fire('خطأ', 'فشل في قبول الإجازة', 'error');
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await rejectLeave(id);
      Swal.fire('تم الرفض', 'تم رفض الإجازة', 'info');
      fetchLeaves();
    } catch (error) {
      console.error('Reject leave error:', error);
      Swal.fire('خطأ', 'فشل في رفض الإجازة', 'error');
    }
  };

  const filteredLeaves =
    filter === 'all' ? (leaves || []) : (leaves || []).filter((e) => e.status === filter);

  const filteredUsers =
    userFilter === 'all' ? (users || []) : (users || []).filter((u) => u.role === userFilter);

  // Calculate statistics
  const leaveStats = {
    total: leaves?.length || 0,
    pending: leaves?.filter((e) => e.status === 'pending')?.length || 0,
    accepted: leaves?.filter((e) => e.status === 'accepted')?.length || 0,
    rejected: leaves?.filter((e) => e.status === 'rejected')?.length || 0,
  };

  const userStats = {
    total: users?.length || 0,
    teachers: users?.filter((u) => u.role === 'teacher')?.length || 0,
    students: users?.filter((u) => u.role === 'student')?.length || 0,
  };

  return (
    <>
      {!isScrolled && (
        <nav
          className={`fixed top-4 left-0 right-0 mx-5 md:mx-10 rounded-xl shadow-md bg-white z-50 transition-opacity duration-700 ${
            isScrolled
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100 pointer-events-auto'
          }`}>
          <div className='px-5 py-4 flex justify-between items-center'>
            <div className='hidden md:flex items-center gap-4'>
              <button
                onClick={async () => {
                  try {
                    await signout();
                    navigate('/');
                  } catch (error) {
                    console.error('Logout error:', error);
                    localStorage.clear();
                    navigate('/');
                  }
                }}
                className='relative group bg-red-700 text-white px-3 py-2 rounded hover:bg-red-600 w-fit'>
                <LogOut className='w-5 h-5' />

                <span className='absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap'>
                  تسجيل الخروج
                </span>
              </button>
            </div>
            <h1 className='text-xl font-bold text-[#27465b]'>Logo..</h1>

            <div className='md:hidden'>
              <button onClick={() => setMenuOpen(!menuOpen)}>
                <Menu className='w-6 h-6 text-[#27465b]' />
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className='md:hidden px-5 pb-4 flex flex-col gap-3'>
              <button
                onClick={async () => {
                  try {
                    await signout();
                    navigate('/');
                  } catch (error) {
                    console.error('Logout error:', error);
                    localStorage.clear();
                    navigate('/');
                  }
                }}
                className='bg-red-700 text-white px-4 py-1 rounded hover:bg-red-600 w-full text-start'>
                تسجيل الخروج
              </button>
            </div>
          )}
        </nav>
      )}

      <div className='pt-25 pb-10 min-h-screen bg-gray-200 text-right'>
        <div className='p-6 bg-white rounded-xl shadow-md overflow-hidden mx-5 md:mx-10'>
          <div className='max-w-6xl mx-auto p-6 space-y-6'>
            <h2 className='sm:text-2xl text-lg font-bold text-[#5196ac]'>
              لوحة تحكم المشرف
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
              <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                <h3 className='text-sm font-medium text-blue-600'>
                  إجمالي الإجازات
                </h3>
                <p className='text-2xl font-bold text-blue-800'>
                  {leaveStats.total}
                </p>
              </div>
              <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200'>
                <h3 className='text-sm font-medium text-yellow-600'>
                  إجازات معلقة
                </h3>
                <p className='text-2xl font-bold text-yellow-800'>
                  {leaveStats.pending}
                </p>
              </div>
              <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
                <h3 className='text-sm font-medium text-green-600'>
                  إجازات مقبولة
                </h3>
                <p className='text-2xl font-bold text-green-800'>
                  {leaveStats.accepted}
                </p>
              </div>
              <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
                <h3 className='text-sm font-medium text-red-600'>
                  إجازات مرفوضة
                </h3>
                <p className='text-2xl font-bold text-red-800'>
                  {leaveStats.rejected}
                </p>
              </div>
            </div>

            <div className='flex gap-4 border-b border-gray-200'>
              <button
                className={`pb-2 px-4 ${
                  activeTab === 'leaves'
                    ? 'border-b-2 border-[#5196ac] text-[#5196ac] font-semibold'
                    : 'text-gray-600 hover:text-[#5196ac]'
                }`}
                onClick={() => setActiveTab('leaves')}>
                إدارة الإجازات ({leaveStats.pending} معلق)
              </button>
              <button
                className={`pb-2 px-4 ${
                  activeTab === 'users'
                    ? 'border-b-2 border-[#5196ac] text-[#5196ac] font-semibold'
                    : 'text-gray-600 hover:text-[#5196ac]'
                }`}
                onClick={() => setActiveTab('users')}>
                إدارة المستخدمين ({userStats.total})
              </button>
            </div>

            {activeTab === 'leaves' && (
              <div className='space-y-6'>
                {leaveStats.pending > 0 && (
                  <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200'>
                    <h3 className='text-lg font-semibold text-yellow-800 mb-2'>
                      إجراءات سريعة - إجازات معلقة ({leaveStats.pending})
                    </h3>
                    <p className='text-yellow-700 text-sm'>
                      يوجد {leaveStats.pending} إجازة في انتظار المراجعة
                      والموافقة
                    </p>
                  </div>
                )}

                <div className='max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-4'>
                  <h2 className='text-xl font-bold text-[#5196ac] mb-4'>
                    إدارة الإجازات الطلابية
                  </h2>

                  <div className='flex gap-4 mb-4'>
                    {['all', 'pending', 'accepted', 'rejected'].map((f) => (
                      <button
                        key={f}
                        className={`px-4 py-1 rounded ${
                          filter === f
                            ? 'bg-[#5196ac] text-white'
                            : 'bg-gray-200'
                        }`}
                        onClick={() => setFilter(f)}>
                        {f === 'all'
                          ? 'الكل'
                          : f === 'pending'
                          ? 'معلق'
                          : f === 'accepted'
                          ? 'مقبول'
                          : 'مرفوض'}
                      </button>
                    ))}
                  </div>

                  <table className='w-full text-center'>
                    <thead>
                      <tr className='bg-[#5196ac] text-white'>
                        <th className='py-2 px-4'>رقم الطالب</th>
                        <th className='py-2 px-4'>التاريخ</th>
                        <th className='py-2 px-4'>السبب</th>
                        <th className='py-2 px-4'>الحالة</th>
                        <th className='py-2 px-4'>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaves.map((e) => (
                        <tr key={e.id} className='border-t hover:bg-gray-50'>
                          <td className='py-2 px-4'>
                            {typeof e.studentId === 'object' && e.studentId?.id 
                              ? e.studentId.id.slice(-8) 
                              : e.studentId || '-'}
                          </td>
                          <td className='py-2 px-4'>
                            {typeof e.date === 'object' 
                              ? new Date(e.date).toLocaleDateString('ar-SA')
                              : e.date}
                          </td>
                          <td className='py-2 px-4'>
                            {typeof e.reason === 'object' 
                              ? JSON.stringify(e.reason)
                              : e.reason}
                          </td>
                          <td className='py-2 px-4'>
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                e.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : e.status === 'accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                              {e.status === 'pending'
                                ? 'معلق'
                                : e.status === 'accepted'
                                ? 'مقبول'
                                : 'مرفوض'}
                            </span>
                          </td>
                          <td className='py-2 px-4'>
                            <div className='flex gap-2 justify-center'>
                              {e.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleAcceptLeave(e.id)}
                                    className='text-green-600 hover:underline text-sm'>
                                    قبول
                                  </button>
                                  <button
                                    onClick={() => handleRejectLeave(e.id)}
                                    className='text-yellow-600 hover:underline text-sm'>
                                    رفض
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDelete(e.id)}
                                className='text-red-600 hover:underline text-sm'>
                                حذف
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredLeaves.length === 0 && (
                        <tr>
                          <td colSpan='5' className='py-4 text-gray-500'>
                            لا توجد إجازات مطابقة
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className='max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow space-y-4'>
                <h2 className='text-xl font-bold text-[#5196ac] mb-4'>
                  إدارة المستخدمين
                </h2>

                <div className='flex gap-4 mb-4'>
                  {['all', 'teacher', 'student'].map((f) => (
                    <button
                      key={f}
                      className={`px-4 py-1 rounded ${
                        userFilter === f
                          ? 'bg-[#5196ac] text-white'
                          : 'bg-gray-200'
                      }`}
                      onClick={() => setUserFilter(f)}>
                      {f === 'all'
                        ? 'الكل'
                        : f === 'teacher'
                        ? 'المعلمين'
                        : 'الطلاب'}
                    </button>
                  ))}
                </div>

                <table className='w-full text-center'>
                  <thead>
                    <tr className='bg-[#5196ac] text-white'>
                      <th className='py-2 px-4'>الرقم</th>
                      <th className='py-2 px-4'>البريد الإلكتروني</th>
                      <th className='py-2 px-4'>الدور</th>
                      <th className='py-2 px-4'>تاريخ الإنشاء</th>
                      <th className='py-2 px-4'>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className='border-t hover:bg-gray-50'>
                        <td className='py-2 px-4'>
                          {user.id?.slice(-8) || user.id}
                        </td>
                        <td className='py-2 px-4'>{user.email}</td>
                        <td className='py-2 px-4'>
                          {user.role === 'teacher'
                            ? 'معلم'
                            : user.role === 'student'
                            ? 'طالب'
                            : user.role}
                        </td>
                        <td className='py-2 px-4'>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                'ar-SA'
                              )
                            : '-'}
                        </td>
                        <td className='py-2 px-4'>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className='text-red-600 hover:underline mr-2'>
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan='5' className='py-4 text-gray-500'>
                          لا توجد مستخدمين مطابقين
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrincipleDashboard;
